import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseClientWithAuth } from '@/lib/supabaseClientWithAuth'

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createSupabaseClientWithAuth(token);
    const formData = await request.formData();

    // Extract form data
    const studentData = {
      title: formData.get('title'),
      titleEng: formData.get('titleEng'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      firstNameEng: formData.get('firstNameEng'),
      lastNameEng: formData.get('lastNameEng'),
      studentId: formData.get('studentId'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      birthDate: formData.get('birthDate'),
      idCard: formData.get('idCard'),
      faculty: formData.get('faculty'),
      major: formData.get('major'),
      yearLevel: formData.get('yearLevel'),
      enrollmentType: formData.get('enrollmentType'),
      address: formData.get('address'),
      emergencyContact: formData.get('emergencyContact'),
      emergencyPhone: formData.get('emergencyPhone'),
      profileImage: formData.get('profileImage')
    };

    // Create user account
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: studentData.email,
      password: studentData.idCard,
    });

    if (signUpError) {
      return NextResponse.json({ 
        error: `การสร้างบัญชีล้มเหลว: ${signUpError.message}` 
      }, { status: 400 });
    }

    let profileImageUrl = null;

    // Handle profile image upload
    if (studentData.profileImage) {
      const file = studentData.profileImage;
      const fileExt = file.name.split('.').pop();
      const filePath = `profiles/${studentData.firstNameEng}-${studentData.lastNameEng}-${studentData.studentId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('img.students')
        .upload(filePath, file);

      if (uploadError) {
        return NextResponse.json({ 
          error: `การอัปโหลดรูปภาพล้มเหลว: ${uploadError.message}` 
        }, { status: 400 });
      }

      const { data: publicUrlData } = supabase.storage
        .from('img.students')
        .getPublicUrl(filePath);

      profileImageUrl = publicUrlData.publicUrl;
    }

    // Insert user record
    const { error: insertUserError } = await supabase
      .from('users')
      .insert([{
        id: signUpData.user.id,
        email: studentData.email,
        name: `${studentData.titleEng}${studentData.firstNameEng} ${studentData.lastNameEng}`,
        role: "student"
      }]);

    if (insertUserError) {
      return NextResponse.json({ 
        error: `การเพิ่มข้อมูลผู้ใช้ล้มเหลว: ${insertUserError.message}` 
      }, { status: 400 });
    }

    // Insert student record
    const { error: insertError } = await supabase
      .from('students')
      .insert([{
        id: signUpData.user.id,
        title: studentData.title,
        title_eng: studentData.titleEng,
        first_name: studentData.firstName,
        last_name: studentData.lastName,
        first_name_eng: studentData.firstNameEng,
        last_name_eng: studentData.lastNameEng,
        student_id: studentData.studentId,
        email: studentData.email,
        phone: studentData.phone,
        birth_date: studentData.birthDate,
        id_card: studentData.idCard,
        faculty: studentData.faculty,
        major: studentData.major,
        year_level: parseInt(studentData.yearLevel),
        enrollment_type: studentData.enrollmentType,
        address: studentData.address,
        emergency_contact: studentData.emergencyContact,
        emergency_phone: studentData.emergencyPhone,
        profile_image_url: profileImageUrl,
      }]);

    if (insertError) {
      return NextResponse.json({ 
        error: `การเพิ่มข้อมูลนักศึกษาล้มเหลว: ${insertError.message}` 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      message: "Student added successfully", 
      studentId: studentData.studentId 
    });

  } catch (error) {
    console.error('Error adding student:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
