import { supabase } from '@/lib/supabaseClient'

export async function GET(request) {

    const url = request.nextUrl

    const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error("Error fetching students:", error);
    } else {
        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 200,
        })
        
    }

}