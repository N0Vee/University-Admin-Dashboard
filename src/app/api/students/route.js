import { NextResponse } from "next/server";
import { supabase } from '@/lib/supabaseClient'

export async function GET(req) {
    const { searchParams } = new URL(req.url);

    const orderBy = searchParams.get("orderBy") || "id";
    const order = searchParams.get("order") || "desc"; // เรียงจากใหม่ไปเก่าเป็นค่า default

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
