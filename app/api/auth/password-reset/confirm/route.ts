import { NextResponse } from 'next/server';
import { consumePasswordReset } from '../../../../../lib/member/repository';
import { hashPassword, hashResetToken } from '../../../../../lib/member/security';
import { MemberBackendSetupError } from '../../../../../lib/member/supabase';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body.token || '').trim();
    const password = String(body.password || '');
    const confirmPassword = String(body.confirmPassword || '');
    if (!token) return NextResponse.json({ ok: false, error: 'กรุณากรอก reset token' }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ ok: false, error: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' }, { status: 400 });
    if (password !== confirmPassword) return NextResponse.json({ ok: false, error: 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน' }, { status: 400 });

    const user = await consumePasswordReset(hashResetToken(token), hashPassword(password));
    if (!user) return NextResponse.json({ ok: false, error: 'Token ไม่ถูกต้องหรือหมดอายุแล้ว' }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof MemberBackendSetupError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 503 });
    }
    return NextResponse.json({ ok: false, error: 'ตั้งรหัสผ่านใหม่ไม่สำเร็จ' }, { status: 500 });
  }
}
