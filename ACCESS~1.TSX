'use client';

/**
 * AccessGate — ระบบรหัสปลดล็อกฟีเจอร์ AI (Baby Cheepy)
 * ------------------------------------------------------------------
 * ลูกค้าเข้าดูหน้าเว็บได้ปกติทุกอย่าง แต่ตอนกดใช้งานจริงจะขอรหัสก่อน
 *
 *   const { ask, gate, unlocked } = useAccessGate({ icon: '📏', title: '...' });
 *   <button onClick={() => ask(analyze)}>วิเคราะห์</button>
 *   {gate}
 *
 * - กรอกรหัสถูก -> ปลดล็อก + ทำงานที่กดค้างไว้ต่อทันที
 * - จำไว้ 7 วัน (localStorage)
 * - ลิงก์ลัด /size-finder?code=cheepyweb -> ปลดล็อกอัตโนมัติ
 *
 * หมายเหตุ: เช็ครหัสฝั่ง client เหมาะกับ "รหัสโปรโมชั่น"
 * กันคนทั่วไปได้ แต่คนที่เปิด DevTools จะเห็นรหัส
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

/* ==================== ตั้งค่าได้ตรงนี้ ==================== */
const ACCESS_CODES = ['cheepyweb'];   // ใส่หลายรหัสได้ เช่น ['cheepyweb', 'cheepytiktok']
const STORAGE_KEY = 'bc_access_v1';   // เปลี่ยนเป็น v2 = บังคับคนเก่ากรอกใหม่
const REMEMBER_DAYS = 7;
const LINE_URL = 'https://line.me/R/ti/p/@861pkbnz';
/* ======================================================== */

const norm = (s: unknown) => String(s ?? '').trim().toLowerCase();
const isValidCode = (s: unknown) => ACCESS_CODES.some((c) => norm(c) === norm(s));

function readStored(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const d = JSON.parse(raw) as { ok?: boolean; until?: number };
    if (d?.ok && typeof d.until === 'number' && Date.now() < d.until) return true;
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  return false;
}

function writeStored() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ok: true, until: Date.now() + REMEMBER_DAYS * 864e5 }),
    );
  } catch {
    /* โหมดไม่ระบุตัวตน — ปลดล็อกเฉพาะรอบนี้ */
  }
}

export interface AccessGateOptions {
  icon?: string;
  title?: string;
  subtitle?: string;
}

/* ==================================================================
 * useAccessGate — ล็อกเฉพาะตอนกดใช้งาน (หน้ายังเข้าดูได้ปกติ)
 * ================================================================== */
export function useAccessGate(options: AccessGateOptions = {}) {
  const {
    icon = '🔓',
    title = 'ปลดล็อกเพื่อใช้งานฟรี',
    subtitle = 'ฟีเจอร์นี้สงวนไว้สำหรับผู้ที่มีรหัส กรอกรหัสแล้วใช้ได้เลยค่ะ',
  } = options;

  const [unlocked, setUnlocked] = useState(false);
  const [open, setOpen] = useState(false);
  const unlockedRef = useRef(false);
  const pendingRef = useRef<(() => void) | null>(null);

  const markUnlocked = useCallback(() => {
    unlockedRef.current = true;
    setUnlocked(true);
  }, []);

  useEffect(() => {
    let ok = readStored();
    try {
      const q = new URLSearchParams(window.location.search).get('code');
      if (q && isValidCode(q)) {
        writeStored();
        ok = true;
      }
    } catch {
      /* ignore */
    }
    if (ok) markUnlocked();
  }, [markUnlocked]);

  /**
   * ask(action)
   *  - ปลดล็อกแล้ว   -> เรียก action ทันที, คืนค่า true
   *  - ยังไม่ปลดล็อก -> เปิดกล่องรหัส, คืนค่า false
   *                     (กรอกถูกแล้วจะเรียก action ให้เอง)
   */
  const ask = useCallback((action?: () => void) => {
    if (unlockedRef.current) {
      action?.();
      return true;
    }
    pendingRef.current = action ?? null;
    setOpen(true);
    return false;
  }, []);

  const handleSuccess = useCallback(() => {
    writeStored();
    markUnlocked();
    setOpen(false);
    const run = pendingRef.current;
    pendingRef.current = null;
    if (run) setTimeout(run, 0);
  }, [markUnlocked]);

  const handleClose = useCallback(() => {
    pendingRef.current = null;
    setOpen(false);
  }, []);

  const gate = open ? (
    <UnlockModal
      icon={icon}
      title={title}
      subtitle={subtitle}
      onSuccess={handleSuccess}
      onClose={handleClose}
    />
  ) : null;

  return { unlocked, ask, gate };
}

