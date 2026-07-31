import { NextRequest, NextResponse } from 'next/server';
import { requireActiveMemberApi } from '../../../../lib/member/auth';
import { getRequestKey, rateLimit } from '../../../../lib/member/rate-limit';
import { createAiModelRequest, createNotification, getAiModelById } from '../../../../lib/member/repository';
import { safeStorageFileName, sha256Buffer } from '../../../../lib/member/security';
import { uploadPrivateObject } from '../../../../lib/member/supabase';
import { jsonError, normalizeText, requireAccepted, requireText, validateUpload } from '../../../../lib/member/validation';

export const runtime = 'nodejs';

const uploadFields = [
  ['mainGarment', 'ภาพชุดต้นฉบับ', true],
  ['frontImage', 'ภาพด้านหน้า', true],
  ['backImage', 'ภาพด้านหลัง', false],
  ['fabricDetail', 'ภาพรายละเอียดผ้า', false],
  ['fabricPattern', 'ลายผ้า', false],
] as const;

export async function POST(request: NextRequest) {
  const auth = await requireActiveMemberApi();
  if (!auth.ok) return auth.response;

  const limit = rateLimit(getRequestKey(request, `ai-request:${auth.context.user.id}`), 6, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: 'ส่งคำขอถี่เกินไป กรุณาลองใหม่ภายหลัง' }, { status: 429 });
  }

  try {
    if (!auth.context.membership) throw new Error('ไม่พบบัญชีสมาชิก');
    const formData = await request.formData();
    const brandName = requireText(formData, 'brandName', 'ชื่อแบรนด์');
    const productName = requireText(formData, 'productName', 'ชื่อสินค้า');
    const productType = requireText(formData, 'productType', 'ประเภทสินค้า');
    const aiModelId = requireText(formData, 'aiModelId', 'นางแบบ AI');
    const aspectRatio = requireText(formData, 'aspectRatio', 'อัตราส่วนภาพ', 20);
    const backgroundStyle = requireText(formData, 'backgroundStyle', 'สไตล์พื้นหลัง', 80);
    const usageChannel = requireText(formData, 'usageChannel', 'ช่องทางนำภาพไปใช้งาน', 160);
    const notes = normalizeText(formData.get('notes'));
    requireAccepted(formData, 'confirmed', 'กรุณายืนยันว่าได้ตรวจสอบนางแบบและรายละเอียดชุดแล้ว');

    const model = await getAiModelById(aiModelId);
    if (!model || model.status !== 'active') throw new Error('กรุณาเลือกนางแบบ AI ที่เปิดใช้งานอยู่ในคลัง');

    const uploadedFiles = [];
    for (const [field, label, required] of uploadFields) {
      const upload = await validateUpload(formData.get(field), { label, kind: 'image', required });
      if (!upload) continue;
      const path = `ai-model-requests/${auth.context.user.id}/${safeStorageFileName(upload.originalName, upload.extension)}`;
      const stored = await uploadPrivateObject({ path, contentType: upload.contentType, buffer: upload.buffer });
      uploadedFiles.push({
        fileKind: field,
        bucket: stored.bucket,
        path: stored.path,
        originalName: upload.originalName,
        contentType: upload.contentType,
        byteSize: upload.size,
        sha256: sha256Buffer(upload.buffer),
      });
    }

    const aiRequest = await createAiModelRequest({
      userId: auth.context.user.id,
      membership: auth.context.membership,
      brandName,
      productName,
      productType,
      aiModelId,
      aspectRatio,
      backgroundStyle,
      usageChannel,
      notes,
      files: uploadedFiles,
    });

    await createNotification({
      userId: auth.context.user.id,
      title: 'ส่งคำขอชุดภาพ AI สำเร็จ',
      body: `คำขอ ${productName} ถูกส่งให้แอดมินตรวจสอบแล้ว`,
      href: '/member-dashboard',
    }).catch(() => undefined);

    return NextResponse.json({ ok: true, request: aiRequest });
  } catch (error) {
    return jsonError(error);
  }
}
