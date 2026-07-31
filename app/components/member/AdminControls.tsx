'use client';

import { useState, type FormEvent } from 'react';
import type { AiModelRequestStatus, DeliverableKind, MembershipStatus, ProductionStatus } from '../../../lib/member/types';

function useAdminSubmit() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(url: string, body: Record<string, unknown>, method = 'PATCH') {
    setMessage(null);
    setError(null);
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setError(data.error || 'ดำเนินการไม่สำเร็จ');
      return false;
    }
    setMessage('บันทึกเรียบร้อยแล้ว');
    window.setTimeout(() => window.location.reload(), 500);
    return true;
  }

  return { message, error, submit };
}

export function AdminMemberControls({ membershipId }: { membershipId: string }) {
  const { message, error, submit } = useAdminSubmit();
  const [note, setNote] = useState('');

  return (
    <div className="space-y-2">
      <input
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="หมายเหตุแอดมิน"
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs"
      />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => submit(`/api/admin/members/${membershipId}`, { action: 'approve', note })} className="rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white">
          อนุมัติ
        </button>
        {(['pending', 'suspended', 'rejected'] as Exclude<MembershipStatus, 'active'>[]).map((status) => (
          <button
            key={status}
            onClick={() => submit(`/api/admin/members/${membershipId}`, { action: 'set_status', status, note, suspendedReason: note })}
            className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600"
          >
            {status}
          </button>
        ))}
        <button onClick={() => submit(`/api/admin/members/${membershipId}`, { action: 'credit', delta: 1, note: note || 'เพิ่มเครดิตโดยแอดมิน' })} className="rounded-lg border border-pink-200 px-3 py-2 text-xs font-bold text-brand-pink">
          + เครดิต
        </button>
        <button onClick={() => submit(`/api/admin/members/${membershipId}`, { action: 'credit', delta: -1, note: note || 'ลดเครดิตโดยแอดมิน' })} className="rounded-lg border border-orange-200 px-3 py-2 text-xs font-bold text-orange-600">
          - เครดิต
        </button>
      </div>
      {message && <p className="text-xs font-bold text-green-700">{message}</p>}
      {error && <p className="text-xs font-bold text-red-600">{error}</p>}
    </div>
  );
}

export function AdminAiRequestControls({ requestId }: { requestId: string }) {
  const { message, error, submit } = useAdminSubmit();
  const [status, setStatus] = useState<AiModelRequestStatus>('accepted');
  const [note, setNote] = useState('');

  return (
    <div className="space-y-2">
      <select value={status} onChange={(event) => setStatus(event.target.value as AiModelRequestStatus)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs">
        {(['submitted', 'waiting_for_details', 'accepted', 'in_progress', 'review', 'revision', 'completed', 'cancelled'] as AiModelRequestStatus[]).map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="หมายเหตุ" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs" />
      <button onClick={() => submit(`/api/admin/ai-model-requests/${requestId}`, { status, note })} className="rounded-lg bg-brand-pink px-3 py-2 text-xs font-bold text-white">
        อัปเดตสถานะ
      </button>
      {message && <p className="text-xs font-bold text-green-700">{message}</p>}
      {error && <p className="text-xs font-bold text-red-600">{error}</p>}
    </div>
  );
}

const deliverableKinds: Array<{ key: DeliverableKind; label: string }> = [
  { key: 'mockup', label: 'Mockup 1 ภาพ' },
  { key: 'model_pose_1', label: 'นางแบบ ท่าที่ 1' },
  { key: 'model_pose_2', label: 'นางแบบ ท่าที่ 2' },
  { key: 'model_pose_3', label: 'นางแบบ ท่าที่ 3' },
  { key: 'model_pose_4', label: 'นางแบบ ท่าที่ 4' },
  { key: 'model_pose_5', label: 'นางแบบ ท่าที่ 5' },
];

export function AdminDeliverablesForm({ requestId }: { requestId: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const response = await fetch('/api/admin/deliverables', { method: 'POST', body: new FormData(event.currentTarget) });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setError(data.error || 'อัปโหลดไฟล์ส่งมอบไม่สำเร็จ');
      return;
    }
    setMessage('อัปโหลดไฟล์ส่งมอบครบ 6 ภาพแล้ว');
    window.setTimeout(() => window.location.reload(), 700);
  }

  return (
    <form onSubmit={submit} className="mt-4 rounded-2xl border border-pink-100 bg-pink-50 p-4 text-sm">
      <input type="hidden" name="requestId" value={requestId} />
      <p className="font-extrabold text-gray-900">อัปโหลดไฟล์ส่งมอบ 6 ภาพ</p>
      <div className="mt-3 grid gap-2">
        {deliverableKinds.map((item) => (
          <label key={item.key} className="grid gap-1 text-xs font-bold text-gray-600">
            {item.label}
            <input name={item.key} type="file" required accept="image/jpeg,image/png" className="rounded-xl border border-dashed border-pink-200 bg-white px-3 py-2" />
          </label>
        ))}
      </div>
      <button className="mt-3 rounded-xl bg-brand-pink px-4 py-2 text-xs font-bold text-white">ส่งมอบภาพครบ 6 ภาพ</button>
      {message && <p className="mt-2 text-xs font-bold text-green-700">{message}</p>}
      {error && <p className="mt-2 text-xs font-bold text-red-600">{error}</p>}
    </form>
  );
}

export function AdminAiModelForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const response = await fetch('/api/admin/ai-models', { method: 'POST', body: new FormData(event.currentTarget) });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setError(data.error || 'เพิ่มนางแบบไม่สำเร็จ');
      return;
    }
    setMessage('เพิ่มนางแบบเรียบร้อยแล้ว');
    window.setTimeout(() => window.location.reload(), 500);
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm space-y-3">
      <h2 className="font-extrabold text-gray-900">เพิ่มนางแบบ AI</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="modelCode" required placeholder="Model ID เช่น BCM-001" className="rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        <input name="displayName" required placeholder="ชื่อนางแบบ" className="rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        <input name="approxAge" placeholder="อายุโดยประมาณ" className="rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        <input name="gender" placeholder="เพศ" className="rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        <input name="style" placeholder="สไตล์" className="rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        <input name="skinTone" placeholder="สีผิว" className="rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        <input name="hairStyle" placeholder="ทรงผม" className="rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        <input name="suitableAgeRange" placeholder="ช่วงอายุสินค้าที่เหมาะสม" className="rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        <input name="sortOrder" type="number" placeholder="ลำดับ" className="rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        <input name="preview" type="file" accept="image/jpeg,image/png" className="rounded-xl border border-dashed border-pink-200 px-3 py-2 text-sm" />
      </div>
      <button className="btn-pink rounded-xl py-2 text-sm">เพิ่มนางแบบ</button>
      {message && <p className="text-sm font-bold text-green-700">{message}</p>}
      {error && <p className="text-sm font-bold text-red-600">{error}</p>}
    </form>
  );
}

