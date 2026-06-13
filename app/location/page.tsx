'use client';

import { useState } from 'react';

type Lang = 'th' | 'en';

const i18n = {
  th: {
    langBtn: 'EN',
    nav: { home: 'หน้าแรก', quote: 'ขอใบเสนอราคา', lineId: '@861pkbnz' },
    chip: '📍 โชว์รูม & โรงงาน',
    title: 'ที่ตั้งและการเยี่ยมชม',
    sub: 'ยินดีต้อนรับทุกท่าน กรุณานัดหมายล่วงหน้าก่อนเข้าเยี่ยมชม',
    shopName: 'ร้านเลิฟลี่ มัมมี่ ไทยแลนด์',
    shopSub: '(Baby Cheepy Studio · Global Apparel Kids)',
    address: '6/9 หมู่บ้านวิโรจน์วิลล์ ต.ละหาร\nอ.บางบัวทอง จ.นนทบุรี 11110',
    hoursTitle: 'วันและเวลาทำการ',
    hours: 'จันทร์ – เสาร์  |  09:00 – 17:00 น.',
    hoursNote: 'รบกวนแจ้งวันและเวลาล่วงหน้าก่อนเข้าเยี่ยมชม',
    apptTitle: 'ติดต่อนัดหมาย',
    apptDesc: 'รบกวนนัดหมายแจ้งวันเวลาก่อนเข้าเยี่ยมชมค่ะ\nหรือหากต้องการนัดนอกสถานที่ แจ้งสถานที่ วันและเวลาได้เลยค่ะ',
    lineBtn: 'นัดหมายผ่าน LINE',
    mapBtn: 'เปิดใน Google Maps',
    backBtn: '← กลับหน้าแรก',
    infoCards: [
      { icon: '🅿️', title: 'ที่จอดรถ', desc: 'มีที่จอดรถบริเวณหน้าร้าน' },
      { icon: '🚗', title: 'การเดินทาง', desc: 'รถยนต์ส่วนตัว หรือแท็กซี่สะดวกที่สุด' },
      { icon: '📞', title: 'โทรนัดหมาย', desc: 'LINE: @861pkbnz' },
    ],
  },
  en: {
    langBtn: 'TH',
    nav: { home: 'Home', quote: 'Get Quote', lineId: '@861pkbnz' },
    chip: '📍 Showroom & Factory',
    title: 'Visit Us',
    sub: 'We welcome all visitors — please make an appointment before your visit.',
    shopName: 'Lovely Mummy Thailand',
    shopSub: '(Baby Cheepy Studio · Global Apparel Kids)',
    address: '6/9 Wiroj Ville Village, Lahan,\nBang Bua Thong, Nonthaburi 11110',
    hoursTitle: 'Business Hours',
    hours: 'Mon – Sat  |  09:00 – 17:00',
    hoursNote: 'Please notify us in advance before visiting.',
    apptTitle: 'Book an Appointment',
    apptDesc: 'Please arrange an appointment and let us know your preferred date and time before visiting.\nOff-site meetings are also available — just let us know the location, date, and time.',
    lineBtn: 'Book via LINE',
    mapBtn: 'Open in Google Maps',
    backBtn: '← Back to Home',
    infoCards: [
      { icon: '🅿️', title: 'Parking', desc: 'Parking available in front of the showroom.' },
      { icon: '🚗', title: 'Getting Here', desc: 'Private car or taxi recommended.' },
      { icon: '📞', title: 'Contact', desc: 'LINE: @861pkbnz' },
    ],
  },
};

const GOOGLE_MAPS_EMBED =
  'https://maps.google.com/maps?q=6%2F9+%E0%B8%AB%E0%B8%A1%E0%B8%B9%E0%B9%88%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%A7%E0%B8%B4%E0%B9%82%E0%B8%A3%E0%B8%88%E0%B8%99%E0%B9%8C%E0%B8%A7%E0%B8%B4%E0%B8%A5%E0%B8%A5%E0%B9%8C+%E0%B8%95.%E0%B8%A5%E0%B8%B0%E0%B8%AB%E0%B8%B2%E0%B8%A3+%E0%B8%AD.%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B8%9A%E0%B8%B1%E0%B8%A7%E0%B8%97%E0%B8%AD%E0%B8%87+%E0%B8%99%E0%B8%99%E0%B8%97%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5+11110&output=embed&z=16';

