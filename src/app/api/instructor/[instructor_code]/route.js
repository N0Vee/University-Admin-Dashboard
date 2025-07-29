import { NextResponse } from "next/server";
import { supabase } from '@/lib/supabaseClient';

export async function GET(req, { params }) {
    const { instructor_code } = await params;

    if (!instructor_code) {
        return NextResponse.json({ error: "Missing instructor_code" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("instructors")
        .select("*")
        .eq("instructor_code", instructor_code)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
        return NextResponse.json({ error: "Instructor not found" }, { status: 404 });
    }

    return NextResponse.json(data);
}
