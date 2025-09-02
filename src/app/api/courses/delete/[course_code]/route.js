import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseClientWithAuth } from '@/lib/supabaseClientWithAuth'

export async function DELETE(req, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const supabase = await createSupabaseClientWithAuth(token);
  
  const { course_code } = await params;
  if (!course_code) {
    return NextResponse.json({ error: "Missing course_code" }, { status: 400 });
  }
  
  const { error: coursesError } = await supabase
    .from('courses')
    .delete()
    .eq('course_code', course_code);

  if (coursesError) {
    return NextResponse.json({ error: coursesError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Course deleted successfully' }, { status: 200 });
}
