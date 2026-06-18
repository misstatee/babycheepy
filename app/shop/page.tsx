'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '../contexts/CartContext';
import CartDrawer from '../components/CartDrawer';
import { SAMPLE_PRODUCTS, CATEGORIES, CATEGORIES_EN, Product } from '../../lib/products';

type Lang = 'th' | 'en';

function discountPct(price: number, sale: number) {
  return Math.round(((price - sale) / price) * 100);
}

function ProductCard({ product, lang, onAdd, added }: {
  product: Product; lang: Lang; onAdd: () => void; added: boolean;
}) {
  const [imgErr, setImgErr] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const name = lang === 'th' ? product.name_th : product.name_en;
  const pct = discountPct(product.price, product.sale_price);
  const SHOW_SIZES = 6;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Image */}
      <div className="relative aspect-square bg-gray-50">
        {product.image && !imgErr ? (
          <Image
            src={product.image.startsWith('http') ? product.image : `/images/${product.image}`}
            alt={name} fill className="object-cover"
            onError={() => setImgErr(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">👕</div>
        )}
        {/* % OFF circle */}
        {pct > 0 && (
          <div className="absolute top-2 left-2 w-11 h-11 bg-red-500 text-white rounded-full flex flex-col items-center justify-center leading-tight shadow">
            <span className="text-[11px] font-extrabold">{pct}%</span>
            <span className="text-[8px] font-bold">OFF</span>
          </div>
        )}
        {/* SALE badge */}
        <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-[9px] font-extrabold px-2 py-0.5 rounded">
          SALE !
        </div>
        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full">
              {lang === 'th' ? 'สินค้าหมด' : 'Out of Stock'}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        {/* Size chips — selectable */}
        <div className="flex flex-wrap items-center gap-1 mb-2">
          {product.sizes.slice(0, SHOW_SIZES).map(s => (
            <button
              key={s}
              onClick={() => setSelectedSize(selectedSize === s ? null : s)}
              className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                selectedSize === s
                  ? 'bg-brand-pink border-brand-pink text-white font-bold'
                  : 'border-gray-300 text-gray-500 hover:border-brand-pink hover:text-brand-pink'
              }`}>
              {s}
            </button>
          ))}
          {product.sizes.length > SHOW_SIZES && (
            <span className="text-[9px] text-gray-400">+{product.sizes.length - SHOW_SIZES}</span>
          )}
        </div>

        {/* Code + Category */}
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[9px] text-gray-400 font-mono">{product.code}</span>
          <span className="text-[9px] text-brand-pink font-bold bg-pink-50 border border-pink-100 px-1.5 py-0.5 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2.5 flex-1 line-clamp-2">{name}</h3>

        {/* Prices */}
        <div className="mb-2.5">
          <div className="flex items-baseline gap-2">
            <span className="text-red-500 font-extrabold text-lg leading-none">
              {product.sale_price.toLocaleString()} ฿
            </span>
            <span className="text-gray-400 text-xs line-through">
              {product.price.toLocaleString()} ฿
            </span>
          </div>
          <div className="mt-1">
            <span className="text-[10px] text-yellow-700 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded font-bold">
              {lang === 'th' ? 'ราคาส่ง' : 'Wholesale'}: {product.wholesale_price.toLocaleString()} ฿
            </span>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={onAdd}
          disabled={!product.in_stock}
          className={`w-full py-2 text-sm font-bold rounded-lg transition-all duration-150 active:scale-95 ${
            added
              ? 'bg-green-500 text-white'
              : 'bg-brand-pink text-white hover:bg-brand-pink-dark'
          } disabled:opacity-40 disabled:cursor-not-allowed`}>
          {added
            ? (lang === 'th' ? '✓ เพิ่มแล้ว!' : '✓ Added!')
            : selectedSize
              ? (lang === 'th' ? `🛒 ใส่ตะกร้า (${selectedSize})` : `🛒 Add (${selectedSize})`)
              : (lang === 'th' ? '🛒 ใส่ตะกร้า' : '🛒 Add to Cart')}
        </button>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [lang, setLang] = useState<Lang>('th');
  const [category, setCategory] = useState('ทั้งหมด');
  const [cartOpen, setCartOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [sort, setSort] = useState('default');
  const { addItem, count } = useCart();

  const cats = lang === 'th' ? CATEGORIES : CATEGORIES_EN;
  const catMap: Record<string, string> = {
    'All': 'ทั้งหมด', 'Baby': 'ทารก', 'Kids': 'เด็กเล็ก',
    'Family': 'ครอบครัว', 'Pet': 'สัตว์เลี้ยง', 'Swimwear': 'ว่ายน้ำ',
  };

  const activeCatTh = lang === 'th' ? category : (catMap[category] ?? 'ทั้งหมด');
  let filtered = activeCatTh === 'ทั้งหมด'
    ? [...SAMPLE_PRODUCTS]
    : SAMPLE_PRODUCTS.filter(p => p.category === activeCatTh);

  if (sort === 'price-asc') filtered.sort((a, b) => a.sale_price - b.sale_price);
  if (sort === 'price-desc') filtered.sort((a, b) => b.sale_price - a.sale_price);

  function handleAdd(product: Product) {
    addItem({
      id: product.id,
      name_th: product.name_th,
      name_en: product.name_en,
      price: product.sale_price > 0 ? product.sale_price : product.price,
      image: product.image,
      min_order: product.min_order,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  }

  return (
    <div className="min-h-screen bg-gray-50 font-prompt">
      {/* Announcement bar */}
      <div className="bg-brand-pink text-white text-xs font-bold text-center py-2 px-4 tracking-wide">
        🎉 {lang === 'th'
          ? 'ลดราคาพิเศษ! เสื้อผ้าเด็กคุณภาพโรงงาน ผ้านุ่ม ใส่สบาย — ส่งทั่วไทย'
          : 'Special Sale! Factory-quality kids clothing, soft & comfortable — Nationwide delivery'}
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-1">
            <span className="font-extrabold text-xl text-gray-900">Baby</span>
            <span className="font-extrabold text-xl text-brand-pink">Cheepy</span>
          </a>

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
            <a href="/" className="hover:text-brand-pink transition-colors">หน้าแรก</a>
            <a href="/shop" className="text-brand-pink border-b-2 border-brand-pink pb-0.5">ร้านค้า</a>
            <a href="/services" className="hover:text-brand-pink transition-colors">บริการ</a>
            <a href="/#quote" className="hover:text-brand-pink transition-colors">สั่งผลิต OEM</a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
              className="text-xs font-bold text-gray-500 border border-gray-200 rounded px-2.5 py-1 hover:border-pink-300 hover:text-brand-pink transition-colors">
              {lang === 'th' ? 'EN' : 'TH'}
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-1.5 bg-brand-pink text-white text-sm font-bold px-3 py-1.5 rounded-lg hover:bg-brand-pink-dark transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{lang === 'th' ? 'ตะกร้า' : 'Cart'}</span>
              {count > 0 && (
                <span className="w-5 h-5 bg-yellow-400 text-gray-900 text-[10px] font-extrabold rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-5">
          <a href="/" className="hover:text-brand-pink transition-colors">หน้าแรก</a>
          <span>›</span>
          <a href="/shop" className="hover:text-brand-pink transition-colors">
            {lang === 'th' ? 'หมวดสินค้า' : 'Products'}
          </a>
          <span>›</span>
          <span className="text-gray-800 font-semibold">
            {lang === 'th' ? 'เสื้อผ้าเด็กเลือก Size ได้' : 'Kids Clothing — Choose Size'}
          </span>
        </nav>

        {/* Promo banner */}
        <div className="relative bg-gradient-to-r from-pink-500 via-pink-400 to-rose-400 rounded-2xl p-5 mb-6 text-white overflow-hidden">
          <div className="absolute -right-4 -top-4 text-[120px] opacity-10 select-none">👶</div>
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="inline-block bg-yellow-400 text-gray-900 text-[10px] font-extrabold px-2 py-0.5 rounded mb-2">
                SALE !
              </span>
              <h2 className="text-xl font-extrabold mb-0.5">
                {lang === 'th' ? 'ชุดเด็กคุณภาพโรงงาน Baby Cheepy' : 'Baby Cheepy Factory-Quality Kids Clothing'}
              </h2>
              <p className="text-sm text-pink-100">
                {lang === 'th'
                  ? 'ผ้านุ่ม ใส่สบาย | เลือก Size ได้ | ผลิตในไทย | ส่งทั่วประเทศ'
                  : 'Soft fabric | Choose your size | Made in Thailand | Nationwide shipping'}
              </p>
            </div>
            <a href="/#quote"
              className="flex-shrink-0 bg-white text-brand-pink font-extrabold text-sm px-5 py-2.5 rounded-xl hover:bg-pink-50 transition-colors shadow-md">
              {lang === 'th' ? '📋 สั่งผลิต OEM' : '📋 OEM Order'}
            </a>
          </div>
        </div>

        {/* Category tabs */}
        <div className="bg-white border border-gray-200 rounded-xl p-1 flex gap-1 flex-wrap mb-5 shadow-sm">
          {cats.map((cat, i) => (
            <button
              key={i}
              onClick={() => setCategory(lang === 'th' ? cat : cat)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                (lang === 'th' ? category === cat : (catMap[cat] ?? cat) === activeCatTh)
                  ? 'bg-brand-pink text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-brand-pink'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Sort & count bar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            {lang === 'th' ? 'พบ' : 'Found'}{' '}
            <span className="font-bold text-gray-900">{filtered.length}</span>{' '}
            {lang === 'th' ? 'รายการ' : 'items'}
          </p>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white focus:outline-none focus:border-brand-pink cursor-pointer">
            <option value="default">{lang === 'th' ? 'เรียงค่าเริ่มต้น' : 'Default'}</option>
            <option value="price-asc">{lang === 'th' ? 'ราคา น้อย → มาก' : 'Price: Low to High'}</option>
            <option value="price-desc">{lang === 'th' ? 'ราคา มาก → น้อย' : 'Price: High to Low'}</option>
          </select>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang}
              added={addedId === product.id}
              onAdd={() => handleAdd(product)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-semibold">
              {lang === 'th' ? 'ไม่พบสินค้าในหมวดนี้' : 'No products in this category.'}
            </p>
          </div>
        )}

        {/* Trust features bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          {[
            {
              icon: '🚚',
              title: lang === 'th' ? 'ส่งทั่วไทย' : 'Nationwide Shipping',
              sub: lang === 'th' ? 'ทุกออเดอร์' : 'All orders',
            },
            {
              icon: '🏭',
              title: lang === 'th' ? 'คุณภาพโรงงาน' : 'Factory Quality',
              sub: lang === 'th' ? 'ตรวจ QC ทุกชิ้น' : 'QC checked every item',
            },
            {
              icon: '📏',
              title: lang === 'th' ? 'เลือก Size ได้' : 'Choose Your Size',
              sub: '3M – 10T',
            },
            {
              icon: '💬',
              title: lang === 'th' ? 'บริการหลังการขาย' : 'After-sale Support',
              sub: 'Line / Facebook',
            },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-tight">{f.title}</p>
                <p className="text-xs text-gray-500">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact section */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-3">
            {lang === 'th' ? '📞 ติดต่อสอบถาม / สั่งซื้อ' : '📞 Contact Us / Order'}
          </h3>
          <div className="flex flex-wrap gap-3">
            <a href="https://line.me" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#06C755] text-white text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              <span>Line</span>
              <span className="text-xs font-normal opacity-90">@babycheepy</span>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#1877F2] text-white text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              <span>Facebook</span>
              <span className="text-xs font-normal opacity-90">Baby Cheepy</span>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              <span>TikTok</span>
              <span className="text-xs font-normal opacity-90">@babycheepy</span>
            </a>
          </div>
        </div>

        {/* OEM CTA */}
        <div className="text-center mt-8 mb-4">
          <a href="/#quote" className="btn-outline-pink">
            {lang === 'th' ? '📋 สั่งผลิต OEM/ODM →' : '📋 OEM/ODM Custom Order →'}
          </a>
        </div>
      </div>

      {/* Cart drawer */}
      {cartOpen && <CartDrawer lang={lang} onClose={() => setCartOpen(false)} />}
    </div>
  );
}
