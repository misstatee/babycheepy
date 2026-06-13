'use client';

import { useState } from 'react';
import QuoteForm from './QuoteForm';
import TikTokSection from './TikTokSection';

type Lang = 'th' | 'en';

/* ─── tiny decorative SVGs ─── */
function StarSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}
function DotCircle({ className }: { className?: string }) {
  return <div className={`rounded-full ${className}`} aria-hidden />;
}
function CloudSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 110" className={className} aria-hidden>
      <ellipse cx="100" cy="82" rx="82" ry="28" fill="currentColor" opacity="0.5" />
      <ellipse cx="68"  cy="60" rx="40" ry="36" fill="currentColor" opacity="0.5" />
      <ellipse cx="135" cy="62" rx="36" ry="30" fill="currentColor" opacity="0.5" />
      <ellipse cx="100" cy="50" rx="46" ry="40" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

/* ─── ImageSlot ─── */
function ImageSlot({ src, alt, className, hint, emoji = '📸' }: {
  src: string; alt: string; className?: string; hint?: string; emoji?: string;
}) {
  const [err, setErr] = useState(false);
  return (
    <div className={`absolute inset-0 overflow-hidden ${className ?? ''}`}>
      {!err
        ? <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setErr(true)} />
        : <div className="img-slot text-center px-4">
            <span className="text-5xl mb-2">{emoji}</span>
            <p className="text-xs text-gray-400 font-medium">{hint ?? src}</p>
          </div>
      }
    </div>
  );
}

