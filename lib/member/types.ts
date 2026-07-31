export const BRAND_CLUB_TYPE = 'brand_club_lifetime' as const;

export const BRAND_CLUB_PACKAGE = {
  name: 'Babycheepy Brand Club',
  description:
    'คลับสำหรับเจ้าของแบรนด์เสื้อผ้าเด็ก ที่ช่วยให้การวางแผนสินค้า ทดลองชุด ทำภาพสินค้า และติดตามงานผลิตง่ายขึ้น',
  priceBaht: 99,
  membershipType: BRAND_CLUB_TYPE,
  aiModelSetTotal: 1,
  imagesPerSet: 6,
  mockupImagesPerSet: 1,
  modelImagesPerSet: 5,
};

export type MembershipType = typeof BRAND_CLUB_TYPE;
export type MembershipStatus = 'pending' | 'active' | 'suspended' | 'rejected';
export type UserRole = 'member' | 'admin';

export type AiModelStatus = 'active' | 'inactive';

export type AiModelRequestStatus =
  | 'draft'
  | 'submitted'
  | 'waiting_for_details'
  | 'accepted'
  | 'in_progress'
  | 'review'
  | 'revision'
  | 'completed'
  | 'cancelled';

export type CreditTransactionType = 'grant' | 'debit' | 'refund' | 'adjustment';

export type DeliverableKind =
  | 'mockup'
  | 'model_pose_1'
  | 'model_pose_2'
  | 'model_pose_3'
  | 'model_pose_4'
  | 'model_pose_5';

export const membershipStatusText: Record<MembershipStatus, string> = {
  pending:
    'บัญชี Babycheepy Brand Club ของคุณอยู่ระหว่างการตรวจสอบหลักฐานการชำระเงิน กรุณารอการอนุมัติจากแอดมิน',
  active: 'บัญชี Babycheepy Brand Club ของคุณพร้อมใช้งานแล้ว',
  suspended: 'บัญชีสมาชิกของคุณถูกระงับ กรุณาติดต่อแอดมิน Baby Cheepy',
  rejected: 'การสมัคร Babycheepy Brand Club ของคุณไม่ผ่านการอนุมัติ กรุณาติดต่อแอดมินเพื่อสอบถามรายละเอียด',
};

export const aiModelRequestStatusText: Record<AiModelRequestStatus, string> = {
  draft: 'บันทึกร่าง',
  submitted: 'ส่งคำขอแล้ว',
  waiting_for_details: 'รอข้อมูลเพิ่มเติม',
  accepted: 'รับงานแล้ว',
  in_progress: 'กำลังดำเนินการ',
  review: 'รอตรวจสอบ',
  revision: 'กำลังแก้ไข',
  completed: 'ส่งมอบแล้ว',
  cancelled: 'ยกเลิก',
};

export const productionStatusOptions = [
  'รับข้อมูลแล้ว',
  'รอใบเสนอราคา',
  'รอชำระเงิน',
  'รอออกแบบ',
  'รออนุมัติแบบ',
  'รอจัดเตรียมผ้า',
  'กำลังตัด',
  'กำลังเย็บ',
  'กำลังปักหรือสกรีน',
  'ตรวจสอบคุณภาพ',
  'กำลังแก้ไข',
  'กำลังแพ็ก',
  'พร้อมจัดส่ง',
  'จัดส่งแล้ว',
  'เสร็จสิ้น',
  'พักงาน',
  'ยกเลิก',
] as const;

export type ProductionStatus = (typeof productionStatusOptions)[number];

export interface UserRecord {
  id: string;
  first_name: string;
  last_name: string;
  brand_name: string;
  phone: string;
  line_id: string | null;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface MembershipRecord {
  id: string;
  user_id: string;
  membership_type: MembershipType;
  status: MembershipStatus;
  applied_at: string;
  paid_at: string | null;
  approved_at: string | null;
  approved_by: string | null;
  payment_proof_id: string | null;
  admin_note: string | null;
  suspended_at: string | null;
  suspended_reason: string | null;
  expires_at: string | null;
  ai_model_set_total: number;
  ai_model_set_used: number;
  images_per_set: number;
  mockup_images_per_set: number;
  model_images_per_set: number;
  user?: UserRecord;
}

export interface PaymentProofRecord {
  id: string;
  user_id: string;
  membership_id: string | null;
  storage_bucket: string;
  storage_path: string;
  original_filename: string;
  content_type: string;
  byte_size: number;
  sha256: string;
  status: string;
  created_at: string;
}

export interface AiModelRecord {
  id: string;
  model_code: string;
  display_name: string;
  preview_bucket: string | null;
  preview_path: string | null;
  approx_age: string | null;
  gender: string | null;
  style: string | null;
  skin_tone: string | null;
  hair_style: string | null;
  suitable_age_range: string | null;
  status: AiModelStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AiModelRequestRecord {
  id: string;
  user_id: string;
  membership_id: string;
  brand_name: string;
  product_name: string;
  product_type: string;
  ai_model_id: string;
  status: AiModelRequestStatus;
  aspect_ratio: string;
  background_style: string;
  usage_channel: string;
  notes: string | null;
  confirmation_checked: boolean;
  credit_debited: boolean;
  revision_rounds_included: number;
  revision_rounds_used: number;
  started_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  ai_model?: AiModelRecord;
  user?: UserRecord;
}

export interface AiModelDeliverableRecord {
  id: string;
  request_id: string;
  user_id: string;
  deliverable_kind: DeliverableKind;
  storage_bucket: string;
  storage_path: string;
  original_filename: string;
  content_type: string;
  byte_size: number;
  sha256: string;
  created_at: string;
}

export interface ProductionOrderRecord {
  id: string;
  user_id: string;
  brand_name: string;
  product_name: string;
  product_image_bucket: string | null;
  product_image_path: string | null;
  quantity: number | null;
  received_at: string | null;
  started_at: string | null;
  expected_done_at: string | null;
  current_status: string;
  customer_note: string | null;
  internal_note: string | null;
  tracking_number: string | null;
  shipping_carrier: string | null;
  show_to_customer: boolean;
  updated_at: string;
  created_at: string;
  user?: UserRecord;
}

export interface NotificationRecord {
  id: string;
  user_id: string;
  title: string;
  body: string;
  href: string | null;
  read_at: string | null;
  created_at: string;
}
