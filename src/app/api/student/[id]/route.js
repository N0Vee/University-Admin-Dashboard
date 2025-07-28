import { NextResponse } from "next/server";
import { supabase } from '@/lib/supabaseClient'

export async function GET(req, { params }) {
    const { id } = await params;
    
    let query = supabase
        .from("students")
        .select("*")
        .eq('id', id)
        .single()

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
