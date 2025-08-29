import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseClientWithAuth } from '@/lib/supabaseClientWithAuth'


export async function GET(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const supabase = await createSupabaseClientWithAuth(token);

  const { count, error: coursesError } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true });

  if (coursesError) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(count);
}
