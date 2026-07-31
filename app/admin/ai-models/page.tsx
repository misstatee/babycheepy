import { redirect } from 'next/navigation';
import MemberNav from '../../components/member/MemberNav';
import SetupNotice from '../../components/member/SetupNotice';
import { AdminAiModelForm } from '../../components/member/AdminControls';
import { getAuthContext } from '../../../lib/member/auth';
import { listAiModels } from '../../../lib/member/repository';
import { MemberBackendSetupError } from '../../../lib/member/supabase';

export const dynamic = 'force-dynamic';

export default async function AdminAiModelsPage() {
  let context;
  try {
    context = await getAuthContext();
  } catch (error) {
    if (error instanceof MemberBackendSetupError) {
      return <main className="min-h-screen bg-cream font-prompt"><MemberNav /><section className="max-w-3xl mx-auto px-4 py-10"><SetupNotice message={error.message} /></section></main>;
    }
    throw error;
  }
  if (!context) redirect('/member-login?next=/admin/ai-models');
  if (context.user.role !== 'admin') {
    return <main className="min-h-screen bg-cream font-prompt"><MemberNav /><section className="max-w-3xl mx-auto px-4 py-10 text-sm font-bold text-red-600">เฉพาะแอดมินเท่านั้น</section></main>;
  }

  const models = await listAiModels(false);

  return (
    <main className="min-h-screen bg-cream font-prompt">
      <MemberNav />
      <section className="max-w-7xl mx-auto px-4 py-8 space-y-5">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-orange-100">
          <p className="chip mb-3">Admin</p>
          <h1 className="text-3xl font-extrabold text-gray-900">จัดการคลังนางแบบ AI</h1>
          <p className="mt-2 text-sm text-gray-500">เพิ่ม แก้ไข เปิดหรือปิดการใช้งาน และจัดลำดับนางแบบ</p>
        </div>
        <AdminAiModelForm />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => (
            <article key={model.id} className="rounded-3xl bg-white p-5 shadow-sm border border-pink-100">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-pink-50">
                {model.preview_bucket && model.preview_path ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/api/member/files/${model.id}?kind=ai_model_preview`} alt={model.display_name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-sm font-bold text-gray-400">Preview</div>
                )}
              </div>
              <h2 className="mt-4 text-xl font-extrabold text-gray-900">{model.display_name}</h2>
              <p className="text-xs font-bold text-brand-pink">{model.model_code} · {model.status} · ลำดับ {model.sort_order}</p>
              <form action={`/api/admin/ai-models/${model.id}`} method="post" className="mt-4 flex gap-2">
                <input type="hidden" name="status" value={model.status === 'active' ? 'inactive' : 'active'} />
                <button className="rounded-xl border border-pink-200 px-3 py-2 text-xs font-bold text-brand-pink">
                  {model.status === 'active' ? 'ปิดการแสดง' : 'เปิดการแสดง'}
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
