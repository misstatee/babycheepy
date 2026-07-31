import { redirect } from 'next/navigation';
import MemberNav from '../components/member/MemberNav';
import RevisionRequestForm from '../components/member/RevisionRequestForm';
import SetupNotice from '../components/member/SetupNotice';
import { getAuthContext, authStatusMessage } from '../../lib/member/auth';
import { getCreditSummary, listAiRequestsForUser, listDeliverablesForUser, listNotifications, listProductionOrdersForUser } from '../../lib/member/repository';
import { aiModelRequestStatusText } from '../../lib/member/types';
import { MemberBackendSetupError } from '../../lib/member/supabase';

export const dynamic = 'force-dynamic';

export default async function MemberDashboardPage() {
  let context;
  try {
    context = await getAuthContext();
  } catch (error) {
    if (error instanceof MemberBackendSetupError) {
      return (
        <main className="min-h-screen bg-cream font-prompt">
          <MemberNav />
          <section className="max-w-3xl mx-auto px-4 py-10"><SetupNotice message={error.message} /></section>
        </main>
      );
    }
    throw error;
  }

  if (!context) redirect('/member-login?next=/member-dashboard');

  const { user, membership } = context;
  const [requests, deliverables, productionOrders, notifications] = await Promise.all([
    listAiRequestsForUser(user.id).catch(() => []),
    listDeliverablesForUser(user.id).catch(() => []),
    listProductionOrdersForUser(user.id).catch(() => []),
    listNotifications(user.id).catch(() => []),
  ]);
  const credit = getCreditSummary(membership);
  const deliverablesByRequest = new Map<string, typeof deliverables>();
  for (const file of deliverables) {
    const files = deliverablesByRequest.get(file.request_id) || [];
    files.push(file);
    deliverablesByRequest.set(file.request_id, files);
  }

  return (
    <main className="min-h-screen bg-cream font-prompt text-gray-800">
      <MemberNav />
      <section className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-orange-100">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="chip mb-3">Babycheepy Brand Club</p>
              <h1 className="text-3xl font-extrabold text-gray-900">สวัสดี {user.first_name}</h1>
              <p className="mt-2 text-gray-600">แบรนด์: <strong>{user.brand_name}</strong></p>
              <p className="text-gray-600">ประเภทสมาชิก: <strong>Babycheepy Brand Club</strong></p>
              <p className="text-gray-600">วันที่สมัคร: {membership ? new Date(membership.applied_at).toLocaleDateString('th-TH') : '-'}</p>
              <p className="text-gray-600">วันที่ได้รับอนุมัติ: {membership?.approved_at ? new Date(membership.approved_at).toLocaleDateString('th-TH') : '-'}</p>
            </div>
            <div className="rounded-2xl bg-pink-50 p-4 text-sm text-gray-700 md:min-w-72">
              <p className="font-extrabold text-gray-900">สถานะสมาชิก</p>
              <p className="mt-1">{authStatusMessage(membership)}</p>
              <p className="mt-3 font-bold text-brand-pink">สมาชิกแบบสมัครครั้งเดียว</p>
              <p className="font-bold text-gray-700">ไม่มีค่าบริการรายเดือน</p>
              <form action="/api/auth/logout" method="post" className="mt-4">
                <button className="rounded-xl border border-pink-200 px-4 py-2 text-sm font-bold text-brand-pink">ออกจากระบบ</button>
              </form>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <a href="/size-finder" className="rounded-3xl bg-white p-5 shadow-sm border border-pink-100">
            <p className="text-xs font-bold text-gray-400">Member Tool</p>
            <h2 className="mt-1 text-xl font-extrabold text-gray-900">AI วัดไซส์</h2>
            <p className="mt-2 text-sm text-gray-500">เข้าใช้เครื่องมือวัดไซส์สำหรับสมาชิก active</p>
          </a>
          <a href="/try-on" className="rounded-3xl bg-white p-5 shadow-sm border border-pink-100">
            <p className="text-xs font-bold text-gray-400">Member Tool</p>
            <h2 className="mt-1 text-xl font-extrabold text-gray-900">AI ลองชุดเสมือนจริง</h2>
            <p className="mt-2 text-sm text-gray-500">ทดลองชุดด้วย AI โดยใช้ระบบเดิมของเว็บไซต์</p>
          </a>
          <a href="/member/production" className="rounded-3xl bg-white p-5 shadow-sm border border-pink-100">
            <p className="text-xs font-bold text-gray-400">Production</p>
            <h2 className="mt-1 text-xl font-extrabold text-gray-900">ติดตามสถานะงานผลิต</h2>
            <p className="mt-2 text-sm text-gray-500">ใช้เฉพาะงานที่ผลิตกับ Baby Cheepy</p>
          </a>
        </div>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-orange-100">
            <h2 className="text-xl font-extrabold text-gray-900">สิทธิ์ชุดภาพนางแบบ AI</h2>
            <div className="mt-4 rounded-2xl bg-pink-50 p-4">
              <p className="text-3xl font-extrabold text-brand-pink">{credit.remaining} เซ็ต</p>
              <p className="text-sm text-gray-600">คงเหลือจากทั้งหมด {credit.total} เซ็ต ใช้แล้ว {credit.used} เซ็ต</p>
              <p className="mt-2 text-xs text-gray-500">1 เซ็ต = Mockup {credit.mockupImagesPerSet} ภาพ + นางแบบ AI {credit.modelImagesPerSet} ท่าทาง รวม {credit.imagesPerSet} ภาพ</p>
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <a href="/member/ai-models" className="btn-outline-pink flex-1 justify-center rounded-xl py-2 text-sm">เลือกนางแบบ AI จากคลัง</a>
              <a href="/member/ai-model-request" className="btn-pink flex-1 justify-center rounded-xl py-2 text-sm">ส่งคำขอชุดภาพ</a>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-orange-100">
            <h2 className="text-xl font-extrabold text-gray-900">สถานะคำขอชุดภาพล่าสุด</h2>
            <div className="mt-4 space-y-3">
              {requests.length === 0 && <p className="text-sm text-gray-500">ยังไม่มีคำขอชุดภาพ AI</p>}
              {requests.slice(0, 4).map((request) => (
                <div key={request.id} className="rounded-2xl border border-gray-100 p-4 text-sm">
                  <p className="font-extrabold text-gray-900">{request.product_name}</p>
                  <p className="text-gray-500">{aiModelRequestStatusText[request.status]}</p>
                  {deliverablesByRequest.has(request.id) && (
                    <div className="mt-3 rounded-2xl border border-pink-100 p-3">
                      <p className="text-xs font-extrabold text-gray-900">ไฟล์ส่งมอบ</p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {(deliverablesByRequest.get(request.id) || []).map((file) => (
                          <a
                            key={file.id}
                            href={`/api/member/files/${file.id}?kind=deliverable`}
                            className="rounded-xl bg-pink-50 px-3 py-2 text-xs font-bold text-brand-pink"
                          >
                            ดาวน์โหลด {file.deliverable_kind}
                          </a>
                        ))}
                      </div>
                      <RevisionRequestForm requestId={request.id} deliverables={deliverablesByRequest.get(request.id) || []} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-orange-100">
            <h2 className="text-xl font-extrabold text-gray-900">งานผลิตล่าสุด</h2>
            {productionOrders.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">ยังไม่มีรายการผลิตในขณะนี้ เมื่อเริ่มงานผลิตกับ Baby Cheepy สถานะงานจะปรากฏที่นี่</p>
            ) : (
              <div className="mt-4 space-y-3">
                {productionOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="rounded-2xl border border-gray-100 p-4 text-sm">
                    <p className="font-extrabold text-gray-900">{order.product_name}</p>
                    <p className="text-brand-pink font-bold">{order.current_status}</p>
                    {order.customer_note && <p className="text-gray-500">{order.customer_note}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-orange-100">
            <h2 className="text-xl font-extrabold text-gray-900">การแจ้งเตือน</h2>
            <div className="mt-4 space-y-3">
              {notifications.length === 0 && <p className="text-sm text-gray-500">ยังไม่มีการแจ้งเตือน</p>}
              {notifications.slice(0, 5).map((notification) => (
                <div key={notification.id} className="rounded-2xl border border-gray-100 p-4 text-sm">
                  <p className="font-extrabold text-gray-900">{notification.title}</p>
                  <p className="text-gray-500">{notification.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <a href="https://line.me/R/ti/p/@861pkbnz" className="btn-line w-full justify-center rounded-2xl">ติดต่อแอดมินผ่าน LINE</a>
      </section>
    </main>
  );
}
