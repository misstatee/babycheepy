import MemberNav from '../components/member/MemberNav';
import MemberRegisterForm from '../components/member/MemberRegisterForm';
import { getPaymentSettings } from '../../lib/member/config';
import { BRAND_CLUB_PACKAGE } from '../../lib/member/types';

export default function MemberRegisterPage() {
  const payment = getPaymentSettings();

  return (
    <main className="min-h-screen bg-cream font-prompt text-gray-800">
      <MemberNav />
      <section className="max-w-6xl mx-auto px-4 py-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-orange-100">
            <p className="chip mb-4">สมัคร Babycheepy Brand Club</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{BRAND_CLUB_PACKAGE.name}</h1>
            <p className="mt-2 text-xl font-extrabold text-brand-pink">คลับสำหรับเจ้าของแบรนด์เสื้อผ้าเด็ก</p>
            <p className="mt-4 text-2xl font-extrabold">สมัครครั้งเดียว 99 บาท</p>
            <p className="mt-2 font-bold text-gray-700">ไม่มีค่าบริการรายเดือน</p>
            <p className="font-bold text-gray-700">ใช้งานสิทธิ์สมาชิกได้ตลอดไปตามเงื่อนไข</p>
            <p className="mt-4 text-sm leading-7 text-gray-600">
              สมัคร Babycheepy Brand Club เพื่อเข้าใช้เครื่องมือและบริการที่ช่วยให้เจ้าของแบรนด์เสื้อผ้าเด็กทำงานง่ายขึ้น
              ตั้งแต่การวัดไซส์ ทดลองชุด ทำภาพสินค้า ไปจนถึงติดตามงานผลิต
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-pink-100">
            <h2 className="font-extrabold text-gray-900">สิทธิประโยชน์หลัก</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>ใช้งาน AI วัดไซส์</li>
              <li>ใช้งาน AI ลองชุดเสมือนจริง</li>
              <li>ติดตามสถานะงานผลิต</li>
              <li>รับชุดภาพนางแบบ AI 1 เซ็ต รวม 6 ภาพ</li>
              <li>เลือกนางแบบ AI จากคลังของ Baby Cheepy</li>
              <li>ทดลองใช้ฟีเจอร์ใหม่บางรายการก่อนบุคคลทั่วไป</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-orange-100 text-sm text-gray-600">
            <h2 className="font-extrabold text-gray-900">ข้อมูลชำระเงิน</h2>
            {payment.qrCodeUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={payment.qrCodeUrl} alt="QR Code ชำระเงิน Babycheepy Brand Club" className="mt-4 w-48 rounded-2xl border border-gray-100" />
            ) : (
              <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-gray-500">ยังไม่ได้ตั้งค่า QR Code ผ่าน Environment Variable</div>
            )}
            <div className="mt-4 space-y-1">
              <p>ชื่อบัญชี: <strong>{payment.accountName || 'ตั้งค่า BRAND_CLUB_PAYMENT_ACCOUNT_NAME'}</strong></p>
              <p>ธนาคาร: <strong>{payment.bankName || 'ตั้งค่า BRAND_CLUB_PAYMENT_BANK_NAME'}</strong></p>
              <p>เลขบัญชี/ข้อมูลรับชำระ: <strong>{payment.accountNumber || 'ตั้งค่า BRAND_CLUB_PAYMENT_ACCOUNT_NUMBER'}</strong></p>
              <p>จำนวนเงิน: <strong>{payment.amountBaht} บาท</strong></p>
              <p>{payment.paymentNote}</p>
            </div>
          </div>
          <div className="rounded-3xl bg-pink-50 p-5 text-xs leading-6 text-gray-600 border border-pink-100">
            <p className="font-extrabold text-gray-900">หมายเหตุ</p>
            <p>ฟีเจอร์บางรายการอาจมีข้อจำกัดจำนวนครั้ง บริการที่มีต้นทุนเพิ่มเติมอาจมีค่าบริการแยก</p>
            <p>ระบบติดตามงานผลิตใช้ได้เฉพาะงานที่ผลิตกับ Baby Cheepy</p>
            <p>สิทธิ์ชุดภาพนางแบบ AI ได้รับ 1 เซ็ตต่อการสมัคร ไม่ใช่บริการสร้างภาพ AI แบบไม่จำกัด</p>
            <p>การสมัครสมาชิกไม่ได้รวมค่าผลิตสินค้า ค่าผ้า ค่าขนส่ง หรือค่าใช้จ่ายการผลิตอื่น</p>
          </div>
        </div>
        <div>
          <MemberRegisterForm />
          <p className="mt-4 text-center text-sm text-gray-500">
            มีบัญชีแล้ว? <a href="/member-login" className="font-bold text-brand-pink">เข้าสู่ระบบ</a> ·{' '}
            <a href="/member-terms" className="font-bold text-brand-pink">อ่านข้อกำหนด</a>
          </p>
        </div>
      </section>
    </main>
  );
}
