import MemberNav from '../components/member/MemberNav';

export default function MemberTermsPage() {
  return (
    <main className="min-h-screen bg-cream font-prompt">
      <MemberNav />
      <article className="max-w-3xl mx-auto px-4 py-10">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-orange-100 text-sm leading-7 text-gray-700">
          <p className="chip mb-4">ข้อกำหนดและเงื่อนไขสมาชิก</p>
          <h1 className="text-3xl font-extrabold text-gray-900">Babycheepy Brand Club</h1>
          <p className="mt-5">
            ค่าบริการ 99 บาทเป็นค่าบริการสมัคร Babycheepy Brand Club แบบชำระครั้งเดียว ไม่มีค่าบริการสมาชิกรายเดือน
            และไม่มีค่าต่ออายุสมาชิก สมาชิกสามารถใช้ฟีเจอร์ที่รวมอยู่ในแพ็กเกจได้ตามเงื่อนไขและจำนวนสิทธิ์ที่ Baby Cheepy กำหนด
          </p>
          <p className="mt-4">
            สิทธิ์ชุดภาพนางแบบ AI รวมจำนวน 1 เซ็ต ภายในเซ็ตประกอบด้วยภาพ Mockup ชุดจำนวน 1 ภาพ
            และภาพนางแบบ AI จำนวน 1 คน จำนวน 5 ท่าทาง รวมทั้งหมด 6 ภาพ สมาชิกสามารถเลือกนางแบบจากคลังที่ Baby Cheepy จัดเตรียมไว้ให้เท่านั้น
          </p>
          <p className="mt-4">
            การเปลี่ยนนางแบบ เปลี่ยนชุด เปลี่ยนลายผ้า เพิ่มจำนวนภาพ เพิ่มจำนวนท่าทาง หรือสร้างเซ็ตเพิ่มเติม อาจมีค่าบริการเพิ่ม
          </p>
          <p className="mt-4">ระบบติดตามงานผลิตใช้สำหรับงานที่สั่งผลิตกับ Baby Cheepy เท่านั้น</p>
          <p className="mt-4">
            Baby Cheepy ขอสงวนสิทธิ์ระงับบัญชีที่มีการใช้งานผิดวัตถุประสงค์ แชร์บัญชี ใช้ข้อมูลผู้อื่น
            หรือพยายามเข้าถึงระบบโดยไม่ได้รับอนุญาต
          </p>
          <p className="mt-4">
            Baby Cheepy ขอสงวนสิทธิ์ปรับปรุง เปลี่ยนแปลง หรือยุติบางฟีเจอร์ หากมีเหตุจำเป็นทางเทคนิค กฎหมาย
            หรือธุรกิจ โดยจะแจ้งสมาชิกตามความเหมาะสม
          </p>
          <div className="mt-6 rounded-2xl bg-pink-50 p-4 text-xs text-gray-600">
            <p className="font-extrabold text-gray-900">สิทธิ์พื้นฐานไม่รวม</p>
            <p>การเปลี่ยนนางแบบหลังเริ่มดำเนินงาน, การเปลี่ยนชุดหลังเริ่มดำเนินงาน, การเพิ่มจำนวนรูป, การเพิ่มนางแบบมากกว่า 1 คน, การสร้างนางแบบใหม่เฉพาะแบรนด์, และการแก้ไขงานเกินจำนวนรอบที่กำหนด</p>
          </div>
        </div>
      </article>
    </main>
  );
}
