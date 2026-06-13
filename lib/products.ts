export type Product = {
  id: string;
  name_th: string;
  name_en: string;
  price: number;
  sale_price: number;
  category: string;
  image: string;
  description_th: string;
  description_en: string;
  min_order: number;
  in_stock: boolean;
};

/* ── Sample products — replace with your own data or connect Google Sheets ── */
export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'BC001', name_th: 'ชุดบอดี้สูทเด็กทารก คอตตอน 100%',
    name_en: 'Baby Bodysuit 100% Cotton',
    price: 189, sale_price: 0, category: 'ทารก',
    image: '', description_th: 'นุ่ม ระบายอากาศดี เหมาะสำหรับทารกแรกเกิด',
    description_en: 'Soft and breathable for newborns.', min_order: 1, in_stock: true,
  },
  {
    id: 'BC002', name_th: 'เสื้อยืดเด็กพิมพ์ลาย Cute Animals',
    name_en: 'Kids Tee — Cute Animals Print',
    price: 220, sale_price: 190, category: 'เด็กเล็ก',
    image: '', description_th: 'ผ้าคอตตอน jersey นุ่ม พิมพ์ลายสัตว์น่ารัก',
    description_en: 'Soft jersey cotton with cute animal prints.', min_order: 1, in_stock: true,
  },
  {
    id: 'BC003', name_th: 'ชุดครอบครัว Family Matching Set',
    name_en: 'Family Matching Set',
    price: 890, sale_price: 0, category: 'ครอบครัว',
    image: '', description_th: 'เซ็ตชุดแมตช์ครอบครัว พ่อ แม่ ลูก ผ้าคอตตอน',
    description_en: 'Matching family set for parents & child. 100% cotton.', min_order: 1, in_stock: true,
  },
  {
    id: 'BC004', name_th: 'ชุดสัตว์เลี้ยง Pet Outfit — หมา/แมว',
    name_en: 'Pet Outfit — Dog / Cat',
    price: 290, sale_price: 250, category: 'สัตว์เลี้ยง',
    image: '', description_th: 'ชุดน่ารักสำหรับสุนัขและแมว เนื้อผ้านุ่มสบาย',
    description_en: 'Cute outfit for dogs & cats. Soft comfortable fabric.', min_order: 1, in_stock: true,
  },
  {
    id: 'BC005', name_th: 'กางเกงเด็ก Jogger Pants',
    name_en: 'Kids Jogger Pants',
    price: 250, sale_price: 0, category: 'เด็กเล็ก',
    image: '', description_th: 'กางเกงจ็อกเกอร์เด็ก ผ้าฝ้ายนิ่ม ใส่สบาย',
    description_en: 'Soft cotton jogger pants for kids.', min_order: 1, in_stock: true,
  },
  {
    id: 'BC006', name_th: 'ชุดว่ายน้ำเด็ก Swimwear UV Protection',
    name_en: 'Kids Swimwear UV Protection',
    price: 450, sale_price: 390, category: 'ว่ายน้ำ',
    image: '', description_th: 'ชุดว่ายน้ำเด็ก ป้องกัน UV ผ้าทนคลอรีน',
    description_en: 'Kids swimwear with UV protection and chlorine-resistant fabric.', min_order: 1, in_stock: true,
  },
];

export const CATEGORIES = ['ทั้งหมด', 'ทารก', 'เด็กเล็ก', 'ครอบครัว', 'สัตว์เลี้ยง', 'ว่ายน้ำ'];
export const CATEGORIES_EN = ['All', 'Baby', 'Kids', 'Family', 'Pet', 'Swimwear'];
