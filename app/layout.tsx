import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from './contexts/CartContext';

export const metadata: Metadata = {
  title: 'Baby Cheepy | Global Apparel Kids — รับผลิตเสื้อผ้าเด็กครบวงจร',
  description:
    'โรงงานรับผลิตเสื้อผ้าเด็ก OEM/ODM ประสบการณ์กว่า 40 ปี บริการครบวงจรตั้งแต่ออกแบบ ทำแพทเทิร์น พิมพ์ผ้า จนถึงส่งมอบสินค้า รับผลิตคอลเลคชั่นครอบครัวและชุดสัตว์เลี้ยง',
  keywords: [
    'รับผลิตเสื้อผ้าเด็ก',
    'OEM เสื้อผ้าเด็ก',
    'โรงงานเสื้อผ้าเด็ก',
    'baby cheepy',
    'global apparel kids',
    'ชุดครอบครัว',
  ],
  openGraph: {
    title: 'Baby Cheepy | รับผลิตเสื้อผ้าเด็กครบวงจร',
    description: 'Your One-Stop Babywear Manufacturing Solution — Cute, Comfy, Cheepy!',
    locale: 'th_TH',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body><CartProvider>{children}</CartProvider></body>
    </html>
  );
}
