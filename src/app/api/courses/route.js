import { NextResponse } from "next/server";
import { supabase } from '@/lib/supabaseClient'

export async function GET(req) {
    
    const {data, error: coursesError} = await supabase
        .from('courses')
        .select('*')

    if (coursesError) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
