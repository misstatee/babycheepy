import { BRAND_CLUB_PACKAGE, BRAND_CLUB_TYPE, type AiModelDeliverableRecord, type AiModelRecord, type AiModelRequestRecord, type AiModelRequestStatus, type MembershipRecord, type MembershipStatus, type NotificationRecord, type PaymentProofRecord, type ProductionOrderRecord, type UserRecord } from './types';
import { eq, supabaseRest, supabaseRpc } from './supabase';

function first<T>(value: T[] | T | null | undefined) {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function orderByNewest(path: string) {
  return `${path}${path.includes('?') ? '&' : '?'}order=created_at.desc`;
}

export async function registerBrandClubMember(input: {
  firstName: string;
  lastName: string;
  brandName: string;
  phone: string;
  lineId: string;
  email: string;
  passwordHash: string;
  paymentProof: {
    bucket: string;
    path: string;
    originalName: string;
    contentType: string;
    byteSize: number;
    sha256: string;
  };
}) {
  const result = await supabaseRpc<MembershipRecord[] | MembershipRecord>('register_brand_club_member', {
    p_first_name: input.firstName,
    p_last_name: input.lastName,
    p_brand_name: input.brandName,
    p_phone: input.phone,
    p_line_id: input.lineId || null,
    p_email: input.email,
    p_password_hash: input.passwordHash,
    p_payment_storage_bucket: input.paymentProof.bucket,
    p_payment_storage_path: input.paymentProof.path,
    p_payment_original_filename: input.paymentProof.originalName,
    p_payment_content_type: input.paymentProof.contentType,
    p_payment_byte_size: input.paymentProof.byteSize,
    p_payment_sha256: input.paymentProof.sha256,
  });
  return first(result);
}

export async function bootstrapAdmin(input: {
  firstName: string;
  lastName: string;
  brandName: string;
  phone: string;
  lineId?: string;
  email: string;
  passwordHash: string;
}) {
  const result = await supabaseRpc<UserRecord[] | UserRecord>('bootstrap_admin_user', {
    p_first_name: input.firstName,
    p_last_name: input.lastName,
    p_brand_name: input.brandName,
    p_phone: input.phone,
    p_line_id: input.lineId || null,
    p_email: input.email,
    p_password_hash: input.passwordHash,
  });
  return first(result);
}

export async function getUserByLogin(login: string) {
  const normalized = login.trim().toLowerCase();
  const filter = normalized.includes('@') ? `email=${eq(normalized)}` : `phone=${eq(normalized.replace(/[^\d+]/g, ''))}`;
  const rows = await supabaseRest<UserRecord[]>(`users?${filter}&limit=1`);
  return rows[0] ?? null;
}

export async function getUserById(userId: string) {
  const rows = await supabaseRest<UserRecord[]>(`users?id=${eq(userId)}&limit=1`);
  return rows[0] ?? null;
}

export async function getMembershipByUserId(userId: string) {
  const rows = await supabaseRest<MembershipRecord[]>(`memberships?user_id=${eq(userId)}&limit=1`);
  return rows[0] ?? null;
}

export async function getMembershipById(membershipId: string) {
  const rows = await supabaseRest<MembershipRecord[]>(`memberships?id=${eq(membershipId)}&select=*,user:users(*)&limit=1`);
  return rows[0] ?? null;
}

export async function getMemberProfile(userId: string) {
  const [user, membership] = await Promise.all([getUserById(userId), getMembershipByUserId(userId)]);
  if (!user) return null;
  return { user, membership };
}

export async function listMemberships(status?: MembershipStatus, query?: string) {
  const statusFilter = status ? `&status=${eq(status)}` : '';
  const rows = await supabaseRest<MembershipRecord[]>(
    `memberships?select=*,user:users(*)&order=applied_at.desc${statusFilter}&limit=300`,
  );
  const q = query?.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((row) => {
    const user = row.user;
    return [user?.first_name, user?.last_name, user?.brand_name, user?.phone, user?.email]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(q));
  });
}

export async function approveMembership(membershipId: string, adminUserId: string, note?: string) {
  const result = await supabaseRpc<MembershipRecord[] | MembershipRecord>('approve_brand_club_member', {
    p_membership_id: membershipId,
    p_admin_id: adminUserId,
    p_note: note || null,
  });
  return first(result);
}

