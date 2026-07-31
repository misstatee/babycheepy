import { NextResponse } from 'next/server';
import { requireActiveMemberApi } from '../../../../lib/member/auth';
import { createAiRevision } from '../../../../lib/member/repository';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const auth = await requireActiveMemberApi();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const requestId = String(body.requestId || '').trim();
    const message = String(body.message || '').trim();
    const imageKeys = Array.isArray(body.imageKeys) ? body.imageKeys.map(String) : [];
    if (!requestId || !message) {
      return NextResponse.json({ ok: false, error: 'กรุณาเลือกคำขอและกรอกรายละเอียดที่ต้องการแก้ไข' }, { status: 400 });
    }
    const revision = await createAiRevision({ requestId, userId: auth.context.user.id, message, imageKeys });
    return NextResponse.json({ ok: true, revision });
  } catch {
    return NextResponse.json({ ok: false, error: 'ส่งคำขอแก้ไขไม่สำเร็จ' }, { status: 500 });
  }
}
