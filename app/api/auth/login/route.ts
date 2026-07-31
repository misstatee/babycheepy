import { NextRequest, NextResponse } from 'next/server';
import { MEMBER_SESSION_COOKIE, MEMBER_SESSION_MAX_AGE_SECONDS } from '../../../../lib/member/config';
import { getRequestKey, rateLimit } from '../../../../lib/member/rate-limit';
import { getUserByLogin } from '../../../../lib/member/repository';
import { signSession, verifyPassword } from '../../../../lib/member/security';
import { MemberBackendSetupError } from '../../../../lib/member/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const limit = rateLimit(getRequestKey(request, 'member-login'), 8, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: 'เข้าสู่ระบบถี่เกินไป กรุณาลองใหม่ภายหลัง' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const login = String(body.login || '').trim();
    const password = String(body.password || '');
    if (!login || !password) {
      return NextResponse.json({ ok: false, error: 'กรุณากรอกอีเมลหรือเบอร์โทรศัพท์และรหัสผ่าน' }, { status: 400 });
    }

    const user = await getUserByLogin(login);
    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ ok: false, error: 'อีเมล/เบอร์โทรศัพท์ หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(MEMBER_SESSION_COOKIE, signSession({ userId: user.id, email: user.email, role: user.role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: MEMBER_SESSION_MAX_AGE_SECONDS,
    });
    return response;
  } catch (error) {
    if (error instanceof MemberBackendSetupError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 503 });
    }
    return NextResponse.json({ ok: false, error: 'เข้าสู่ระบบไม่สำเร็จ' }, { status: 500 });
  }
}
