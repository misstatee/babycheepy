// รายการหัวข้อบทความ — แก้ไขที่ไฟล์นี้ที่เดียว หน้า /articles จะอัปเดตเอง
// เมื่อเขียนบทความเสร็จแล้ว ให้เปลี่ยน status เป็น 'published' (และเพิ่มหน้าบทความตาม slug)

export type ArticleStatus = 'soon' | 'published';

export interface ArticleTopic {
  slug: string;
  title: string;
  desc: string;
  status: ArticleStatus;
}

export interface ArticleCategory {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  bg: string; // tailwind class (ใช้สีการ์ดที่มีอยู่แล้วในเว็บ)
  topics: ArticleTopic[];
}

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  {
    id: 'color-pattern',
    emoji: '🎨',
    title: 'เทรนด์สีและลายผ้า',
    desc: 'สีและลายที่กำลังมาแรงสำหรับเสื้อผ้าเด็ก',
    bg: 'bg-card-pink',
    topics: [
      { slug: 'trending-colors-kids-wear', title: 'สีมาแรงสำหรับเสื้อผ้าเด็กฤดูกาลถัดไป และวิธีเลือกสีให้เหมาะกับสีผิวเด็กไทย', desc: 'ดูว่าสีไหนกำลังมา และเลือกใช้อย่างไรให้ลูกดูสดใส', status: 'published' },
      { slug: 'pastel-vs-bright', title: 'โทนพาสเทลกับโทนสดใส แบบไหนขายดีกว่ากัน', desc: 'เปรียบเทียบสองโทนยอดนิยม พร้อมข้อดีข้อเสียของแต่ละแบบ', status: 'published' },
      { slug: 'popular-kids-prints', title: 'ลายผ้ายอดนิยมของเสื้อผ้าเด็ก: ลายผลไม้ ลายสัตว์ ลายขนมเบเกอรี่', desc: 'รวมลายที่พ่อแม่ชอบและเด็กๆ ใส่แล้วน่ารัก', status: 'published' },
      { slug: 'color-and-mood', title: 'สีกับอารมณ์เด็ก: สีไหนช่วยให้ดูสดใส สีไหนใส่ถ่ายรูปสวย', desc: 'เลือกสีให้เหมาะกับโอกาสและรูปที่อยากได้', status: 'published' },
    ],
  },
  {
    id: 'fashion-trends',
    emoji: '👗',
    title: 'เทรนด์แฟชั่นเด็กและครอบครัว',
    desc: 'ไอเดียและแนวโน้มชุดเด็ก ชุดครอบครัว และชุดสัตว์เลี้ยง',
    bg: 'bg-card-blue',
    topics: [
      { slug: 'family-matching-sets', title: 'ชุดเซ็ตคู่พี่น้องและชุดแม่ลูก/พ่อลูก: ทำไมถึงเป็นที่นิยม', desc: 'เทรนด์ชุดแมตช์ครอบครัวและวิธีเลือกให้เข้ากัน', status: 'soon' },
      { slug: 'kids-swimwear-thailand', title: 'ชุดว่ายน้ำเด็กที่ปลอดภัยและน่ารัก เลือกอย่างไรให้เหมาะกับทะเลไทย', desc: 'ผ้า การป้องกันแดด และดีไซน์ที่ควรดู', status: 'published' },
      { slug: 'pet-outfit-trend', title: 'เทรนด์ชุดสัตว์เลี้ยงคู่เจ้าของ (Pet outfit)', desc: 'ชุดน้องหมาน้องแมวที่ใส่คู่กับเจ้าของได้', status: 'soon' },
      { slug: 'festival-kids-outfits', title: 'เสื้อผ้าเด็กสำหรับเทศกาล: ปีใหม่ สงกรานต์ ฮัลโลวีน และวันเด็ก', desc: 'ไอเดียแต่งตัวเด็กตามเทศกาลตลอดปี', status: 'soon' },
    ],
  },
  {
    id: 'fabric-safety',
    emoji: '🧵',
    title: 'ผ้าและความปลอดภัย',
    desc: 'ความรู้เรื่องผ้าและมาตรฐานสำหรับเสื้อผ้าเด็ก',
    bg: 'bg-card-mint',
    topics: [
      { slug: 'cotton-for-kids-skin', title: 'ผ้าคอตตอนแบบไหนเหมาะกับผิวเด็ก และการเลือกผ้าสำหรับอากาศร้อนชื้น', desc: 'เข้าใจชนิดผ้าก่อนเลือกซื้อหรือสั่งผลิต', status: 'published' },
      { slug: 'oeko-tex-explained', title: 'มาตรฐาน OEKO-TEX คืออะไร และทำไมพ่อแม่ควรสนใจ', desc: 'อธิบายมาตรฐานความปลอดภัยของสิ่งทอแบบเข้าใจง่าย', status: 'published' },
      { slug: 'wash-care-kids-clothes', title: 'วิธีดูแลและซักเสื้อผ้าเด็กให้สีไม่ตกและผ้าไม่ยืด', desc: 'เคล็ดลับซักและเก็บรักษาให้ใส่ได้นาน', status: 'published' },
    ],
  },
  {
    id: 'parent-guides',
    emoji: '📏',
    title: 'คู่มือสำหรับพ่อแม่',
    desc: 'เลือกไซส์และแมทช์ชุดให้ลูก',
    bg: 'bg-card-lavender',
    topics: [
      { slug: 'choose-kids-size', title: 'วิธีเลือกไซส์เสื้อผ้าเด็กให้พอดี', desc: 'วัดตัวและอ่านตารางไซส์อย่างไรให้ไม่พลาด', status: 'soon' },
      { slug: 'photo-outfit-ideas', title: 'ไอเดียแมทช์ชุดเด็กสำหรับถ่ายรูปและงานพิเศษ', desc: 'จับคู่ชุดและสีสำหรับวันสำคัญของลูก', status: 'soon' },
    ],
  },
];