export async function updateMembershipStatus(params: {
  membershipId: string;
  adminUserId: string;
  status: Exclude<MembershipStatus, 'active'>;
  note?: string;
  suspendedReason?: string;
}) {
  const result = await supabaseRpc<MembershipRecord[] | MembershipRecord>('set_brand_club_member_status', {
    p_membership_id: params.membershipId,
    p_admin_id: params.adminUserId,
    p_status: params.status,
    p_note: params.note || null,
    p_suspended_reason: params.suspendedReason || null,
  });
  return first(result);
}

export async function adjustAiModelSetCredit(params: {
  membershipId: string;
  adminUserId: string;
  delta: number;
  reason: string;
}) {
  const result = await supabaseRpc<MembershipRecord[] | MembershipRecord>('adjust_ai_model_set_credit', {
    p_membership_id: params.membershipId,
    p_admin_id: params.adminUserId,
    p_delta: params.delta,
    p_reason: params.reason,
    p_idempotency_key: `admin-adjust:${params.adminUserId}:${params.membershipId}:${Date.now()}`,
  });
  return first(result);
}

export async function listAiModels(activeOnly = false) {
  const filter = activeOnly ? `&status=${eq('active')}` : '';
  return supabaseRest<AiModelRecord[]>(`ai_models?select=*&order=sort_order.asc,created_at.desc${filter}`);
}

export async function getAiModelById(modelId: string) {
  const rows = await supabaseRest<AiModelRecord[]>(`ai_models?id=${eq(modelId)}&limit=1`);
  return rows[0] ?? null;
}

