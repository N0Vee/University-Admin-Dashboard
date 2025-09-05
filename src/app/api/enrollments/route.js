import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseClientWithAuth } from '@/lib/supabaseClientWithAuth'

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createSupabaseClientWithAuth(token);

  // Get query parameters
  const course_code = searchParams.get("course_code");
  const user_id = searchParams.get("user_id");
  const student_id = searchParams.get("student_id");
  const status = searchParams.get("status");
  const orderBy = searchParams.get("orderBy") || "enrolled_at";
  const order = searchParams.get("order") || "desc";

  let query = supabase
    .from("enrollments")
    .select(`*,
            students!enrollments_student_id_fkey(*),
            student_user:students!enrollments_user_id_fkey(*),
            courses!enrollments_course_code_fkey(*)
    `)
    .order(orderBy, { ascending: order === "asc" });

  // Apply filters based on query parameters
  if (course_code) {
    query = query.eq('course_code', course_code);
  }

  if (user_id) {
    query = query.eq('user_id', user_id);
  }

  if (student_id) {
    query = query.eq('student_id', student_id);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST - Create new enrollment
export async function POST(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createSupabaseClientWithAuth(token);

  try {
    const { course_code, student_id, user_id, updated_at, status = 'pending' } = await req.json();

    // ใช้ user_id ถ้ามี, ถ้าไม่มีใช้ student_id (เพื่อ backward compatibility)
    const enrollmentData = {};
    
    if (user_id) {
      enrollmentData.user_id = user_id;
      // ถ้ามี student_id ส่งมาด้วย ให้เก็บทั้งคู่
      if (student_id) {
        enrollmentData.student_id = student_id;
      }
      
      // Check if enrollment already exists by user_id
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_code', course_code)
        .eq('user_id', user_id)
        .single();

      if (existingEnrollment) {
        return NextResponse.json({ error: "Already enrolled in this course" }, { status: 400 });
      }
    } else if (student_id) {
      enrollmentData.student_id = student_id;
      // Check if enrollment already exists by student_id
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_code', course_code)
        .eq('student_id', student_id)
        .single();

      if (existingEnrollment) {
        return NextResponse.json({ error: "Already enrolled in this course" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Missing student_id or user_id" }, { status: 400 });
    }

    // เตรียมข้อมูลสำหรับ insert
    const insertData = {
      course_code,
      ...enrollmentData,
      status,
      enrolled_at: new Date().toISOString()
    };

    // เพิ่ม updated_at ถ้ามีส่งมา
    if (updated_at) {
      insertData.updated_at = updated_at;
    }

    const { data, error } = await supabase
      .from('enrollments')
      .insert(insertData)
      .select();

    if (error) {
      console.error('Enrollment insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });

  } catch (error) {
    console.error('POST enrollment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
