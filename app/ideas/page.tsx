'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ─── ImageSlot ─── */
function ImageSlot({
  src, alt, className, hint, emoji = '📸',
}: { src: string; alt: string; className?: string; hint?: string; emoji?: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      {!err
        ? <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setErr(true)} />
        : <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-cream to-cream-mid text-center px-3">
            <span className="text-4xl">{emoji}</span>
            <p className="text-xs text-gray-400 font-medium">{hint ?? alt}</p>
          </div>
      }
    </div>
  );
}

/* ─── Data ─── */
const STYLES = [
  {
    id: 'family-match',
    emoji: '👨‍👩‍👧‍👦',
    label: 'Matching Family Collection',
    labelTh: 'ชุดครอบครัวแมตช์',
    sub: 'แมตช์ครบ • พ่อ แม่ ลูก • สัตว์เลี้ยง',
    desc: 'คอลเลคชั่นชุดครอบครัวแมตช์ ใส่คู่กันได้ทั้งครอบครัว ลายผ้าเดียวกัน ตัดเย็บเป็นแบบสำหรับ Dad, Mom, Daughter, Son — รับผลิต OEM/ODM ได้ตั้งแต่ 120 ตัว/แบบ คละขนาดได้',
    main: '/images/collection/ชุดครอบครัวแมตซ์/main.png',
    bg: 'bg-card-blue',
    accent: 'text-blue-500',
    border: 'border-blue-200',
    tags: ['Family Matching', 'พ่อ-แม่-ลูก', 'แมตช์ครบเซ็ต'],
  },
  {
    id: 'cartoon',
    emoji: '🦄',
    label: 'Cartoon & Character Prints',
    labelTh: 'ลายการ์ตูน & ตัวละคร',
    sub: 'ลิขสิทธิ์ถูกต้อง หรือออกแบบมาสคอตเอง',
    desc: 'ลายการ์ตูนที่เด็กๆ ชอบ ทั้งแบบลิขสิทธิ์ที่ถูกต้องตามกฎหมาย และการออกแบบมาสคอตของแบรนด์ลูกค้าเอง พิมพ์หรือปักบนผ้าได้หลายแบบ',
    main: '/images/collection/ลายการ์ตูน & ตัวละคร/main.jpg',
    bg: 'bg-card-beige',
    accent: 'text-orange-500',
    border: 'border-orange-200',
    tags: ['การ์ตูน', 'มาสคอต', 'ลิขสิทธิ์', 'พิมพ์ลาย'],
  },
  {
    id: 'sport-active',
    emoji: '⚽',
    label: 'Sport & Active Wear',
    labelTh: 'สไตล์กีฬา & ACTIVE',
    sub: 'ผ้ายืด ระบายอากาศ เคลื่อนไหวสะดวก',
    desc: 'เหมาะกับเด็กที่ชอบเคลื่อนไหว ออกกำลังกาย เล่นกีฬา หรือเต้น ผ้า Dry-fit ยืดหยุ่น ดูดซับเหงื่อ ระบายอากาศดี เหมาะกับสภาพอากาศร้อนในไทย',
    main: '/images/collection/สไตล์กีฬา & ACTIVE/main.png',
    bg: 'bg-card-blue',
    accent: 'text-sky-500',
    border: 'border-sky-200',
    tags: ['Dry-fit', 'ชุดกีฬา', 'ยืดหยุ่น', 'ระบายอากาศ'],
  },
  {
    id: 'formal',
    emoji: '🎀',
    label: 'Formal Collection',
    labelTh: 'สไตล์ทางการ',
    sub: 'งานแต่ง วันเกิด โอกาสพิเศษ',
    desc: 'ชุดสวยหรูสำหรับโอกาสพิเศษ ทำพิธี งานแต่งงาน วันเกิด มีทั้งชุดกระโปรง ชุดจั๊มสูท ตกแต่งด้วยลูกไม้ โบว์ และงานปักสวยงาม',
    main: '/images/collection/สไตล์ทางการ/main.png',
    bg: 'bg-card-lavender',
    accent: 'text-purple-500',
    border: 'border-purple-200',
    tags: ['ชุดกระโปรง', 'ลูกไม้', 'งานปัก', 'โบว์', 'งานพิธี'],
  },
  {
    id: 'cute',
    emoji: '🌸',
    label: 'Cute Collection',
    labelTh: 'สไตล์น่ารัก',
    sub: 'หวาน • น่ารัก • เป็นเอกลักษณ์',
    desc: 'คอลเลคชั่นชุดเด็กสไตล์น่ารัก ลวดลายสดใส สีสันสวยงาม เหมาะกับเด็กที่ชอบความหวานและน่ารัก รับผลิต OEM/ODM ตามสั่งได้ตั้งแต่ 120 ตัว/แบบ คละขนาดได้',
    main: '/images/collection/สไตล์นำเทรนด์/main.jpg',
    bg: 'bg-card-pink',
    accent: 'text-pink-500',
    border: 'border-pink-200',
    tags: ['น่ารัก', 'หวาน', 'สดใส', 'เป็นเอกลักษณ์'],
  },
  {
    id: 'casual',
    emoji: '👕',
    label: 'Casual Everyday Wear',
    labelTh: 'สไตล์ลำลอง',
    sub: 'ใส่สบาย • ทนทาน • ทุกวัน',
    desc: 'ชุดลำลองเนื้อผ้านุ่ม ใส่ได้ทุกวัน เหมาะกับสภาพอากาศร้อนในไทย สวมถอดง่าย เคลื่อนไหวสะดวก ไม่จำกัดการเล่นของเด็ก',
    main: '/images/collection/สไตล์ลำลอง/main.png',
    bg: 'bg-card-mint',
    accent: 'text-green-600',
    border: 'border-green-200',
    tags: ['ลำลอง', 'ทุกวัน', 'สบาย', 'ทนทาน'],
  },
];

