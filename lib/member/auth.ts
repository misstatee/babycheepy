import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { MEMBER_SESSION_COOKIE } from './config';
import { verifySession, type SessionPayload } from './security';
import { getMemberProfile } from './repository';
import { membershipStatusText, type MembershipRecord, type UserRecord } from './types';
import { MemberBackendSetupError } from './supabase';

export interface AuthContext {
  session: SessionPayload;
  user: UserRecord;
  membership: MembershipRecord | null;
}

export async function getSessionPayload() {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(MEMBER_SESSION_COOKIE)?.value);
}

export async function getAuthContext(): Promise<AuthContext | null> {
  const session = await getSessionPayload();
  if (!session) return null;
  const profile = await getMemberProfile(session.userId);
  if (!profile) return null;
  return { session, user: profile.user, membership: profile.membership };
}

export function authStatusMessage(membership: MembershipRecord | null | undefined) {
  if (!membership) return 'ไม่พบบัญชี Babycheepy Brand Club กรุณาสมัครสมาชิกก่อนใช้งาน';
  return membershipStatusText[membership.status];
}

export function membershipAccessJson(context: AuthContext | null) {
  if (!context) {
    return NextResponse.json(
      {
        ok: false,
        code: 'not_authenticated',
        error: 'ฟีเจอร์นี้สำหรับสมาชิก Babycheepy Brand Club กรุณาสมัครสมาชิกหรือเข้าสู่ระบบ',
      },
      { status: 401 },
    );
  }

  if (context.membership?.status !== 'active' && context.user.role !== 'admin') {
    return NextResponse.json(
      {
        ok: false,
        code: context.membership?.status || 'not_member',
        error: authStatusMessage(context.membership),
      },
      { status: 403 },
    );
  }

  return null;
}

export async function requireActiveMemberApi() {
  try {
    const context = await getAuthContext();
    const response = membershipAccessJson(context);
    if (response || !context) return { ok: false as const, response: response || membershipAccessJson(null)! };
    return { ok: true as const, context };
  } catch (error) {
    if (error instanceof MemberBackendSetupError) {
      return {
        ok: false as const,
        response: NextResponse.json({ ok: false, error: error.message }, { status: 503 }),
      };
    }
    throw error;
  }
}

export async function requireAdminApi() {
  try {
    const context = await getAuthContext();
    if (!context) {
      return {
        ok: false as const,
        response: NextResponse.json({ ok: false, error: 'กรุณาเข้าสู่ระบบแอดมิน' }, { status: 401 }),
      };
    }
    if (context.user.role !== 'admin') {
      return {
        ok: false as const,
        response: NextResponse.json({ ok: false, error: 'เฉพาะแอดมินเท่านั้น' }, { status: 403 }),
      };
    }
    return { ok: true as const, context };
  } catch (error) {
    if (error instanceof MemberBackendSetupError) {
      return {
        ok: false as const,
        response: NextResponse.json({ ok: false, error: error.message }, { status: 503 }),
      };
    }
    throw error;
  }
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(MEMBER_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
