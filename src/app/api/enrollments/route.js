import { NextResponse } from "next/server";
import { supabase } from '@/lib/supabaseClient'

export async function GET(req) {
    const { searchParams } = new URL(req.url);

    const eq = searchParams.get("eq") || "course_code";
    const order = searchParams.get("order") || "desc";

    let query = supabase
        .from("enrollments")
        .select("*")
        .eq('course_code', eq)

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
