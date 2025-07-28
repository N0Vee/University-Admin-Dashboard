import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request) {
    try {
        const { email, password } = await request.json()

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        if (!data.session) {
            return NextResponse.json({ error: 'เข้าสู่ระบบไม่สำเร็จ' }, { status: 401 })
        }
        const userId = data.user.id

        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .single()
        
        if (userError) {
            return NextResponse.json({ error: 'ดึง role ไม่สำเร็จ' }, { status: 400 })
        }

        const userRole = userData.role


        const res = NextResponse.json({
            role: userRole
        })
        res.cookies.set('access_token', data.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict', 
            maxAge: data.session.expires_in,
        });

        return res

    } catch (err) {
        return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 })
    }
}
