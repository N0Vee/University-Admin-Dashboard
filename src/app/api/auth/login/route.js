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

        if (userError || !userData) {
            setError('ไม่สามารถดึงข้อมูลผู้ใช้ได้')
            return
        }

        const userRole = userData.role

        return NextResponse.json({
            session: data.session,
            user: data.user,
            role: userRole
        })
    } catch (err) {
        return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 })
    }
}
