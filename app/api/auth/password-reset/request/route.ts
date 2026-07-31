import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getPasswordResetTtlMinutes, getSiteUrl } from '../../../../../lib/member/config';
import { getRequestKey, rateLimit } from '../../../../../lib/member/rate-limit';
import { createPasswordReset, getUserByLogin } from '../../../../../lib/member/repository';
import { hashResetToken, randomToken } from '../../../../../lib/member/security';
import { MemberBackendSetupError } from '../../../../../lib/member/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const limit = rateLimit(getRequestKey(request, 'password-reset'), 4, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: 'ส่งคำขอถี่เกินไป กรุณาลองใหม่ภายหลัง' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const login = String(body.login || '').trim();
    if (!login) return NextResponse.json({ ok: true });

    const user = await getUserByLogin(login);
    if (!user) return NextResponse.json({ ok: true });

    const token = randomToken(32);
    const expiresAt = new Date(Date.now() + getPasswordResetTtlMinutes() * 60 * 1000).toISOString();
    await createPasswordReset(user.id, hashResetToken(token), expiresAt);

    const resetUrl = `${getSiteUrl()}/member-reset-password?token=${encodeURIComponent(token)}`;
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: process.env.MEMBER_EMAIL_FROM || 'Baby Cheepy <onboarding@resend.dev>',
        to: user.email,
        subject: 'รีเซ็ตรหัสผ่าน Babycheepy Brand Club',
        html: `<p>กดลิงก์นี้เพื่อตั้งรหัสผ่านใหม่ ลิงก์จะหมดอายุใน ${getPasswordResetTtlMinutes()} นาที</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
      });
    }

    return NextResponse.json({
      ok: true,
      devResetToken:
        process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEV_RESET_TOKEN_RESPONSE === 'true' ? token : undefined,
    });
  } catch (error) {
    if (error instanceof MemberBackendSetupError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 503 });
    }
    return NextResponse.json({ ok: false, error: 'ส่งคำขอรีเซ็ตรหัสผ่านไม่สำเร็จ' }, { status: 500 });
  }
}
