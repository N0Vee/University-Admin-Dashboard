import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseClientWithAuth } from '@/lib/supabaseClientWithAuth'

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createSupabaseClientWithAuth(token);

    const { data, error } = await supabase
      .from("students")
      .select("student_id")
      .order("student_id", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching last student ID:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let lastId = "00000000";
    if (data && data.length > 0) {
      lastId = data[0].student_id;
    }

    let carry = 1;
    let nextIdArr = lastId.split("").reverse().map((char) => {
      if (!/\d/.test(char)) return char;

      let sum = parseInt(char) + carry;
      if (sum >= 10) {
        carry = 1;
        return "0";
      } else {
        carry = 0;
        return String(sum);
      }
    });

    if (carry === 1) {
      nextIdArr.push("1");
    }

    const nextId = nextIdArr.reverse().join("").padStart(8, "0").slice(-8);

    return NextResponse.json({ studentId: nextId });

  } catch (error) {
    console.error("❌ Error generating student ID:", error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
