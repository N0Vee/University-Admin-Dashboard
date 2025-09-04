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
