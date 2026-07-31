import { NextResponse } from 'next/server';
import { requireAdminApi } from '../../../../../lib/member/auth';
import { createNotification, recordAudit, updateAiRequestStatus } from '../../../../../lib/member/repository';
import { aiModelRequestStatusText, type AiModelRequestStatus } from '../../../../../lib/member/types';

export const runtime = 'nodejs';

type Props = { params: Promise<{ requestId: string }> };

export async function PATCH(request: Request, { params }: Props) {
  const admin = await requireAdminApi();
  if (!admin.ok) return admin.response;

  try {
    const { requestId } = await params;
    const body = await request.json();
    const status = String(body.status || '') as AiModelRequestStatus;
    if (!Object.prototype.hasOwnProperty.call(aiModelRequestStatusText, status)) {
      return NextResponse.json({ ok: false, error: 'สถานะคำขอไม่ถูกต้อง' }, { status: 400 });
    }
    const updated = await updateAiRequestStatus({
      requestId,
      adminUserId: admin.context.user.id,
      status,
      note: String(body.note || '').trim(),
    });
    if (updated?.user_id) {
      await createNotification({
        userId: updated.user_id,
        title: 'คำขอชุดภาพ AI เปลี่ยนสถานะ',
        body: `${updated.product_name}: ${aiModelRequestStatusText[status]}`,
        href: '/member-dashboard',
      }).catch(() => undefined);
    }
    await recordAudit({
      adminUserId: admin.context.user.id,
      action: 'update_ai_model_request_status',
      entityType: 'ai_model_request',
      entityId: requestId,
      after: updated,
      note: String(body.note || '').trim(),
    }).catch(() => undefined);
    return NextResponse.json({ ok: true, request: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'อัปเดตคำขอไม่สำเร็จ';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
