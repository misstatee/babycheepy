import { NextResponse } from 'next/server';
import { getAuthContext, authStatusMessage } from '../../../../lib/member/auth';
import { getCreditSummary } from '../../../../lib/member/repository';
import { MemberBackendSetupError } from '../../../../lib/member/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const context = await getAuthContext();
    if (!context) {
      return NextResponse.json({
        ok: true,
        authenticated: false,
        canUseMemberTools: false,
        status: null,
        message: 'ฟีเจอร์นี้สำหรับสมาชิก Babycheepy Brand Club กรุณาสมัครสมาชิกหรือเข้าสู่ระบบ',
      });
    }

    const canUseMemberTools = context.user.role === 'admin' || context.membership?.status === 'active';
    return NextResponse.json({
      ok: true,
      authenticated: true,
      canUseMemberTools,
      user: {
        id: context.user.id,
        firstName: context.user.first_name,
        lastName: context.user.last_name,
        brandName: context.user.brand_name,
        email: context.user.email,
        phone: context.user.phone,
        role: context.user.role,
      },
      status: context.membership?.status || null,
      membershipType: context.membership?.membership_type || null,
      credit: getCreditSummary(context.membership),
      message: authStatusMessage(context.membership),
    });
  } catch (error) {
    if (error instanceof MemberBackendSetupError) {
      return NextResponse.json({
        ok: false,
        authenticated: false,
        canUseMemberTools: false,
        status: null,
        message: error.message,
      }, { status: 503 });
    }
    return NextResponse.json({ ok: false, error: 'ตรวจสอบสิทธิ์ไม่สำเร็จ' }, { status: 500 });
  }
}
