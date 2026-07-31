import { redirect } from 'next/navigation';
import MemberNav from '../../components/member/MemberNav';
import SetupNotice from '../../components/member/SetupNotice';
import { authStatusMessage, getAuthContext } from '../../../lib/member/auth';
import { listAiModels } from '../../../lib/member/repository';
import { MemberBackendSetupError } from '../../../lib/member/supabase';

export const dynamic = 'force-dynamic';

export default async function MemberAiModelsPage() {
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
  if (!context) redirect('/member-login?next=/member/ai-models');

  const active = context.membership?.status === 'active' || context.user.role === 'admin';
  const models = active ? await listAiModels(true).catch(() => []) : [];

  return (
    <main className="min-h-screen bg-cream font-prompt">
      <MemberNav />
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm border border-orange-100">
          <p className="chip mb-3">เลือกนางแบบ AI จากคลังของ Baby Cheepy</p>
          <h1 className="text-3xl font-extrabold text-gray-900">คลังนางแบบ AI</h1>
          <p className="mt-2 text-sm text-gray-600">
            สมาชิกสามารถเลือกนางแบบจากตัวเลือกที่เราจัดเตรียมไว้ เพื่อใช้สร้างภาพนางแบบจำนวน 5 ท่าทางภายในเซ็ตสมาชิก
          </p>
        </div>

        {!active ? (
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-pink-100 text-sm text-gray-600">
            {authStatusMessage(context.membership)}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {models.length === 0 && <p className="text-sm text-gray-500">ยังไม่มีนางแบบ AI ที่เปิดใช้งานในคลัง</p>}
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
                <p className="text-xs font-bold text-brand-pink">{model.model_code}</p>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div><dt className="font-bold text-gray-700">อายุ</dt><dd>{model.approx_age || '-'}</dd></div>
                  <div><dt className="font-bold text-gray-700">เพศ</dt><dd>{model.gender || '-'}</dd></div>
                  <div><dt className="font-bold text-gray-700">สไตล์</dt><dd>{model.style || '-'}</dd></div>
                  <div><dt className="font-bold text-gray-700">สีผิว</dt><dd>{model.skin_tone || '-'}</dd></div>
                  <div><dt className="font-bold text-gray-700">ทรงผม</dt><dd>{model.hair_style || '-'}</dd></div>
                  <div><dt className="font-bold text-gray-700">เหมาะกับ</dt><dd>{model.suitable_age_range || '-'}</dd></div>
                </dl>
                <a href={`/member/ai-model-request?model=${model.id}`} className="btn-pink mt-4 w-full justify-center rounded-xl py-2 text-sm">
                  เลือกนางแบบนี้
                </a>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
