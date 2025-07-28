import { supabase } from '@/lib/supabaseClient'

export async function PUT(req, { params }) {
    const { id } = await params;
    const body = await req.formData()

    const fields = [
        'title',
        'titleEng',
        'firstName',
        'lastName',
        'firstNameEng',
        'lastNameEng',
        'studentId',
        'email',
        'phone',
        'birthDate',
        'idCard',
        'faculty',
        'major',
        'yearLevel',
        'enrollmentType',
        'address',
        'emergencyContact',
        'emergencyPhone'
    ];

    const data = {};
    for (const field of fields) {
        data[field] = body.get(field) || '';
    }

    // อ่านไฟล์รูปภาพ (เป็น optional)
    const imageFile = body.get('profileImage');
    let profileImageUrl = body.get('existingImageUrl');

    try {
        if (imageFile && typeof imageFile.name === 'string') {
            const fileExt = imageFile.name.split('.').pop();
            const filePath = `profiles/${data.firstNameEng}-${data.lastNameEng}-${data.studentId}.${fileExt}`
            const fileJpg = `profiles/${data.firstNameEng}-${data.lastNameEng}-${data.studentId}.jpg`
            const filePng = `profiles/${data.firstNameEng}-${data.lastNameEng}-${data.studentId}.png`
            
            const { error : JpgError } = await supabase
                .storage
                .from('img.students')
                .remove([fileJpg]);

            const { error : PngError } = await supabase
                .storage
                .from('img.students')
                .remove([filePng]);

            const { error: uploadError } = await supabase
                .storage
                .from('img.students')
                .upload(filePath, imageFile, {
                    contentType: imageFile.type
                });

            if (uploadError) {
                return new Response(JSON.stringify({ error: uploadError.message }), { status: 400 });
            }

            const { data: urlData } = supabase
                .storage
                .from('img.students')
                .getPublicUrl(filePath);

            profileImageUrl = urlData.publicUrl;
        }

        // อัปเดตข้อมูลใน students
        const { error: updateError } = await supabase
            .from('students')
            .update({
                title: data.title,
                title_eng: data.titleEng,
                first_name: data.firstName,
                last_name: data.lastName,
                first_name_eng: data.firstNameEng,
                last_name_eng: data.lastNameEng,
                student_id: data.studentId,
                email: data.email,
                phone: data.phone,
                birth_date: data.birthDate,
                id_card: data.idCard,
                faculty: data.faculty,
                major: data.major,
                year_level: data.yearLevel,
                enrollment_type: data.enrollmentType,
                address: data.address,
                emergency_contact: data.emergencyContact,
                emergency_phone: data.emergencyPhone,
                profile_image_url: profileImageUrl,
            })
            .eq('id', id);

        if (updateError) {
            return new Response(JSON.stringify({ error: updateError.message }), { status: 400 });
        }

        // อัปเดต users table (optional)
        await supabase
            .from('users')
            .update({
                email: data.email,
                name: `${data.firstNameEng} ${data.lastNameEng}`
            })
            .eq('id', id);

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
