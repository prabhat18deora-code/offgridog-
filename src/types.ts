export type {
  User,
  Address,
  Product,
  ProductVariant,
  ProductSize,
  Category,
  Collection,
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  DiscountCode,
  Review,
  StoreSettings,
  AuditLog,
  ImageRecord,
  ImageDepartment,
  ImageType,
} from './server/types.ts';

export interface CartItem {
  productId: string;
  variantId: string;
  productName: string;
  variantLabel: string;
  imageUrl: string;
  pricePaise: number;
  quantity: number;
  lineTotalPaise: number;
  availableStock: number;
  inStock: boolean;
}

export interface CartSummary {
  items: CartItem[];
  subtotalPaise: number;
  discountPaise: number;
  discountError?: string;
  shippingChargesPaise: number;
  freeShippingThresholdPaise: number;
  freeShippingQualified: boolean;
  totalPaise: number;
}
