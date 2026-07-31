import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '../../../../lib/member/auth';
import { createNotification, createProductionOrder, recordAudit } from '../../../../lib/member/repository';
import { safeStorageFileName, sha256Buffer } from '../../../../lib/member/security';
import { uploadPrivateObject } from '../../../../lib/member/supabase';
import { normalizeText, requireText, validateUpload } from '../../../../lib/member/validation';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const admin = await requireAdminApi();
  if (!admin.ok) return admin.response;

  try {
    const formData = await request.formData();
    const userId = requireText(formData, 'userId', 'สมาชิก');
    const brandName = requireText(formData, 'brandName', 'ชื่อแบรนด์');
    const productName = requireText(formData, 'productName', 'ชื่อสินค้า');
    const image = await validateUpload(formData.get('productImage'), { label: 'รูปสินค้า', kind: 'image', required: false });
    let stored: { bucket: string; path: string } | null = null;
    if (image) {
      stored = await uploadPrivateObject({
        path: `production-orders/${userId}/${safeStorageFileName(image.originalName, image.extension)}`,
        contentType: image.contentType,
        buffer: image.buffer,
      });
      sha256Buffer(image.buffer);
    }

    const order = await createProductionOrder({
      user_id: userId,
      brand_name: brandName,
      product_name: productName,
      product_image_bucket: stored?.bucket || null,
      product_image_path: stored?.path || null,
      quantity: Number(formData.get('quantity') || 0) || null,
      received_at: new Date().toISOString(),
      expected_done_at: normalizeText(formData.get('expectedDoneAt')) || null,
      current_status: 'รับข้อมูลแล้ว',
      customer_note: normalizeText(formData.get('customerNote')) || null,
      internal_note: normalizeText(formData.get('internalNote')) || null,
      show_to_customer: true,
    });

    if (order) {
      await createNotification({
        userId,
        title: 'เพิ่มรายการผลิตใหม่',
        body: `${productName}: รับข้อมูลแล้ว`,
        href: '/member/production',
      }).catch(() => undefined);
      await recordAudit({
        adminUserId: admin.context.user.id,
        action: 'create_production_order',
        entityType: 'production_order',
        entityId: order.id,
        after: order,
      }).catch(() => undefined);
    }

    return NextResponse.json({ ok: true, order });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'เพิ่มงานผลิตไม่สำเร็จ';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
