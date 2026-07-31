import { redirect } from 'next/navigation';
import MemberNav from '../../components/member/MemberNav';
import SetupNotice from '../../components/member/SetupNotice';
import { AdminAiRequestControls, AdminDeliverablesForm } from '../../components/member/AdminControls';
import { getAuthContext } from '../../../lib/member/auth';
import { listAiRequestsForAdmin } from '../../../lib/member/repository';
import { MemberBackendSetupError } from '../../../lib/member/supabase';
import { aiModelRequestStatusText, type AiModelRequestStatus } from '../../../lib/member/types';

export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<{ status?: AiModelRequestStatus }> };

export default async function AdminAiModelRequestsPage({ searchParams }: Props) {
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
  if (!context) redirect('/member-login?next=/admin/ai-model-requests');
  if (context.user.role !== 'admin') {
    return <main className="min-h-screen bg-cream font-prompt"><MemberNav /><section className="max-w-3xl mx-auto px-4 py-10 text-sm font-bold text-red-600">เฉพาะแอดมินเท่านั้น</section></main>;
  }

  const requests = await listAiRequestsForAdmin(params.status);

  return (
    <main className="min-h-screen bg-cream font-prompt">
      <MemberNav />
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-5 rounded-3xl bg-white p-6 shadow-sm border border-orange-100">
          <p className="chip mb-3">Admin</p>
          <h1 className="text-3xl font-extrabold text-gray-900">จัดการคำขอภาพ AI</h1>
          <form className="mt-4 flex gap-3">
            <select name="status" defaultValue={params.status || ''} className="rounded-xl border border-gray-200 px-4 py-3 text-sm">
              <option value="">ทุกสถานะ</option>
              {Object.keys(aiModelRequestStatusText).map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <button className="btn-pink rounded-xl py-2 text-sm">กรอง</button>
          </form>
        </div>
        <div className="space-y-4">
          {requests.map((request) => (
            <article key={request.id} className="rounded-3xl bg-white p-5 shadow-sm border border-pink-100">
              <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                <div>
                  <p className="text-xs font-bold text-gray-400">Request ID: {request.id}</p>
                  <h2 className="text-xl font-extrabold text-gray-900">{request.product_name}</h2>
                  <p className="text-sm text-gray-600">สมาชิก: {request.user?.first_name} {request.user?.last_name} · {request.brand_name}</p>
                  <p className="text-sm text-gray-600">นางแบบ: {request.ai_model?.display_name || request.ai_model_id}</p>
                  <p className="mt-2 text-sm font-bold text-brand-pink">{aiModelRequestStatusText[request.status]}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    {request.product_type} · {request.aspect_ratio} · {request.background_style} · ใช้งาน: {request.usage_channel}
                  </p>
                  {request.notes && <p className="mt-2 rounded-2xl bg-gray-50 p-3 text-sm text-gray-600">{request.notes}</p>}
                  <div className="mt-3 text-xs text-gray-500">
                    เครดิตหักแล้ว: {request.credit_debited ? 'ใช่' : 'ยัง'} · รอบแก้ไข {request.revision_rounds_used}/{request.revision_rounds_included}
                  </div>
                </div>
                <div>
                  <AdminAiRequestControls requestId={request.id} />
                  <AdminDeliverablesForm requestId={request.id} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
