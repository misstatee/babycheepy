import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLE_CATEGORIES } from '@/lib/articles';
import { ARTICLE_BODIES, getArticleBody } from '@/lib/articles-content';

type Params = { slug: string };

function findTopic(slug: string) {
  for (const cat of ARTICLE_CATEGORIES) {
    const topic = cat.topics.find((t) => t.slug === slug);
    if (topic) return { cat, topic };
  }
  return null;
}

export function generateStaticParams() {
  return ARTICLE_BODIES.map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const found = findTopic(slug);
  const body = getArticleBody(slug);
  if (!found || !body) return {};
  return {
    title: `${found.topic.title} | Baby Cheepy`,
    description: body.intro.slice(0, 150),
    openGraph: { title: found.topic.title, description: found.topic.desc, locale: 'th_TH', type: 'article' },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const found = findTopic(slug);
  const body = getArticleBody(slug);
  if (!found || !body) notFound();

  const { cat, topic } = found;
  const related = cat.topics.filter((t) => t.slug !== slug && t.status === 'published').slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: topic.title,
    datePublished: body.isoDate,
    inLanguage: 'th',
    author: { '@type': 'Organization', name: 'Baby Cheepy' },
    publisher: { '@type': 'Organization', name: 'Baby Cheepy' },
  };

  return (
    <div className="min-h-screen bg-cream font-prompt">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Top bar */}
      <div className="fixed top-0 inset-x-0 z-50 bg-white border-b border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🐣</span>
            <div className="leading-tight">
              <div className="font-extrabold text-gray-900 text-base">Baby<span className="text-coral">Cheepy</span></div>
              <div className="text-[10px] text-gray-400 font-medium hidden sm:block">รับผลิตเสื้อผ้าเด็กครบวงจร</div>
            </div>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-semibold text-gray-600">
            <Link href="/" className="px-3 py-2 rounded-xl hover:text-coral hover:bg-coral-light transition-colors">หน้าแรก</Link>
            <Link href="/shop" className="px-3 py-2 rounded-xl hover:text-coral hover:bg-coral-light transition-colors hidden sm:inline-block">สินค้า</Link>
            <Link href="/articles" className="px-3 py-2 rounded-xl bg-coral text-white">บทความ</Link>
          </nav>
        </div>
      </div>

      {/* Header */}
      <header className={`pt-28 pb-10 px-4 ${cat.bg}`}>
        <div className="max-w-3xl mx-auto">
          <Link href="/articles" className="text-sm font-bold text-coral hover:underline">← บทความทั้งหมด</Link>
          <p className="mt-4 text-sm font-bold text-gray-500">{cat.emoji} {cat.title}</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug">{topic.title}</h1>
          <p className="mt-3 text-xs text-gray-500">
            เผยแพร่ {body.published} · อ่านประมาณ {body.readMinutes} นาที
          </p>
        </div>
      </header>

      {/* Body */}
      <article className="px-4 py-10">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm p-6 md:p-10">
          <p className="text-gray-700 text-lg leading-relaxed mb-8">{body.intro}</p>

          {body.sections.map((sec) => (
            <section key={sec.heading} className="mb-8">
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-3">{sec.heading}</h2>
              {sec.paragraphs?.map((p, i) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-3">{p}</p>
              ))}
              {sec.bullets && (
                <ul className="list-disc pl-6 space-y-2 text-gray-700 leading-relaxed">
                  {sec.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </section>
          ))}

          <div className="bg-coral-light border border-coral-muted rounded-2xl p-5 text-gray-800 leading-relaxed">
            {body.takeaway}
          </div>

          {body.sources && body.sources.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h2 className="text-sm font-extrabold text-gray-500 mb-2">แหล่งอ้างอิง</h2>
              <ul className="text-sm space-y-1">
                {body.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-coral hover:underline break-words">{s.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="px-4 pb-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-extrabold text-gray-900 mb-3">บทความที่เกี่ยวข้อง</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {related.map((t) => (
                <Link key={t.slug} href={`/articles/${t.slug}`}
                  className="bg-white rounded-2xl p-4 text-sm font-bold text-gray-800 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  {t.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">สนใจผลิตเสื้อผ้าเด็กแบรนด์ของคุณเอง?</h2>
          <p className="text-gray-500 mb-5">ปรึกษาทีม Baby Cheepy ได้ฟรี ตั้งแต่ไอเดีย แพทเทิร์น จนถึงผลิตจริง</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/#quote" className="btn-coral">ขอใบเสนอราคา</Link>
            <a href="https://line.me/R/ti/p/@861pkbnz" target="_blank" rel="noopener noreferrer" className="btn-outline-coral">ปรึกษาฟรีทาง LINE</a>
          </div>
        </div>
      </section>
    </div>
  );
}
