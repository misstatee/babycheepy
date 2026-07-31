import { NextRequest, NextResponse } from 'next/server';
import { getAdminBootstrapToken } from '../../../../lib/member/config';
import { bootstrapAdmin } from '../../../../lib/member/repository';
import { hashPassword } from '../../../../lib/member/security';
import { MemberBackendSetupError } from '../../../../lib/member/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const token = request.headers.get('x-admin-bootstrap-token') || '';
  const expected = getAdminBootstrapToken();
  if (!expected || token !== expected) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const password = String(body.password || '');
    if (password.length < 10) {
      return NextResponse.json({ ok: false, error: 'รหัสผ่านแอดมินต้องมีอย่างน้อย 10 ตัวอักษร' }, { status: 400 });
    }
    const admin = await bootstrapAdmin({
      firstName: String(body.firstName || 'Baby').trim(),
      lastName: String(body.lastName || 'Cheepy Admin').trim(),
      brandName: String(body.brandName || 'Baby Cheepy').trim(),
      phone: String(body.phone || '').trim(),
      lineId: String(body.lineId || '').trim(),
      email: String(body.email || '').trim().toLowerCase(),
      passwordHash: hashPassword(password),
    });
    return NextResponse.json({ ok: true, admin: admin ? { id: admin.id, email: admin.email } : null });
  } catch (error) {
    if (error instanceof MemberBackendSetupError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 503 });
    }
    return NextResponse.json({ ok: false, error: 'สร้างบัญชีแอดมินไม่สำเร็จ' }, { status: 500 });
  }
}
