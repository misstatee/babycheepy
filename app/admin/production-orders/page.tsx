import { redirect } from 'next/navigation';
import MemberNav from '../../components/member/MemberNav';
import SetupNotice from '../../components/member/SetupNotice';
import { AdminProductionForm, AdminProductionStatusControls } from '../../components/member/AdminControls';
import { getAuthContext } from '../../../lib/member/auth';
import { listMemberships, listProductionOrdersForAdmin } from '../../../lib/member/repository';
import { MemberBackendSetupError } from '../../../lib/member/supabase';
import { productionStatusOptions } from '../../../lib/member/types';

export const dynamic = 'force-dynamic';

export default async function AdminProductionOrdersPage() {
  let context;
  try {
    context = await getAuthContext();
  } catch (error) {
    if (error instanceof MemberBackendSetupError) {
      return <main className="min-h-screen bg-cream font-prompt"><MemberNav /><section className="max-w-3xl mx-auto px-4 py-10"><SetupNotice message={error.message} /></section></main>;
    }
    throw error;
  }
  if (!context) redirect('/member-login?next=/admin/production-orders');
  if (context.user.role !== 'admin') {
    return <main className="min-h-screen bg-cream font-prompt"><MemberNav /><section className="max-w-3xl mx-auto px-4 py-10 text-sm font-bold text-red-600">เฉพาะแอดมินเท่านั้น</section></main>;
  }

  const [orders, memberships] = await Promise.all([
    listProductionOrdersForAdmin(),
    listMemberships('active'),
  ]);
  const users = memberships
    .filter((membership) => membership.user)
    .map((membership) => ({
      id: membership.user!.id,
      label: `${membership.user!.brand_name} · ${membership.user!.first_name} ${membership.user!.last_name}`,
    }));

  return (
    <main className="min-h-screen bg-cream font-prompt">
      <MemberNav />
      <section className="max-w-7xl mx-auto px-4 py-8 space-y-5">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-orange-100">
          <p className="chip mb-3">Admin</p>
          <h1 className="text-3xl font-extrabold text-gray-900">จัดการงานผลิต</h1>
          <p className="mt-2 text-sm text-gray-500">สมาชิกจะไม่เห็นหมายเหตุภายในของแอดมิน</p>
        </div>
        <AdminProductionForm users={users} />
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-3xl bg-white p-5 shadow-sm border border-pink-100">
              <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                <div>
                  <p className="text-xs font-bold text-gray-400">Production Order ID: {order.id}</p>
                  <h2 className="text-xl font-extrabold text-gray-900">{order.product_name}</h2>
                  <p className="text-sm text-gray-600">สมาชิก: {order.user?.first_name} {order.user?.last_name} · {order.brand_name}</p>
                  <p className="mt-2 text-sm font-bold text-brand-pink">{order.current_status}</p>
                  <div className="mt-3 grid gap-2 text-xs text-gray-500 sm:grid-cols-3">
                    <p>จำนวนผลิต: {order.quantity ?? '-'}</p>
                    <p>คาดว่าจะเสร็จ: {order.expected_done_at ? new Date(order.expected_done_at).toLocaleDateString('th-TH') : '-'}</p>
                    <p>เลขพัสดุ: {order.tracking_number || '-'}</p>
                  </div>
                  {order.customer_note && <p className="mt-2 rounded-2xl bg-pink-50 p-3 text-sm text-gray-600">ลูกค้าเห็น: {order.customer_note}</p>}
                  {order.internal_note && <p className="mt-2 rounded-2xl bg-gray-50 p-3 text-sm text-gray-600">หมายเหตุภายใน: {order.internal_note}</p>}
                </div>
                <AdminProductionStatusControls orderId={order.id} statuses={productionStatusOptions} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
