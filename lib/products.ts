export type Product = {
  id: string;
  code: string;
  name_th: string;
  name_en: string;
  price: number;
  sale_price: number;
  wholesale_price: number;
  category: string;
  image: string;
  description_th: string;
  description_en: string;
  sizes: string[];
  min_order: number;
  in_stock: boolean;
};

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'BC001', code: 'BC-GRL-3M5T-01',
    name_th: 'ชุดเด็กผู้หญิงน่ารัก เลือก SIZE ได้',
    name_en: "Cute Girls' Outfit — Choose Size",
    price: 399, sale_price: 150, wholesale_price: 99, category: 'เด็กเล็ก',
    image: 'shop/1.jpg',
    description_th: 'ชุดเด็กเนื้อผ้านุ่ม ใส่สบาย ลายน่ารัก',
    description_en: 'Soft girls outfit, cute pattern, comfortable wear.',
    sizes: ['3M', '6M', '12M', '18M', '2T', '3T', '4T', '5T'],
    min_order: 1, in_stock: true,
  },
  {
    id: 'BC002', code: 'BC-BOY-3M5T-02',
    name_th: 'ชุดเด็กผู้ชายเท่ๆ เลือก SIZE ได้',
    name_en: "Cool Boys' Outfit — Choose Size",
    price: 399, sale_price: 150, wholesale_price: 99, category: 'เด็กเล็ก',
    image: 'shop/2.jpg',
    description_th: 'ชุดเด็กผู้ชาย ลายเท่ ใส่ทนทาน',
    description_en: "Cool boys' outfit, durable fabric.",
    sizes: ['3M', '6M', '12M', '18M', '2T', '3T', '4T', '5T'],
    min_order: 1, in_stock: true,
  },
  {
    id: 'BC003', code: 'BC-UNI-3M5T-03',
    name_th: 'ชุดเด็ก Unisex สีพาสเทล เลือก SIZE ได้',
    name_en: 'Unisex Pastel Outfit — Choose Size',
    price: 449, sale_price: 170, wholesale_price: 110, category: 'เด็กเล็ก',
    image: 'shop/3.jpg',
    description_th: 'ชุดเด็ก Unisex ผ้านุ่มพิเศษ สีพาสเทลหวาน',
    description_en: 'Unisex kids outfit, extra soft, sweet pastel colors.',
    sizes: ['3M', '6M', '12M', '18M', '2T', '3T'],
    min_order: 1, in_stock: true,
  },
  {
    id: 'BC004', code: 'BC-GRL-3M5T-04',
    name_th: 'ชุดเดรสเด็กหญิง ผ้าคอตตอน เลือก SIZE ได้',
    name_en: "Girls' Cotton Dress — Choose Size",
    price: 459, sale_price: 180, wholesale_price: 119, category: 'เด็กเล็ก',
    image: 'shop/4.jpg',
    description_th: 'เดรสเด็กหญิงผ้าคอตตอน 100% นุ่มสบาย ระบายอากาศดี',
    description_en: "100% cotton girls' dress, breathable and comfortable.",
    sizes: ['12M', '18M', '2T', '3T', '4T', '5T'],
    min_order: 1, in_stock: true,
  },
  {
    id: 'BC005', code: 'BC-FAM-SM5T-05',
    name_th: 'ชุด Family Set พ่อแม่ลูก เลือก SIZE ได้',
    name_en: 'Family Matching Set — Choose Size',
    price: 799, sale_price: 350, wholesale_price: 249, category: 'ครอบครัว',
    image: 'shop/1.jpg',
    description_th: 'ชุดครอบครัวแมทช์กัน ผ้าคอตตอน นุ่มสบาย',
    description_en: 'Matching family outfit set, soft cotton fabric.',
    sizes: ['S', 'M', 'L', 'XL', '2T', '3T', '4T', '5T'],
    min_order: 1, in_stock: true,
  },
  {
    id: 'BC006', code: 'BC-KID-4T8T-06',
    name_th: 'ชุดเด็กลายกราฟิก เลือก SIZE ได้',
    name_en: 'Kids Graphic Outfit — Choose Size',
    price: 499, sale_price: 199, wholesale_price: 139, category: 'เด็กเล็ก',
    image: 'shop/2.jpg',
    description_th: 'ชุดเด็กโตลายกราฟิก เท่ สไตล์ สวมใส่ง่าย',
    description_en: 'Graphic kids outfit, stylish and easy to wear.',
    sizes: ['4T', '5T', '6T', '7T', '8T'],
    min_order: 1, in_stock: true,
  },
  {
    id: 'BC007', code: 'BC-BAB-NB18M-07',
    name_th: 'ชุดบอดี้สูทเด็กทารก ผ้านุ่มพิเศษ เลือก SIZE ได้',
    name_en: 'Baby Bodysuit Extra Soft — Choose Size',
    price: 349, sale_price: 130, wholesale_price: 89, category: 'ทารก',
    image: 'shop/3.jpg',
    description_th: 'บอดี้สูทเด็กทารก ผ้าโมดัล นุ่มพิเศษ ระคายเคืองผิวน้อย',
    description_en: 'Baby bodysuit, modal fabric, extra soft, low irritation.',
    sizes: ['NB', '3M', '6M', '12M', '18M'],
    min_order: 1, in_stock: true,
  },
  {
    id: 'BC008', code: 'BC-SWM-2T6T-08',
    name_th: 'ชุดว่ายน้ำเด็ก UV Protection เลือก SIZE ได้',
    name_en: 'Kids Swimwear UV Protection — Choose Size',
    price: 549, sale_price: 220, wholesale_price: 159, category: 'ว่ายน้ำ',
    image: 'shop/4.jpg',
    description_th: 'ชุดว่ายน้ำเด็ก UPF 50+ กัน UV แห้งเร็ว',
    description_en: 'Kids swimwear UPF 50+ UV protection, quick dry.',
    sizes: ['2T', '3T', '4T', '5T', '6T'],
    min_order: 1, in_stock: false,
  },
];

export const CATEGORIES = ['ทั้งหมด', 'ทารก', 'เด็กเล็ก', 'ครอบครัว', 'สัตว์เลี้ยง', 'ว่ายน้ำ'];
export const CATEGORIES_EN = ['All', 'Baby', 'Kids', 'Family', 'Pet', 'Swimwear'];
