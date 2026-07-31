import { NextResponse } from 'next/server';
import { requireAdminApi } from '../../../../../lib/member/auth';
import { createNotification, recordAudit, updateProductionOrder } from '../../../../../lib/member/repository';

export const runtime = 'nodejs';

type Props = { params: Promise<{ orderId: string }> };

export async function PATCH(request: Request, { params }: Props) {
  const admin = await requireAdminApi();
  if (!admin.ok) return admin.response;

  try {
    const { orderId } = await params;
    const body = await request.json();
    const patch = {
      current_status: String(body.current_status || body.currentStatus || '').trim(),
      customer_note: String(body.customer_note || body.customerNote || '').trim() || null,
      internal_note: body.internal_note === undefined ? undefined : String(body.internal_note || '').trim() || null,
      tracking_number: body.tracking_number === undefined ? undefined : String(body.tracking_number || '').trim() || null,
      shipping_carrier: body.shipping_carrier === undefined ? undefined : String(body.shipping_carrier || '').trim() || null,
    };
    if (!patch.current_status) return NextResponse.json({ ok: false, error: 'กรุณาเลือกสถานะงานผลิต' }, { status: 400 });

    const order = await updateProductionOrder(orderId, patch, admin.context.user.id);
    if (order?.user_id) {
      await createNotification({
        userId: order.user_id,
        title: 'งานผลิตเปลี่ยนสถานะ',
        body: `${order.product_name}: ${order.current_status}`,
        href: '/member/production',
      }).catch(() => undefined);
    }
    await recordAudit({
      adminUserId: admin.context.user.id,
      action: 'update_production_order',
      entityType: 'production_order',
      entityId: orderId,
      after: order,
    }).catch(() => undefined);
    return NextResponse.json({ ok: true, order });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'อัปเดตงานผลิตไม่สำเร็จ';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
