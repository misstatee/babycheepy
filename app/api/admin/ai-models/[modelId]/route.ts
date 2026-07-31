import { NextResponse } from 'next/server';
import { requireAdminApi } from '../../../../../lib/member/auth';
import { getAiModelById, recordAudit, updateAiModel } from '../../../../../lib/member/repository';
import type { AiModelStatus } from '../../../../../lib/member/types';

export const runtime = 'nodejs';

type Props = { params: Promise<{ modelId: string }> };

async function updateStatus(modelId: string, status: AiModelStatus, adminUserId: string, request: Request) {
  const before = await getAiModelById(modelId);
  if (!before) return NextResponse.json({ ok: false, error: 'ไม่พบนางแบบ' }, { status: 404 });
  const model = await updateAiModel(modelId, { status });
  await recordAudit({
    adminUserId,
    action: 'update_ai_model',
    entityType: 'ai_model',
    entityId: modelId,
    before,
    after: model,
  }).catch(() => undefined);
  if (request.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ ok: true, model });
  }
  return NextResponse.redirect(new URL('/admin/ai-models', request.url), { status: 303 });
}

export async function PATCH(request: Request, { params }: Props) {
  const admin = await requireAdminApi();
  if (!admin.ok) return admin.response;
  const { modelId } = await params;
  const body = await request.json();
  const status = String(body.status || '') as AiModelStatus;
  if (!['active', 'inactive'].includes(status)) {
    return NextResponse.json({ ok: false, error: 'สถานะไม่ถูกต้อง' }, { status: 400 });
  }
  return updateStatus(modelId, status, admin.context.user.id, request);
}

export async function POST(request: Request, { params }: Props) {
  const admin = await requireAdminApi();
  if (!admin.ok) return admin.response;
  const { modelId } = await params;
  const formData = await request.formData();
  const status = String(formData.get('status') || '') as AiModelStatus;
  if (!['active', 'inactive'].includes(status)) {
    return NextResponse.json({ ok: false, error: 'สถานะไม่ถูกต้อง' }, { status: 400 });
  }
  return updateStatus(modelId, status, admin.context.user.id, request);
}
