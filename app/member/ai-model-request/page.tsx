import { redirect } from 'next/navigation';
import AiModelRequestForm from '../../components/member/AiModelRequestForm';
import MemberNav from '../../components/member/MemberNav';
import SetupNotice from '../../components/member/SetupNotice';
import { authStatusMessage, getAuthContext } from '../../../lib/member/auth';
import { getCreditSummary, listAiModels } from '../../../lib/member/repository';
import { MemberBackendSetupError } from '../../../lib/member/supabase';

export const dynamic = 'force-dynamic';

export default async function MemberAiModelRequestPage() {
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
  if (!context) redirect('/member-login?next=/member/ai-model-request');

  const active = context.membership?.status === 'active' || context.user.role === 'admin';
  const models = active ? await listAiModels(true).catch(() => []) : [];
  const credit = getCreditSummary(context.membership);

  return (
    <main className="min-h-screen bg-cream font-prompt">
      <MemberNav />
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm border border-orange-100">
          <p className="chip mb-3">AI Model Request</p>
          <h1 className="text-3xl font-extrabold text-gray-900">ขอใช้สิทธิ์ชุดภาพนางแบบ AI</h1>
          <p className="mt-2 text-sm text-gray-600">
            สิทธิ์พื้นฐานรวมภาพ Mockup 1 ภาพ และภาพนางแบบ AI คนเดียวกัน 5 ท่าทาง รวม 6 ภาพต่อ 1 เซ็ต
          </p>
        </div>
        {!active ? (
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-pink-100 text-sm text-gray-600">
            {authStatusMessage(context.membership)}
          </div>
        ) : (
          <AiModelRequestForm models={models} brandName={context.user.brand_name} remainingCredits={credit.remaining} />
        )}
      </section>
    </main>
  );
}
