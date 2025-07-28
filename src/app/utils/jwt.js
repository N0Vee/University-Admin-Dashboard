import * as jose from 'jose'
import * as cookie from 'cookie'

const JWKS = jose.createRemoteJWKSet(new URL(process.env.JWKS_URL))

export function parseAuthCookie(cookieHeader) {
    if (!cookieHeader) return null
    const cookies = cookie.parse(cookieHeader)
    return cookies.access_token || null
}


export function verifyJwt(token) {
    
    try {
        return jose.jwtVerify(token, JWKS, {
            algorithms: ['ES256'],
        })
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}