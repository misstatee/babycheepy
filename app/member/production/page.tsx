import { redirect } from 'next/navigation';
import MemberNav from '../../components/member/MemberNav';
import SetupNotice from '../../components/member/SetupNotice';
import { getAuthContext } from '../../../lib/member/auth';
import { listProductionOrdersForUser } from '../../../lib/member/repository';
import { MemberBackendSetupError } from '../../../lib/member/supabase';

export const dynamic = 'force-dynamic';

export default async function MemberProductionPage() {
  let context;
  try {
    context = await getAuthContext();
  } catch (error) {
    if (error instanceof MemberBackendSetupError) {
      return (
        <main className="min-h-screen bg-cream font-prompt"><MemberNav /><section className="max-w-3xl mx-auto px-4 py-10"><SetupNotice message={error.message} /></section></main>
      );
    }
    throw error;
  }
  if (!context) redirect('/member-login?next=/member/production');

  const orders = await listProductionOrdersForUser(context.user.id).catch(() => []);

  return (
    <main className="min-h-screen bg-cream font-prompt">
      <MemberNav />
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm border border-orange-100">
          <p className="chip mb-3">Production Tracking</p>
          <h1 className="text-3xl font-extrabold text-gray-900">ติดตามสถานะงานผลิต</h1>
          <p className="mt-2 text-sm text-gray-600">สมาชิกจะเห็นเฉพาะรายการผลิตของบัญชีตัวเองเท่านั้น</p>
        </div>
        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-pink-100 text-sm text-gray-500">
            ยังไม่มีรายการผลิตในขณะนี้ เมื่อเริ่มงานผลิตกับ Baby Cheepy สถานะงานจะปรากฏที่นี่
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <article key={order.id} className="rounded-3xl bg-white p-5 shadow-sm border border-pink-100">
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="h-32 w-full overflow-hidden rounded-2xl bg-pink-50 md:w-40">
                    {order.product_image_bucket && order.product_image_path ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`/api/member/files/${order.id}?kind=production_image`} alt={order.product_name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-xs font-bold text-gray-400">ภาพสินค้า</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400">Production Order ID: {order.id}</p>
                    <h2 className="mt-1 text-xl font-extrabold text-gray-900">{order.product_name}</h2>
                    <p className="text-sm text-gray-600">แบรนด์: {order.brand_name}</p>
                    <div className="mt-3 grid gap-2 text-xs text-gray-500 sm:grid-cols-2">
                      <p>จำนวนผลิต: {order.quantity ?? '-'}</p>
                      <p>วันที่รับงาน: {order.received_at ? new Date(order.received_at).toLocaleDateString('th-TH') : '-'}</p>
                      <p>วันที่เริ่มผลิต: {order.started_at ? new Date(order.started_at).toLocaleDateString('th-TH') : '-'}</p>
                      <p>คาดว่าจะเสร็จ: {order.expected_done_at ? new Date(order.expected_done_at).toLocaleDateString('th-TH') : '-'}</p>
                      <p>ขนส่ง: {order.shipping_carrier || '-'}</p>
                      <p>เลขพัสดุ: {order.tracking_number || '-'}</p>
                      <p>อัปเดตล่าสุด: {new Date(order.updated_at).toLocaleString('th-TH')}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl bg-pink-50 p-4">
                  <p className="text-xs font-bold text-gray-500">สถานะปัจจุบัน</p>
                  <p className="text-2xl font-extrabold text-brand-pink">{order.current_status}</p>
                  {order.customer_note && <p className="mt-2 text-sm text-gray-600">{order.customer_note}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