const STEPS = [
  { icon: '💬', num: '01', title: 'บอกแค่ความชอบ', desc: 'ไม่ต้องมีแบบ แค่บอกว่าชอบสไตล์ไหน สีอะไร หรือส่งรูปอ้างอิงมาได้เลย' },
  { icon: '✏️', num: '02', title: 'ทีมออกแบบช่วยเลย', desc: 'ทีมดีไซน์ของเราจะสร้างแบบร่างให้ดูก่อน ปรับได้ไม่จำกัดครั้งจนพอใจ' },
  { icon: '🎨', num: '03', title: 'อนุมัติแล้วผลิตเลย', desc: 'เมื่อแบบลงตัวแล้ว เราจะทำตัวอย่างให้ดู แล้วค่อยผลิตจริงตามจำนวนที่ต้องการ' },
];

const GALLERY = [
  // Sweet Garden Collection
  { src: '/images/sweet-garden.jpg',
    label: 'Sweet Garden Collection – ลายดอกไม้สวีท',                             tag: 'Sweet Garden' },
  { src: '/images/cute-3.jpg',
    label: 'Sweet Garden – ชุดเด็กน่ารักสไตล์หวาน',                              tag: 'Sweet Garden' },
  { src: '/images/cute-4.jpg',
    label: 'Sweet Garden – Puff Dress & Romper ลายดอกไม้',                        tag: 'Sweet Garden' },
  // Family Collection
  { src: '/images/family-sunshine.jpg',
    label: 'Family Collection: Sunshine & Bloom',                                  tag: 'Family' },
  { src: '/images/ผลงานที่ผ่านมา/จัดจำหน่ายในประเทศ/family-1.jpg',
    label: 'ชุดครอบครัวแมตช์ – จัดจำหน่ายในประเทศ',                             tag: 'Family' },
  { src: '/images/ผลงานที่ผ่านมา/จัดจำหน่ายในประเทศ/family-2.jpg',
    label: 'Family Set – แมตช์ครบเซ็ตทุกไซส์',                                   tag: 'Family' },
  // ODM Stock – ชุดนอน (confirmed correct from screenshot)
  { src: '/images/casual-1.jpg',
    label: 'ODM Stock – ชุดนอนคอกลม ลายจุด',                                     tag: 'ODM Stock' },
  { src: '/images/casual-2.jpg',
    label: 'ODM Stock – ชุดนอนลายดาว เนื้อผ้านุ่ม',                             tag: 'ODM Stock' },
  { src: '/images/casual-3.jpg',
    label: 'ODM Stock – เซ็ตลำลอง สั่งปลีก-ส่งได้',                             tag: 'ODM Stock' },
  // งานพิธี – ใช้ภาพที่ถูกต้องจากโฟลเดอร์ผลงาน
  { src: '/images/ผลงานที่ผ่านมา/cat-formal.jpg',
    label: 'งานพิธี – ชุดกระโปรงสวยหรู',                                         tag: 'งานพิธี' },
  { src: '/images/formal-3.jpg',
    label: 'โอกาสพิเศษ – ชุดตกแต่งลูกไม้และโบว์',                               tag: 'งานพิธี' },
  // ลายการ์ตูน
  { src: '/images/cartoon-1.jpg',
    label: 'ลายการ์ตูน – ผลิตให้แบรนด์ลูกค้า',                                  tag: 'การ์ตูน' },
  { src: '/images/cartoon-2.jpg',
    label: 'ลายการ์ตูน – มาสคอตออกแบบเอง',                                      tag: 'การ์ตูน' },
  // Active
  { src: '/images/sport-1.jpg',
    label: 'Active & Sport – ผ้า Dry-fit ระบายอากาศ',                            tag: 'Active' },
  // ส่งออก
  { src: '/images/gallery-intl-1.jpg',
    label: 'ผลงาน OEM ส่งออกต่างประเทศ',                                          tag: 'ส่งออก' },
  { src: '/images/gallery-intl-2.jpg',
    label: 'ออกแบบให้ลูกค้าต่างประเทศ',                                           tag: 'ส่งออก' },
  { src: '/images/gallery-intl-3.jpg',
    label: 'Custom Design – International Brand',                                  tag: 'ส่งออก' },
];

