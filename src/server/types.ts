export type UserRole = 'customer' | 'admin';

export interface Address {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  addresses: Address[];
  wishlistProductIds: string[];
  createdAt: string;
}

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ProductVariant {
  id: string;
  productId: string;
  size: ProductSize;
  color: string;
  colorHex: string;
  sku: string;
  priceOverridePaise?: number;
  stockQuantity: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  collectionSlug?: string;
  tags: string[];
  fabric: string;
  fit: string;
  careInstructions: string;
  basePricePaise: number; // in integer paise (₹1 = 100 paise)
  salePricePaise?: number; // optional discount price in paise
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  department?: 'men' | 'women' | 'unisex';
  status: 'published' | 'draft';
  images: string[];
  variants: ProductVariant[];
  createdAt: string;
  rating?: number;
  reviewCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  department?: 'men' | 'women' | 'unisex' | 'all';
}

export type ImageDepartment = 'MEN' | 'WOMEN' | 'UNISEX' | 'GENERAL';
export type ImageType = 'PRODUCT' | 'MODEL' | 'LIFESTYLE' | 'HERO' | 'BANNER';

export interface ImageRecord {
  id: string;
  url: string;
  title: string;
  department: ImageDepartment;
  imageType: ImageType;
  category: string;
  productId?: string;
  isPrimary: boolean;
  altText: string;
  needsReview?: boolean;
  reviewReason?: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  bannerImage: string;
  department?: 'men' | 'women' | 'unisex' | 'all';
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'razorpay' | 'cod';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantLabel: string; // e.g. "Olive / L"
  pricePaise: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  shippingAddress: Address;
  subtotalPaise: number;
  discountPaise: number;
  discountCode?: string;
  shippingChargesPaise: number;
  taxPaise: number;
  totalPaise: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  trackingNumber?: string;
  courierName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amountPaise: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  createdAt: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percent' | 'flat';
  value: number; // percentage (e.g. 15 for 15%) or paise (e.g. 25000 for ₹250)
  minOrderPaise: number;
  usageLimit?: number;
  timesUsed: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  subscribedAt: string;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId?: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface StoreSettings {
  announcementText: string;
  announcementEnabled: boolean;
  freeShippingThresholdPaise: number; // e.g. 199900 (₹1,999)
  standardShippingFeePaise: number; // e.g. 14900 (₹149)
  codEnabled: boolean;
  returnDaysWindow: number;
  supportEmail: string;
  supportPhone: string;
  brandStoryHeadline: string;
  brandStoryCopy: string;
  heroHeadline: string;
  heroSubhead: string;
  campaignHeadline: string;
  campaignSubhead: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  details: string;
  timestamp: string;
}
