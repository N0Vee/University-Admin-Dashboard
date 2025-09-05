import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseClientWithAuth } from '@/lib/supabaseClientWithAuth'

// PATCH - Update enrollment status
export async function PATCH(req, { params }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createSupabaseClientWithAuth(token);
  
  try {
    const { status } = await req.json();

    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('enrollments')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data.length === 0) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    return NextResponse.json(data[0]);

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete enrollment
export async function DELETE(req, { params }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createSupabaseClientWithAuth(token);

  try {
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Enrollment deleted successfully" });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