const GOOGLE_MAPS_LINK =
  'https://www.google.com/maps/search/6%2F9+%E0%B8%AB%E0%B8%A1%E0%B8%B9%E0%B9%88%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%A7%E0%B8%B4%E0%B9%82%E0%B8%A3%E0%B8%88%E0%B8%99%E0%B9%8C%E0%B8%A7%E0%B8%B4%E0%B8%A5%E0%B8%A5%E0%B9%8C+%E0%B8%95.%E0%B8%A5%E0%B8%B0%E0%B8%AB%E0%B8%B2%E0%B8%A3+%E0%B8%AD.%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B8%9A%E0%B8%B1%E0%B8%A7%E0%B8%97%E0%B8%AD%E0%B8%87+%E0%B8%99%E0%B8%99%E0%B8%97%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5+11110';

export default function LocationPage() {
  const [lang, setLang] = useState<Lang>('th');
  const t = i18n[lang];

  return (
    <div className="min-h-screen bg-pastel-pink-light font-prompt">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-pink-100 px-4 h-16 flex items-center justify-between shadow-sm">
        <a href="/" className="flex items-center gap-1.5">
          <span className="font-extrabold text-gray-900">Baby</span>
          <span className="font-extrabold text-brand-pink">Cheepy</span>
          <span className="text-xs text-gray-400 ml-1">📍</span>
        </a>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
            className="text-xs font-bold text-gray-500 border border-gray-200 rounded-full px-2.5 py-1 hover:border-pink-300 hover:text-brand-pink transition-colors"
          >
            {t.langBtn}
          </button>
          <a
            href="https://line.me/R/ti/p/@861pkbnz"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-line text-sm py-2 px-4 hidden sm:inline-flex"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white mr-1.5" aria-hidden>
              <path d="M19.952 11.037C19.952 6.608 15.485 3 10 3S.048 6.608.048 11.037c0 4.002 3.547 7.354 8.337 7.984.325.07.767.214.879.49.1.25.066.641.032.894l-.142.854c-.043.25-.2.977.856.532 1.056-.444 5.7-3.356 7.778-5.744C19.166 14.316 19.952 12.745 19.952 11.037z" />
            </svg>
            {t.nav.lineId}
          </a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="chip mb-3">{t.chip}</div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">{t.sub}</p>
        </div>

        {/* Map */}
        <div className="rounded-3xl overflow-hidden shadow-lg border border-pink-100 mb-8">
          <iframe
            src={GOOGLE_MAPS_EMBED}
            width="100%"
            height="380"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Baby Cheepy Location"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Address card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-pink/10 flex items-center justify-center shrink-0 text-2xl">
                📍
              </div>
              <div>
                <h2 className="font-extrabold text-gray-900 text-lg leading-snug">{t.shopName}</h2>
                <p className="text-xs text-gray-400 mb-3">{t.shopSub}</p>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{t.address}</p>
                <a
                  href={GOOGLE_MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-brand-pink hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {t.mapBtn}
                </a>
              </div>
            </div>
          </div>

          {/* Hours card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center shrink-0 text-2xl">
                🕘
              </div>
              <div className="flex-1">
                <h2 className="font-extrabold text-gray-900 text-lg mb-3">{t.hoursTitle}</h2>
                <div className="bg-yellow-50 rounded-2xl px-4 py-3 mb-3">
                  <p className="font-bold text-yellow-800 text-sm">{t.hours}</p>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{t.hoursNote}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment card */}
        <div className="bg-gradient-to-br from-brand-pink/10 to-pastel-pink-light rounded-3xl p-8 border border-pink-200 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📅</span>
                <h2 className="font-extrabold text-gray-900 text-xl">{t.apptTitle}</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{t.apptDesc}</p>
            </div>
            <a
              href="https://line.me/R/ti/p/@861pkbnz"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-line shrink-0 text-sm py-3 px-6 flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden>
                <path d="M19.952 11.037C19.952 6.608 15.485 3 10 3S.048 6.608.048 11.037c0 4.002 3.547 7.354 8.337 7.984.325.07.767.214.879.49.1.25.066.641.032.894l-.142.854c-.043.25-.2.977.856.532 1.056-.444 5.7-3.356 7.778-5.744C19.166 14.316 19.952 12.745 19.952 11.037z" />
              </svg>
              {t.lineBtn}
            </a>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {t.infoCards.map((card, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl mb-2">{card.icon}</div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{card.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Back */}
        <div className="text-center">
          <a href="/" className="btn-outline-pink text-sm">
            {t.backBtn}
          </a>
        </div>
      </div>
    </div>
  );
}