/* ─── translations ─── */
const i18n = {
  th: {
    langBtn: 'EN',
    phone: '02-XXX-XXXX',
    nav: {
      home: 'หน้าแรก', about: 'เกี่ยวกับเรา', services: 'บริการของเรา',
      shop: 'สินค้า', ideas: 'ไอเดีย ✨', portfolio: 'ผลงานของเรา', contact: 'ติดต่อเรา', location: '📍 โลเคชั่น',
      quote: 'ขอใบเสนอราคา', lineId: '@861pkbnz',
      serviceItems: [
        { label: 'รับผลิต OEM / ODM',         href: '#services' },
        { label: 'คอลเลคชั่นครอบครัว & สัตว์', href: '#services' },
        { label: 'พัฒนาแพทเทิร์น & ตัวอย่าง', href: '#services' },
        { label: 'จัดหาผ้า & พิมพ์ลาย',       href: '#services' },
        { label: 'ปัก / สกรีน / Decoration',   href: '#services' },
        { label: 'ขายส่ง ODM',                 href: '#pricing' },
      ],
    },
    hero: {
      badge: '🏅 ประสบการณ์ 40+ ปี · CBME Shanghai · OEKO-TEX',
      h1a: 'รับผลิตเสื้อผ้าเด็ก',
      h1b: 'คุณภาพดี ใส่ใจทุกรายละเอียด',
      sub: 'ปลอดภัย อ่อนโยน สำหรับเด็กน้อยทุกคน',
      features: [
        { icon: '🌿', label: 'ผ้านุ่ม\nคุณภาพสูง',   color: 'bg-icon-green' },
        { icon: '🛡️', label: 'ปลอดภัย\nไร้สารอันตราย', color: 'bg-icon-salmon' },
        { icon: '✂️', label: 'ตัดเย็บประณีต\nได้มาตรฐาน', color: 'bg-icon-yellow' },
        { icon: '🎨', label: 'ออกแบบได้\nตามต้องการ',  color: 'bg-icon-sky' },
      ],
      cta1: 'ขอใบเสนอราคา', cta2: 'ดูแคตตาล็อก',
      bubble: 'สร้างแบรนด์เสื้อผ้าเด็ก\nกับเราง่ายๆ เริ่มต้นได้เลย!',
    },
    stats: [
      { icon: '📦', t: 'ขั้นต่ำการผลิตต่ำ',   s: 'เริ่มต้นเพียง 120 ตัว/แบบ คละขนาดได้' },
      { icon: '✏️', t: 'ออกแบบฟรี',           s: 'มีทีมช่วยดูแลตั้งแต่ต้น' },
      { icon: '🚀', t: 'ผลิตตรงเวลา',          s: 'ส่งมอบตามกำหนด' },
      { icon: '🔍', t: 'QC ทุกชิ้น',           s: 'ได้มาตรฐานสากล' },
      { icon: '💬', t: 'บริการหลังการขาย',     s: 'ดูแลตลอดการผลิต' },
    ],
    categories: {
      title: 'ตัวอย่างผลงาน',
      items: [
        { label: 'ชุดงานสั่งผลิตแบรนด์',       sub: 'OEM/ODM Custom Brand',        image: '/images/ตัวอย่างผลงาน/ชุดงานสั่งผลิตแบรนด์/mainn.png',        bg: 'bg-card-beige',    emoji: '👗' },
        { label: 'ชุดว่ายน้ำ',                  sub: 'Swimwear Collection',          image: '/images/ตัวอย่างผลงาน/ชุดว่ายน้ำ/mainn.png',                  bg: 'bg-card-blue',     emoji: '🏊' },
        { label: 'ชุดสัตว์เลี้ยง',              sub: 'Pet Outfit Collection',        image: '/images/ตัวอย่างผลงาน/ชุดสัตว์เลี้ยง/mainn.png',              bg: 'bg-card-mint',     emoji: '🐾' },
        { label: 'เครื่องประดับและของตกแต่ง',   sub: 'Accessories & Decoration',    image: '/images/ตัวอย่างผลงาน/เครื่องประดับและของตกแต่ง/mainn.png',   bg: 'bg-card-lavender', emoji: '✨' },
      ],
    },
    trust: {
      title: 'ทำไมต้องเลือก Baby Cheepy?',
      items: [
        { icon: '🛡️', t: 'ปลอดภัย ไร้สารเคมี',    s: 'ใช้ผ้าที่ผ่านมาตรฐาน OEKO-TEX ปลอดภัยต่อผิวทารก' },
        { icon: '🌏', t: 'ส่งออกต่างประเทศ',       s: 'ประสบการณ์ส่งออกกว่า 40 ปี ลูกค้าในหลายประเทศ' },
        { icon: '🧵', t: 'ทีมงานมืออาชีพ',         s: 'ช่างฝีมือผู้ชำนาญ ดูแลทุกขั้นตอนอย่างใส่ใจ' },
        { icon: '🤝', t: 'พาร์ทเนอร์ที่เชื่อถือได้', s: 'เคียงข้างธุรกิจคุณ เติบโตไปด้วยกัน' },
      ],
      cta: { badge: '🐣 Baby Cheepy OEM/ODM', title: 'เริ่มต้นสร้างแบรนด์\nเสื้อผ้าเด็กของคุณ\nกับเราวันนี้!', btn: 'ติดต่อเรา →' },
    },
    process: {
      chip: 'OEM Process', title: 'ขั้นตอนการผลิต OEM/ODM',
      sub: 'โปร่งใส ดูแลทุกขั้นตอนโดยทีมผู้เชี่ยวชาญ',
      steps: [
        { icon: '💬', t: 'ปรึกษา',   s: 'รับฟังและแนะนำ' },
        { icon: '✏️', t: 'ออกแบบ',   s: 'ออกแบบร่วมกัน' },
        { icon: '🧶', t: 'เลือกผ้า', s: 'คัดสรรวัตถุดิบ' },
        { icon: '📐', t: 'แพทเทิร์น', s: 'พัฒนาและทำตัวอย่าง' },
        { icon: '🏭', t: 'ผลิต',     s: 'มาตรฐานสากล' },
        { icon: '🔍', t: 'QC',       s: 'ตรวจทุกชิ้น' },
        { icon: '📦', t: 'ส่งมอบ',   s: 'ตรงเวลา' },
      ],
    },
    standards: {
      chip: 'มาตรฐาน', title: 'มาตรฐานการผลิต',
      items: [
        { icon: '🛡️', t: 'OEKO-TEX®', s: 'ปลอดภัยสำหรับทารก ผ่านการรับรองสีย้อมและสารเคมี' },
        { icon: '🌿', t: 'COTTON USA', s: 'ผ้าฝ้ายคุณภาพสูงจากอเมริกา นุ่ม ระบายอากาศดี' },
        { icon: '©️', t: 'Character IP', s: 'ได้รับสิทธิ์ลิขสิทธิ์ตัวการ์ตูน ผลิตได้ถูกกฎหมาย' },
      ],
    },
    pricing: {
      chip: 'ราคา & แพ็กเกจ', title: 'เลือกแผนที่เหมาะกับคุณ',
      sub: 'ยิ่งสั่งมาก ราคายิ่งคุ้มค่า',
      popular: 'ยอดนิยม',
      note: '* ราคาจริงขึ้นอยู่กับประเภทสินค้า วัสดุ และจำนวนที่สั่ง',
      tiers: [
        { name: 'ขายปลีก', emoji: '🛍️', price: 'ราคาป้าย', unit: 'ไม่มีขั้นต่ำ', highlight: false,
          features: ['ไม่มีขั้นต่ำ', 'รับได้ทันที', 'แบรนด์ Baby Cheepy', 'คุณภาพโรงงาน'], cta: 'สั่งซื้อเลย' },
        { name: 'ขายส่ง', emoji: '📦', price: 'ราคาพิเศษ', unit: 'ขั้นต่ำ 12 ชิ้น/แบบ', highlight: true,
          features: ['ส่วนลดพิเศษ', 'ขั้นต่ำ 12 ชิ้น/แบบ', 'เลือกหลายแบบ', 'จัดส่งทั่วไทย'], cta: 'สอบถามราคา' },
        { name: 'OEM / ODM', emoji: '🎨', price: 'ราคาโรงงาน', unit: 'ขั้นต่ำ 120 ตัว/แบบ คละขนาดได้', highlight: false,
          features: ['ออกแบบเฉพาะแบรนด์', 'แพทเทิร์นฟรี', 'เลือกผ้าได้', 'ใส่แบรนด์ลูกค้า'], cta: 'ขอใบเสนอราคา' },
      ],
    },
    quote: { chip: 'ขอใบเสนอราคา', title: 'เริ่มต้นกับเราได้เลย', sub: 'ทีมงานติดต่อกลับภายใน 24 ชั่วโมง' },
    footer: {
      tagline: 'โรงงานรับผลิตเสื้อผ้าเด็กครบวงจร ประสบการณ์กว่า 40 ปี',
      address: '6/9 หมู่บ้านวิโรจน์วิลเลจ ต.ละหาร อ.บางบัวทอง จ.นนทบุรี 11110',
      rights: '© 2025 Global Apparel Kids (Baby Cheepy Studio). All rights reserved.',
    },
  },
  en: {
    langBtn: 'TH',
    phone: '02-XXX-XXXX',
    nav: {
      home: 'Home', about: 'About', services: 'Services',
      shop: 'Shop', ideas: 'Ideas ✨', portfolio: 'Portfolio', contact: 'Contact', location: '📍 Location',
      quote: 'Get Quote', lineId: '@861pkbnz',
      serviceItems: [
        { label: 'OEM / ODM Production',    href: '#services' },
        { label: 'Family & Pet Collection', href: '#services' },
        { label: 'Pattern Development',     href: '#services' },
        { label: 'Fabric Sourcing',         href: '#services' },
        { label: 'Embroidery & Decoration', href: '#services' },
        { label: 'ODM Wholesale',           href: '#pricing' },
      ],
    },
    hero: {
      badge: '🏅 40+ Years · CBME Shanghai · OEKO-TEX',
      h1a: "Children's Clothing Manufacturer",
      h1b: 'Quality You Can Trust, Care in Every Detail',
      sub: 'Safe, gentle, and crafted for every little one.',
      features: [
        { icon: '🌿', label: 'Premium\nSoft Fabric',  color: 'bg-icon-green' },
        { icon: '🛡️', label: 'Safe &\nNon-toxic',    color: 'bg-icon-salmon' },
        { icon: '✂️', label: 'Precision\nCrafted',    color: 'bg-icon-yellow' },
        { icon: '🎨', label: 'Custom\nDesign',        color: 'bg-icon-sky' },
      ],
      cta1: 'Get Free Quote', cta2: 'View Catalogue',
      bubble: 'Build your children\'s clothing brand\nwith us — easy to start!',
    },
    stats: [
      { icon: '📦', t: 'Low MOQ',         s: 'From 120 pcs/style (mix sizes)' },
      { icon: '✏️', t: 'Free Design',     s: 'Expert design team' },
      { icon: '🚀', t: 'On-time Delivery',s: 'Reliable schedule' },
      { icon: '🔍', t: 'QC Every Piece',  s: 'International standards' },
      { icon: '💬', t: 'After-sales',     s: 'Full production support' },
    ],
    categories: {
      title: 'Portfolio',
      items: [
        { label: 'Custom Brand OEM/ODM',      sub: 'Branded Production',        image: '/images/ตัวอย่างผลงาน/ชุดงานสั่งผลิตแบรนด์/mainn.png',        bg: 'bg-card-beige',    emoji: '👗' },
        { label: 'Swimwear',                  sub: 'Swimwear Collection',       image: '/images/ตัวอย่างผลงาน/ชุดว่ายน้ำ/mainn.png',                  bg: 'bg-card-blue',     emoji: '🏊' },
        { label: 'Pet Outfits',               sub: 'Pet Outfit Collection',     image: '/images/ตัวอย่างผลงาน/ชุดสัตว์เลี้ยง/mainn.png',              bg: 'bg-card-mint',     emoji: '🐾' },
        { label: 'Accessories & Decoration',  sub: 'Accessories & Decoration',  image: '/images/ตัวอย่างผลงาน/เครื่องประดับและของตกแต่ง/mainn.png',   bg: 'bg-card-lavender', emoji: '✨' },
      ],
    },
    trust: {
      title: 'Why Choose Baby Cheepy?',
      items: [
        { icon: '🛡️', t: 'Safe & Non-toxic',     s: 'OEKO-TEX certified fabrics — safe for baby skin.' },
        { icon: '🌏', t: 'International Export', s: '40+ years exporting to markets worldwide.' },
        { icon: '🧵', t: 'Expert Craftsmanship', s: 'Skilled team with meticulous attention to detail.' },
        { icon: '🤝', t: 'Trusted Partner',       s: "We grow alongside your brand, every step of the way." },
      ],
      cta: { badge: '🐣 Baby Cheepy OEM/ODM', title: 'Start building your\nchildren\'s clothing brand\nwith us today!', btn: 'Contact Us →' },
    },
    process: {
      chip: 'OEM Process', title: 'Our OEM/ODM Process',
      sub: 'Transparent and expert-managed from inquiry to delivery.',
      steps: [
        { icon: '💬', t: 'Consult',  s: 'Understand needs' },
        { icon: '✏️', t: 'Design',   s: 'Collaborate on design' },
        { icon: '🧶', t: 'Fabric',   s: 'Source materials' },
        { icon: '📐', t: 'Pattern',  s: 'Develop samples' },
        { icon: '🏭', t: 'Produce',  s: 'Manufacture' },
        { icon: '🔍', t: 'QC',       s: 'Check every piece' },
        { icon: '📦', t: 'Deliver',  s: 'On-time delivery' },
      ],
    },
    standards: {
      chip: 'Standards', title: 'Production Standards',
      items: [
        { icon: '🛡️', t: 'OEKO-TEX®',   s: 'Certified safe dyes and chemicals for infant use.' },
        { icon: '🌿', t: 'COTTON USA',   s: 'Premium 100% US cotton — soft and breathable.' },
        { icon: '©️', t: 'Character IP', s: 'Licensed character IP for legally branded garments.' },
      ],
    },
    pricing: {
      chip: 'Pricing', title: 'Choose Your Plan',
      sub: 'Better pricing for larger orders.',
      popular: 'Popular',
      note: '* Actual pricing depends on product type, materials, and volume.',
      tiers: [
        { name: 'Retail',    emoji: '🛍️', price: 'Full Price',    unit: 'No minimum',        highlight: false,
          features: ['No minimum order', 'Ready stock', 'Baby Cheepy brand', 'Factory quality'], cta: 'Shop Now' },
        { name: 'Wholesale', emoji: '📦', price: 'Special Price', unit: 'Min. 12 pcs/style',  highlight: true,
          features: ['Volume discounts', 'Min. 12 pcs/style', 'Multiple styles OK', 'Nationwide delivery'], cta: 'Get Pricing' },
        { name: 'OEM / ODM', emoji: '🎨', price: 'Factory Price', unit: 'Min. 120 pcs/style (mix sizes)', highlight: false,
          features: ['Custom brand design', 'Free pattern', 'Fabric selection', 'Private label'], cta: 'Get OEM Quote' },
      ],
    },
    quote: { chip: 'Request a Quote', title: 'Start With Us Today', sub: 'Our team will contact you within 24 hours.' },
    footer: {
      tagline: "Full-service children's apparel manufacturer with 40+ years of experience.",
      address: '6/9 Wiroj Village, Lahan, Bang Bua Thong, Nonthaburi 11110',
      rights: '© 2025 Global Apparel Kids (Baby Cheepy Studio). All rights reserved.',
    },
  },
} as const;

