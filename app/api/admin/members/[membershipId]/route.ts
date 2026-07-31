import { NextResponse } from 'next/server';
import { requireAdminApi } from '../../../../../lib/member/auth';
import {
  adjustAiModelSetCredit,
  approveMembership,
  createNotification,
  getMembershipById,
  recordAudit,
  updateMembershipStatus,
} from '../../../../../lib/member/repository';
import type { MembershipStatus } from '../../../../../lib/member/types';

export const runtime = 'nodejs';

type Props = { params: Promise<{ membershipId: string }> };
type AdminEditableMembershipStatus = Exclude<MembershipStatus, 'active'>;
const adminEditableStatuses: AdminEditableMembershipStatus[] = ['pending', 'suspended', 'rejected'];

export async function PATCH(request: Request, { params }: Props) {
  const admin = await requireAdminApi();
  if (!admin.ok) return admin.response;

  const { membershipId } = await params;
  const before = await getMembershipById(membershipId);
  if (!before) return NextResponse.json({ ok: false, error: 'ไม่พบสมาชิก' }, { status: 404 });

  try {
    const body = await request.json();
    const action = String(body.action || '');
    const note = String(body.note || '').trim();
    let after;

    if (action === 'approve') {
      after = await approveMembership(membershipId, admin.context.user.id, note);
      if (after?.user_id) {
        await createNotification({
          userId: after.user_id,
          title: 'บัญชี Babycheepy Brand Club พร้อมใช้งานแล้ว',
          body: 'คุณสามารถเข้าใช้ AI วัดไซส์, AI ลองชุด และสิทธิ์สมาชิกได้แล้ว',
          href: '/member-dashboard',
        }).catch(() => undefined);
      }
    } else if (action === 'set_status') {
      const status = String(body.status || '') as AdminEditableMembershipStatus;
      if (!adminEditableStatuses.includes(status)) {
        return NextResponse.json({ ok: false, error: 'สถานะไม่ถูกต้อง' }, { status: 400 });
      }
      after = await updateMembershipStatus({
        membershipId,
        adminUserId: admin.context.user.id,
        status,
        note,
        suspendedReason: String(body.suspendedReason || '').trim(),
      });
      if (after?.user_id) {
        await createNotification({
          userId: after.user_id,
          title: `สถานะสมาชิกเปลี่ยนเป็น ${status}`,
          body: note || 'กรุณาตรวจสอบ Dashboard หรือ ติดต่อแอดมิน Baby Cheepy',
          href: '/member-dashboard',
        }).catch(() => undefined);
      }
    } else if (action === 'credit') {
      const delta = Number(body.delta || 0);
      if (!Number.isInteger(delta) || delta === 0) {
        return NextResponse.json({ ok: false, error: 'จำนวนเครดิตไม่ถูกต้อง' }, { status: 400 });
      }
      after = await adjustAiModelSetCredit({
        membershipId,
        adminUserId: admin.context.user.id,
        delta,
        reason: note || 'ปรับเครดิตโดยแอดมิน',
      });
    } else {
      return NextResponse.json({ ok: false, error: 'Action ไม่ถูกต้อง' }, { status: 400 });
    }

    await recordAudit({
      adminUserId: admin.context.user.id,
      action,
      entityType: 'membership',
      entityId: membershipId,
      before,
      after,
      note,
    }).catch(() => undefined);

    return NextResponse.json({ ok: true, membership: after });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'จัดการสมาชิกไม่สำเร็จ';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