const TAG_COLORS: Record<string, string> = {
  'Sweet Garden': 'bg-pink-100 text-pink-600',
  'Family':       'bg-green-100 text-green-700',
  'ODM Stock':    'bg-blue-100 text-blue-600',
  'งานพิธี':     'bg-purple-100 text-purple-600',
  'การ์ตูน':     'bg-yellow-100 text-yellow-700',
  'Active':       'bg-sky-100 text-sky-600',
  'ส่งออก':      'bg-coral-light text-coral',
};

/* ─── Page ─── */
export default function IdeasPage() {
  const [activeStyle, setActiveStyle] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-cream font-prompt">

      {/* ── NavBar back link ── */}
      <div className="fixed top-0 inset-x-0 z-50 bg-white border-b border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🐣</span>
            <div className="leading-tight">
              <div className="font-extrabold text-gray-900 text-base">Baby<span className="text-coral">Cheepy</span></div>
              <div className="text-[10px] text-gray-400 font-medium hidden sm:block">รับผลิตเสื้อผ้าเด็กครบวงจร</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-600">
            <Link href="/"        className="px-3 py-2 rounded-xl hover:text-coral hover:bg-coral-light transition-colors">หน้าแรก</Link>
            <Link href="/services" className="px-3 py-2 rounded-xl hover:text-coral hover:bg-coral-light transition-colors">บริการของเรา</Link>
            <Link href="/shop"    className="px-3 py-2 rounded-xl hover:text-coral hover:bg-coral-light transition-colors">สินค้า</Link>
            <Link href="/ideas"   className="px-3 py-2 rounded-xl bg-coral text-white transition-colors">ไอเดีย ✨</Link>
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/#quote"  className="btn-coral text-sm py-2 px-5 hidden md:inline-flex">ขอใบเสนอราคา</Link>
            <a href="https://line.me/R/ti/p/@861pkbnz" target="_blank" rel="noopener noreferrer"
              className="btn-line text-sm py-2 px-4">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden>
                <path d="M19.952 11.037C19.952 6.608 15.485 3 10 3S.048 6.608.048 11.037c0 4.002 3.547 7.354 8.337 7.984.325.07.767.214.879.49.1.25.066.641.032.894l-.142.854c-.043.25-.2.977.856.532 1.056-.444 5.7-3.356 7.778-5.744C19.166 14.316 19.952 12.745 19.952 11.037z"/>
              </svg>
              LINE OA
            </a>
          </div>
        </div>
      </div>

      {/* ── Hero banner ── */}
      <section className="pt-28 pb-16 px-4 bg-gradient-to-br from-cream via-white to-coral-light">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-coral-muted text-coral text-xs font-bold px-4 py-1.5 rounded-full mb-4 shadow-sm">
            ✨ ไม่มีแบบ ก็ทำชุดได้
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            ไอเดียชุดเด็ก<br/>
            <span className="text-coral">สำหรับมือใหม่</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed mb-8">
            ยังไม่มีไอเดียว่าจะทำชุดแบบไหน? เราช่วยได้ค่ะ
            ดูไอเดียจากผลงานจริง แล้วแจ้งเราว่าชอบแบบไหน
            ทีมออกแบบของเราจะช่วยสร้างชุดในแบบของคุณเอง
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#styles" className="btn-coral">ดูไอเดียทั้งหมด ↓</a>
            <a href="https://line.me/R/ti/p/@861pkbnz" target="_blank" rel="noopener noreferrer"
              className="btn-outline-coral">ปรึกษาฟรีทาง LINE</a>
          </div>
        </div>
      </section>

      {/* ── 3 steps ── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="chip mb-3">3 ขั้นตอนง่ายๆ</p>
            <h2 className="text-3xl font-extrabold text-gray-900">จากไอเดีย → ชุดจริงในมือคุณ</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.num} className="cream-card text-center relative overflow-hidden">
                <div className="absolute top-3 right-4 text-5xl font-black text-orange-100 select-none">{s.num}</div>
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-extrabold text-gray-900 text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Style categories ── */}
      <section id="styles" className="py-14 px-4 bg-cream-mid">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="chip mb-3">คอลเลคชั่น & สไตล์</p>
            <h2 className="text-3xl font-extrabold text-gray-900">เลือกคอลเลคชั่นที่ใช่สำหรับคุณ</h2>
            <p className="text-gray-500 mt-2">คลิกดูตัวอย่างและรายละเอียด — แจ้งเราได้เลยว่าสนใจแบบไหน</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setActiveStyle(activeStyle === style.id ? null : style.id)}
                className={`text-left rounded-3xl border-2 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${style.bg} ${activeStyle === style.id ? `${style.border} shadow-lg scale-[1.01]` : 'border-transparent'}`}
              >
                {/* Main image */}
                <div className="h-44">
                  <ImageSlot src={style.main} alt={style.label}
                    className="h-full" hint={style.label} emoji={style.emoji} />
                </div>
                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{style.emoji}</span>
                    <div>
                      <h3 className={`font-extrabold text-base leading-tight ${style.accent}`}>{style.labelTh}</h3>
                      <p className="text-xs text-gray-400 font-medium">{style.label}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{style.sub}</p>
                  {activeStyle === style.id && (
                    <div className="mt-3 space-y-3 border-t border-white/60 pt-3">
                      <p className="text-sm text-gray-700 leading-relaxed">{style.desc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {style.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-white/70 text-gray-600 px-2 py-0.5 rounded-full font-medium border border-white/80">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className={`mt-2 text-xs font-bold ${style.accent} flex items-center gap-1`}>
                    {activeStyle === style.id ? '▲ ซ่อน' : '▼ ดูรายละเอียด'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Inspiration gallery ── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="chip mb-3">แกลเลอรี่ไอเดีย</p>
            <h2 className="text-3xl font-extrabold text-gray-900">ผลงานจริงจากโรงงานเรา</h2>
            <p className="text-gray-500 mt-2 text-sm">ทั้งหมดนี้เป็นผลงานจริงที่ผ่านการผลิต — เลือกสไตล์ที่ชอบแล้วบอกเราได้เลย</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {GALLERY.map((item, i) => (
              <div key={i} className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-white border border-gray-100">
                <div className="relative h-40 sm:h-48">
                  <ImageSlot src={item.src} alt={item.label} className="h-full w-full"
                    hint={item.label} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <div className="absolute bottom-2 left-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TAG_COLORS[item.tag] ?? 'bg-gray-100 text-gray-600'}`}>
                      {item.tag}
                    </span>
                  </div>
                </div>
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-gray-700 leading-tight">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ accordion ── */}
      <section className="py-14 px-4 bg-cream-mid">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="chip mb-3">คำถามที่พบบ่อย</p>
            <h2 className="text-3xl font-extrabold text-gray-900">ยังสงสัยอยู่? อ่านตรงนี้</h2>
          </div>
          {[
            { q: 'ถ้าไม่มีแบบเลย เริ่มต้นอย่างไรดี?', a: 'ง่ายมากค่ะ แค่ส่งรูปอ้างอิงจากอินเตอร์เน็ตมาให้เรา แล้วบอกว่าชอบแบบไหน สีอะไร หรือจะบรรยายแค่นั้นก็ได้ ทีมดีไซน์ของเราจะวาดแบบร่างมาให้ดูก่อนโดยไม่มีค่าใช้จ่าย' },
            { q: 'ขั้นต่ำสั่งผลิตกี่ชิ้น?', a: 'OEM/ODM เริ่มที่ 120 ตัวต่อแบบค่ะ คละขนาดได้เลย สำหรับลูกค้าที่อยากลองก่อน เราก็มีสินค้าสต็อกพร้อมส่งในรูปแบบปลีกและส่งด้วยค่ะ' },
            { q: 'ใช้เวลาผลิตนานไหม?', a: 'หลังจากอนุมัติแบบแล้ว ระยะเวลาผลิตประมาณ 30–60 วัน ขึ้นอยู่กับจำนวนและความซับซ้อนของงานค่ะ' },
            { q: 'เราเลือกผ้าและสีเองได้มั้ย?', a: 'ได้เลยค่ะ คุณสามารถเลือกผ้า สี ลาย และวัสดุตกแต่งทั้งหมดได้ตามต้องการ ทีมของเราจะแนะนำให้ด้วยค่ะว่าผ้าแบบไหนเหมาะกับดีไซน์นั้นๆ' },
            { q: 'มีบริการออกแบบมาสคอตหรือโลโก้ให้ด้วยมั้ย?', a: 'มีค่ะ เราช่วยออกแบบมาสคอตและโลโก้สำหรับแบรนด์ของคุณได้ และสามารถนำไปปักหรือพิมพ์บนชุดได้เลยค่ะ' },
          ].map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4 bg-coral text-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-4">🐣</div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
            พร้อมเริ่มสร้างชุดในแบบของคุณแล้วหรือยัง?
          </h2>
          <p className="text-white/80 mb-8 leading-relaxed">
            ปรึกษาฟรี ไม่มีค่าใช้จ่าย ทีมของเราพร้อมช่วยตั้งแต่ไอเดียแรกจนถึงชุดตัวสุดท้าย
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://line.me/R/ti/p/@861pkbnz" target="_blank" rel="noopener noreferrer"
              className="btn-white">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-coral" aria-hidden>
                <path d="M19.952 11.037C19.952 6.608 15.485 3 10 3S.048 6.608.048 11.037c0 4.002 3.547 7.354 8.337 7.984.325.07.767.214.879.49.1.25.066.641.032.894l-.142.854c-.043.25-.2.977.856.532 1.056-.444 5.7-3.356 7.778-5.744C19.166 14.316 19.952 12.745 19.952 11.037z"/>
              </svg>
              ปรึกษาทาง LINE OA
            </a>
            <Link href="/#quote"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold py-3 px-7 rounded-full hover:bg-white hover:text-coral active:scale-95 transition-all duration-150">
              ขอใบเสนอราคา →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-xs">
        © 2025 Global Apparel Kids (Baby Cheepy Studio). All rights reserved.
      </footer>
    </div>
  );
}

/* ─── FaqItem ─── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`cream-card mb-3 transition-all ${open ? 'shadow-md' : ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 text-left"
      >
        <span className="font-bold text-gray-900">{q}</span>
        <svg className={`w-5 h-5 text-coral shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <p className="text-sm text-gray-500 leading-relaxed mt-3 pt-3 border-t border-orange-100">{a}</p>}
    </div>
  );
}
