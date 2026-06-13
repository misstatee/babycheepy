export type Product = {
  id: string;
  name_th: string;
  name_en: string;
  price: number;
  sale_price: number;
  wholesale_price: number;
  category: string;
  image: string;
  description_th: string;
  description_en: string;
  min_order: number;
  in_stock: boolean;
};

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'BC001', name_th: 'ชุดเด็ก — แบบที่ 1',
    name_en: 'Kids Outfit — Style 1',
    price: 399, sale_price: 150, wholesale_price: 99, category: 'เด็กเล็ก',
    image: 'shop/1.jpg', description_th: 'ชุดเด็กเนื้อผ้านุ่ม ใส่สบาย',
    description_en: 'Soft kids outfit, comfortable wear.', min_order: 1, in_stock: true,
  },
  {
    id: 'BC002', name_th: 'ชุดเด็ก — แบบที่ 2',
    name_en: 'Kids Outfit — Style 2',
    price: 399, sale_price: 150, wholesale_price: 99, category: 'เด็กเล็ก',
    image: 'shop/2.jpg', description_th: 'ชุดเด็กเนื้อผ้านุ่ม ใส่สบาย',
    description_en: 'Soft kids outfit, comfortable wear.', min_order: 1, in_stock: true,
  },
  {
    id: 'BC003', name_th: 'ชุดเด็ก — แบบที่ 3',
    name_en: 'Kids Outfit — Style 3',
    price: 399, sale_price: 150, wholesale_price: 99, category: 'เด็กเล็ก',
    image: 'shop/3.jpg', description_th: 'ชุดเด็กเนื้อผ้านุ่ม ใส่สบาย',
    description_en: 'Soft kids outfit, comfortable wear.', min_order: 1, in_stock: true,
  },
  {
    id: 'BC004', name_th: 'ชุดเด็ก — แบบที่ 4',
    name_en: 'Kids Outfit — Style 4',
    price: 399, sale_price: 150, wholesale_price: 99, category: 'เด็กเล็ก',
    image: 'shop/4.jpg', description_th: 'ชุดเด็กเนื้อผ้านุ่ม ใส่สบาย',
    description_en: 'Soft kids outfit, comfortable wear.', min_order: 1, in_stock: true,
  },
];

export const CATEGORIES = ['ทั้งหมด', 'ทารก', 'เด็กเล็ก', 'ครอบครัว', 'สัตว์เลี้ยง', 'ว่ายน้ำ'];
export const CATEGORIES_EN = ['All', 'Baby', 'Kids', 'Family', 'Pet', 'Swimwear'];
