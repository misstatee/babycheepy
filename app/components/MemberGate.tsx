'use client';

import { type ReactNode, useEffect, useState } from 'react';

type MembershipState = {
  ok: boolean;
  authenticated: boolean;
  canUseMemberTools: boolean;
  status: 'pending' | 'active' | 'suspended' | 'rejected' | null;
  message: string;
};

export default function MemberGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MembershipState | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch('/api/member/me', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        if (alive) setState(data);
      })
      .catch(() => {
        if (alive) {
          setState({
            ok: false,
            authenticated: false,
            canUseMemberTools: false,
            status: null,
            message: 'ฟีเจอร์นี้สำหรับสมาชิก Babycheepy Brand Club กรุณาสมัครสมาชิกหรือเข้าสู่ระบบ',
          });
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!state) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center text-sm font-semibold text-gray-500 shadow-sm">
        กำลังตรวจสอบสิทธิ์สมาชิก...
      </div>
    );
  }

  if (state.canUseMemberTools) {
    return <>{children}</>;
  }

  const message =
    state.status === 'pending'
      ? 'บัญชีของคุณอยู่ระหว่างการตรวจสอบหลักฐานการชำระเงิน'
      : state.status === 'suspended'
        ? 'บัญชีสมาชิกของคุณถูกระงับ กรุณาติดต่อแอดมิน Baby Cheepy'
        : state.status === 'rejected'
          ? 'การสมัครของคุณไม่ผ่านการอนุมัติ กรุณาติดต่อแอดมิน'
          : 'ฟีเจอร์นี้สำหรับสมาชิก Babycheepy Brand Club กรุณาสมัครสมาชิกหรือเข้าสู่ระบบ';

  return (
    <section className="bg-white border border-pink-200 rounded-2xl p-5 shadow-sm">
      <div className="text-center">
        <p className="text-xs font-extrabold text-brand-pink tracking-wide mb-1">Babycheepy Brand Club</p>
        <h2 className="text-xl font-extrabold text-gray-900">เครื่องมือนี้สำหรับสมาชิก</h2>
        <p className="text-sm text-gray-500 mt-2">
          ผู้ใช้ทั่วไปสามารถดูคำอธิบาย วิธีใช้งาน และตัวอย่างได้ ส่วนการอัปโหลดและประมวลผล AI เปิดให้สมาชิกสถานะ Active เท่านั้น
        </p>
      </div>
      <div className="mt-5 rounded-2xl bg-pink-50 p-4 text-sm font-semibold text-gray-700">
        {message}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a href="/member-register" className="btn-pink justify-center rounded-xl py-3 text-sm">
          สมัคร Babycheepy Brand Club 99 บาท
        </a>
        <a href="/member-login" className="btn-outline-pink justify-center rounded-xl py-3 text-sm">
          เข้าสู่ระบบ
        </a>
      </div>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-600"
      >
        ดูรายละเอียดสิทธิ์สมาชิก
      </button>
      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4" role="dialog" aria-modal="true">
          <div className="max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-extrabold text-gray-900">ฟีเจอร์นี้สำหรับสมาชิก Babycheepy Brand Club</h3>
            <p className="mt-2 text-sm text-gray-600">กรุณาสมัครสมาชิกหรือเข้าสู่ระบบ</p>
            <div className="mt-5 grid gap-3">
              <a href="/member-register" className="btn-pink justify-center rounded-xl py-3 text-sm">
                สมัคร Babycheepy Brand Club 99 บาท
              </a>
              <a href="/member-login" className="btn-outline-pink justify-center rounded-xl py-3 text-sm">
                เข้าสู่ระบบ
              </a>
              <button onClick={() => setModalOpen(false)} className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-500">
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
