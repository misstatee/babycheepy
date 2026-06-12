'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import QuoteForm from './QuoteForm';

type Lang = 'th' | 'en';

/* ─────────────── SVG decorations ─────────────── */
function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 110" className={className} aria-hidden>
      <ellipse cx="100" cy="82" rx="82" ry="28" fill="white" opacity="0.85" />
      <ellipse cx="68"  cy="60" rx="40" ry="36" fill="white" opacity="0.85" />
      <ellipse cx="135" cy="62" rx="36" ry="30" fill="white" opacity="0.85" />
      <ellipse cx="100" cy="50" rx="46" ry="40" fill="white" opacity="0.85" />
    </svg>
  );
}

function Rainbow({ className }: { className?: string }) {
  const arcs = [
    { r: 260, color: '#FF9AA2' }, { r: 238, color: '#FFB347' },
    { r: 216, color: '#FDFD96' }, { r: 194, color: '#9DE8A0' },
    { r: 172, color: '#87CEEB' }, { r: 150, color: '#C9B1F3' },
  ];
  return (
    <svg viewBox="0 0 600 280" className={className} aria-hidden>
      {arcs.map((a, i) => (
        <path key={i}
          d={`M ${300 - a.r} 280 A ${a.r} ${a.r} 0 0 1 ${300 + a.r} 280`}
          fill="none" stroke={a.color} strokeWidth="16" opacity="0.65" />
      ))}
    </svg>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

/* ─────────────── translations ─────────────── */
const i18n = {
  th: {
    langBtn: 'EN',
    nav: { about: 'เกี่ยวกับเรา', services: 'บริการ', portfolio: 'ผลงาน', pricing: 'ราคา', contact: 'ติดต่อ', quote: 'ขอใบเสนอราคา',
      serviceItems: [
        { label: 'รับผลิต OEM / ODM', href: '#services' },
        { label: 'คอลเลคชั่นครอบครัว & สัตว์เลี้ยง', href: '#services' },
        { label: 'พัฒนาแพทเทิร์น & ตัวอย่าง', href: '#services' },
        { label: 'จัดหาผ้า & พิมพ์ลาย', href: '#services' },
        { label: 'ปัก / สกรีน / Decoration', href: '#services' },
        { label: 'ขายส่ง ODM', href: '#pricing' },
      ],
    },
    hero: {
      badge: '🏅 ประสบการณ์กว่า 40 ปี · CBME Shanghai · OEKO-TEX Certified',
      h1: ['YOUR ONE-STOP', 'BABYWEAR', 'SOLUTION'],
      tagline: 'Cute, Comfy, Cheepy! 🐣',
      desc: 'โรงงานรับผลิตเสื้อผ้าเด็กครบวงจร — OEM / ODM\nคอลเลคชั่นครอบครัวและชุดสัตว์เลี้ยง ผลิตด้วยมาตรฐานสากล',
      cta1: 'ขอใบเสนอราคาฟรี', cta2: 'ดูบริการทั้งหมด',
    },
    stats: [
      { num: '40+', label: 'ปีประสบการณ์' },
      { num: 'OEM', label: 'ในและต่างประเทศ' },
      { num: 'CBME', label: 'Shanghai' },
      { num: '3', label: 'มาตรฐานสากล' },
    ],
    about: {
      chip: 'เกี่ยวกับเรา',
      h2: ['จากโรงงานของเรา', 'สู่ตู้เสื้อผ้าลูกน้อยของคุณ'],
      p1: 'เลิฟลี่มัมมี่ ไทยแลนด์ (Baby Cheepy Studio) มีจุดเริ่มต้นจากคุณแม่ผู้มีประสบการณ์ในวงการการ์เม้นท์มาเกือบ 40 ปี เริ่มต้นจากพนักงานตัดเย็บจนก่อตั้งโรงงานผลิตเสื้อผ้าเด็กที่ส่งให้ทั้งแบรนด์ไทยชั้นนำและตลาดต่างประเทศ',
      p2: 'วันนี้เราสานต่อธุรกิจด้วยการผสมผสานความชำนาญด้านการผลิตเข้ากับเทรนด์ตลาดยุคใหม่ — คอลเลคชั่นครอบครัวพ่อแม่ลูก และชุดสัตว์เลี้ยง',
      badges: ['🏆 แบรนด์ไทยชั้นนำ', '🌏 ส่งออกต่างประเทศ', '🌱 Eco-Friendly'],
    },
    services: {
      chip: 'บริการครบวงจร', h2: ['บริการของเรา', 'End-to-End Manufacturing'],
      sub: 'ครบทุกขั้นตอน ตั้งแต่ไอเดียจนถึงมือลูกค้าปลายทาง',
      cta: 'ขอใบเสนอราคา →',
    },
    process: {
      chip: 'OEM Process', h2: 'ขั้นตอนการผลิต OEM/ODM',
      sub: 'กระบวนการที่โปร่งใส ดูแลทุกขั้นตอนโดยทีมผู้เชี่ยวชาญ',
      steps: [
        { icon: '💬', title: 'ปรึกษา', desc: 'รับฟังความต้องการและให้คำแนะนำ' },
        { icon: '✏️', title: 'ออกแบบ', desc: 'ร่วมออกแบบและกำหนดรายละเอียด' },
        { icon: '🧶', title: 'เลือกผ้า', desc: 'คัดสรรวัตถุดิบที่เหมาะสม' },
        { icon: '📐', title: 'แพทเทิร์น', desc: 'พัฒนาแพทเทิร์นและทำตัวอย่าง' },
        { icon: '🏭', title: 'ผลิต', desc: 'ผลิตด้วยมาตรฐานสากล' },
        { icon: '🔍', title: 'ตรวจสอบ', desc: 'QC ทุกชิ้นก่อนส่งมอบ' },
        { icon: '📦', title: 'ส่งมอบ', desc: 'ตรงเวลา ถึงมือลูกค้า' },
      ],
    },
    categories: {
      chip: 'Product Categories', h2: 'หมวดหมู่สินค้า',
      sub: 'รับผลิตเสื้อผ้าเด็กและครอบครัวหลากหลายประเภท',
    },
    fabrics: {
      chip: 'Fabric Selection', h2: 'วัตถุดิบที่เราใช้',
      sub: 'คัดสรรผ้าคุณภาพสูง ปลอดภัยสำหรับทารกและเด็ก',
    },
    gallery: {
      chip: 'Factory Gallery', h2: 'ภายในโรงงานของเรา',
      sub: 'ความเป็นมืออาชีพและความใส่ใจในทุกขั้นตอนการผลิต',
    },
    standards: {
      chip: 'Certified Quality', h2: 'มาตรฐานการผลิต',
      sub: 'ผลิตด้วยมาตรฐานระดับสากล ปลอดภัยสำหรับทารกและเด็ก',
    },
    testimonials: {
      chip: 'Customer Reviews', h2: 'เสียงจากลูกค้าของเรา',
      sub: 'ความไว้วางใจจากลูกค้าคือสิ่งที่เราภูมิใจที่สุด',
    },
    pricing: {
      chip: 'ราคา & แพ็กเกจ', h2: 'เลือกแผนที่เหมาะกับคุณ',
      sub: 'ยิ่งสั่งมาก ราคายิ่งคุ้มค่า — ติดต่อสอบถามราคาจริงได้เลยค่ะ',
      popular: 'ยอดนิยม',
      note: '* ราคาจริงขึ้นอยู่กับประเภทสินค้า วัสดุ และจำนวนที่สั่ง',
    },
    quote: {
      chip: 'ขอใบเสนอราคา', h2: ['เริ่มต้นสร้างแบรนด์', 'ของคุณกับเรา'],
      sub: 'กรอกข้อมูลด้านล่าง ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง',
    },
    footer: {
      tagline: 'โรงงานรับผลิตเสื้อผ้าเด็กครบวงจร ประสบการณ์กว่า 40 ปี',
      services: 'บริการ', contact: 'ติดต่อเรา', address: 'ที่อยู่:',
      rights: '© 2025 Global Apparel Kids (Baby Cheepy Studio). All rights reserved.',
    },
  },
  en: {
    langBtn: 'TH',
    nav: { about: 'About', services: 'Services', portfolio: 'Portfolio', pricing: 'Pricing', contact: 'Contact', quote: 'Get Quote',
      serviceItems: [
        { label: 'OEM / ODM Production', href: '#services' },
        { label: 'Family & Pet Collection', href: '#services' },
        { label: 'Pattern Development', href: '#services' },
        { label: 'Fabric Sourcing & Printing', href: '#services' },
        { label: 'Embroidery & Decoration', href: '#services' },
        { label: 'ODM Wholesale', href: '#pricing' },
      ],
    },
    hero: {
      badge: '🏅 40+ Years Experience · CBME Shanghai · OEKO-TEX Certified',
      h1: ['YOUR ONE-STOP', 'BABYWEAR', 'SOLUTION'],
      tagline: 'Cute, Comfy, Cheepy! 🐣',
      desc: "Full-service children's clothing manufacturer — OEM / ODM\nFamily collections and pet outfits, made to international standards.",
      cta1: 'Get Free Quote', cta2: 'View Services',
    },
    stats: [
      { num: '40+', label: 'Years Experience' },
      { num: 'OEM', label: 'Local & Export' },
      { num: 'CBME', label: 'Shanghai' },
      { num: '3', label: 'Certifications' },
    ],
    about: {
      chip: 'About Us',
      h2: ['From Our Factory', "to Your Baby's Closet"],
      p1: "Lovely Mommy Thailand (Baby Cheepy Studio) was founded by a passionate woman with nearly 40 years in the garment industry. From textile worker to factory owner, we supply high-quality baby and kidswear to leading Thai brands and international markets.",
      p2: "Today we blend decades of craftsmanship with modern trends — offering family matching collections and pet outfits to meet the evolving demands of today's parents.",
      badges: ['🏆 Trusted Thai Brands', '🌏 International Export', '🌱 Eco-Friendly'],
    },
    services: {
      chip: 'Full-Service', h2: ['Our Services', 'End-to-End Manufacturing'],
      sub: 'From concept to delivery — we handle every step.',
      cta: 'Request a Quote →',
    },
    process: {
      chip: 'OEM Process', h2: 'Our OEM/ODM Process',
      sub: 'A transparent, expert-managed process from inquiry to delivery.',
      steps: [
        { icon: '💬', title: 'Consult', desc: 'Understand your needs and advise' },
        { icon: '✏️', title: 'Design', desc: 'Collaborate on design details' },
        { icon: '🧶', title: 'Fabric', desc: 'Source the right materials' },
        { icon: '📐', title: 'Pattern', desc: 'Develop patterns and samples' },
        { icon: '🏭', title: 'Produce', desc: 'Manufacture to international standards' },
        { icon: '🔍', title: 'QC', desc: 'Quality check every piece' },
        { icon: '📦', title: 'Deliver', desc: 'On-time delivery to your door' },
      ],
    },
    categories: {
      chip: 'Product Categories', h2: 'Product Categories',
      sub: 'We manufacture a wide range of clothing for children and families.',
    },
    fabrics: {
      chip: 'Fabric Selection', h2: 'Our Fabrics',
      sub: 'Premium fabrics selected for safety, comfort, and quality.',
    },
    gallery: {
      chip: 'Factory Gallery', h2: 'Inside Our Factory',
      sub: 'Professionalism and care in every step of production.',
    },
    standards: {
      chip: 'Certified Quality', h2: 'Production Standards',
      sub: 'International-grade production — safe for infants and children.',
    },
    testimonials: {
      chip: 'Customer Reviews', h2: 'What Our Clients Say',
      sub: 'The trust of our clients is what we are most proud of.',
    },
    pricing: {
      chip: 'Pricing & Packages', h2: 'Choose Your Plan',
      sub: 'Better pricing for larger orders — contact us for exact quotes.',
      popular: 'Most Popular',
      note: '* Actual pricing depends on product type, materials, and order volume.',
    },
    quote: {
      chip: 'Request a Quote', h2: ['Start Building', 'Your Brand With Us'],
      sub: 'Fill in the form below and our team will contact you within 24 hours.',
    },
    footer: {
      tagline: "Full-service children's apparel manufacturer with 40+ years of experience.",
      services: 'Services', contact: 'Contact Us', address: 'Address:',
      rights: '© 2025 Global Apparel Kids (Baby Cheepy Studio). All rights reserved.',
    },
  },
} as const;

/* ─────────────── static data ─────────────── */
const services = [
  { icon: '🧵', color: 'border-pastel-pink bg-pastel-pink-light',   tag: 'หลัก',
    th: { title: 'รับผลิต OEM / ODM',                  desc: 'รับผลิตตามแบบลูกค้า (OEM) หรือออกแบบให้ใหม่ (ODM) ครบวงจรตั้งแต่ผ้าจนถึงบรรจุภัณฑ์' },
    en: { title: 'OEM / ODM Production',                desc: 'Produce to your design (OEM) or let us design for you (ODM). Full service from fabric to packaging.' } },
  { icon: '👨‍👩‍👧', color: 'border-pastel-lavender bg-pastel-lavender/30', tag: '🆕 ใหม่',
    th: { title: 'คอลเลคชั่นครอบครัว & สัตว์เลี้ยง',  desc: 'ชุดแมตช์ครอบครัวพ่อแม่ลูก และชุดสัตว์เลี้ยง ตอบสนองเทรนด์ครอบครัวยุคใหม่' },
    en: { title: 'Family & Pet Collection',             desc: 'Matching family outfits for parents, children, and pets — the hottest modern family trend.' } },
  { icon: '📐', color: 'border-pastel-blue bg-pastel-blue-light',    tag: 'บริการ',
    th: { title: 'พัฒนาแพทเทิร์น & ตัวอย่าง',          desc: 'ออกแบบแพทเทิร์น เกรดไซส์ และทำตัวอย่างสินค้าก่อนผลิตจริง เพื่อให้ได้ผลลัพธ์ที่ตรงใจ' },
    en: { title: 'Pattern Development & Sampling',      desc: 'Pattern design, size grading, and sample garments before full production.' } },
  { icon: '🎨', color: 'border-pastel-yellow bg-pastel-yellow/40',   tag: 'บริการ',
    th: { title: 'จัดหาผ้า & พิมพ์ลาย',                desc: 'คัดสรรผ้าคุณภาพสูงรวมถึงผ้านวัตกรรม พร้อมพิมพ์ลายผ้าทั้ง Knit และ Woven' },
    en: { title: 'Fabric Sourcing & Printing',          desc: 'Premium fabric selection including innovative options. Printing on both knit and woven.' } },
  { icon: '✨', color: 'border-pastel-peach bg-pastel-peach/30',     tag: 'บริการ',
    th: { title: 'ปักและ Decoration',                   desc: 'ปักดิจิทัล 3D สกรีนหลายแบบ พิมพ์ดิจิทัล และตราสินค้าเฉพาะ เพิ่มความโดดเด่น' },
    en: { title: 'Embroidery & Decoration',             desc: '3D embroidery, screen print styles, digital printing, and custom private labels.' } },
  { icon: '🏷️', color: 'border-pastel-mint bg-pastel-mint/30',      tag: 'ODM',
    th: { title: 'ขายส่ง ODM ในประเทศ',                desc: 'จำหน่ายขายส่งเสื้อผ้าเด็กในราคาโรงงาน ภายใต้แบรนด์ Baby Cheepy คุณภาพสูง' },
    en: { title: 'Domestic ODM Wholesale',              desc: 'Wholesale Baby Cheepy brand items at factory prices — high quality, accessible pricing.' } },
];

const categories = [
  { emoji: '👗', labelTh: 'เสื้อผ้าเด็กทั่วไป', labelEn: 'Kids Clothing',      image: '/images/cat-kids.jpg',      bg: 'from-pastel-pink-light to-pastel-pink-mid' },
  { emoji: '🩱', labelTh: 'ชุดว่ายน้ำ',         labelEn: 'Swimwear',           image: '/images/cat-swimwear.jpg',  bg: 'from-pastel-blue-light to-pastel-blue' },
  { emoji: '👨‍👩‍👧', labelTh: 'ชุดครอบครัว',      labelEn: 'Family Collection',  image: '/images/cat-family.jpg',   bg: 'from-pastel-lavender to-purple-100' },
  { emoji: '🐾', labelTh: 'ชุดสัตว์เลี้ยง',    labelEn: 'Pet Outfits',        image: '/images/cat-pets.jpg',     bg: 'from-pastel-peach to-orange-100' },
  { emoji: '🎩', labelTh: 'อุปกรณ์เสริม',       labelEn: 'Accessories',        image: '/images/cat-accessories.jpg', bg: 'from-pastel-mint to-green-100' },
  { emoji: '🥻', labelTh: 'ชุดพิธีการ',         labelEn: 'Formal / Party',     image: '/images/cat-formal.jpg',   bg: 'from-pastel-yellow to-yellow-100' },
];

const fabrics = [
  { icon: '🌿', name: 'Cotton 100%', nameTh: 'ฝ้าย 100%',     descTh: 'นุ่ม ระบายอากาศดี เหมาะสำหรับทารกแรกเกิด', descEn: 'Soft and breathable — perfect for newborns', color: 'bg-green-50 border-green-200' },
  { icon: '🧶', name: 'Interlock',   nameTh: 'อินเตอร์ล็อค',   descTh: 'ยืดหยุ่นสูง ไม่ยับง่าย เหมาะสำหรับทุกวัย',  descEn: 'Highly elastic and wrinkle-resistant',       color: 'bg-blue-50 border-blue-200' },
  { icon: '🪢', name: 'Jersey',      nameTh: 'เจอร์ซี่',        descTh: 'เนื้อผ้านุ่ม ยืดตัวดี ใส่สบาย',              descEn: 'Soft knit fabric, great stretch and comfort', color: 'bg-pink-50 border-pink-200' },
  { icon: '☁️', name: 'Fleece',      nameTh: 'ฟลีซ',           descTh: 'อุ่น นุ่มพิเศษ เหมาะสำหรับอากาศเย็น',        descEn: 'Warm and ultra-soft for cooler weather',      color: 'bg-purple-50 border-purple-200' },
  { icon: '🎋', name: 'Bamboo',      nameTh: 'ไผ่ (Bamboo)',    descTh: 'ผ้า Eco-friendly ระบายอากาศ ต้านเชื้อแบคทีเรีย', descEn: 'Eco-friendly, antibacterial and breathable', color: 'bg-emerald-50 border-emerald-200' },
  { icon: '♻️', name: 'Recycled',    nameTh: 'รีไซเคิล',       descTh: 'ผ้าจากวัตถุดิบรีไซเคิล รองรับ Circular Economy', descEn: 'Recycled materials supporting circular economy', color: 'bg-teal-50 border-teal-200' },
];

const gallery = [
  { label: 'โรงงานตัดเย็บ', labelEn: 'Sewing Floor',     image: '/images/gallery-1.jpg', span: 'col-span-2 row-span-2' },
  { label: 'การตรวจสอบคุณภาพ', labelEn: 'Quality Control', image: '/images/gallery-2.jpg', span: '' },
  { label: 'แผนกพิมพ์ผ้า',  labelEn: 'Fabric Printing',  image: '/images/gallery-3.jpg', span: '' },
  { label: 'ห้องแพทเทิร์น', labelEn: 'Pattern Room',     image: '/images/gallery-4.jpg', span: '' },
  { label: 'โชว์รูมสินค้า',  labelEn: 'Showroom',         image: '/images/gallery-5.jpg', span: '' },
];

const standards = [
  { icon: '🛡️', title: 'OEKO-TEX® ECO PASSPORT', color: 'border-t-4 border-pink-400',
    th: 'ได้รับการรับรองความปลอดภัยของสีย้อมและสารเคมี ปลอดภัยสำหรับทารกและเด็ก',
    en: 'Certified safe dyes and chemicals — confirmed safe for infants and children.' },
  { icon: '🌿', title: 'COTTON USA', color: 'border-t-4 border-blue-400',
    th: 'ใช้ผ้าฝ้ายอเมริกาคุณภาพสูง 100% — นุ่ม ระบายอากาศดี เหมาะสำหรับผิวบอบบาง',
    en: 'Premium 100% US cotton — soft, breathable, perfect for delicate baby skin.' },
  { icon: '©️', title: '(C) Character IP', color: 'border-t-4 border-purple-400',
    th: 'ได้รับสิทธิ์ใช้ลิขสิทธิ์ตัวการ์ตูน สามารถผลิตเสื้อผ้าที่มีตัวละครลิขสิทธิ์ถูกกฎหมาย',
    en: 'Licensed character IP rights — legally produce garments featuring popular characters.' },
];

const testimonials = [
  { name: 'คุณนงนุช พ่วงสุข', role: 'เจ้าของแบรนด์ "Lulu Kids"', nameEn: 'Nongnuch P.', roleEn: 'Owner — Lulu Kids Brand',
    textTh: 'ทำงานร่วมกันมา 2 ปีแล้วค่ะ ประทับใจมากตั้งแต่ขั้นตอนแพทเทิร์นไปจนถึงการส่งสินค้า คุณภาพสม่ำเสมอ ทีมงานใส่ใจมากๆ',
    textEn: "We've worked together for 2 years. Impressed from the pattern stage to delivery — consistently great quality and a very attentive team.", stars: 5 },
  { name: 'คุณอาร์ต มีทรัพย์', role: 'ร้าน Little Dream Shop', nameEn: 'Art M.', roleEn: 'Little Dream Shop',
    textTh: 'สั่งขายส่งมาหลายครั้งแล้วครับ ราคาโรงงานจริงๆ สินค้าน่ารักมาก ลูกค้าของผมชอบทุกแบบเลย แนะนำเลยครับ',
    textEn: "Ordered wholesale multiple times. Real factory pricing, very cute designs. My customers love every style. Highly recommend!", stars: 5 },
  { name: 'Ms. Sarah Lin', role: 'Brand Owner, Singapore', nameEn: 'Sarah Lin', roleEn: 'Brand Owner, Singapore',
    textTh: 'Professional OEM service with excellent quality control. Fast turnaround and very responsive. Will continue to work together!',
    textEn: 'Professional OEM service with excellent quality control. Fast turnaround and very responsive. Will continue to work together!', stars: 5 },
];

const pricingTiers = {
  th: [
    { name: 'ขายปลีก', sub: 'Retail', emoji: '🛍️', price: 'ราคาป้าย', unit: 'ไม่มีขั้นต่ำ', highlight: false,
      features: ['ไม่มีขั้นต่ำ', 'รับสินค้าได้ทันที', 'เสื้อผ้า Baby Cheepy', 'คุณภาพโรงงาน'], cta: 'ติดต่อสั่งปลีก' },
    { name: 'ขายส่ง', sub: 'Wholesale', emoji: '📦', price: 'ราคาพิเศษ', unit: 'ขั้นต่ำ 12 ชิ้น/แบบ', highlight: true,
      features: ['ส่วนลดพิเศษ', 'ขั้นต่ำ 12 ชิ้นต่อแบบ', 'เลือกได้หลายแบบ', 'จัดส่งทั่วไทย'], cta: 'สอบถามราคาส่ง' },
    { name: 'OEM / ODM', sub: 'Custom Brand', emoji: '🎨', price: 'ราคาโรงงาน', unit: 'ขั้นต่ำ 200 ชิ้น/แบบ', highlight: false,
      features: ['ออกแบบเฉพาะแบรนด์', 'แพทเทิร์น & ตัวอย่างฟรี', 'เลือกผ้าได้เอง', 'ใส่แบรนด์ลูกค้า'], cta: 'ขอใบเสนอราคา OEM' },
  ],
  en: [
    { name: 'Retail', sub: 'ขายปลีก', emoji: '🛍️', price: 'Full Price', unit: 'No minimum', highlight: false,
      features: ['No minimum order', 'Ready stock', 'Baby Cheepy brand', 'Factory quality'], cta: 'Shop Retail' },
    { name: 'Wholesale', sub: 'ขายส่ง', emoji: '📦', price: 'Special Price', unit: 'Min. 12 pcs/style', highlight: true,
      features: ['Volume discounts', 'Min. 12 pcs per style', 'Multiple styles OK', 'Nationwide delivery'], cta: 'Wholesale Inquiry' },
    { name: 'OEM / ODM', sub: 'Custom Brand', emoji: '🎨', price: 'Factory Price', unit: 'Min. 200 pcs/style', highlight: false,
      features: ['Custom brand design', 'Free pattern & sample', 'Fabric selection', 'Private label'], cta: 'Get OEM Quote' },
  ],
};

/* ─────────────── ImageSlot ─────────────── */
function ImageSlot({ src, alt, className, hint }: { src: string; alt: string; className?: string; hint?: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      {!err && (
        <Image src={src} alt={alt} fill className="object-cover"
          onError={() => setErr(true)} />
      )}
      {err && (
        <div className="img-slot text-center px-4">
          <span className="text-3xl">📸</span>
          <p className="text-xs text-gray-400 font-medium">{hint ?? src.replace('/images/', 'public/images/')}</p>
        </div>
      )}
    </div>
  );
}

/* ─────────────── NavBar ─────────────── */
function NavBar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const t = i18n[lang];
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-md border-b border-pink-100'}`}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-1.5 shrink-0">
          <span className="text-lg font-extrabold text-gray-900">Baby</span>
          <span className="text-lg font-extrabold text-brand-pink">Cheepy</span>
          <span className="hidden sm:block text-[11px] text-gray-400 ml-1 leading-tight">Lovely Mommy TH<br/>Global Apparel Kids</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5 text-sm font-semibold text-gray-600">
          <a href="#about"     className="px-3 py-2 rounded-xl hover:text-brand-pink hover:bg-pink-50 transition-colors">{t.nav.about}</a>
          <div className="dropdown-wrap">
            <button className="px-3 py-2 rounded-xl hover:text-brand-pink hover:bg-pink-50 transition-colors flex items-center gap-1">
              {t.nav.services}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="dropdown-menu">
              {t.nav.serviceItems.map((s, i) => (
                <a key={i} href={s.href}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-pink-50 hover:text-brand-pink transition-colors">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <a href="#portfolio"  className="px-3 py-2 rounded-xl hover:text-brand-pink hover:bg-pink-50 transition-colors">{t.nav.portfolio}</a>
          <a href="#pricing"    className="px-3 py-2 rounded-xl hover:text-brand-pink hover:bg-pink-50 transition-colors">{t.nav.pricing}</a>
          <a href="#contact"    className="px-3 py-2 rounded-xl hover:text-brand-pink hover:bg-pink-50 transition-colors">{t.nav.contact}</a>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
            className="hidden md:flex text-xs font-bold text-gray-500 hover:text-brand-pink border border-gray-200 hover:border-pink-300 rounded-full px-2.5 py-1 transition-colors">
            {t.langBtn}
          </button>
          <a href="#quote" className="btn-pink text-sm py-2 px-5">{t.nav.quote}</a>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-pink-100 px-4 pb-4 space-y-1 text-sm font-semibold">
          {['#about','#portfolio','#pricing','#contact'].map((href, i) => {
            const labels = [t.nav.about, t.nav.portfolio, t.nav.pricing, t.nav.contact];
            return (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700">{labels[i]}</a>
            );
          })}
          <button onClick={() => { setLang(lang === 'th' ? 'en' : 'th'); setMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-500">
            Switch to {lang === 'th' ? 'English' : 'ภาษาไทย'}
          </button>
        </div>
      )}
    </nav>
  );
}

/* ─────────────── Main ─────────────── */
export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('th');
  const t = i18n[lang];

  return (
    <div className="font-prompt">
      <NavBar lang={lang} setLang={setLang} />

      {/* ══ HERO ══ */}
      <section id="hero" className="relative min-h-screen flex items-center pt-16 overflow-hidden
        bg-gradient-to-br from-pastel-pink-light via-white to-pastel-blue-light">

        {/* Rainbow background */}
        <Rainbow className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl opacity-60 pointer-events-none" />

        {/* Floating clouds */}
        <Cloud className="absolute top-16 -left-10 w-52 text-white animate-float opacity-80 pointer-events-none" />
        <Cloud className="absolute top-24 right-0 w-44 text-white animate-float-slow opacity-70 pointer-events-none" />
        <Cloud className="absolute bottom-24 left-1/4 w-36 text-white animate-float opacity-50 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <div className="chip mb-5">{t.hero.badge}</div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-none mb-4">
              {t.hero.h1[0]}<br />
              <span className="text-brand-pink italic">{t.hero.h1[1]}</span><br />
              {t.hero.h1[2]}
            </h1>
            <p className="text-xl font-bold text-pink-400 mb-2">{t.hero.tagline}</p>
            <p className="text-gray-600 mb-8 whitespace-pre-line leading-relaxed">{t.hero.desc}</p>
            <div className="flex flex-wrap gap-3">
              <a href="#quote" className="btn-pink shadow-pink-200 shadow-lg">{t.hero.cta1}</a>
              <a href="#services" className="btn-outline-pink">{t.hero.cta2}</a>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative">
            <div className="relative rounded-4xl overflow-hidden shadow-2xl aspect-[4/3]
              ring-4 ring-white ring-offset-4 ring-offset-pastel-pink-light">
              <ImageSlot src="/images/hero.jpg" alt="Baby Cheepy Products"
                hint={lang === 'th' ? 'วางรูปสินค้า/โรงงาน (1200×900px)' : 'Place product/factory photo here'} />
            </div>
            {/* Floating stat chips */}
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl px-5 py-3 border border-pink-100">
              <div className="text-2xl font-extrabold text-brand-pink">40+</div>
              <div className="text-xs text-gray-500">{lang === 'th' ? 'ปีประสบการณ์' : 'Years'}</div>
            </div>
            <div className="absolute -top-5 -right-5 bg-brand-pink text-white rounded-2xl shadow-xl px-5 py-3">
              <div className="text-lg font-extrabold">OEM/ODM</div>
              <div className="text-xs opacity-80">CBME Shanghai</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-pink-300 text-xs animate-bounce">
          <span>{lang === 'th' ? 'เลื่อนดูข้อมูล' : 'Scroll down'}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <section className="bg-white border-y border-pink-100 py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {t.stats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-extrabold text-brand-pink">{s.num}</div>
              <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section id="about" className="py-20 bg-pastel-pink-light">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <div className="chip mb-4">{t.about.chip}</div>
            <h2 className="section-title mb-5">
              {t.about.h2[0]}<br />
              <span className="text-brand-pink italic">{t.about.h2[1]}</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">{t.about.p1}</p>
            <p className="text-gray-600 leading-relaxed mb-6">{t.about.p2}</p>
            <div className="flex flex-wrap gap-2">
              {t.about.badges.map((b, i) => (
                <span key={i} className="bg-white border border-pink-200 text-gray-700 text-sm font-semibold rounded-full px-4 py-1.5 shadow-sm">{b}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 relative aspect-video rounded-3xl overflow-hidden shadow-lg ring-2 ring-white">
              <ImageSlot src="/images/about.jpg" alt="Our Factory"
                hint={lang === 'th' ? 'รูปโรงงาน / ทีมงาน' : 'Factory / team photo'} />
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md">
              <ImageSlot src="/images/about-2.jpg" alt="Sewing" hint="public/images/about-2.jpg" />
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md">
              <ImageSlot src="/images/about-3.jpg" alt="Products" hint="public/images/about-3.jpg" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="chip mb-4">{t.services.chip}</div>
            <h2 className="section-title">{t.services.h2[0]}<br />
              <span className="text-brand-pink">{t.services.h2[1]}</span>
            </h2>
            <p className="section-sub max-w-xl mx-auto">{t.services.sub}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <div key={i} className={`pastel-card border-2 ${s.color}`}>
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="chip-blue text-[11px] mb-2">{s.tag}</div>
                <h3 className="font-extrabold text-gray-900 mb-2">{lang === 'th' ? s.th.title : s.en.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{lang === 'th' ? s.th.desc : s.en.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="#quote" className="btn-pink">{t.services.cta}</a>
          </div>
        </div>
      </section>

      {/* ══ OEM PROCESS TIMELINE ══ */}
      <section className="py-20 bg-gradient-to-br from-pastel-blue-light to-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="chip-blue mb-4">{t.process.chip}</div>
            <h2 className="section-title">{t.process.h2}</h2>
            <p className="section-sub max-w-xl mx-auto">{t.process.sub}</p>
          </div>
          {/* Timeline */}
          <div className="relative">
            {/* horizontal line for desktop */}
            <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-pastel-pink via-pastel-blue to-pastel-mint" />
            <div className="grid grid-cols-2 md:grid-cols-7 gap-6">
              {t.process.steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center relative">
                  <div className="relative z-10 w-20 h-20 rounded-full bg-white shadow-lg border-2 border-pink-200
                    flex flex-col items-center justify-center mb-3 hover:scale-110 transition-transform">
                    <span className="text-2xl">{step.icon}</span>
                    <span className="text-[10px] font-bold text-brand-pink mt-0.5">{i + 1}</span>
                  </div>
                  <h4 className="font-extrabold text-gray-900 text-sm mb-1">{step.title}</h4>
                  <p className="text-xs text-gray-500 leading-snug">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-12">
            <a href="#quote" className="btn-pink">{lang === 'th' ? 'เริ่มต้นกับเราเลย →' : 'Start Your Project →'}</a>
          </div>
        </div>
      </section>

      {/* ══ PRODUCT CATEGORIES ══ */}
      <section id="portfolio" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="chip mb-4">{t.categories.chip}</div>
            <h2 className="section-title">{t.categories.h2}</h2>
            <p className="section-sub">{t.categories.sub}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {categories.map((cat, i) => (
              <div key={i} className="group relative overflow-hidden rounded-3xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
                <div className={`aspect-square bg-gradient-to-br ${cat.bg} relative`}>
                  <ImageSlot src={cat.image} alt={lang === 'th' ? cat.labelTh : cat.labelEn}
                    hint={cat.image.replace('/images/', 'public/images/')} />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4
                    translate-y-2 group-hover:translate-y-0 transition-transform">
                    <div className="text-white font-extrabold text-base">{lang === 'th' ? cat.labelTh : cat.labelEn}</div>
                    <div className="text-white/70 text-xs">{lang === 'th' ? cat.labelEn : cat.labelTh}</div>
                  </div>
                  {/* Fallback big emoji shown only when no image */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-[.no-img]:opacity-100">
                    <span className="text-7xl">{cat.emoji}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FABRIC SELECTION ══ */}
      <section className="py-20 bg-pastel-pink-light">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="chip mb-4">{t.fabrics.chip}</div>
            <h2 className="section-title">{t.fabrics.h2}</h2>
            <p className="section-sub">{t.fabrics.sub}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {fabrics.map((f, i) => (
              <div key={i} className={`pastel-card border-2 ${f.color}`}>
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-extrabold text-gray-900 mb-0.5">{f.name}</h3>
                <div className="text-xs text-gray-400 font-semibold mb-2">{f.nameTh}</div>
                <p className="text-sm text-gray-600 leading-relaxed">{lang === 'th' ? f.descTh : f.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FACTORY GALLERY ══ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="chip mb-4">{t.gallery.chip}</div>
            <h2 className="section-title">{t.gallery.h2}</h2>
            <p className="section-sub">{t.gallery.sub}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
            {gallery.map((g, i) => (
              <div key={i} className={`relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow ${g.span}`}>
                <ImageSlot src={g.image} alt={lang === 'th' ? g.label : g.labelEn}
                  hint={g.image.replace('/images/', 'public/images/')} />
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {lang === 'th' ? g.label : g.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STANDARDS ══ */}
      <section id="standards" className="py-20 bg-pastel-blue-light">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="chip-blue mb-4">{t.standards.chip}</div>
            <h2 className="section-title">{t.standards.h2}</h2>
            <p className="section-sub">{t.standards.sub}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {standards.map((s, i) => (
              <div key={i} className={`pastel-card text-center ${s.color}`}>
                <div className="text-5xl mb-4">{s.icon}</div>
                <h3 className="font-extrabold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{lang === 'th' ? s.th : s.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="py-20 bg-gradient-to-br from-pastel-pink-light via-white to-pastel-lavender/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="chip mb-4">{t.testimonials.chip}</div>
            <h2 className="section-title">{t.testimonials.h2}</h2>
            <p className="section-sub">{t.testimonials.sub}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((r, i) => (
              <div key={i} className="pastel-card relative">
                {/* Quote mark */}
                <div className="text-5xl text-pink-100 font-serif leading-none mb-2">&ldquo;</div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">
                  {lang === 'th' ? r.textTh : r.textEn}
                </p>
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
                <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pastel-pink to-pastel-blue flex items-center justify-center text-sm font-bold text-white">
                    {(lang === 'th' ? r.name : r.nameEn).charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-900">{lang === 'th' ? r.name : r.nameEn}</div>
                    <div className="text-xs text-gray-400">{lang === 'th' ? r.role : r.roleEn}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="chip mb-4">{t.pricing.chip}</div>
            <h2 className="section-title">{t.pricing.h2}</h2>
            <p className="section-sub">{t.pricing.sub}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {pricingTiers[lang].map((tier, i) => (
              <div key={i} className={`relative rounded-3xl p-7 flex flex-col border-2 transition-all
                ${tier.highlight
                  ? 'bg-gradient-to-br from-brand-pink to-pink-700 border-brand-pink text-white shadow-2xl shadow-pink-200 scale-105'
                  : 'bg-white border-pink-100 hover:border-pink-300 hover:shadow-lg'}`}>
                {tier.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs font-extrabold px-4 py-1 rounded-full shadow">
                    ⭐ {t.pricing.popular}
                  </div>
                )}
                <div className="text-3xl mb-3">{tier.emoji}</div>
                <div className={`text-xs font-semibold mb-1 ${tier.highlight ? 'text-pink-200' : 'text-gray-400'}`}>{tier.sub}</div>
                <h3 className={`text-xl font-extrabold mb-1 ${tier.highlight ? 'text-white' : 'text-gray-900'}`}>{tier.name}</h3>
                <div className={`text-2xl font-extrabold mb-1 ${tier.highlight ? 'text-yellow-300' : 'text-brand-pink'}`}>{tier.price}</div>
                <div className={`text-xs mb-6 ${tier.highlight ? 'text-pink-200' : 'text-gray-400'}`}>{tier.unit || ' '}</div>
                <ul className="space-y-2 mb-7 flex-1">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <svg className={`w-4 h-4 shrink-0 ${tier.highlight ? 'text-yellow-300' : 'text-brand-pink'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={tier.highlight ? 'text-white' : 'text-gray-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="#quote"
                  className={`w-full text-center py-3 rounded-2xl font-bold text-sm transition-all
                    ${tier.highlight ? 'bg-white text-brand-pink hover:bg-pink-50' : 'bg-brand-pink text-white hover:bg-brand-pink-dark'}`}>
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">{t.pricing.note}</p>
        </div>
      </section>

      {/* ══ QUOTE FORM ══ */}
      <section id="quote" className="py-20 bg-pastel-pink-light">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="chip mb-4">{t.quote.chip}</div>
            <h2 className="section-title">
              {t.quote.h2[0]}<br />
              <span className="text-brand-pink">{t.quote.h2[1]}</span>
            </h2>
            <p className="section-sub mt-3">{t.quote.sub}</p>
          </div>
          <div className="bg-white rounded-4xl shadow-lg p-8 border border-pink-100">
            <QuoteForm lang={lang} />
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer id="contact" className="bg-gray-900 text-white py-14">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="text-2xl font-extrabold mb-1">Baby<span className="text-pastel-pink">Cheepy</span></div>
            <div className="text-gray-400 text-sm mb-1">Global Apparel Kids</div>
            <div className="text-gray-400 text-sm mb-4">เลิฟลี่มัมมี่ ไทยแลนด์</div>
            <p className="text-gray-400 text-sm leading-relaxed">{t.footer.tagline}</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-pastel-pink">{t.footer.services}</h4>
            <ul className="space-y-1.5 text-gray-400 text-sm">
              {(lang === 'th' ? [
                'รับผลิต OEM / ODM', 'คอลเลคชั่นครอบครัว & สัตว์เลี้ยง',
                'พัฒนาแพทเทิร์น & ตัวอย่าง', 'จัดหาผ้า & พิมพ์ลาย',
                'ปักและตกแต่ง', 'ขายส่ง ODM',
              ] : [
                'OEM / ODM Production', 'Family & Pet Collection',
                'Pattern Development', 'Fabric Sourcing & Printing',
                'Embroidery & Decoration', 'ODM Wholesale',
              ]).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-pastel-pink">{t.footer.contact}</h4>
            <div className="space-y-3 text-gray-400 text-sm">
              <p><span className="text-white font-semibold">{t.footer.address}</span>{' '}6/9 หมู่บ้านวิโรจน์วิลเลจ ต.ละหาร อ.บางบัวทอง จ.นนทบุรี 11110</p>
              <p><span className="text-white font-semibold">LINE OA:</span>{' '}
                <a href="https://line.me/R/ti/p/@861pkbnz" target="_blank" rel="noopener noreferrer"
                  className="text-pastel-pink hover:underline">@861pkbnz</a></p>
              <p><span className="text-white font-semibold">Facebook:</span>{' '}
                <a href="https://www.facebook.com/lovelymommyth" target="_blank" rel="noopener noreferrer"
                  className="text-pastel-pink hover:underline">lovelymommyth</a></p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-xs">{t.footer.rights}</div>
      </footer>

      {/* ══ FLOATING CONTACT BUTTONS ══ */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <a href="https://www.facebook.com/lovelymommyth" target="_blank" rel="noopener noreferrer"
          title="Facebook"
          className="w-13 h-13 w-12 h-12 bg-[#1877F2] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
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
