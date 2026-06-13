'use client';

import { useState, useEffect, useRef } from 'react';

type Lang = 'th' | 'en';

/* ── วาง Video ID ของคุณที่นี่ ──────────────────────────────────────
   วิธีหา ID:
   1. เปิด TikTok บนมือถือหรือเบราว์เซอร์
   2. เปิดวิดีโอที่ต้องการ → กด Share → Copy Link
   3. ลิงก์จะเป็น: https://www.tiktok.com/@babycheepy/video/7123456789012345678
   4. ตัวเลขยาวๆ ท้าย URL คือ Video ID — copy มาวางด้านล่าง
──────────────────────────────────────────────────────────────────── */
const TIKTOK_VIDEO_IDS: string[] = [
  '7320212876742921478',
  '7389624837204937992',
  '7560311181651610898',
];

const PLACEHOLDER_COUNT = 3; // แสดง placeholder กี่ช่อง ถ้ายังไม่มีวิดีโอ

export default function TikTokSection({ lang = 'th' }: { lang?: Lang }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasVideos = TIKTOK_VIDEO_IDS.length > 0;
  const count = hasVideos ? TIKTOK_VIDEO_IDS.length : PLACEHOLDER_COUNT;

  /* auto-rotate */
  function startTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActive(prev => (prev + 1) % count);
    }, 7000);
  }

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, count]);

  function goTo(i: number) {
    setActive(i);
  }
  function prev() { goTo((active - 1 + count) % count); }
  function next() { goTo((active + 1) % count); }

  return (
    <section className="py-16 bg-cream-mid">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {/* TikTok logo */}
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-gray-900" aria-hidden>
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.53V6.75a4.85 4.85 0 01-1.02-.06z"/>
              </svg>
              <h2 className="text-2xl font-extrabold text-gray-900">
                {lang === 'th' ? 'วิดีโอจาก TikTok' : 'TikTok Videos'}
              </h2>
            </div>
            <p className="text-gray-500 text-sm">
              {lang === 'th' ? 'ติดตามเราที่ TikTok @babycheepy' : 'Follow us on TikTok @babycheepy'}
            </p>
          </div>
          <a href="https://www.tiktok.com/@babycheepy" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gray-900 text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-gray-700 transition-colors shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden>
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.53V6.75a4.85 4.85 0 01-1.02-.06z"/>
            </svg>
            {lang === 'th' ? 'ดูทั้งหมด' : 'View All'}
          </a>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center gap-4">
          {/* Prev */}
          <button onClick={prev}
            className="shrink-0 w-10 h-10 rounded-full bg-white shadow-md border border-orange-100 flex items-center justify-center hover:border-coral hover:text-coral transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Videos */}
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-4 transition-transform duration-500"
              style={{ transform: `translateX(calc(-${active} * (100% / 3 + 16px / 3 * 2)))` }}>
              {hasVideos ? (
                TIKTOK_VIDEO_IDS.map((id, i) => (
                  <div key={id} className={`shrink-0 w-full sm:w-[calc(33.333%-11px)] rounded-3xl overflow-hidden shadow-lg transition-all duration-300 ${i === active ? 'ring-2 ring-coral scale-[1.02]' : 'opacity-80'}`}>
                    <div className="relative" style={{ paddingBottom: '177.77%' /* 9:16 */ }}>
                      <iframe
                        className="absolute inset-0 w-full h-full rounded-3xl"
                        src={`https://www.tiktok.com/embed/v2/${id}`}
                        allowFullScreen
                        allow="autoplay; encrypted-media"
                        title={`TikTok video ${i + 1}`}
                        loading="lazy"
                      />
                    </div>
                  </div>
                ))
              ) : (
                /* Placeholder cards */
                Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
                  <div key={i} className={`shrink-0 w-full sm:w-[calc(33.333%-11px)] rounded-3xl overflow-hidden bg-white shadow-lg border-2 border-dashed transition-all duration-300 ${i === active ? 'border-coral scale-[1.02]' : 'border-orange-200 opacity-70'}`}>
                    <div className="relative flex flex-col items-center justify-center gap-3 text-center p-8"
                      style={{ paddingBottom: 'calc(177.77% - 64px)', minHeight: 320 }}>
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-gray-400">
                            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.53V6.75a4.85 4.85 0 01-1.02-.06z"/>
                          </svg>
                        </div>
                        <p className="font-bold text-gray-500 text-sm">
                          {lang === 'th' ? `วิดีโอ TikTok ${i + 1}` : `TikTok Video ${i + 1}`}
                        </p>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {lang === 'th'
                            ? 'วาง Video ID ใน\nTikTokSection.tsx\nบรรทัด TIKTOK_VIDEO_IDS'
                            : 'Add Video ID in\nTikTokSection.tsx\nline TIKTOK_VIDEO_IDS'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Next */}
          <button onClick={next}
            className="shrink-0 w-10 h-10 rounded-full bg-white shadow-md border border-orange-100 flex items-center justify-center hover:border-coral hover:text-coral transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: count }).map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-200 ${i === active ? 'w-6 h-2.5 bg-coral' : 'w-2.5 h-2.5 bg-orange-200 hover:bg-coral/50'}`} />
          ))}
        </div>

        {/* Auto-progress bar */}
        <div className="mt-4 max-w-xs mx-auto h-0.5 bg-orange-100 rounded-full overflow-hidden">
          <div key={active} className="h-full bg-coral rounded-full animate-[progress_7s_linear_forwards]" />
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </section>
  );
}
