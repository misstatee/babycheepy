import type { Metadata } from 'next';
import Link from 'next/link';
import { ARTICLE_CATEGORIES } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'บทความ | Baby Cheepy — เทรนด์เสื้อผ้าเด็ก สีมาแรง และความรู้เรื่องผ้า',
  description:
    'รวมบทความเกี่ยวกับเทรนด์เสื้อผ้าเด็ก สีและลายผ้าที่กำลังมาแรง ชุดครอบครัว ความรู้เรื่องผ้าและมาตรฐานความปลอดภัย จาก Baby Cheepy',
};

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-cream font-prompt">
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
            <Link href="/ideas" className="px-3 py-2 rounded-xl hover:text-coral hover:bg-coral-light transition-colors hidden sm:inline-block">ไอเดีย ✨</Link>
            <Link href="/articles" className="px-3 py-2 rounded-xl bg-coral text-white">บทความ</Link>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-28 pb-12 px-4 bg-gradient-to-br from-cream via-white to-coral-light">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-coral-muted text-coral text-xs font-bold px-4 py-1.5 rounded-full mb-4 shadow-sm">
            📖 บทความจาก Baby Cheepy
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            เทรนด์ สี และความรู้<br />
            <span className="text-coral">เรื่องเสื้อผ้าเด็ก</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            รวมเรื่องน่ารู้เกี่ยวกับเทรนด์เสื้อผ้าเด็ก สีและลายที่กำลังมาแรง
            ความรู้เรื่องผ้า และคู่มือเลือกชุดให้ลูก
          </p>
        </div>
      </section>

      {/* Categories */}
      <main className="px-4 pt-10 pb-16">
        <div className="max-w-6xl mx-auto space-y-12">
          {ARTICLE_CATEGORIES.map((cat) => (
            <section key={cat.id} aria-labelledby={`cat-${cat.id}`}>
              <div className="mb-5">
                <h2 id={`cat-${cat.id}`} className="text-2xl font-extrabold text-gray-900">
                  <span className="mr-2">{cat.emoji}</span>{cat.title}
                </h2>
                <p className="text-gray-500 text-sm mt-1">{cat.desc}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {cat.topics.map((t) => {
                  const card = (
                    <div className={`${cat.bg} rounded-3xl p-5 h-full border-2 border-transparent transition-all ${t.status === 'published' ? 'hover:-translate-y-1 hover:shadow-lg hover:border-coral-muted' : ''}`}>
                      <h3 className="font-extrabold text-gray-900 leading-snug mb-2">{t.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-3">{t.desc}</p>
                      {t.status === 'published' ? (
                        <span className="text-sm font-bold text-coral">อ่านบทความ →</span>
                      ) : (
                        <span className="inline-block text-xs font-bold text-gray-500 bg-white/80 rounded-full px-3 py-1">เร็วๆ นี้</span>
                      )}
                    </div>
                  );
                  return t.status === 'published' ? (
                    <Link key={t.slug} href={`/articles/${t.slug}`}>{card}</Link>
                  ) : (
                    <div key={t.slug}>{card}</div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* CTA */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">สนใจผลิตเสื้อผ้าเด็กแบรนด์ของคุณเอง?</h2>
          <p className="text-gray-500 mb-6">ปรึกษาทีม Baby Cheepy ได้ฟรี ตั้งแต่ไอเดีย แพทเทิร์น จนถึงผลิตจริง</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/#quote" className="btn-coral">ขอใบเสนอราคา</Link>
            <a href="https://line.me/R/ti/p/@861pkbnz" target="_blank" rel="noopener noreferrer" className="btn-outline-coral">
              ปรึกษาฟรีทาง LINE
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