export function AdminProductionForm({ users }: { users: Array<{ id: string; label: string }> }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const response = await fetch('/api/admin/production-orders', { method: 'POST', body: new FormData(event.currentTarget) });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setError(data.error || 'เพิ่มงานผลิตไม่สำเร็จ');
      return;
    }
    setMessage('เพิ่มงานผลิตเรียบร้อยแล้ว');
    window.setTimeout(() => window.location.reload(), 500);
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm space-y-3">
      <h2 className="font-extrabold text-gray-900">เพิ่มรายการผลิต</h2>
      <select name="userId" required className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm">
        <option value="">เลือกสมาชิก</option>
        {users.map((user) => <option key={user.id} value={user.id}>{user.label}</option>)}
      </select>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="brandName" required placeholder="ชื่อแบรนด์" className="rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        <input name="productName" required placeholder="ชื่อสินค้า" className="rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        <input name="quantity" type="number" placeholder="จำนวนผลิต" className="rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        <input name="expectedDoneAt" type="date" className="rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        <input name="productImage" type="file" accept="image/jpeg,image/png" className="rounded-xl border border-dashed border-pink-200 px-3 py-2 text-sm" />
      </div>
      <textarea name="customerNote" placeholder="หมายเหตุที่ลูกค้าเห็น" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
      <textarea name="internalNote" placeholder="หมายเหตุภายใน" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
      <button className="btn-pink rounded-xl py-2 text-sm">เพิ่มงานผลิต</button>
      {message && <p className="text-sm font-bold text-green-700">{message}</p>}
      {error && <p className="text-sm font-bold text-red-600">{error}</p>}
    </form>
  );
}

export function AdminProductionStatusControls({ orderId, statuses }: { orderId: string; statuses: readonly ProductionStatus[] }) {
  const { message, error, submit } = useAdminSubmit();
  const [status, setStatus] = useState<string>(statuses[0]);
  const [customerNote, setCustomerNote] = useState('');

  return (
    <div className="space-y-2">
      <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs">
        {statuses.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <input value={customerNote} onChange={(event) => setCustomerNote(event.target.value)} placeholder="หมายเหตุลูกค้า" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs" />
      <button onClick={() => submit(`/api/admin/production-orders/${orderId}`, { current_status: status, customer_note: customerNote })} className="rounded-lg bg-brand-pink px-3 py-2 text-xs font-bold text-white">
        อัปเดตงานผลิต
      </button>
      {message && <p className="text-xs font-bold text-green-700">{message}</p>}
      {error && <p className="text-xs font-bold text-red-600">{error}</p>}
    </div>
  );
}
