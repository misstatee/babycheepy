'use client';

import { useState } from 'react';
import Image from 'next/image';

type Lang = 'th' | 'en';

function ImageSlot({ src, alt, className, emoji = '📸' }: { src: string; alt: string; className?: string; emoji?: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-cream rounded-2xl ${className ?? ''}`}>
      {!err ? (
        <Image src={src} alt={alt} fill className="object-cover" onError={() => setErr(true)} />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center p-4">
          <span className="text-4xl">{emoji}</span>
          <p className="text-xs text-gray-400">{src.replace('/images/', 'public/images/')}</p>
        </div>
      )}
    </div>
  );
}

const services = [
  {
    id: 'oem-odm',
    icon: '🏭',
    color: 'border-coral bg-coral-light',
    tagColor: 'bg-coral text-white',
    tag: 'หลัก',
    th: {
      title: 'รับผลิต OEM / ODM',
      desc: 'รับผลิตตามแบบลูกค้า (OEM) หรือออกแบบให้ใหม่ทั้งหมด (ODM) ครบวงจรตั้งแต่ไอเดียจนถึงบรรจุภัณฑ์ มีประสบการณ์ผลิตให้แบรนด์ไทยและต่างประเทศมาแล้วกว่า 40 ปี',
      points: [
        'รับออกแบบตามสเปคลูกค้า (OEM)',
        'ออกแบบและพัฒนาแบรนด์ใหม่ทั้งหมด (ODM)',
        'พัฒนาแพทเทิร์นและทำตัวอย่างก่อนผลิต',
        'ผลิตเสื้อผ้าเด็ก ครอบครัว และสัตว์เลี้ยง',
        'ส่งมอบตรงเวลาพร้อม QC ทุกชิ้น',
        'รองรับออเดอร์ในประเทศและส่งออก',
      ],
    },
    en: {
      title: 'OEM / ODM Manufacturing',
      desc: 'Produce to your design (OEM) or let us design from scratch (ODM). Full service from concept to packaging. 40+ years serving Thai and international brands.',
      points: [
        'Custom spec production (OEM)',
        'Full brand development (ODM)',
        'Pattern development & sampling',
        "Children's, family & pet apparel",
        'On-time delivery with full QC',
        'Domestic & international orders',
      ],
    },
    images: ['/images/oem-1.jpg', '/images/oem-2.jpg', '/images/oem-3.jpg'],
    emojis: ['👗', '✂️', '📦'],
  },
  {
    id: 'embroidery',
    icon: '🪡',
    color: 'border-purple-300 bg-purple-50',
    tagColor: 'bg-purple-500 text-white',
    tag: 'Decoration',
    th: {
      title: 'งานปัก (Embroidery)',
      desc: 'บริการปักดิจิทัลและปักมือคุณภาพสูง รองรับทั้งปัก 2D, 3D, ปักแพทช์ และปักโลโก้แบรนด์ เพิ่มความพรีเมียมและโดดเด่นให้กับสินค้า',
      points: [
        'ปักดิจิทัล (Digital Embroidery)',
        'ปัก 3D นูน (3D Puff Embroidery)',
        'ปักแพทช์ติดสินค้า (Patch Embroidery)',
        'ปักโลโก้แบรนด์บนเสื้อผ้า',
        'รองรับผ้าทุกประเภท',
        'จำนวนขั้นต่ำน้อย เหมาะสำหรับทุกขนาด',
      ],
    },
    en: {
      title: 'Embroidery',
      desc: 'High-quality digital and hand embroidery. Supports 2D, 3D puff, patch, and brand logo embroidery — adding premium value to every garment.',
      points: [
        'Digital embroidery',
        '3D puff embroidery',
        'Patch embroidery',
        'Brand logo embroidery',
        'Works on all fabric types',
        'Low minimum order available',
      ],
    },
    images: ['/images/emb-1.jpg', '/images/emb-2.jpg', '/images/emb-3.jpg'],
    emojis: ['🪡', '✨', '🏷️'],
  },
  {
    id: 'screen-print',
    icon: '🖨️',
    color: 'border-blue-300 bg-blue-50',
    tagColor: 'bg-blue-500 text-white',
    tag: 'Printing',
    th: {
      title: 'งานสกรีน (Screen Printing)',
      desc: 'สกรีนหลายสี หลายเทคนิค ทั้งสกรีนน้ำ สกรีนพลาสติซอล สกรีนดิสชาร์จ เหมาะสำหรับงาน batch ใหญ่และต้องการสีสดชัดเจน',
      points: [
        'สกรีนน้ำ (Water-based)',
        'สกรีนพลาสติซอล (Plastisol)',
        'สกรีนดิสชาร์จ (Discharge)',
        'สกรีนหลายสีพร้อมกัน',
        'เหมาะสำหรับ batch size ใหญ่',
        'สีทนทาน ไม่ลอกง่าย',
      ],
    },
    en: {
      title: 'Screen Printing',
      desc: 'Multi-color, multi-technique screen printing — water-based, plastisol, discharge. Ideal for large batches requiring vibrant, durable colors.',
      points: [
        'Water-based screen printing',
        'Plastisol printing',
        'Discharge printing',
        'Multi-color printing',
        'Best for large batch runs',
        'Long-lasting, wash-resistant colors',
      ],
    },
    images: ['/images/screen-1.jpg', '/images/screen-2.jpg', '/images/screen-3.jpg'],
    emojis: ['🖨️', '🎨', '👕'],
  },
  {
    id: 'fabric-print',
    icon: '🎨',
    color: 'border-yellow-300 bg-yellow-50',
    tagColor: 'bg-yellow-500 text-white',
    tag: 'Printing',
    th: {
      title: 'พิมพ์ลายผ้า (Fabric Printing)',
      desc: 'พิมพ์ลายผ้าระบบดิจิทัล ทั้งผ้า Knit และ Woven รองรับลายซับซ้อนหลายสี ไม่จำกัดสี เหมาะสำหรับคอลเลคชั่นพิเศษและ Limited Edition',
      points: [
        'พิมพ์ดิจิทัลผ้า Knit และ Woven',
        'ไม่จำกัดจำนวนสีในลาย',
        'ลายละเอียดสูง เส้นคมชัด',
        'สีติดทนนาน ซักได้หลายครั้ง',
        'รองรับออกแบบลายตามต้องการ',
        'เหมาะสำหรับ Limited Edition',
      ],
    },
    en: {
      title: 'Fabric Printing',
      desc: 'Digital fabric printing for Knit and Woven. Unlimited colors, high-detail patterns. Perfect for special collections and limited editions.',
      points: [
        'Digital printing on Knit & Woven',
        'Unlimited color count',
        'High-resolution sharp prints',
        'Wash-durable colors',
        'Custom pattern design supported',
        'Ideal for limited edition runs',
      ],
    },
    images: ['/images/print-1.jpg', '/images/print-2.jpg', '/images/print-3.jpg'],
    emojis: ['🎨', '🌈', '🧵'],
  },
  {
    id: 'smocking',
    icon: '🧶',
    color: 'border-pink-300 bg-pink-50',
    tagColor: 'bg-pink-500 text-white',
    tag: 'Special',
    th: {
      title: 'งานสม้อค (Smocking)',
      desc: 'งานสม้อคฝีมือประณีต เพิ่มมูลค่าให้กับเสื้อผ้าเด็กและสตรี ทั้งสม้อคแบบดั้งเดิมและสม้อคดิจิทัล เหมาะสำหรับชุดพิธีการและ High-end fashion',
      points: [
        'สม้อคแบบดั้งเดิม (Traditional Smocking)',
        'สม้อคดิจิทัล (Digital Smocking)',
        'ลายสม้อคหลากหลายแบบ',
        'เหมาะกับชุดเด็กและสตรี',
        'เพิ่มมูลค่าและความพรีเมียม',
        'รับออกแบบลายพิเศษตามต้องการ',
      ],
    },
    en: {
      title: 'Smocking',
      desc: 'Exquisite handcrafted smocking adding value to children\'s and women\'s wear. Traditional and digital smocking for high-end and ceremonial garments.',
      points: [
        'Traditional smocking',
        'Digital smocking',
        'Wide variety of smocking patterns',
        "Ideal for children's & women's wear",
        'Adds premium value',
        'Custom pattern design available',
      ],
    },
    images: ['/images/smocking-1.jpg', '/images/smocking-2.jpg', '/images/smocking-3.jpg'],
    emojis: ['🧶', '💎', '👘'],
  },
  {
    id: 'innovative-fabric',
    icon: '🌿',
    color: 'border-green-300 bg-green-50',
    tagColor: 'bg-green-600 text-white',
    tag: 'Eco',
    th: {
      title: 'ผ้านวัตกรรม (Innovative Fabrics)',
      desc: 'จัดหาและแนะนำผ้านวัตกรรมล่าสุด ตั้งแต่ผ้า Bamboo ป้องกันเชื้อแบคทีเรีย ผ้า Recycled เพื่อสิ่งแวดล้อม ผ้า UV Protection และผ้าเทคโนโลยีใหม่ๆ',
      points: [
        'ผ้า Bamboo — ระบายอากาศ ต้านเชื้อแบคทีเรีย',
        'ผ้า Recycled — รักษ์สิ่งแวดล้อม',
        'ผ้า UV Protection — ป้องกันแสงอาทิตย์',
        'ผ้า Coolmax — ระบายความร้อนเร็ว',
        'ผ้า Organic Cotton — ปลูกแบบออร์แกนิค',
        'ผ้า OEKO-TEX Certified ทุกชนิด',
      ],
    },
    en: {
      title: 'Innovative Fabrics',
      desc: 'Source and recommend the latest innovative fabrics — bamboo, recycled, UV protection, and new-technology textiles for modern sustainable fashion.',
      points: [
        'Bamboo — breathable, antibacterial',
        'Recycled — eco-friendly',
        'UV Protection fabric',
        'Coolmax — rapid heat dissipation',
        'Organic Cotton',
        'All OEKO-TEX certified',
      ],
    },
    images: ['/images/fabric-1.jpg', '/images/fabric-2.jpg', '/images/fabric-3.jpg'],
    emojis: ['🌿', '♻️', '🧪'],
  },
  {
    id: 'export',
    icon: '✈️',
    color: 'border-sky-300 bg-sky-50',
    tagColor: 'bg-sky-500 text-white',
    tag: 'Export',
    th: {
      title: 'ส่งออกต่างประเทศ (International Export)',
      desc: 'มีประสบการณ์ส่งออกเสื้อผ้าเด็กไปยังหลายประเทศ ทีมงานจัดการเอกสาร บรรจุภัณฑ์ และการขนส่งครบวงจร เคยเข้าร่วม CBME Shanghai',
      points: [
        'ส่งออกไปยังหลายประเทศทั่วโลก',
        'จัดการเอกสารส่งออกครบวงจร',
        'บรรจุภัณฑ์ตามมาตรฐานสากล',
        'เคยเข้าร่วมงาน CBME Shanghai',
        'รองรับ Letter of Credit (L/C)',
        'ประสานงานกับ Shipping Agent',
      ],
    },
    en: {
      title: 'International Export',
      desc: 'Experienced in exporting children\'s apparel globally. Full documentation, packaging, and logistics management. CBME Shanghai exhibitor.',
      points: [
        'Export to multiple countries worldwide',
        'Full export documentation',
        'International-standard packaging',
        'CBME Shanghai exhibitor',
        'Letter of Credit (L/C) accepted',
        'Shipping agent coordination',
      ],
    },
    images: ['/images/export-1.jpg', '/images/export-2.jpg', '/images/export-3.jpg'],
    emojis: ['✈️', '🌏', '📦'],
  },
  {
    id: 'family-pet',
    icon: '👨‍👩‍👧',
    color: 'border-orange-300 bg-orange-50',
    tagColor: 'bg-orange-500 text-white',
    tag: '🆕 ใหม่',
    th: {
      title: 'คอลเลคชั่นครอบครัว & สัตว์เลี้ยง',
      desc: 'ออกแบบและผลิตชุดแมตช์ครอบครัว พ่อ แม่ ลูก รวมถึงชุดสัตว์เลี้ยง เทรนด์ใหม่ที่ตลาดต้องการ เพิ่มโอกาสทางธุรกิจให้แบรนด์ของคุณ',
      points: [
        'ชุดแมตช์ครอบครัวพ่อ แม่ ลูก',
        'ชุดสุนัข แมว และกระต่าย',
        'วัสดุนุ่ม ปลอดภัย เหมาะกับทุกวัย',
        'ออกแบบให้ตาม collection ของแบรนด์',
        'ถ่ายภาพ content ได้หลากหลาย',
        'ขายดีในช่วงเทศกาล',
      ],
    },
    en: {
      title: 'Family & Pet Collection',
      desc: 'Design and produce matching family sets — parents, children, and pets. A growing trend that expands your brand\'s market opportunities.',
      points: [
        'Matching sets for whole family',
        'Dog, cat & rabbit outfits',
        'Soft, safe materials for all ages',
        'Designed to match your collection',
        'Great for content creation',
        'Top sellers during festive seasons',
      ],
    },
    images: ['/images/family-1.jpg', '/images/family-2.jpg', '/images/family-3.jpg'],
    emojis: ['👨‍👩‍👧', '🐾', '🎉'],
  },
];

export default function ServicesPage() {
  const [lang, setLang] = useState<Lang>('th');
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-cream font-prompt">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white border-b border-orange-100 shadow-sm px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span className="text-xl">🐣</span>
          <div>
            <span className="font-extrabold text-gray-900">Baby</span>
            <span className="font-extrabold text-coral">Cheepy</span>
          </div>
        </a>
        <div className="flex items-center gap-3">
          <button onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
            className="text-xs font-bold text-gray-500 border border-gray-200 rounded-full px-2.5 py-1 hover:border-coral hover:text-coral transition-colors">
            {lang === 'th' ? 'EN' : 'TH'}
          </button>
          <a href="/#quote" className="btn-coral text-sm py-2 px-5">
            {lang === 'th' ? 'ขอใบเสนอราคา' : 'Get Quote'}
          </a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="chip mb-3">
            {lang === 'th' ? '🏭 บริการครบวงจร' : '🏭 Full Service'}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
            {lang === 'th' ? 'บริการของเรา' : 'Our Services'}
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            {lang === 'th'
              ? 'ครบทุกบริการในที่เดียว ตั้งแต่ออกแบบ ผลิต ตกแต่ง จนถึงส่งออก'
              : 'Everything under one roof — design, manufacture, decorate, and export.'}
          </p>
        </div>

        {/* Service grid */}
        <div className="space-y-5">
          {services.map((svc) => {
            const t = lang === 'th' ? svc.th : svc.en;
            const isOpen = active === svc.id;
            return (
              <div key={svc.id} id={svc.id}
                className={`cream-card border-2 transition-all duration-300 ${svc.color} ${isOpen ? 'shadow-lg' : ''}`}>
                {/* Header row — clickable */}
                <button className="w-full flex items-center gap-4 text-left"
                  onClick={() => setActive(isOpen ? null : svc.id)}>
                  <div className="text-4xl shrink-0">{svc.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${svc.tagColor}`}>{svc.tag}</span>
                    </div>
                    <h2 className="text-lg font-extrabold text-gray-900">{t.title}</h2>
                    <p className="text-sm text-gray-500 line-clamp-1">{t.desc}</p>
                  </div>
                  <svg className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Left: description + points */}
                      <div>
                        <p className="text-gray-600 leading-relaxed mb-5">{t.desc}</p>
                        <h3 className="font-extrabold text-gray-900 mb-3">
                          {lang === 'th' ? '✅ สิ่งที่รวมอยู่ในบริการ' : '✅ What\'s Included'}
                        </h3>
                        <ul className="space-y-2">
                          {t.points.map((pt, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <svg className="w-4 h-4 text-coral shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                              {pt}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6">
                          <a href="/#quote" className="btn-coral text-sm">
                            {lang === 'th' ? '📋 ขอใบเสนอราคาบริการนี้ →' : '📋 Request a Quote →'}
                          </a>
                        </div>
                      </div>

                      {/* Right: portfolio images */}
                      <div>
                        <h3 className="font-extrabold text-gray-900 mb-3">
                          {lang === 'th' ? '📸 ผลงานที่ผ่านมา' : '📸 Portfolio'}
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                          {svc.images.map((img, i) => (
                            <ImageSlot key={i} src={img} alt={`${t.title} ${i + 1}`}
                              className="aspect-square" emoji={svc.emojis[i] ?? '📸'} />
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">
                          {lang === 'th'
                            ? `วางรูปผลงานได้ที่ public/images/${svc.id}-1.jpg ถึง ${svc.id}-3.jpg`
                            : `Add photos at public/images/${svc.id}-1.jpg to ${svc.id}-3.jpg`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-coral rounded-4xl p-10 text-white text-center shadow-xl shadow-coral/20">
          <h2 className="text-3xl font-extrabold mb-3">
            {lang === 'th' ? 'พร้อมเริ่มต้นกับเราแล้วหรือยัง?' : 'Ready to Start With Us?'}
          </h2>
          <p className="text-white/80 mb-6">
            {lang === 'th'
              ? 'ทีมงานพร้อมให้คำปรึกษาและเสนอราคาภายใน 24 ชั่วโมง'
              : 'Our team is ready to consult and quote within 24 hours.'}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="/#quote" className="btn-white text-coral">
              {lang === 'th' ? '📋 ขอใบเสนอราคาฟรี' : '📋 Get Free Quote'}
            </a>
            <a href="https://line.me/R/ti/p/@861pkbnz" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#06C755] text-white font-bold py-3 px-7 rounded-full hover:opacity-90 transition">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M19.952 11.037C19.952 6.608 15.485 3 10 3S.048 6.608.048 11.037c0 4.002 3.547 7.354 8.337 7.984.325.07.767.214.879.49.1.25.066.641.032.894l-.142.854c-.043.25-.2.977.856.532 1.056-.444 5.7-3.356 7.778-5.744C19.166 14.316 19.952 12.745 19.952 11.037z"/>
              </svg>
              LINE @861pkbnz
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