/* ─── NavBar ─── */
function NavBar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const t = i18n[lang];
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-200 bg-white border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🐣</span>
          <div className="leading-tight">
            <div className="font-extrabold text-gray-900 text-base">Baby<span className="text-coral">Cheepy</span></div>
            <div className="text-[10px] text-gray-400 font-medium hidden sm:block">รับผลิตเสื้อผ้าเด็กครบวงจร</div>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5 text-sm font-semibold text-gray-600 flex-1 justify-center">
          <a href="#hero"      className="px-3 py-2 rounded-xl hover:text-coral hover:bg-coral-light transition-colors">{t.nav.home}</a>
          <a href="#about"     className="px-3 py-2 rounded-xl hover:text-coral hover:bg-coral-light transition-colors">{t.nav.about}</a>
          <div className="dropdown-wrap">
            <button className="px-3 py-2 rounded-xl hover:text-coral hover:bg-coral-light transition-colors flex items-center gap-1">
              {t.nav.services}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="dropdown-menu">
              {t.nav.serviceItems.map((s, i) => (
                <a key={i} href={s.href} className="block px-4 py-2 text-sm text-gray-600 hover:bg-coral-light hover:text-coral transition-colors">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <a href="/shop"      className="px-3 py-2 rounded-xl hover:text-coral hover:bg-coral-light transition-colors">{t.nav.shop}</a>
          <a href="/ideas"     className="px-3 py-2 rounded-xl hover:text-coral hover:bg-coral-light transition-colors">{t.nav.ideas}</a>
          <a href="#portfolio" className="px-3 py-2 rounded-xl hover:text-coral hover:bg-coral-light transition-colors">{t.nav.portfolio}</a>
          <a href="#contact"   className="px-3 py-2 rounded-xl hover:text-coral hover:bg-coral-light transition-colors">{t.nav.contact}</a>
          <a href="/location"  className="px-3 py-2 rounded-xl hover:text-coral hover:bg-coral-light transition-colors">{t.nav.location}</a>
        </div>

        {/* Right CTAs */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Phone (desktop) */}
          <a href={`tel:${t.phone}`} className="hidden xl:flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-coral transition-colors">
            <svg className="w-4 h-4 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {t.phone}
          </a>
          <button onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
            className="hidden md:block text-xs font-bold text-gray-500 border border-gray-200 hover:border-coral rounded-full px-2.5 py-1 transition-colors hover:text-coral">
            {t.langBtn}
          </button>
          <a href="#quote" className="btn-coral text-sm py-2 px-5 hidden md:inline-flex">{t.nav.quote}</a>
          <a href="https://line.me/R/ti/p/@861pkbnz" target="_blank" rel="noopener noreferrer"
            className="btn-line text-sm py-2 px-4 hidden md:inline-flex">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden>
              <path d="M19.952 11.037C19.952 6.608 15.485 3 10 3S.048 6.608.048 11.037c0 4.002 3.547 7.354 8.337 7.984.325.07.767.214.879.49.1.25.066.641.032.894l-.142.854c-.043.25-.2.977.856.532 1.056-.444 5.7-3.356 7.778-5.744C19.166 14.316 19.952 12.745 19.952 11.037z"/>
            </svg>
            {t.nav.lineId}
          </a>
          <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-orange-100 px-4 pb-4 space-y-1 text-sm font-semibold">
          {([['#hero', t.nav.home], ['#about', t.nav.about], ['/shop', t.nav.shop], ['/ideas', t.nav.ideas], ['#portfolio', t.nav.portfolio], ['#contact', t.nav.contact], ['/location', t.nav.location]] as [string, string][]).map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-xl hover:bg-coral-light text-gray-700">{label}</a>
          ))}
          <div className="flex gap-2 pt-2">
            <a href="#quote" onClick={() => setOpen(false)} className="btn-coral text-sm py-2 px-4 flex-1 text-center">{t.nav.quote}</a>
            <button onClick={() => { setLang(lang === 'th' ? 'en' : 'th'); setOpen(false); }}
              className="border border-gray-200 rounded-full px-3 text-xs font-bold text-gray-500">{t.langBtn}</button>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── Main component ─── */
export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('th');
  const t = i18n[lang];

  return (
    <div className="font-prompt bg-cream">
      <NavBar lang={lang} setLang={setLang} />

      {/* ══ HERO ══ */}
      <section id="hero" className="pt-16 bg-cream min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Main hero card */}
          <div className="relative bg-white rounded-5xl overflow-hidden shadow-xl border border-orange-100 p-8 md:p-14">
            {/* Background decoration */}
            <DotCircle className="absolute top-8 right-48 w-56 h-56 bg-cream opacity-60 pointer-events-none" />
            <DotCircle className="absolute -bottom-10 -left-10 w-48 h-48 bg-coral-light opacity-40 pointer-events-none" />
            <CloudSVG className="absolute top-4 left-1/3 w-32 text-orange-100 pointer-events-none" />
            <StarSVG className="absolute top-12 left-[30%] w-5 h-5 text-yellow-300 pointer-events-none" />
            <StarSVG className="absolute bottom-20 right-[38%] w-4 h-4 text-coral-muted pointer-events-none" />
            <DotCircle className="absolute top-16 right-[36%] w-3 h-3 bg-blue-300 pointer-events-none" />
            <DotCircle className="absolute bottom-16 left-[28%] w-3 h-3 bg-green-300 pointer-events-none" />

            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              {/* Left */}
              <div>
                <div className="chip mb-4">{t.hero.badge}</div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-coral leading-tight mb-2">
                  {t.hero.h1a}
                </h1>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-3">
                  {t.hero.h1b}
                </h2>
                <p className="text-gray-500 mb-8">{t.hero.sub}</p>

                {/* Feature icon circles */}
                <div className="flex gap-4 mb-8 flex-wrap">
                  {t.hero.features.map((f, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div className={`w-14 h-14 rounded-full ${f.color} flex items-center justify-center text-2xl shadow-sm`}>
                        {f.icon}
                      </div>
                      <span className="text-xs font-bold text-gray-600 text-center whitespace-pre-line leading-tight">{f.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <a href="#quote" className="btn-coral shadow-lg shadow-coral/20">{t.hero.cta1}</a>
                  <a href="/shop"  className="btn-outline-coral">{t.hero.cta2}</a>
                </div>
              </div>

              {/* Right — hero image */}
              <div className="relative flex justify-center">
                <div className="relative w-full max-w-md aspect-[4/3] rounded-4xl overflow-hidden shadow-2xl ring-4 ring-white ring-offset-4 ring-offset-cream">
                  <ImageSlot src="/images/hero.jpg" alt="Baby Cheepy Products"
                    hint={lang === 'th' ? 'วางรูปสินค้าหรือรูปเด็กสวมเสื้อผ้า (1200×900px)' : 'Place children product photo here'}
                    emoji="👶" />
                </div>
                {/* Floating bubble */}
                <div className="absolute -bottom-4 -left-4 bg-coral text-white rounded-3xl rounded-bl-none px-4 py-3 shadow-xl max-w-[180px] text-xs font-bold leading-snug">
                  ❤️ {t.hero.bubble}
                </div>
                {/* Stats chips */}
                <div className="absolute -top-3 -right-3 bg-white rounded-2xl shadow-lg px-4 py-2.5 border border-orange-100">
                  <div className="text-xl font-extrabold text-coral">40+</div>
                  <div className="text-[10px] text-gray-500">{lang === 'th' ? 'ปีประสบการณ์' : 'Years Exp.'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Stats strip ── */}
          <div className="mt-5 bg-white rounded-4xl border border-orange-100 shadow-sm px-4 py-5">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 divide-y md:divide-y-0 md:divide-x divide-orange-100">
              {t.stats.map((s, i) => (
                <div key={i} className="flex items-center gap-3 py-2 md:py-0 md:px-4 first:pl-0 last:pr-0">
                  <span className="text-2xl shrink-0">{s.icon}</span>
                  <div>
                    <div className="font-extrabold text-sm text-gray-900">{s.t}</div>
                    <div className="text-xs text-gray-500">{s.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ PORTFOLIO ══ */}
      <section id="portfolio" className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="chip mb-3">🏆 {lang === 'th' ? 'ตัวอย่างผลงาน' : 'Our Portfolio'}</div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              {lang === 'th' ? 'ตัวอย่างผลงาน' : 'Portfolio'}
            </h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              {lang === 'th'
                ? 'ผลงานจริงจากโรงงานของเรา — ออกแบบและผลิตโดยทีมงานมืออาชีพ'
                : 'Real work from our factory — designed and manufactured by our expert team'}
            </p>
            <div className="flex justify-center gap-3 mt-4">
              <a href="/ideas" className="flex items-center gap-2 bg-coral text-white text-sm font-bold px-5 py-2 rounded-full shadow hover:bg-coral-dark transition-colors">
                ✨ {lang === 'th' ? 'ดูไอเดียทั้งหมด' : 'View All Ideas'}
              </a>
              <a href="#quote" className="flex items-center gap-2 bg-white border-2 border-coral text-coral text-sm font-bold px-5 py-2 rounded-full hover:bg-coral hover:text-white transition-colors">
                📋 {lang === 'th' ? 'ขอใบเสนอราคา' : 'Get a Quote'}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.categories.items.map((cat, i) => (
              <div key={i} className={`group ${cat.bg} rounded-3xl p-4 flex flex-col items-start gap-3 border border-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}>
                <a href="/ideas" className="w-full">
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white/60 shadow-sm">
                    <ImageSlot src={cat.image} alt={cat.label}
                      hint={cat.image}
                      emoji={cat.emoji} />
                  </div>
                </a>
                <div className="w-full">
                  <div className="font-extrabold text-gray-900 text-sm">{cat.label}</div>
                  <div className="text-xs text-gray-500 mb-3">{cat.sub}</div>
                  <div className="flex gap-1.5 flex-wrap">
                    <a href="/ideas"
                      className="flex-1 text-center text-xs font-bold text-coral border border-coral rounded-full px-2 py-1.5 group-hover:bg-coral group-hover:text-white transition-colors">
                      ✨ {lang === 'th' ? 'ดูผลงาน' : 'View Work'}
                    </a>
                    <a href="#quote"
                      className="flex-1 text-center text-xs font-bold text-gray-600 border border-gray-300 rounded-full px-2 py-1.5 hover:bg-gray-700 hover:text-white transition-colors">
                      📋 {lang === 'th' ? 'สั่งผลิต' : 'Order'}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mini service link bar */}
          <div className="mt-8 bg-white rounded-3xl border border-orange-100 p-5 flex flex-wrap items-center gap-3 justify-between shadow-sm">
            <p className="font-bold text-gray-700 text-sm">
              🏭 {lang === 'th' ? 'ต้องการผลิตเอง? ดูบริการ OEM/ODM ของเรา:' : 'Need custom production? See our OEM/ODM services:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: lang === 'th' ? 'OEM/ODM' : 'OEM/ODM',          href: '/services#oem-odm' },
                { label: lang === 'th' ? 'งานปัก' : 'Embroidery',         href: '/services#embroidery' },
                { label: lang === 'th' ? 'สกรีน' : 'Screen Print',        href: '/services#screen-print' },
                { label: lang === 'th' ? 'พิมพ์ลายผ้า' : 'Fabric Print',  href: '/services#fabric-print' },
                { label: lang === 'th' ? 'สม้อค' : 'Smocking',            href: '/services#smocking' },
                { label: lang === 'th' ? 'ส่งออก' : 'Export',             href: '/services#export' },
              ].map((s, i) => (
                <a key={i} href={s.href}
                  className="text-xs font-bold text-coral border border-coral/40 bg-coral-light rounded-full px-3 py-1 hover:bg-coral hover:text-white transition-colors">
                  {s.label}
                </a>
              ))}
              <a href="/services" className="text-xs font-bold text-white bg-coral rounded-full px-3 py-1 hover:bg-coral-dark transition-colors">
                {lang === 'th' ? 'ดูทั้งหมด →' : 'View All →'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TIKTOK ══ */}
      <TikTokSection lang={lang} />

      {/* ══ เกี่ยวกับเรา ══ */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Text */}
            <div>
              <div className="chip mb-4">{lang === 'th' ? '🐣 เกี่ยวกับเรา' : '🐣 About Us'}</div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
                {lang === 'th'
                  ? <>{`จากรุ่นแม่`}<span className="text-coral">{`สู่รุ่นลูก`}</span></>
                  : <>From Generation <span className="text-coral">to Generation</span></>}
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
                <p>
                  {lang === 'th'
                    ? 'เราสืบทอดประสบการณ์กว่า 40 ปีในวงการเสื้อผ้าเด็ก ด้วยความเชื่อว่าทุกแบรนด์ที่ดี ควรเริ่มต้นจากผู้ผลิตที่เข้าใจ'
                    : "We carry forward 40+ years of expertise in children's apparel, built on the belief that every great brand starts with a manufacturer that truly understands."}
                </p>
                <p>
                  {lang === 'th'
                    ? 'เราดูแลทุกขั้นตอนตั้งแต่การออกแบบ การเลือกผ้า การผลิต ไปจนถึงการให้คำปรึกษาด้านการสร้างแบรนด์และการตลาด เพื่อให้ลูกค้าสามารถเปลี่ยนไอเดียให้กลายเป็นสินค้าที่พร้อมเติบโตในตลาดได้อย่างมั่นใจ'
                    : 'We handle everything — from design and fabric selection to manufacturing and brand consulting — so you can turn your ideas into market-ready products with confidence.'}
                </p>
                <p className="font-bold text-coral text-base">
                  {lang === 'th'
                    ? 'เพราะความสำเร็จของลูกค้า คือความภาคภูมิใจของเราเสมอ'
                    : 'Because your success is always our pride.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                {([
                  { icon: '🏭', label: lang === 'th' ? '40+ ปี' : '40+ Years', sub: lang === 'th' ? 'ประสบการณ์' : 'Experience' },
                  { icon: '🌍', label: lang === 'th' ? 'ส่งออก' : 'Export', sub: lang === 'th' ? 'หลายประเทศ' : 'Worldwide' },
                  { icon: '✂️', label: 'OEM / ODM', sub: lang === 'th' ? 'ครบวงจร' : 'Full Service' },
                ] as { icon: string; label: string; sub: string }[]).map((b, i) => (
                  <div key={i} className="flex items-center gap-3 bg-cream rounded-2xl px-4 py-3 border border-orange-100">
                    <span className="text-2xl">{b.icon}</span>
                    <div>
                      <div className="font-extrabold text-gray-900 text-sm">{b.label}</div>
                      <div className="text-xs text-gray-500">{b.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 rounded-3xl overflow-hidden h-52 shadow-md">
                <img src="/images/about.png"
                  alt="Baby Cheepy โรงงาน" className="w-full h-full object-cover" />
              </div>
              {([
                '/images/about-1.png',
                '/images/about-2.png',
                '/images/about-3.png',
              ] as string[]).map((src, i) => (
                <div key={i} className="rounded-2xl overflow-hidden h-36 shadow-sm">
                  <img src={src} alt="Baby Cheepy" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══ TRUST / WHY US ══ */}
      <section className="py-16 bg-white border-t border-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">{t.trust.title}</h2>
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Features (4 cols) */}
            <div className="lg:col-span-4 grid sm:grid-cols-2 gap-5">
              {t.trust.items.map((item, i) => (
                <div key={i} className="flex gap-4 bg-cream rounded-3xl p-5 border border-orange-100 hover:shadow-md transition-shadow">
                  <div className="text-4xl shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 mb-1">{item.t}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.s}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* CTA card (1 col) */}
            <div className="bg-coral rounded-3xl p-6 flex flex-col justify-between text-white shadow-xl shadow-coral/20">
              <div>
                <div className="text-xs font-bold bg-white/20 rounded-full px-3 py-1 inline-block mb-4">{t.trust.cta.badge}</div>
                <p className="font-extrabold text-lg leading-snug whitespace-pre-line mb-6">{t.trust.cta.title}</p>
              </div>
              <a href="#contact" className="btn-white w-full text-coral justify-center">{t.trust.cta.btn}</a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ OEM PROCESS ══ */}
      <section id="services" className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="chip mb-3">{t.process.chip}</div>
            <h2 className="section-title text-gray-900">{t.process.title}</h2>
            <p className="section-sub">{t.process.sub}</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-9 left-0 right-0 h-0.5 bg-gradient-to-r from-coral-muted via-orange-200 to-coral-muted" />
            <div className="grid grid-cols-2 md:grid-cols-7 gap-5">
              {t.process.steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center relative">
                  <div className="relative z-10 w-18 h-18 w-16 h-16 rounded-full bg-white shadow-md border-2 border-orange-200
                    flex flex-col items-center justify-center mb-3 hover:scale-110 hover:border-coral transition-all">
                    <span className="text-2xl">{step.icon}</span>
                    <span className="text-[10px] font-bold text-coral mt-0.5">{i + 1}</span>
                  </div>
                  <h4 className="font-extrabold text-gray-900 text-sm mb-0.5">{step.t}</h4>
                  <p className="text-xs text-gray-400 leading-snug">{step.s}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-10">
            <a href="#quote" className="btn-coral">
              {lang === 'th' ? 'เริ่มต้นกับเราเลย →' : 'Start Your Project →'}
            </a>
          </div>
        </div>
      </section>

      {/* ══ STANDARDS ══ */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="chip mb-3">{t.standards.chip}</div>
            <h2 className="section-title text-gray-900">{t.standards.title}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {t.standards.items.map((s, i) => (
              <div key={i} className="cream-card text-center border-t-4 border-coral">
                <div className="text-5xl mb-4">{s.icon}</div>
                <h3 className="font-extrabold text-gray-900 mb-2">{s.t}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section id="pricing" className="py-16 bg-cream">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="chip mb-3">{t.pricing.chip}</div>
            <h2 className="section-title text-gray-900">{t.pricing.title}</h2>
            <p className="section-sub">{t.pricing.sub}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {t.pricing.tiers.map((tier, i) => (
              <div key={i} className={`relative rounded-4xl p-7 flex flex-col border-2 transition-all
                ${tier.highlight
                  ? 'bg-coral border-coral text-white shadow-2xl shadow-coral/30 scale-105'
                  : 'bg-white border-orange-100 hover:border-coral/40 hover:shadow-lg'}`}>
                {tier.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs font-extrabold px-4 py-1 rounded-full shadow">
                    ⭐ {t.pricing.popular}
                  </div>
                )}
                <div className="text-3xl mb-3">{tier.emoji}</div>
                <h3 className={`text-xl font-extrabold mb-1 ${tier.highlight ? 'text-white' : 'text-gray-900'}`}>{tier.name}</h3>
                <div className={`text-2xl font-extrabold mb-1 ${tier.highlight ? 'text-yellow-300' : 'text-coral'}`}>{tier.price}</div>
                <div className={`text-xs mb-6 ${tier.highlight ? 'text-white/70' : 'text-gray-400'}`}>{tier.unit}</div>
                <ul className="space-y-2 mb-7 flex-1">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <svg className={`w-4 h-4 shrink-0 ${tier.highlight ? 'text-yellow-300' : 'text-coral'}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={tier.highlight ? 'text-white' : 'text-gray-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="#quote"
                  className={`w-full text-center py-3 rounded-2xl font-bold text-sm transition-all
                    ${tier.highlight ? 'bg-white text-coral hover:bg-orange-50' : 'bg-coral text-white hover:bg-coral-dark'}`}>
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-5">{t.pricing.note}</p>
        </div>
      </section>

      {/* ══ QUOTE FORM ══ */}
      <section id="quote" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="chip mb-3">{t.quote.chip}</div>
            <h2 className="section-title text-gray-900">{t.quote.title}</h2>
            <p className="section-sub">{t.quote.sub}</p>
          </div>
          <div className="bg-cream rounded-4xl p-8 border border-orange-100 shadow-sm">
            <QuoteForm lang={lang} />
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer id="contact" className="bg-gray-900 text-white py-14">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🐣</span>
              <div className="font-extrabold text-lg">Baby<span className="text-coral-muted">Cheepy</span></div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{t.footer.tagline}</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-coral-muted">{lang === 'th' ? 'บริการของเรา' : 'Our Services'}</h4>
            <ul className="space-y-1.5 text-gray-400 text-sm">
              {(lang === 'th' ? [
                'รับผลิต OEM / ODM', 'คอลเลคชั่นครอบครัว & สัตว์เลี้ยง',
                'พัฒนาแพทเทิร์น', 'จัดหาผ้า & พิมพ์ลาย', 'ขายส่ง ODM',
              ] : [
                'OEM / ODM Production', 'Family & Pet Collection',
                'Pattern Development', 'Fabric Sourcing', 'ODM Wholesale',
              ]).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-coral-muted">{lang === 'th' ? 'ติดต่อเรา' : 'Contact Us'}</h4>
            <div className="space-y-3 text-gray-400 text-sm">
              <p><span className="text-white font-semibold">{lang === 'th' ? 'ที่อยู่:' : 'Address:'}</span>{' '}{t.footer.address}</p>
              <p><span className="text-white font-semibold">LINE OA:</span>{' '}
                <a href="https://line.me/R/ti/p/@861pkbnz" target="_blank" rel="noopener noreferrer"
                  className="text-coral-muted hover:underline">@861pkbnz</a></p>
              <p><span className="text-white font-semibold">Facebook:</span>{' '}
                <a href="https://www.facebook.com/lovelymommyth" target="_blank" rel="noopener noreferrer"
                  className="text-coral-muted hover:underline">lovelymommyth</a></p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-xs">{t.footer.rights}</div>
      </footer>

      {/* ══ FLOATING BUTTONS ══ */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <a href="https://www.facebook.com/lovelymommyth" target="_blank" rel="noopener noreferrer"
          title="Facebook"
          className="w-12 h-12 bg-[#1877F2] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" aria-hidden>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <a href="https://line.me/R/ti/p/@861pkbnz" target="_blank" rel="noopener noreferrer"
          title="LINE"
          className="w-12 h-12 bg-[#06C755] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" aria-hidden>
            <path d="M19.952 11.037C19.952 6.608 15.485 3 10 3S.048 6.608.048 11.037c0 4.002 3.547 7.354 8.337 7.984.325.07.767.214.879.49.1.25.066.641.032.894l-.142.854c-.043.25-.2.977.856.532 1.056-.444 5.7-3.356 7.778-5.744C19.166 14.316 19.952 12.745 19.952 11.037z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
