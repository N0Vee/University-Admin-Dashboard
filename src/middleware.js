import { NextResponse } from 'next/server';
import { parseAuthCookie, verifyJwt } from './app/utils/jwt';

export function middleware(request) {

    const isLoginApi = request.nextUrl.pathname === '/api/auth/login'

    if (isLoginApi) {

        return NextResponse.next()
    }

    const token = parseAuthCookie(request.headers.get('cookie'))

    if (!token) {
        return NextResponse.json({ error: 'No Access Token' }, { status: 401 });
    }


    const payload = verifyJwt(token)
    console.log(payload)
    if (!payload) {
        const response = NextResponse.json({ error: 'Invalid Access Token' }, { status: 401 });
        response.cookies.delete('access_token')
        return response
    }

    console.log('Pass!')

    const response = NextResponse.next();
    return response;
}

export const config = {
    matcher: ['/api/:path*'],
}