import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req, { params }) {
    try {
        const { id } = await params

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        )

        const { error } = await supabaseAdmin.auth.admin.deleteUser(id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
