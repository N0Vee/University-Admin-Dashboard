import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseClientWithAuth } from '@/lib/supabaseClientWithAuth'


export async function PUT(req, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const supabase = await createSupabaseClientWithAuth(token);
  
  const { course_code } = await params;
  if (!course_code) {
    return NextResponse.json({ error: "Missing course_code" }, { status: 400 });
  }
  const body = await req.json()
  if (!body) {
    return NextResponse.json({ error: 'No data provided' }, { status: 400 });
  }

  const fields = [
    'courseCode',
    'courseName',
    'courseNameEn',
    'credits',
    'semester',
    'faculty',
    'department',
    'instructor',
    'maxStudents',
    'status',
    'schedule',
    'objectives',
    'description'
  ];

  const data = {};
  for (const field of fields) {
    data[field] = body[field] || '';
  }

  const { error: coursesError } = await supabase
    .from('courses')
    .update({
      course_code: data.courseCode,
      course_name: data.courseName,
      course_name_en: data.courseNameEn,
      credits: data.credits,
      semester: data.semester,
      faculty: data.faculty,
      department: data.department,
      instructor: data.instructor,
      max_students: data.maxStudents,
      status: data.status,
      schedule: data.schedule,
      objectives: data.objectives,
      description: data.description
    })
    .eq('course_code', course_code);

  if (coursesError) {
    return NextResponse.json({ error: coursesError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Course added successfully' }, { status: 200 });
}
