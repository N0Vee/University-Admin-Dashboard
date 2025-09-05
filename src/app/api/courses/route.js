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
  const course_name = searchParams.get("course_name");
  const semester = searchParams.get("semester");
  const faculty = searchParams.get("faculty");
  const department = searchParams.get("department");
  const instructor = searchParams.get("instructor");
  const status = searchParams.get("status");
  const credits = searchParams.get("credits");
  const orderBy = searchParams.get("orderBy") || "course_code";
  const order = searchParams.get("order") || "asc";

  let query = supabase
    .from('courses')
    .select('*,instructors!courses_instructor_fkey(name)')
    .order(orderBy, { ascending: order === "asc" });

  // Apply filters based on query parameters
  if (course_code) {
    query = query.eq('course_code', course_code);
  }

  if (course_name) {
    query = query.ilike('course_name', `%${course_name}%`);
  }

  if (semester) {
    query = query.eq('semester', semester);
  }

  if (faculty) {
    query = query.eq('faculty', faculty);
  }

  if (department) {
    query = query.eq('department', department);
  }

  if (instructor) {
    query = query.eq('instructor', instructor);
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (credits) {
    query = query.eq('credits', parseInt(credits));
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