/* ==================================================================
 * <AccessGate> — ล็อกทั้งหน้า (ทางเลือกสำรอง ไม่ได้ใช้ตอนนี้)
 * ================================================================== */
export default function AccessGate({
  children,
  icon = '🔒',
  title = 'ฟีเจอร์นี้สำหรับผู้ที่มีรหัสเท่านั้น',
  subtitle = 'กรอกรหัสเพื่อทดลองใช้ฟรี',
}: AccessGateOptions & { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    let ok = readStored();
    try {
      const q = new URLSearchParams(window.location.search).get('code');
      if (q && isValidCode(q)) {
        writeStored();
        ok = true;
      }
    } catch {
      /* ignore */
    }
    setUnlocked(ok);
  }, []);

  if (unlocked === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-4xl animate-pulse">🐣</div>
    );
  }

  if (unlocked) return <>{children}</>;

  return (
    <>
      <div className="blur-md opacity-60 pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>
      <UnlockModal
        icon={icon}
        title={title}
        subtitle={subtitle}
        onSuccess={() => {
          writeStored();
          setUnlocked(true);
        }}
      />
    </>
  );
}

/* ==================================================================
 * กล่องกรอกรหัส
 * ================================================================== */
export function UnlockModal({
  icon,
  title,
  subtitle,
  onSuccess,
  onClose,
}: {
  icon?: string;
  title?: string;
  subtitle?: string;
  onSuccess: () => void;
  onClose?: () => void;
}) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  // ปิดด้วย Esc + ล็อกไม่ให้หน้าเลื่อน
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (isValidCode(input)) {
      setError('');
      onSuccess();
    } else {
      setError('รหัสไม่ถูกต้อง ลองใหม่อีกครั้งนะคะ');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-prompt"
    >
      <div
        className={`relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 px-7 pt-9 pb-6 text-center ${
          shake ? 'animate-[bcShake_0.45s_ease]' : ''
        }`}
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิด"
            className="absolute top-3 right-3.5 w-8 h-8 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        )}

        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-100 to-amber-50 flex items-center justify-center text-3xl">
          {icon}
        </div>

        <h2 className="text-lg font-extrabold text-gray-900 mb-1.5 leading-snug">{title}</h2>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">{subtitle}</p>

        <form onSubmit={submit}>
          <input
            type="password"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError('');
            }}
            placeholder="กรอกรหัสผ่าน"
            autoFocus
            autoComplete="off"
            className={`w-full border-2 rounded-xl px-4 py-3 text-sm text-center tracking-wide bg-gray-50 focus:outline-none focus:bg-white transition-colors ${
              error ? 'border-red-400' : 'border-pink-200 focus:border-brand-pink'
            }`}
          />

          <div className="min-h-[22px] mt-2 text-xs font-semibold text-red-500">
            {error ? `⚠️ ${error}` : ''}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-brand-pink text-white font-extrabold rounded-xl hover:bg-brand-pink-dark transition-all active:scale-[0.99] shadow-md"
          >
            ✨ ปลดล็อกใช้งานฟรี
          </button>
        </form>

        <div className="mt-4 rounded-xl bg-pink-50 px-4 py-3 text-xs text-gray-600 leading-relaxed">
          ยังไม่มีรหัส?{' '}
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-pink font-bold hover:underline"
          >
            ทักไลน์ @861pkbnz
          </a>{' '}
          เพื่อขอรหัสฟรีได้เลยค่ะ
        </div>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← ไว้ก่อน ขอดูต่อ
          </button>
        ) : (
          <a href="/" className="inline-block mt-3 text-xs text-gray-400 hover:text-gray-600">
            ← กลับหน้าแรก
          </a>
        )}
      </div>

      <style>{`
        @keyframes bcShake {
          0%,100% { transform: translateX(0) }
          20% { transform: translateX(-9px) }
          40% { transform: translateX(9px) }
          60% { transform: translateX(-6px) }
          80% { transform: translateX(6px) }
        }
      `}</style>
    </div>
  );
}

/* ป้าย "ต้องมีรหัส" แปะข้างปุ่มได้ */
export function LockBadge({ text = '🔑 ต้องมีรหัส' }: { text?: string }) {
  return (
    <span className="ml-2 inline-block align-middle rounded-full bg-white/25 px-2.5 py-0.5 text-[11px] font-bold">
      {text}
    </span>
  );
}