export async function createAiModel(input: Partial<AiModelRecord>) {
  const rows = await supabaseRest<AiModelRecord[]>('ai_models', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return rows[0] ?? null;
}

export async function updateAiModel(modelId: string, input: Partial<AiModelRecord>) {
  const rows = await supabaseRest<AiModelRecord[]>(`ai_models?id=${eq(modelId)}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
  return rows[0] ?? null;
}

export async function createAiModelRequest(input: {
  userId: string;
  membership: MembershipRecord;
  brandName: string;
  productName: string;
  productType: string;
  aiModelId: string;
  aspectRatio: string;
  backgroundStyle: string;
  usageChannel: string;
  notes?: string;
  files: Array<{
    fileKind: string;
    bucket: string;
    path: string;
    originalName: string;
    contentType: string;
    byteSize: number;
    sha256: string;
  }>;
}) {
  const remaining = input.membership.ai_model_set_total - input.membership.ai_model_set_used;
  if (remaining <= 0) {
    throw new Error('สิทธิ์ชุดภาพนางแบบ AI ของคุณถูกใช้ครบแล้ว กรุณาติดต่อแอดมิน Baby Cheepy');
  }

  const requestRows = await supabaseRest<AiModelRequestRecord[]>('ai_model_requests', {
    method: 'POST',
    body: JSON.stringify({
      user_id: input.userId,
      membership_id: input.membership.id,
      brand_name: input.brandName,
      product_name: input.productName,
      product_type: input.productType,
      ai_model_id: input.aiModelId,
      status: 'submitted',
      aspect_ratio: input.aspectRatio,
      background_style: input.backgroundStyle,
      usage_channel: input.usageChannel,
      notes: input.notes || null,
      confirmation_checked: true,
    }),
  });
  const request = requestRows[0];
  if (!request) throw new Error('ไม่สามารถสร้างคำขอชุดภาพ AI ได้');

  if (input.files.length) {
    await supabaseRest('ai_model_request_files', {
      method: 'POST',
      body: JSON.stringify(
        input.files.map((file) => ({
          request_id: request.id,
          user_id: input.userId,
          file_kind: file.fileKind,
          storage_bucket: file.bucket,
          storage_path: file.path,
          original_filename: file.originalName,
          content_type: file.contentType,
          byte_size: file.byteSize,
          sha256: file.sha256,
        })),
      ),
    });
  }

  return request;
}

export async function listAiRequestsForUser(userId: string) {
  return supabaseRest<AiModelRequestRecord[]>(
    orderByNewest(`ai_model_requests?user_id=${eq(userId)}&select=*,ai_model:ai_models(*)&limit=200`),
  );
}

export async function listAiRequestsForAdmin(status?: AiModelRequestStatus) {
  const statusFilter = status ? `&status=${eq(status)}` : '';
  return supabaseRest<AiModelRequestRecord[]>(
    `ai_model_requests?select=*,user:users(*),ai_model:ai_models(*)&order=created_at.desc${statusFilter}&limit=300`,
  );
}

export async function getAiRequestById(requestId: string) {
  const rows = await supabaseRest<AiModelRequestRecord[]>(
    `ai_model_requests?id=${eq(requestId)}&select=*,user:users(*),ai_model:ai_models(*)&limit=1`,
  );
  return rows[0] ?? null;
}

export async function updateAiRequestStatus(params: {
  requestId: string;
  adminUserId: string;
  status: AiModelRequestStatus;
  note?: string;
}) {
  const result = await supabaseRpc<AiModelRequestRecord[] | AiModelRequestRecord>('set_ai_model_request_status', {
    p_request_id: params.requestId,
    p_admin_id: params.adminUserId,
    p_status: params.status,
    p_note: params.note || null,
  });
  return first(result);
}

export async function createAiRevision(input: {
  requestId: string;
  userId: string;
  message: string;
  imageKeys: string[];
}) {
  const rows = await supabaseRest('ai_model_revisions', {
    method: 'POST',
    body: JSON.stringify({
      request_id: input.requestId,
      user_id: input.userId,
      message: input.message,
      selected_deliverable_ids: input.imageKeys,
      status: 'submitted',
    }),
  });
  return first(rows);
}

export async function createDeliverable(input: {
  requestId: string;
  userId: string;
  kind: string;
  bucket: string;
  path: string;
  originalName: string;
  contentType: string;
  byteSize: number;
  sha256: string;
}) {
  const rows = await supabaseRest('ai_model_deliverables', {
    method: 'POST',
    body: JSON.stringify({
      request_id: input.requestId,
      user_id: input.userId,
      deliverable_kind: input.kind,
      storage_bucket: input.bucket,
      storage_path: input.path,
      original_filename: input.originalName,
      content_type: input.contentType,
      byte_size: input.byteSize,
      sha256: input.sha256,
    }),
  });
  return first(rows);
}

export async function listDeliverablesForUser(userId: string) {
  return supabaseRest<AiModelDeliverableRecord[]>(
    `ai_model_deliverables?user_id=${eq(userId)}&select=*&order=created_at.asc&limit=300`,
  );
}

export async function listDeliverablesForRequest(requestId: string) {
  return supabaseRest<AiModelDeliverableRecord[]>(
    `ai_model_deliverables?request_id=${eq(requestId)}&select=*&order=deliverable_kind.asc&limit=6`,
  );
}

export async function listProductionOrdersForUser(userId: string) {
  return supabaseRest<ProductionOrderRecord[]>(
    `production_orders?user_id=${eq(userId)}&show_to_customer=${eq(true)}&select=*&order=updated_at.desc&limit=100`,
  );
}

export async function listProductionOrdersForAdmin() {
  return supabaseRest<ProductionOrderRecord[]>(
    'production_orders?select=*,user:users(*)&order=updated_at.desc&limit=300',
  );
}

export async function createProductionOrder(input: Partial<ProductionOrderRecord>) {
  const rows = await supabaseRest<ProductionOrderRecord[]>('production_orders', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return rows[0] ?? null;
}

export async function updateProductionOrder(orderId: string, input: Partial<ProductionOrderRecord>, adminUserId: string) {
  const result = await supabaseRpc<ProductionOrderRecord[] | ProductionOrderRecord>('update_production_order_status', {
    p_order_id: orderId,
    p_admin_id: adminUserId,
    p_patch: input,
  });
  return first(result);
}

export async function listNotifications(userId: string) {
  return supabaseRest<NotificationRecord[]>(
    `notifications?user_id=${eq(userId)}&select=*&order=created_at.desc&limit=50`,
  );
}

export async function createNotification(input: {
  userId: string;
  title: string;
  body: string;
  href?: string;
}) {
  await supabaseRest('notifications', {
    method: 'POST',
    body: JSON.stringify({
      user_id: input.userId,
      title: input.title,
      body: input.body,
      href: input.href || null,
    }),
  });
}

export async function recordAudit(input: {
  adminUserId: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  note?: string;
}) {
  await supabaseRest('admin_audit_logs', {
    method: 'POST',
    body: JSON.stringify({
      admin_user_id: input.adminUserId,
      action: input.action,
      entity_type: input.entityType,
      entity_id: input.entityId,
      before_value: input.before || null,
      after_value: input.after || null,
      note: input.note || null,
    }),
  });
}

export async function createPasswordReset(userId: string, tokenHash: string, expiresAt: string) {
  await supabaseRest('password_reset_tokens', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    }),
  });
}

export async function consumePasswordReset(tokenHash: string, passwordHash: string) {
  const result = await supabaseRpc<UserRecord[] | UserRecord>('consume_password_reset_token', {
    p_token_hash: tokenHash,
    p_password_hash: passwordHash,
  });
  return first(result);
}

export async function getPaymentProofById(id: string) {
  const rows = await supabaseRest<PaymentProofRecord[]>(`payment_proofs?id=${eq(id)}&limit=1`);
  return rows[0] ?? null;
}

export async function getPrivateFileRecord(kind: string | null, id: string) {
  if (kind === 'payment') {
    const row = await getPaymentProofById(id);
    return row
      ? {
          userId: row.user_id,
          bucket: row.storage_bucket,
          path: row.storage_path,
          contentType: row.content_type,
          fileName: row.original_filename,
          publicForActiveMembers: false,
        }
      : null;
  }

  if (kind === 'ai_model_preview') {
    const model = await getAiModelById(id);
    return model?.preview_bucket && model.preview_path
      ? {
          userId: null,
          bucket: model.preview_bucket,
          path: model.preview_path,
          contentType: 'image/jpeg',
          fileName: `${model.model_code}.jpg`,
          publicForActiveMembers: model.status === 'active',
        }
      : null;
  }

  if (kind === 'deliverable') {
    const rows = await supabaseRest<Array<{ user_id: string; storage_bucket: string; storage_path: string; content_type: string; original_filename: string }>>(
      `ai_model_deliverables?id=${eq(id)}&limit=1`,
    );
    const row = rows[0];
    return row
      ? {
          userId: row.user_id,
          bucket: row.storage_bucket,
          path: row.storage_path,
          contentType: row.content_type,
          fileName: row.original_filename,
          publicForActiveMembers: false,
        }
      : null;
  }

  if (kind === 'production_image') {
    const rows = await supabaseRest<
      Array<{
        user_id: string;
        product_image_bucket: string | null;
        product_image_path: string | null;
        product_name: string;
      }>
    >(`production_orders?id=${eq(id)}&limit=1`);
    const row = rows[0];
    return row?.product_image_bucket && row.product_image_path
      ? {
          userId: row.user_id,
          bucket: row.product_image_bucket,
          path: row.product_image_path,
          contentType: 'image/jpeg',
          fileName: `${row.product_name}.jpg`,
          publicForActiveMembers: false,
        }
      : null;
  }

  const rows = await supabaseRest<Array<{ user_id: string; storage_bucket: string; storage_path: string; content_type: string; original_filename: string }>>(
    `ai_model_request_files?id=${eq(id)}&limit=1`,
  );
  const row = rows[0];
  return row
    ? {
        userId: row.user_id,
        bucket: row.storage_bucket,
        path: row.storage_path,
        contentType: row.content_type,
        fileName: row.original_filename,
        publicForActiveMembers: false,
      }
    : null;
}

export function getCreditSummary(membership: MembershipRecord | null | undefined) {
  const total = membership?.ai_model_set_total ?? BRAND_CLUB_PACKAGE.aiModelSetTotal;
  const used = membership?.ai_model_set_used ?? 0;
  return {
    total,
    used,
    remaining: Math.max(0, total - used),
    imagesPerSet: membership?.images_per_set ?? BRAND_CLUB_PACKAGE.imagesPerSet,
    mockupImagesPerSet: membership?.mockup_images_per_set ?? BRAND_CLUB_PACKAGE.mockupImagesPerSet,
    modelImagesPerSet: membership?.model_images_per_set ?? BRAND_CLUB_PACKAGE.modelImagesPerSet,
    membershipType: membership?.membership_type ?? BRAND_CLUB_TYPE,
  };
}
