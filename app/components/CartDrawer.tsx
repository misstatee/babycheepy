'use client';

import { useCart } from '../contexts/CartContext';
import Image from 'next/image';
import { useState } from 'react';

type Lang = 'th' | 'en';

const lbl = {
  th: {
    title: '🛒 ตะกร้าสินค้า', empty: 'ยังไม่มีสินค้าในตะกร้าค่ะ',
    total: 'ยอดรวม', checkout: 'สั่งซื้อ / ชำระเงิน',
    continue: 'เลือกสินค้าต่อ', unit: 'บาท',
  },
  en: {
    title: '🛒 Cart', empty: 'Your cart is empty.',
    total: 'Total', checkout: 'Checkout',
    continue: 'Continue Shopping', unit: 'THB',
  },
};

export default function CartDrawer({ lang = 'th', onClose }: { lang?: Lang; onClose: () => void }) {
  const { items, removeItem, updateQty, total } = useCart();
  const t = lbl[lang];

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="w-full max-w-sm bg-white h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-pink-100 bg-pastel-pink-light">
          <h2 className="font-extrabold text-gray-900">{t.title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow text-gray-500 hover:text-gray-900">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <span className="text-5xl">🛍️</span>
              <p className="text-sm">{t.empty}</p>
              <button onClick={onClose} className="btn-outline-pink text-sm py-2 px-6">{t.continue}</button>
            </div>
          ) : items.map(item => (
            <div key={item.id} className="flex gap-3 bg-gray-50 rounded-2xl p-3">
              <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-pastel-pink-light shrink-0">
                {item.image ? (
                  <Image src={item.image.startsWith('http') ? item.image : `/images/${item.image}`}
                    alt={lang === 'th' ? item.name_th : item.name_en}
                    fill className="object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : <div className="w-full h-full flex items-center justify-center text-2xl">👕</div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">{lang === 'th' ? item.name_th : item.name_en}</p>
                <p className="text-brand-pink font-extrabold text-sm">{item.price.toLocaleString()} {t.unit}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <button onClick={() => updateQty(item.id, item.quantity - 1)}
                    className="w-6 h-6 rounded-full bg-pink-100 text-brand-pink font-bold text-xs flex items-center justify-center hover:bg-pink-200">−</button>
                  <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-full bg-pink-100 text-brand-pink font-bold text-xs flex items-center justify-center hover:bg-pink-200">+</button>
                  <button onClick={() => removeItem(item.id)} className="ml-auto text-gray-300 hover:text-red-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-pink-100 p-4 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-700">{t.total}</span>
              <span className="text-xl font-extrabold text-brand-pink">{total.toLocaleString()} {t.unit}</span>
            </div>
            <a href="/checkout" onClick={onClose} className="btn-pink w-full justify-center text-center block">
              {t.checkout} →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
