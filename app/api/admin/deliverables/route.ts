import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '../../../../lib/member/auth';
import { createDeliverable, createNotification, getAiRequestById, recordAudit, updateAiRequestStatus } from '../../../../lib/member/repository';
import { safeStorageFileName, sha256Buffer } from '../../../../lib/member/security';
import { uploadPrivateObject } from '../../../../lib/member/supabase';
import { validateUpload } from '../../../../lib/member/validation';
import type { DeliverableKind } from '../../../../lib/member/types';

export const runtime = 'nodejs';

const deliverableKinds: DeliverableKind[] = [
  'mockup',
  'model_pose_1',
  'model_pose_2',
  'model_pose_3',
  'model_pose_4',
  'model_pose_5',
];

export async function POST(request: NextRequest) {
  const admin = await requireAdminApi();
  if (!admin.ok) return admin.response;

  try {
    const formData = await request.formData();
    const requestId = String(formData.get('requestId') || '').trim();
    if (!requestId) return NextResponse.json({ ok: false, error: 'กรุณาระบุคำขอ' }, { status: 400 });
    const aiRequest = await getAiRequestById(requestId);
    if (!aiRequest) return NextResponse.json({ ok: false, error: 'ไม่พบคำขอภาพ AI' }, { status: 404 });

    const uploaded = [];
    for (const kind of deliverableKinds) {
      const file = await validateUpload(formData.get(kind), { label: kind, kind: 'image', required: true });
      if (!file) continue;
      const stored = await uploadPrivateObject({
        path: `ai-model-deliverables/${aiRequest.user_id}/${requestId}/${kind}-${safeStorageFileName(file.originalName, file.extension)}`,
        contentType: file.contentType,
        buffer: file.buffer,
      });
      uploaded.push(await createDeliverable({
        requestId,
        userId: aiRequest.user_id,
        kind,
        bucket: stored.bucket,
        path: stored.path,
        originalName: file.originalName,
        contentType: file.contentType,
        byteSize: file.size,
        sha256: sha256Buffer(file.buffer),
      }));
    }

    const completed = await updateAiRequestStatus({
      requestId,
      adminUserId: admin.context.user.id,
      status: 'completed',
      note: 'อัปโหลดไฟล์ส่งมอบครบ 6 ภาพ',
    });

    await createNotification({
      userId: aiRequest.user_id,
      title: 'ภาพ AI พร้อมส่งมอบแล้ว',
      body: `${aiRequest.product_name} ส่งมอบครบ 6 ภาพแล้ว`,
      href: '/member-dashboard',
    }).catch(() => undefined);

    await recordAudit({
      adminUserId: admin.context.user.id,
      action: 'upload_ai_deliverables',
      entityType: 'ai_model_request',
      entityId: requestId,
      after: uploaded,
      note: 'อัปโหลดไฟล์ส่งมอบครบ 6 ภาพ',
    }).catch(() => undefined);

    return NextResponse.json({ ok: true, request: completed, deliverables: uploaded });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'อัปโหลดไฟล์ส่งมอบไม่สำเร็จ';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
