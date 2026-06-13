'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '../contexts/CartContext';
import CartDrawer from '../components/CartDrawer';
import { SAMPLE_PRODUCTS, CATEGORIES, CATEGORIES_EN, Product } from '../../lib/products';

type Lang = 'th' | 'en';

function ProductCard({ product, lang, onAdd }: { product: Product; lang: Lang; onAdd: () => void }) {
  const [imgErr, setImgErr] = useState(false);
  const hasDiscount = product.sale_price > 0;
  const displayPrice = hasDiscount ? product.sale_price : product.price;
  const name = lang === 'th' ? product.name_th : product.name_en;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-pastel-pink-light to-pastel-blue-light">
        {product.image && !imgErr ? (
          <Image
            src={product.image.startsWith('http') ? product.image : `/images/${product.image}`}
            alt={name} fill className="object-cover"
            onError={() => setImgErr(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">👕</div>
        )}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            SALE
          </div>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full">
              {lang === 'th' ? 'สินค้าหมด' : 'Out of Stock'}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="chip-blue text-[10px] mb-1.5">{product.category}</div>
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 flex-1">{name}</h3>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-extrabold text-brand-pink">{displayPrice.toLocaleString()} ฿</span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">{product.price.toLocaleString()} ฿</span>
          )}
        </div>
        {product.min_order > 1 && (
          <p className="text-xs text-gray-400 mb-2">
            {lang === 'th' ? `ขั้นต่ำ ${product.min_order} ชิ้น` : `Min. ${product.min_order} pcs`}
          </p>
        )}
        <button
          onClick={onAdd}
          disabled={!product.in_stock}
          className="w-full btn-pink py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed justify-center">
          🛒 {lang === 'th' ? 'เพิ่มในตะกร้า' : 'Add to Cart'}
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
  const { addItem, count } = useCart();

  const cats = lang === 'th' ? CATEGORIES : CATEGORIES_EN;
  const catMap: Record<string, string> = {
    'All': 'ทั้งหมด', 'Baby': 'ทารก', 'Kids': 'เด็กเล็ก',
    'Family': 'ครอบครัว', 'Pet': 'สัตว์เลี้ยง', 'Swimwear': 'ว่ายน้ำ',
  };

  const activeCatTh = lang === 'th' ? category : (catMap[category] ?? 'ทั้งหมด');
  const filtered = activeCatTh === 'ทั้งหมด'
    ? SAMPLE_PRODUCTS
    : SAMPLE_PRODUCTS.filter(p => p.category === activeCatTh);

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
    <div className="min-h-screen bg-pastel-pink-light font-prompt">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-pink-100 px-4 h-16 flex items-center justify-between shadow-sm">
        <a href="/" className="flex items-center gap-1.5">
          <span className="font-extrabold text-gray-900">Baby</span>
          <span className="font-extrabold text-brand-pink">Cheepy</span>
          <span className="text-xs text-gray-400 ml-1">{lang === 'th' ? 'ร้านค้า' : 'Shop'}</span>
        </a>
        <div className="flex items-center gap-3">
          <button onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
            className="text-xs font-bold text-gray-500 border border-gray-200 rounded-full px-2.5 py-1 hover:border-pink-300 hover:text-brand-pink transition-colors">
            {lang === 'th' ? 'EN' : 'TH'}
          </button>
          <button onClick={() => setCartOpen(true)}
            className="relative w-10 h-10 bg-brand-pink text-white rounded-full flex items-center justify-center shadow-md hover:bg-brand-pink-dark transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-gray-900 text-[10px] font-extrabold rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="chip mb-3">{lang === 'th' ? '🛍️ ร้านค้าออนไลน์' : '🛍️ Online Shop'}</div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            {lang === 'th' ? 'สินค้าทั้งหมด' : 'All Products'}
          </h1>
          <p className="text-gray-500 text-sm">
            {lang === 'th'
              ? 'สินค้าคุณภาพโรงงาน Baby Cheepy — ส่งทั่วไทย'
              : 'Factory-quality Baby Cheepy products — nationwide delivery'}
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {cats.map((cat, i) => (
            <button key={i} onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all border-2 ${
                (lang === 'th' ? category === cat : (catMap[cat] ?? cat) === activeCatTh)
                  ? 'bg-brand-pink text-white border-brand-pink shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300 hover:text-brand-pink'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Added toast */}
        {addedId && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg">
            ✅ {lang === 'th' ? 'เพิ่มในตะกร้าแล้ว!' : 'Added to cart!'}
          </div>
        )}

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} lang={lang}
              onAdd={() => handleAdd(product)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">🔍</div>
            <p>{lang === 'th' ? 'ไม่พบสินค้าในหมวดนี้' : 'No products in this category.'}</p>
          </div>
        )}

        {/* Back to main */}
        <div className="text-center mt-12">
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
