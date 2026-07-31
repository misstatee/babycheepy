import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '../../../../lib/member/auth';
import { createAiModel, recordAudit } from '../../../../lib/member/repository';
import { safeStorageFileName, sha256Buffer } from '../../../../lib/member/security';
import { uploadPrivateObject } from '../../../../lib/member/supabase';
import { normalizeText, requireText, validateUpload } from '../../../../lib/member/validation';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const admin = await requireAdminApi();
  if (!admin.ok) return admin.response;

  try {
    const formData = await request.formData();
    const preview = await validateUpload(formData.get('preview'), {
      label: 'ภาพ Preview นางแบบ',
      kind: 'image',
      required: false,
    });
    let stored: { bucket: string; path: string } | null = null;
    if (preview) {
      stored = await uploadPrivateObject({
        path: `ai-model-previews/${safeStorageFileName(preview.originalName, preview.extension)}`,
        contentType: preview.contentType,
        buffer: preview.buffer,
      });
      sha256Buffer(preview.buffer);
    }

    const model = await createAiModel({
      model_code: requireText(formData, 'modelCode', 'Model ID', 80),
      display_name: requireText(formData, 'displayName', 'ชื่อนางแบบ', 120),
      preview_bucket: stored?.bucket || null,
      preview_path: stored?.path || null,
      approx_age: normalizeText(formData.get('approxAge')) || null,
      gender: normalizeText(formData.get('gender')) || null,
      style: normalizeText(formData.get('style')) || null,
      skin_tone: normalizeText(formData.get('skinTone')) || null,
      hair_style: normalizeText(formData.get('hairStyle')) || null,
      suitable_age_range: normalizeText(formData.get('suitableAgeRange')) || null,
      status: 'active',
      sort_order: Number(formData.get('sortOrder') || 100),
    });

    if (model) {
      await recordAudit({
        adminUserId: admin.context.user.id,
        action: 'create_ai_model',
        entityType: 'ai_model',
        entityId: model.id,
        after: model,
      }).catch(() => undefined);
    }

    return NextResponse.json({ ok: true, model });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'เพิ่มนางแบบไม่สำเร็จ';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
