import { redirect } from 'next/navigation';
import MemberNav from '../../components/member/MemberNav';
import SetupNotice from '../../components/member/SetupNotice';
import { AdminMemberControls } from '../../components/member/AdminControls';
import { getAuthContext } from '../../../lib/member/auth';
import { getCreditSummary, listMemberships } from '../../../lib/member/repository';
import { MemberBackendSetupError } from '../../../lib/member/supabase';
import { membershipStatusText, type MembershipStatus } from '../../../lib/member/types';

export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<{ status?: MembershipStatus; q?: string }> };

export default async function AdminMembersPage({ searchParams }: Props) {
  const params = await searchParams;
  let context;
  try {
    context = await getAuthContext();
  } catch (error) {
    if (error instanceof MemberBackendSetupError) {
      return <main className="min-h-screen bg-cream font-prompt"><MemberNav /><section className="max-w-3xl mx-auto px-4 py-10"><SetupNotice message={error.message} /></section></main>;
    }
    throw error;
  }
  if (!context) redirect('/member-login?next=/admin/members');
  if (context.user.role !== 'admin') {
    return <main className="min-h-screen bg-cream font-prompt"><MemberNav /><section className="max-w-3xl mx-auto px-4 py-10 text-sm font-bold text-red-600">เฉพาะแอดมินเท่านั้น</section></main>;
  }

  const memberships = await listMemberships(params.status, params.q);

  return (
    <main className="min-h-screen bg-cream font-prompt">
      <MemberNav />
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-5 rounded-3xl bg-white p-6 shadow-sm border border-orange-100">
          <p className="chip mb-3">Admin</p>
          <h1 className="text-3xl font-extrabold text-gray-900">จัดการสมาชิก Babycheepy Brand Club</h1>
          <form className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input name="q" defaultValue={params.q || ''} placeholder="ค้นหาชื่อ แบรนด์ เบอร์โทร อีเมล" className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm" />
            <select name="status" defaultValue={params.status || ''} className="rounded-xl border border-gray-200 px-4 py-3 text-sm">
              <option value="">ทุกสถานะ</option>
              <option value="pending">pending</option>
              <option value="active">active</option>
              <option value="suspended">suspended</option>
              <option value="rejected">rejected</option>
            </select>
            <button className="btn-pink rounded-xl py-2 text-sm">กรอง</button>
          </form>
        </div>
        <div className="overflow-x-auto rounded-3xl bg-white shadow-sm border border-pink-100">
          <table className="min-w-[1100px] w-full text-left text-sm">
            <thead className="bg-pink-50 text-xs text-gray-500">
              <tr>
                <th className="p-3">สมาชิก</th>
                <th className="p-3">สถานะ</th>
                <th className="p-3">สมัคร</th>
                <th className="p-3">อนุมัติ</th>
                <th className="p-3">เครดิต</th>
                <th className="p-3">หลักฐาน</th>
                <th className="p-3">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((membership) => {
                const credit = getCreditSummary(membership);
                return (
                  <tr key={membership.id} className="border-t border-gray-100 align-top">
                    <td className="p-3">
                      <p className="font-extrabold text-gray-900">{membership.user?.first_name} {membership.user?.last_name}</p>
                      <p className="text-gray-500">{membership.user?.brand_name}</p>
                      <p className="text-xs text-gray-400">{membership.user?.phone} · {membership.user?.email}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-brand-pink">{membership.status}</p>
                      <p className="max-w-xs text-xs text-gray-500">{membershipStatusText[membership.status]}</p>
                    </td>
                    <td className="p-3 text-xs text-gray-500">{new Date(membership.applied_at).toLocaleString('th-TH')}</td>
                    <td className="p-3 text-xs text-gray-500">{membership.approved_at ? new Date(membership.approved_at).toLocaleString('th-TH') : '-'}</td>
                    <td className="p-3 text-xs text-gray-600">{credit.used}/{credit.total} ใช้แล้ว · คงเหลือ {credit.remaining}</td>
                    <td className="p-3 text-xs">
                      {membership.payment_proof_id ? (
                        <a className="font-bold text-brand-pink underline" href={`/api/member/files/${membership.payment_proof_id}?kind=payment`} target="_blank">
                          ดูสลิป
                        </a>
                      ) : '-'}
                    </td>
                    <td className="p-3"><AdminMemberControls membershipId={membership.id} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
