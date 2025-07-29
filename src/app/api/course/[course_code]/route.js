import { NextResponse } from "next/server";
import { supabase } from '@/lib/supabaseClient'

export async function GET(req, { params }) {
    const { course_code } = await params;

    if (!course_code) {
        return NextResponse.json({ error: "Missing course_code" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("course_code", course_code)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
