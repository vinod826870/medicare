export type UserRole = 'user' | 'admin';
export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';
export type ContactStatus = 'new' | 'in_progress' | 'resolved';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Medicine {
  id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  prescription_required: boolean;
  manufacturer: string | null;
  dosage: string | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  medicine_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  items: OrderItemData[];
  total_amount: number;
  currency: string;
  status: OrderStatus;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  shipping_address: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  medicine_id: string;
  medicine_name: string;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
}

export interface OrderItemData {
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface MedicineWithCategory extends Medicine {
  category?: Category;
}

export interface CartItemWithMedicine extends CartItem {
  medicine?: Medicine;
}

export interface CheckoutItem {
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface CheckoutRequest {
  items: CheckoutItem[];
  currency?: string;
  payment_method_types?: string[];
  shipping_address?: string;
}

export interface CheckoutResponse {
  url: string;
  sessionId: string;
  orderId: string;
}

export interface PaymentVerificationRequest {
  sessionId: string;
}

export interface PaymentVerificationResponse {
  verified: boolean;
  status: string;
  sessionId: string;
  paymentIntentId?: string;
  amount?: number;
  currency?: string;
  customerEmail?: string;
  customerName?: string;
  orderUpdated?: boolean;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  user_id: string | null;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
  user_id?: string | null;
}

// Medicine Data from Supabase table
export interface MedicineData {
  id: number;
  name: string;
  price: number | null;
  is_discontinued: boolean | null;
  manufacturer_name: string | null;
  type: string | null;
  pack_size_label: string | null;
  short_composition1: string | null;
  salt_composition: string | null;
  side_effects: string | null;
  drug_interactions: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  author: string;
  category: string;
  image_url: string | null;
  read_time: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogPost {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author: string;
  category: string;
  image_url?: string;
  read_time?: number;
  published?: boolean;
}

export interface UpdateBlogPost {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  category?: string;
  image_url?: string;
  read_time?: number;
  published?: boolean;
}

