import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET() {
  
  const cookieStore = await cookies();

  const access_token = cookieStore.get("access_token")?.value;
  if (!access_token) {
    return NextResponse.json({ error: 'No access token provided' }, { status: 401 });
  }

  const role_token = cookieStore.get("role_access_token")?.value;
  if (!role_token) {
    return NextResponse.json({ error: 'No role token provided' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(
      role_token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return NextResponse.json({ role: payload.role })
  } catch (error) {
    console.error('JWT verification error:', error);
    return NextResponse.json({ role: null })
  }

}
