import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseClientWithAuth } from '@/lib/supabaseClientWithAuth'

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const orderBy = searchParams.get("orderBy") || "student_id";
  const order = searchParams.get("order") || "desc";

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const supabase = await createSupabaseClientWithAuth(token);

  let query = supabase
    .from("students")
    .select("*")
    .order(orderBy, { ascending: order === "asc" });

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
