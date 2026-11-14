import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  User,
  Product,
  Category,
  Collection,
  Order,
  PaymentRecord,
  DiscountCode,
  NewsletterSubscription,
  Review,
  StoreSettings,
  AuditLog,
  ImageRecord,
  ImageDepartment,
  ImageType,
} from './types.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'offgrid_db.json');

export interface DatabaseSchema {
  users: User[];
  products: Product[];
  categories: Category[];
  collections: Collection[];
  orders: Order[];
  payments: PaymentRecord[];
  discountCodes: DiscountCode[];
  newsletterSubscriptions: NewsletterSubscription[];
  reviews: Review[];
  settings: StoreSettings;
  auditLogs: AuditLog[];
  mediaImages: ImageRecord[];
}

export function hashPassword(password: string): string {
  const salt = 'offgrid_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

const DEFAULT_SETTINGS: StoreSettings = {
  announcementText: 'Complimentary shipping across India on orders above ₹1,999 · Discover the Everyday Uniform',
  announcementEnabled: true,
  freeShippingThresholdPaise: 199900, // ₹1,999
  standardShippingFeePaise: 14900, // ₹149
  codEnabled: true,
  returnDaysWindow: 7,
  supportEmail: 'support@offgridog.in',
  supportPhone: '+91 98765 43210',
  brandStoryHeadline: 'NOT HERE TO FIT IN.',
  brandStoryCopy:
    'OffGrid OG was founded on an uncompromising principle: modern style should feel inherently your own. We craft a disciplined wardrobe of versatile essentials, clean silhouettes, and tactile fabrics that exist outside fleeting trends—giving you room for true individuality.',
  heroHeadline: 'FIND YOUR OWN WAY.',
  heroSubhead: 'Everyday essentials. Uncommon perspective.',
  campaignHeadline: 'LESS NOISE. MORE YOU.',
  campaignSubhead: 'Considered silhouettes. Versatile layers. Pieces that work effortlessly on your terms.',
};

function getSeedDatabase(): DatabaseSchema {
  const adminUser: User = {
    id: 'usr_admin_001',
    email: 'admin@offgridog.in',
    passwordHash: hashPassword('admin_offgrid_2026'),
    fullName: 'Store Admin',
    role: 'admin',
    addresses: [],
    wishlistProductIds: [],
    createdAt: new Date().toISOString(),
  };

  const demoCustomer: User = {
    id: 'usr_cust_001',
    email: 'prabhat18deora@gmail.com',
    passwordHash: hashPassword('customer_2026'),
    fullName: 'Prabhat Deora',
    phone: '+91 98765 43210',
    role: 'customer',
    addresses: [
      {
        id: 'addr_001',
        userId: 'usr_cust_001',
        fullName: 'Prabhat Deora',
        phone: '+91 98765 43210',
        line1: '402, Sunset Boulevard, Bandra West',
        line2: 'Near Pali Hill',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400050',
        country: 'India',
        isDefault: true,
      },
    ],
    wishlistProductIds: ['prod_polo_olive', 'prod_trousers_sand'],
    createdAt: new Date().toISOString(),
  };

  const categories: Category[] = [
    {
      id: 'cat_tshirts',
      name: 'T-Shirts',
      slug: 't-shirts',
      description: 'Heavyweight premium combed cotton tees designed with balanced dropped shoulder cuts.',
      image: '/src/assets/images/product_tee_heavyweight_1791888627295.jpg',
      department: 'men',
    },
    {
      id: 'cat_polos',
      name: 'Polos',
      slug: 'polos',
      description: 'Textured knit and refined pique polos engineered for relaxed smart casual elegance.',
      image: '/src/assets/images/product_polo_olive_1791888587605.jpg',
      department: 'men',
    },
    {
      id: 'cat_shirts',
      name: 'Shirts',
      slug: 'shirts',
      description: 'Crisp oxford cotton and textured weaves with soft structured collars.',
      image: '/src/assets/images/product_oxford_shirt_1791888627723.jpg',
      department: 'men',
    },
    {
      id: 'cat_trousers',
      name: 'Trousers',
      slug: 'trousers',
      description: 'Pleated and straight-leg trousers with fluid drape and tailored comfort.',
      image: '/src/assets/images/category_trousers_look_1791888586736.jpg',
      department: 'men',
    },
    {
      id: 'cat_overshirts',
      name: 'Overshirts',
      slug: 'overshirts',
      description: 'Substantial transitional outerwear layers tailored for effortless modularity.',
      image: '/src/assets/images/campaign_editorial_layering_1791888586191.jpg',
      department: 'men',
    },
    {
      id: 'cat_jackets',
      name: 'Jackets',
      slug: 'jackets',
      description: 'Minimalist architectural silhouettes crafted with durable weather-resistant finishes.',
      image: '/src/assets/images/product_bomber_jacket_1791888628108.jpg',
      department: 'men',
    },
    {
      id: 'cat_outfits',
      name: 'Complete Outfits',
      slug: 'outfits',
      description: 'Curated lookbook pairings that take the hesitation out of everyday styling.',
      image: '/src/assets/images/outfit_streetwear_coord_1791888587655.jpg',
      department: 'men',
    },
    {
      id: 'cat_wmn_tops',
      name: 'T-Shirts & Tops',
      slug: 't-shirts-tops',
      description: 'Heavyweight cropped tees, tanks, and sculpted knit tops.',
      image: '/src/assets/images/women_tops_editorial_1792062525021.jpg',
      department: 'women',
    },
    {
      id: 'cat_wmn_shirts',
      name: 'Women Shirts',
      slug: 'women-shirts',
      description: 'Lustrous breathable poplin and boyfriend button-downs.',
      image: '/src/assets/images/women_relaxed_poplin_shirt_1792409673934.jpg',
      department: 'women',
    },
    {
      id: 'cat_wmn_trousers',
      name: 'Women Trousers',
      slug: 'women-trousers',
      description: 'Fluid drape wide-leg trousers in airy neutral tones.',
      image: '/src/assets/images/women_fluid_wide_trousers_1792409690642.jpg',
      department: 'women',
    },
    {
      id: 'cat_wmn_jeans',
      name: 'Jeans',
      slug: 'women-jeans',
      description: 'Authentic organic washed denim tailored with clean straight lines.',
      image: '/src/assets/images/product_women_jeans_1792061307710.jpg',
      department: 'women',
    },
    {
      id: 'cat_wmn_coord',
      name: 'Co-ord Sets',
      slug: 'co-ord-sets',
      description: 'Synchronized utilitarian cropped overshirts and wide trousers.',
      image: '/src/assets/images/product_women_coord_1792061307583.jpg',
      department: 'women',
    },
    {
      id: 'cat_wmn_dresses',
      name: 'Dresses',
      slug: 'dresses',
      description: 'Column knit maxi silhouettes and minimal summer slips.',
      image: '/src/assets/images/product_women_dress_1792061307251.jpg',
      department: 'women',
    },
    {
      id: 'cat_wmn_outerwear',
      name: 'Outerwear',
      slug: 'outerwear',
      description: 'Architectural oversized blazers and structured transitional layers.',
      image: '/src/assets/images/women_outerwear_blazer_1792062522398.jpg',
      department: 'women',
    },
    {
      id: 'cat_wmn_accessories',
      name: 'Accessories',
      slug: 'accessories',
      description: 'Saddle leather totes, archival canvas bags, and utilitarian essentials.',
      image: '/src/assets/images/product_canvas_tote_bag_1792409743795.jpg',
      department: 'women',
    },
    {
      id: 'cat_sweatshirts',
      name: 'Sweatshirts',
      slug: 'sweatshirts',
      description: 'Heavyweight French terry crewnecks and loopback fleece designed for effortless layering.',
      image: '/src/assets/images/outfit_streetwear_coord_1791888587655.jpg',
      department: 'men',
    },
    {
      id: 'cat_jeans',
      name: 'Jeans',
      slug: 'jeans',
      description: 'Washed selvedge and organic cotton denim tailored with clean straight lines.',
      image: '/src/assets/images/men_selvedge_denim_jeans_1792409708489.jpg',
      department: 'men',
    },
  ];

  const collections: Collection[] = [
    {
      id: 'col_everyday_uniform',
      name: 'Everyday Uniform',
      slug: 'everyday-uniform',
      description: 'Core daily staples calibrated for comfort, movement, and enduring subtlety.',
      bannerImage: '/src/assets/images/hero_fashion_campaign_1791888586032.jpg',
      department: 'men',
    },
    {
      id: 'col_warm_minimalism',
      name: 'Warm Minimalism',
      slug: 'warm-minimalism',
      description: 'Sun-baked sand tones, rich olives, and warm ivory textures.',
      bannerImage: '/src/assets/images/campaign_editorial_layering_1791888586191.jpg',
      department: 'men',
    },
    {
      id: 'col_wmn_graphic_tees',
      name: 'Graphic Tees',
      slug: 'graphic-tees',
      description: 'Express yourself. Wear your story. Oversized vintage graphics and retro typography.',
      bannerImage: '/images/women_graphic_tees.jpg',
      department: 'women',
    },
    {
      id: 'col_wmn_oversized_tees',
      name: 'Oversized Tees',
      slug: 'oversized-tees',
      description: 'Relaxed fits. Everyday attitude. Heavyweight streetwear silhouettes with architectural presence.',
      bannerImage: '/images/women_oversized_tees.jpg',
      department: 'women',
    },
    {
      id: 'col_wmn_essentials',
      name: 'Everyday Essentials',
      slug: 'essentials',
      description: 'Comfort meets understated style. Minimal graphics and pure tactile organic cottons.',
      bannerImage: '/images/women_everyday_essentials.jpg',
      department: 'women',
    },
  ];

  const products: Product[] = [
    {
      id: 'prod_polo_olive',
      slug: 'og-everyday-polo-olive',
      name: 'OG Everyday Polo',
      tagline: 'Refined knit texture with a modern tailored drape',
      description:
        'Crafted from 100% long-staple combed cotton knit with a subtle ribbed knit collar and understated placket. Cut for an easy, confident silhouette that bridges relaxed weekend leisure and polished evening dinners.',
      category: 'Polos',
      collectionSlug: 'warm-minimalism',
      tags: ['polo', 'knit', 'olive', 'smart-casual', 'essentials'],
      fabric: '100% Long-Staple Combed Cotton (240 GSM Knit)',
      fit: 'Relaxed Tailored Fit. Model is 6’1” (185 cm) wearing size L.',
      careInstructions: 'Machine wash cold inside out on gentle cycle. Lay flat to dry in shade. Warm iron if needed.',
      basePricePaise: 249900, // ₹2,499
      salePricePaise: 219900, // ₹2,199
      isNew: true,
      isBestSeller: true,
      isFeatured: true,
      department: 'men',
      status: 'published',
      images: [
        '/src/assets/images/product_polo_olive_1791888587605.jpg',
        '/src/assets/images/hero_fashion_campaign_1791888586032.jpg',
      ],
      variants: [
        { id: 'var_polo_ol_s', productId: 'prod_polo_olive', size: 'S', color: 'Olive', colorHex: '#777B5A', sku: 'OG-POLO-OLV-S', stockQuantity: 14 },
        { id: 'var_polo_ol_m', productId: 'prod_polo_olive', size: 'M', color: 'Olive', colorHex: '#777B5A', sku: 'OG-POLO-OLV-M', stockQuantity: 28 },
        { id: 'var_polo_ol_l', productId: 'prod_polo_olive', size: 'L', color: 'Olive', colorHex: '#777B5A', sku: 'OG-POLO-OLV-L', stockQuantity: 22 },
        { id: 'var_polo_ol_xl', productId: 'prod_polo_olive', size: 'XL', color: 'Olive', colorHex: '#777B5A', sku: 'OG-POLO-OLV-XL', stockQuantity: 10 },
      ],
      createdAt: '2026-09-01T10:00:00Z',
    },
    {
      id: 'prod_trousers_sand',
      slug: 'og-pleated-relaxed-trousers',
      name: 'OG Pleated Relaxed Trousers',
      tagline: 'Single pleat front with an effortless fluid drape',
      description:
        'A masterclass in proportions. Tailored with single deep forward pleats, an elasticated back waistband for hidden comfort, and wide-tapered legs that sit neatly over modern sneakers or classic loafers.',
      category: 'Trousers',
      collectionSlug: 'warm-minimalism',
      tags: ['trousers', 'pleated', 'beige', 'smart-casual', 'relax-fit'],
      fabric: 'Tencel & Cotton Blend with soft micro-twill weave (280 GSM)',
      fit: 'Relaxed Straight Taper. Mid-rise with expandable waist.',
      careInstructions: 'Dry clean recommended or gentle cold wash. Line dry. Steam press.',
      basePricePaise: 329900, // ₹3,299
      salePricePaise: 289900, // ₹2,899
      isNew: true,
      isBestSeller: true,
      isFeatured: true,
      department: 'men',
      status: 'published',
      images: [
        '/src/assets/images/category_trousers_look_1791888586736.jpg',
        '/src/assets/images/hero_fashion_campaign_1791888586032.jpg',
      ],
      variants: [
        { id: 'var_tr_sand_s', productId: 'prod_trousers_sand', size: 'S', color: 'Sand Beige', colorHex: '#D6C7AE', sku: 'OG-TRS-SND-S', stockQuantity: 12 },
        { id: 'var_tr_sand_m', productId: 'prod_trousers_sand', size: 'M', color: 'Sand Beige', colorHex: '#D6C7AE', sku: 'OG-TRS-SND-M', stockQuantity: 25 },
        { id: 'var_tr_sand_l', productId: 'prod_trousers_sand', size: 'L', color: 'Sand Beige', colorHex: '#D6C7AE', sku: 'OG-TRS-SND-L', stockQuantity: 18 },
        { id: 'var_tr_sand_xl', productId: 'prod_trousers_sand', size: 'XL', color: 'Sand Beige', colorHex: '#D6C7AE', sku: 'OG-TRS-SND-XL', stockQuantity: 8 },
      ],
      createdAt: '2026-09-02T10:00:00Z',
    },
    {
      id: 'prod_tee_oversized',
      slug: 'og-essential-oversized-tee',
      name: 'OG Essential Oversized Tee',
      tagline: 'Heavyweight 280 GSM boxy cut with clean collar bind',
      description:
        'Engineered for true structure without feeling stiff. Cut with a dropped shoulder seam, wide ribbed collar band, and a generous boxy chest that hangs with substantial architectural presence.',
      category: 'T-Shirts',
      collectionSlug: 'everyday-uniform',
      tags: ['t-shirt', 'oversized', 'heavyweight', 'ivory', 'streetwear', 'men'],
      fabric: '100% Carded & Combed Organic Cotton (280 GSM Heavyweight Jersey)',
      fit: 'Oversized Boxy Silhouette. True to size for intentional oversized aesthetic.',
      careInstructions: 'Machine wash cold with like colors. Do not bleach. Tumble dry low.',
      basePricePaise: 169900, // ₹1,699
      salePricePaise: 149900, // ₹1,499
      isNew: true,
      isBestSeller: true,
      isFeatured: true,
      department: 'men',
      status: 'published',
      images: [
        '/src/assets/images/product_tee_heavyweight_1791888627295.jpg',
        '/src/assets/images/outfit_streetwear_coord_1791888587655.jpg',
      ],
      variants: [
        { id: 'var_tee_iv_xs', productId: 'prod_tee_oversized', size: 'XS', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-TEE-IVR-XS', stockQuantity: 10 },
        { id: 'var_tee_iv_s', productId: 'prod_tee_oversized', size: 'S', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-TEE-IVR-S', stockQuantity: 24 },
        { id: 'var_tee_iv_m', productId: 'prod_tee_oversized', size: 'M', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-TEE-IVR-M', stockQuantity: 40 },
        { id: 'var_tee_iv_l', productId: 'prod_tee_oversized', size: 'L', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-TEE-IVR-L', stockQuantity: 35 },
        { id: 'var_tee_iv_xl', productId: 'prod_tee_oversized', size: 'XL', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-TEE-IVR-XL', stockQuantity: 15 },
      ],
      createdAt: '2026-09-03T10:00:00Z',
    },
    {
      id: 'prod_oxford_shirt',
      slug: 'og-relaxed-oxford-shirt',
      name: 'OG Relaxed Oxford Shirt',
      tagline: 'Washed Japanese cotton weave with structured button-down collar',
      description:
        'An uncompromising revision of the classic oxford cloth button-down. Garment-washed for broken-in softness from day one, with natural mother-of-pearl buttons and a gently curved hem designed to stay untucked.',
      category: 'Shirts',
      collectionSlug: 'everyday-uniform',
      tags: ['shirt', 'oxford', 'button-down', 'off-white', 'classic', 'men'],
      fabric: '100% Combed Oxford Cotton (190 GSM)',
      fit: 'Relaxed Tailored fit with box pleat on back yoke.',
      careInstructions: 'Machine wash warm. Hang dry. Medium heat iron.',
      basePricePaise: 279900, // ₹2,799
      salePricePaise: 249900, // ₹2,499
      isNew: false,
      isBestSeller: false,
      isFeatured: true,
      department: 'men',
      status: 'published',
      images: [
        '/src/assets/images/product_oxford_shirt_1791888627723.jpg',
      ],
      variants: [
        { id: 'var_ox_wht_s', productId: 'prod_oxford_shirt', size: 'S', color: 'Off-White', colorHex: '#F2EFE7', sku: 'OG-OXF-WHT-S', stockQuantity: 15 },
        { id: 'var_ox_wht_m', productId: 'prod_oxford_shirt', size: 'M', color: 'Off-White', colorHex: '#F2EFE7', sku: 'OG-OXF-WHT-M', stockQuantity: 22 },
        { id: 'var_ox_wht_l', productId: 'prod_oxford_shirt', size: 'L', color: 'Off-White', colorHex: '#F2EFE7', sku: 'OG-OXF-WHT-L', stockQuantity: 17 },
        { id: 'var_ox_wht_xl', productId: 'prod_oxford_shirt', size: 'XL', color: 'Off-White', colorHex: '#F2EFE7', sku: 'OG-OXF-WHT-XL', stockQuantity: 11 },
      ],
      createdAt: '2026-09-05T10:00:00Z',
    },
    {
      id: 'prod_bomber_jacket',
      slug: 'og-minimal-bomber-jacket',
      name: 'OG Minimal Bomber Jacket',
      tagline: 'Matte technical cotton shell with architectural lines',
      description:
        'Stripped of all unnecessary military adornment, this bomber celebrates pure form. Features custom gunmetal two-way hardware, recessed tonal ribbed cuffs, and concealed snap welt pockets.',
      category: 'Jackets',
      collectionSlug: 'everyday-uniform',
      tags: ['bomber', 'jacket', 'outerwear', 'charcoal', 'minimal', 'men'],
      fabric: 'Water-Repellent Matte Cotton-Polyester Shell with Viscose Satin Lining',
      fit: 'Clean Boxy Fit with slight cropped waist.',
      careInstructions: 'Specialist dry clean only.',
      basePricePaise: 499900, // ₹4,999
      salePricePaise: 449900, // ₹4,499
      isNew: true,
      isBestSeller: false,
      isFeatured: true,
      department: 'men',
      status: 'published',
      images: [
        '/src/assets/images/product_bomber_jacket_1791888628108.jpg',
      ],
      variants: [
        { id: 'var_bmb_blk_m', productId: 'prod_bomber_jacket', size: 'M', color: 'Charcoal Black', colorHex: '#20211E', sku: 'OG-BMB-BLK-M', stockQuantity: 14 },
        { id: 'var_bmb_blk_l', productId: 'prod_bomber_jacket', size: 'L', color: 'Charcoal Black', colorHex: '#20211E', sku: 'OG-BMB-BLK-L', stockQuantity: 16 },
        { id: 'var_bmb_blk_xl', productId: 'prod_bomber_jacket', size: 'XL', color: 'Charcoal Black', colorHex: '#20211E', sku: 'OG-BMB-BLK-XL', stockQuantity: 8 },
      ],
      createdAt: '2026-09-06T10:00:00Z',
    },
    {
      id: 'prod_heavyweight_tee_charcoal',
      slug: 'og-heavyweight-basic-tee-charcoal',
      name: 'OG Heavyweight Basic Tee',
      tagline: 'Standard straight cut in garment-dyed deep charcoal',
      description:
        'Your daily benchmark t-shirt. Dense 240 GSM organic cotton knit that maintains its crisp structure through hundreds of wears. Preshrunk with a reinforced twin-needle neck rib.',
      category: 'T-Shirts',
      collectionSlug: 'everyday-uniform',
      tags: ['tee', 'charcoal', 'heavyweight', 'streetwear', 'basics', 'men'],
      fabric: '100% Ringspun Combed Cotton (240 GSM)',
      fit: 'Regular Relaxed Cut. True to size.',
      careInstructions: 'Machine wash cold with dark garments. Do not tumble dry.',
      basePricePaise: 149900, // ₹1,499
      salePricePaise: 129900, // ₹1,299
      isNew: false,
      isBestSeller: true,
      isFeatured: false,
      department: 'men',
      status: 'published',
      images: [
        '/src/assets/images/outfit_streetwear_coord_1791888587655.jpg',
        '/src/assets/images/product_tee_heavyweight_1791888627295.jpg',
      ],
      variants: [
        { id: 'var_tee_ch_s', productId: 'prod_heavyweight_tee_charcoal', size: 'S', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-TEE-CHR-S', stockQuantity: 20 },
        { id: 'var_tee_ch_m', productId: 'prod_heavyweight_tee_charcoal', size: 'M', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-TEE-CHR-M', stockQuantity: 35 },
        { id: 'var_tee_ch_l', productId: 'prod_heavyweight_tee_charcoal', size: 'L', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-TEE-CHR-L', stockQuantity: 30 },
        { id: 'var_tee_ch_xl', productId: 'prod_heavyweight_tee_charcoal', size: 'XL', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-TEE-CHR-XL', stockQuantity: 12 },
      ],
      createdAt: '2026-09-07T10:00:00Z',
    },
    {
      id: 'prod_coord_set',
      slug: 'og-signature-coord-set',
      name: 'OG Signature Co-ord Set',
      tagline: 'Matching relaxed overshirt and pleated bottom in tone-on-tone olive',
      description:
        'A harmonized two-piece uniform. Features our signature relaxed utility overshirt cut from medium-weight micro-twill paired with matching relaxed pleated trousers for an instant, effortless outfit statement.',
      category: 'Complete Outfits',
      collectionSlug: 'warm-minimalism',
      tags: ['coord', 'set', 'outfit', 'olive', 'smart-casual'],
      fabric: '100% Washed Linen-Cotton Blend (260 GSM)',
      fit: 'Relaxed Tailored Two-Piece Outfit.',
      careInstructions: 'Hand wash cold or gentle machine cycle. Dry flat.',
      basePricePaise: 549900, // ₹5,499
      salePricePaise: 499900, // ₹4,999
      isNew: true,
      isBestSeller: true,
      isFeatured: true,
      status: 'published',
      images: [
        '/src/assets/images/hero_fashion_campaign_1791888586032.jpg',
        '/src/assets/images/category_trousers_look_1791888586736.jpg',
      ],
      variants: [
        { id: 'var_cd_ol_s', productId: 'prod_coord_set', size: 'S', color: 'Olive Earth', colorHex: '#777B5A', sku: 'OG-CRD-OLV-S', stockQuantity: 8 },
        { id: 'var_cd_ol_m', productId: 'prod_coord_set', size: 'M', color: 'Olive Earth', colorHex: '#777B5A', sku: 'OG-CRD-OLV-M', stockQuantity: 15 },
        { id: 'var_cd_ol_l', productId: 'prod_coord_set', size: 'L', color: 'Olive Earth', colorHex: '#777B5A', sku: 'OG-CRD-OLV-L', stockQuantity: 12 },
        { id: 'var_cd_ol_xl', productId: 'prod_coord_set', size: 'XL', color: 'Olive Earth', colorHex: '#777B5A', sku: 'OG-CRD-OLV-XL', stockQuantity: 6 },
      ],
      department: 'men',
      createdAt: '2026-09-08T10:00:00Z',
    },
    {
      id: 'prod_wmn_dress',
      slug: 'og-ribbed-knit-slip-maxi-dress',
      name: 'OG Ribbed Knit Slip Maxi Dress',
      tagline: 'Fluid column silhouette crafted from premium combed cotton rib knit',
      description:
        'An effortless expression of warm minimalism. Features a flattering soft V-neckline, subtle vertical ribbing that contours naturally, and a clean ankle-skimming hem. Pair effortlessly with our minimal blazer or wear unadorned for relaxed evening elegance.',
      category: 'Dresses',
      department: 'women',
      collectionSlug: 'warm-minimalism',
      tags: ['dress', 'maxi', 'knit', 'ribbed', 'beige', 'summer', 'women'],
      fabric: '95% Organic Combed Cotton, 5% Elastane (280 GSM Ribbed Knit)',
      fit: 'Slim Column Fit with natural comfort stretch. Model is 5’9” (175 cm) wearing size S.',
      careInstructions: 'Hand wash cold or gentle machine cycle. Dry flat in shade.',
      basePricePaise: 349900,
      salePricePaise: 299900,
      isNew: true,
      isBestSeller: true,
      isFeatured: true,
      status: 'published',
      images: [
        '/src/assets/images/product_women_dress_1792061307251.jpg',
        '/src/assets/images/hero_women_campaign_1792061306400.jpg',
      ],
      variants: [
        { id: 'var_wd_snd_xs', productId: 'prod_wmn_dress', size: 'XS', color: 'Sand Beige', colorHex: '#D6C7AE', sku: 'OG-W-DRS-SND-XS', stockQuantity: 15 },
        { id: 'var_wd_snd_s', productId: 'prod_wmn_dress', size: 'S', color: 'Sand Beige', colorHex: '#D6C7AE', sku: 'OG-W-DRS-SND-S', stockQuantity: 25 },
        { id: 'var_wd_snd_m', productId: 'prod_wmn_dress', size: 'M', color: 'Sand Beige', colorHex: '#D6C7AE', sku: 'OG-W-DRS-SND-M', stockQuantity: 20 },
        { id: 'var_wd_snd_l', productId: 'prod_wmn_dress', size: 'L', color: 'Sand Beige', colorHex: '#D6C7AE', sku: 'OG-W-DRS-SND-L', stockQuantity: 12 },
        { id: 'var_wd_snd_xl', productId: 'prod_wmn_dress', size: 'XL', color: 'Sand Beige', colorHex: '#D6C7AE', sku: 'OG-W-DRS-SND-XL', stockQuantity: 8 },
      ],
      createdAt: '2026-10-10T10:00:00Z',
    },
    {
      id: 'prod_wmn_coord',
      slug: 'og-cropped-utility-coord-set',
      name: 'OG Cropped Utility Co-ord Set',
      tagline: 'Boxy cropped overshirt and high-rise pleated wide trousers in olive earth',
      description:
        'Tailored precision meets relaxed utilitarian style. The cropped overshirt features twin chest flap pockets and horn buttons, paired with fluid high-waisted pleated wide-leg trousers for a sharp, confident uniform.',
      category: 'Co-ord Sets',
      department: 'women',
      collectionSlug: 'warm-minimalism',
      tags: ['coord', 'set', 'utility', 'cropped', 'olive', 'trousers', 'women'],
      fabric: '100% Washed Linen-Cotton Micro Twill (240 GSM)',
      fit: 'Cropped relaxed top with high-rise wide-leg pants. Model is 5’9” wearing size S.',
      careInstructions: 'Machine wash cold gentle. Line dry. Warm iron.',
      basePricePaise: 589900,
      salePricePaise: 529900,
      isNew: true,
      isBestSeller: true,
      isFeatured: true,
      status: 'published',
      images: [
        '/src/assets/images/product_women_coord_1792061307583.jpg',
      ],
      variants: [
        { id: 'var_wc_ol_xs', productId: 'prod_wmn_coord', size: 'XS', color: 'Olive Earth', colorHex: '#777B5A', sku: 'OG-W-CRD-OLV-XS', stockQuantity: 10 },
        { id: 'var_wc_ol_s', productId: 'prod_wmn_coord', size: 'S', color: 'Olive Earth', colorHex: '#777B5A', sku: 'OG-W-CRD-OLV-S', stockQuantity: 22 },
        { id: 'var_wc_ol_m', productId: 'prod_wmn_coord', size: 'M', color: 'Olive Earth', colorHex: '#777B5A', sku: 'OG-W-CRD-OLV-M', stockQuantity: 18 },
        { id: 'var_wc_ol_l', productId: 'prod_wmn_coord', size: 'L', color: 'Olive Earth', colorHex: '#777B5A', sku: 'OG-W-CRD-OLV-L', stockQuantity: 14 },
      ],
      createdAt: '2026-10-10T11:00:00Z',
    },
    {
      id: 'prod_wmn_jeans',
      slug: 'og-high-rise-wide-leg-jeans',
      name: 'OG High-Rise Straight-Leg Jeans',
      tagline: '13.5 oz washed ecru denim with clean straight drape and raw hem',
      description:
        'Engineered from authentic Japanese non-stretch 100% organic cotton denim. Cut with a high waist that sits comfortably above the hip, a fitted rear, and relaxed straight legs that drape cleanly over minimalist footwear.',
      category: 'Jeans',
      department: 'women',
      collectionSlug: 'everyday-uniform',
      tags: ['jeans', 'denim', 'ecru', 'high-rise', 'straight-leg', 'women'],
      fabric: '100% Heavyweight Organic Cotton Denim (13.5 oz)',
      fit: 'High-Rise Straight Leg. Fitted at natural waist, relaxed through leg.',
      careInstructions: 'Wash inside out in cold water. Hang dry to maintain shape.',
      basePricePaise: 369900,
      salePricePaise: 329900,
      isNew: true,
      isBestSeller: false,
      isFeatured: true,
      status: 'published',
      images: [
        '/src/assets/images/product_women_jeans_1792061307710.jpg',
      ],
      variants: [
        { id: 'var_wj_ec_xs', productId: 'prod_wmn_jeans', size: 'XS', color: 'Washed Ecru', colorHex: '#F2EFE7', sku: 'OG-W-JNS-ECR-26', stockQuantity: 12 },
        { id: 'var_wj_ec_s', productId: 'prod_wmn_jeans', size: 'S', color: 'Washed Ecru', colorHex: '#F2EFE7', sku: 'OG-W-JNS-ECR-28', stockQuantity: 20 },
        { id: 'var_wj_ec_m', productId: 'prod_wmn_jeans', size: 'M', color: 'Washed Ecru', colorHex: '#F2EFE7', sku: 'OG-W-JNS-ECR-30', stockQuantity: 25 },
        { id: 'var_wj_ec_l', productId: 'prod_wmn_jeans', size: 'L', color: 'Washed Ecru', colorHex: '#F2EFE7', sku: 'OG-W-JNS-ECR-32', stockQuantity: 16 },
      ],
      createdAt: '2026-10-10T12:00:00Z',
    },
    {
      id: 'prod_wmn_blazer',
      slug: 'og-minimal-wool-blend-blazer',
      name: 'OG Minimal Wool-Blend Blazer',
      tagline: 'Oversized architectural silhouette in rich mocha brown',
      description:
        'The cornerstone of the women’s tailoring capsule. Designed with dropped shoulders, subtle notch lapels, structured welt pockets, and a full satin lining for an imposing yet effortless drape.',
      category: 'Outerwear',
      department: 'women',
      collectionSlug: 'warm-minimalism',
      tags: ['blazer', 'outerwear', 'jacket', 'tailoring', 'mocha', 'women'],
      fabric: '70% Fine Merino Wool, 30% Recycled Poly Blend with Viscose Satin Lining',
      fit: 'Intentional Relaxed Oversized Fit. Model is wearing size S.',
      careInstructions: 'Dry clean only.',
      basePricePaise: 649900,
      salePricePaise: 579900,
      isNew: true,
      isBestSeller: true,
      isFeatured: true,
      status: 'published',
      images: [
        '/src/assets/images/women_outerwear_blazer_1792062522398.jpg',
        '/src/assets/images/hero_women_campaign_1792061306400.jpg',
      ],
      variants: [
        { id: 'var_wb_mc_xs', productId: 'prod_wmn_blazer', size: 'XS', color: 'Mocha Brown', colorHex: '#796653', sku: 'OG-W-BLZ-MCH-XS', stockQuantity: 8 },
        { id: 'var_wb_mc_s', productId: 'prod_wmn_blazer', size: 'S', color: 'Mocha Brown', colorHex: '#796653', sku: 'OG-W-BLZ-MCH-S', stockQuantity: 16 },
        { id: 'var_wb_mc_m', productId: 'prod_wmn_blazer', size: 'M', color: 'Mocha Brown', colorHex: '#796653', sku: 'OG-W-BLZ-MCH-M', stockQuantity: 14 },
        { id: 'var_wb_mc_l', productId: 'prod_wmn_blazer', size: 'L', color: 'Mocha Brown', colorHex: '#796653', sku: 'OG-W-BLZ-MCH-L', stockQuantity: 9 },
      ],
      createdAt: '2026-10-10T13:00:00Z',
    },
    {
      id: 'prod_wmn_cropped_tee',
      slug: 'og-heavyweight-boxy-cropped-tee',
      name: 'OG Heavyweight Boxy Cropped Tee',
      tagline: '260 GSM combed cotton with dropped shoulders and relaxed cropped hem',
      description:
        'Cut wide through the body with a high-crew rib collar and a modern cropped length designed to hit precisely at the waistband of our high-rise trousers and jeans.',
      category: 'T-Shirts & Tops',
      department: 'women',
      collectionSlug: 'everyday-uniform',
      tags: ['tee', 'cropped', 'ivory', 'heavyweight', 'tops', 'women'],
      fabric: '100% Combed Ringspun Cotton (260 GSM)',
      fit: 'Boxy Cropped Silhouette. True to size.',
      careInstructions: 'Machine wash cold. Tumble dry low.',
      basePricePaise: 159900,
      salePricePaise: 139900,
      isNew: true,
      isBestSeller: false,
      isFeatured: false,
      status: 'published',
      images: [
        '/src/assets/images/women_tops_editorial_1792062525021.jpg',
      ],
      variants: [
        { id: 'var_wt_iv_xs', productId: 'prod_wmn_cropped_tee', size: 'XS', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-TEE-IVR-XS', stockQuantity: 20 },
        { id: 'var_wt_iv_s', productId: 'prod_wmn_cropped_tee', size: 'S', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-TEE-IVR-S', stockQuantity: 35 },
        { id: 'var_wt_iv_m', productId: 'prod_wmn_cropped_tee', size: 'M', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-TEE-IVR-M', stockQuantity: 30 },
        { id: 'var_wt_iv_l', productId: 'prod_wmn_cropped_tee', size: 'L', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-TEE-IVR-L', stockQuantity: 15 },
      ],
      createdAt: '2026-10-10T14:00:00Z',
    },
    {
      id: 'prod_wmn_wide_trousers',
      slug: 'og-fluid-tailored-wide-trousers',
      name: 'OG Fluid Tailored Wide Trousers',
      tagline: 'High-rise double forward pleats in sand beige tencel blend',
      description:
        'Architectural fluid movement. Crafted with deep forward pleats, invisible side slant pockets, and a fluid drape that cascades over sneakers or loafers.',
      category: 'Trousers',
      department: 'women',
      collectionSlug: 'warm-minimalism',
      tags: ['trousers', 'wide-leg', 'pleated', 'sand', 'tailored', 'women'],
      fabric: 'Tencel & Wool Micro-Twill (260 GSM)',
      fit: 'High-Rise Wide-Leg Relaxed Cut.',
      careInstructions: 'Gentle cold wash or dry clean.',
      basePricePaise: 349900,
      salePricePaise: 299900,
      isNew: false,
      isBestSeller: true,
      isFeatured: true,
      status: 'published',
      images: [
        '/src/assets/images/women_fluid_wide_trousers_1792409690642.jpg',
        '/src/assets/images/hero_women_campaign_1792061306400.jpg',
      ],
      variants: [
        { id: 'var_wtr_sn_xs', productId: 'prod_wmn_wide_trousers', size: 'XS', color: 'Sand Beige', colorHex: '#D6C7AE', sku: 'OG-W-TRS-SND-XS', stockQuantity: 14 },
        { id: 'var_wtr_sn_s', productId: 'prod_wmn_wide_trousers', size: 'S', color: 'Sand Beige', colorHex: '#D6C7AE', sku: 'OG-W-TRS-SND-S', stockQuantity: 24 },
        { id: 'var_wtr_sn_m', productId: 'prod_wmn_wide_trousers', size: 'M', color: 'Sand Beige', colorHex: '#D6C7AE', sku: 'OG-W-TRS-SND-M', stockQuantity: 20 },
        { id: 'var_wtr_sn_l', productId: 'prod_wmn_wide_trousers', size: 'L', color: 'Sand Beige', colorHex: '#D6C7AE', sku: 'OG-W-TRS-SND-L', stockQuantity: 10 },
      ],
      createdAt: '2026-10-10T15:00:00Z',
    },
    {
      id: 'prod_wmn_relaxed_shirt',
      slug: 'og-relaxed-silk-cotton-shirt',
      name: 'OG Relaxed Washed Poplin Shirt',
      tagline: 'Lustrous breathable poplin with structured French collar',
      description:
        'A staple button-down cut generously for versatile styling—tuck into tailored trousers, wear unbuttoned over a ribbed tank, or tie at the waist.',
      category: 'Shirts',
      department: 'women',
      collectionSlug: 'everyday-uniform',
      tags: ['shirt', 'poplin', 'off-white', 'button-down', 'women'],
      fabric: '80% Long-Staple Cotton, 20% Mulberry Silk Poplin (140 GSM)',
      fit: 'Relaxed Boyfriend Cut.',
      careInstructions: 'Hand wash cold or dry clean.',
      basePricePaise: 289900,
      salePricePaise: 259900,
      isNew: false,
      isBestSeller: false,
      isFeatured: true,
      status: 'published',
      images: [
        '/src/assets/images/women_relaxed_poplin_shirt_1792409673934.jpg',
      ],
      variants: [
        { id: 'var_wsh_ow_xs', productId: 'prod_wmn_relaxed_shirt', size: 'XS', color: 'Off-White', colorHex: '#F2EFE7', sku: 'OG-W-SHR-OW-XS', stockQuantity: 12 },
        { id: 'var_wsh_ow_s', productId: 'prod_wmn_relaxed_shirt', size: 'S', color: 'Off-White', colorHex: '#F2EFE7', sku: 'OG-W-SHR-OW-S', stockQuantity: 18 },
        { id: 'var_wsh_ow_m', productId: 'prod_wmn_relaxed_shirt', size: 'M', color: 'Off-White', colorHex: '#F2EFE7', sku: 'OG-W-SHR-OW-M', stockQuantity: 15 },
        { id: 'var_wsh_ow_l', productId: 'prod_wmn_relaxed_shirt', size: 'L', color: 'Off-White', colorHex: '#F2EFE7', sku: 'OG-W-SHR-OW-L', stockQuantity: 10 },
      ],
      createdAt: '2026-10-10T16:00:00Z',
    },
    {
      id: 'prod_wmn_leather_bag',
      slug: 'og-minimalist-leather-shoulder-bag',
      name: 'OG Minimalist Leather Shoulder Bag',
      tagline: 'Full-grain vegetable-tanned saddle leather in rich chestnut brown',
      description:
        'Constructed from full-grain saddle leather with hand-burnished edges, custom matte gunmetal hardware, and an ergonomic shoulder strap designed for everyday utility.',
      category: 'Accessories',
      department: 'unisex',
      collectionSlug: 'warm-minimalism',
      tags: ['bag', 'leather', 'accessories', 'unisex', 'women'],
      fabric: '100% Full-Grain Vegetable-Tanned Cowhide with Cotton Twill Lining',
      fit: 'Dimensions: 28cm W x 18cm H x 8cm D',
      careInstructions: 'Wipe clean with soft damp cloth. Condition leather annually.',
      basePricePaise: 429900,
      isNew: true,
      isBestSeller: true,
      isFeatured: true,
      status: 'published',
      images: [
        '/src/assets/images/hero_women_campaign_1792061306400.jpg',
      ],
      variants: [
        { id: 'var_wbg_ch_os', productId: 'prod_wmn_leather_bag', size: 'XL', color: 'Chestnut Brown', colorHex: '#796653', sku: 'OG-ACC-BAG-BRN', stockQuantity: 15 },
      ],
      createdAt: '2026-10-10T17:00:00Z',
    },
    {
      id: 'prod_wmn_graphic_tee_vintage',
      slug: 'og-vintage-arc-graphic-tee',
      name: 'OG Vintage Arc Graphic Tee',
      tagline: 'Oversized 240 GSM combed cotton in cream with archival collegiate graphic',
      description:
        'Express yourself. Wear your story. Inspired by vintage European sportswear archives, this relaxed tee features custom distressed water-based typography across the chest and dropped shoulders that hang effortlessly over washed blue denim.',
      category: 'T-Shirts & Tops',
      department: 'women',
      collectionSlug: 'graphic-tees',
      tags: ['graphic-tees', 'vintage-tees', 'tee', 'cream', 't-shirts-tops', 'graphic', 'women'],
      fabric: '100% Combed Ringspun Organic Cotton (240 GSM)',
      fit: 'Relaxed Vintage Oversized Fit. Model is 5’9” wearing size S.',
      careInstructions: 'Machine wash cold inside out. Hang dry in shade. Do not iron directly on print.',
      basePricePaise: 189900,
      salePricePaise: 169900,
      isNew: true,
      isBestSeller: true,
      isFeatured: true,
      status: 'published',
      images: [
        '/images/women_graphic_tees.jpg',
        '/src/assets/images/women_graphic_tees_1792147850313.jpg',
      ],
      variants: [
        { id: 'var_wgt_cr_xs', productId: 'prod_wmn_graphic_tee_vintage', size: 'XS', color: 'Vintage Cream', colorHex: '#F2EFE7', sku: 'OG-W-GTEE-CRM-XS', stockQuantity: 18 },
        { id: 'var_wgt_cr_s', productId: 'prod_wmn_graphic_tee_vintage', size: 'S', color: 'Vintage Cream', colorHex: '#F2EFE7', sku: 'OG-W-GTEE-CRM-S', stockQuantity: 30 },
        { id: 'var_wgt_cr_m', productId: 'prod_wmn_graphic_tee_vintage', size: 'M', color: 'Vintage Cream', colorHex: '#F2EFE7', sku: 'OG-W-GTEE-CRM-M', stockQuantity: 26 },
        { id: 'var_wgt_cr_l', productId: 'prod_wmn_graphic_tee_vintage', size: 'L', color: 'Vintage Cream', colorHex: '#F2EFE7', sku: 'OG-W-GTEE-CRM-L', stockQuantity: 14 },
      ],
      createdAt: '2026-10-15T09:00:00Z',
    },
    {
      id: 'prod_wmn_oversized_streetwear_tee',
      slug: 'og-studio-archive-oversized-tee',
      name: 'OG Studio Archive Oversized Tee',
      tagline: 'Heavyweight washed black streetwear tee with stark architectural typography',
      description:
        'Relaxed fits. Everyday attitude. Cut wide and substantial with dropped shoulder seams and raw-edge sleeve finish. Crafted from dense 260 GSM jersey that holds a bold silhouette with zero clinging.',
      category: 'T-Shirts & Tops',
      department: 'women',
      collectionSlug: 'oversized-tees',
      tags: ['oversized-tees', 'streetwear', 'tee', 'black', 't-shirts-tops', 'women'],
      fabric: '100% Heavyweight Carded Cotton Jersey (260 GSM)',
      fit: 'Oversized Boxy Streetwear Cut. Model is 5’9” wearing size S.',
      careInstructions: 'Machine wash cold with dark colors. Line dry. Cool iron if needed.',
      basePricePaise: 199900,
      salePricePaise: 179900,
      isNew: true,
      isBestSeller: true,
      isFeatured: true,
      status: 'published',
      images: [
        '/images/women_oversized_tees.jpg',
        '/src/assets/images/women_oversized_tees_1792147866665.jpg',
      ],
      variants: [
        { id: 'var_wost_bk_xs', productId: 'prod_wmn_oversized_streetwear_tee', size: 'XS', color: 'Washed Black', colorHex: '#20211E', sku: 'OG-W-OTEE-BLK-XS', stockQuantity: 15 },
        { id: 'var_wost_bk_s', productId: 'prod_wmn_oversized_streetwear_tee', size: 'S', color: 'Washed Black', colorHex: '#20211E', sku: 'OG-W-OTEE-BLK-S', stockQuantity: 32 },
        { id: 'var_wost_bk_m', productId: 'prod_wmn_oversized_streetwear_tee', size: 'M', color: 'Washed Black', colorHex: '#20211E', sku: 'OG-W-OTEE-BLK-M', stockQuantity: 28 },
        { id: 'var_wost_bk_l', productId: 'prod_wmn_oversized_streetwear_tee', size: 'L', color: 'Washed Black', colorHex: '#20211E', sku: 'OG-W-OTEE-BLK-L', stockQuantity: 12 },
      ],
      createdAt: '2026-10-15T10:00:00Z',
    },
    {
      id: 'prod_wmn_essential_artifact_tee',
      slug: 'og-minimal-artifact-heavyweight-tee',
      name: 'OG Minimal Artifact Heavyweight Tee',
      tagline: 'Understated botanical emblem on heavyweight warm ivory cotton',
      description:
        'Comfort meets understated style. A pure distillation of the OffGrid uniform aesthetic. Finished with a discrete line-art botanical graphic centered on the chest, a tight ribbed collar, and a smooth tactile handfeel.',
      category: 'T-Shirts & Tops',
      department: 'women',
      collectionSlug: 'essentials',
      tags: ['essentials', 'everyday-essentials', 'minimal', 'tee', 'cream', 't-shirts-tops', 'women'],
      fabric: '100% Combed Compact Cotton (260 GSM)',
      fit: 'Relaxed Daily Silhouette with clean straight hem.',
      careInstructions: 'Machine wash cold. Tumble dry low or dry flat.',
      basePricePaise: 179900,
      salePricePaise: 159900,
      isNew: true,
      isBestSeller: true,
      isFeatured: true,
      status: 'published',
      images: [
        '/images/women_everyday_essentials.jpg',
        '/src/assets/images/women_everyday_essentials_1792147884145.jpg',
      ],
      variants: [
        { id: 'var_wmae_iv_xs', productId: 'prod_wmn_essential_artifact_tee', size: 'XS', color: 'Natural Ivory', colorHex: '#F2EFE7', sku: 'OG-W-ETEE-IVR-XS', stockQuantity: 20 },
        { id: 'var_wmae_iv_s', productId: 'prod_wmn_essential_artifact_tee', size: 'S', color: 'Natural Ivory', colorHex: '#F2EFE7', sku: 'OG-W-ETEE-IVR-S', stockQuantity: 36 },
        { id: 'var_wmae_iv_m', productId: 'prod_wmn_essential_artifact_tee', size: 'M', color: 'Natural Ivory', colorHex: '#F2EFE7', sku: 'OG-W-ETEE-IVR-M', stockQuantity: 30 },
        { id: 'var_wmae_iv_l', productId: 'prod_wmn_essential_artifact_tee', size: 'L', color: 'Natural Ivory', colorHex: '#F2EFE7', sku: 'OG-W-ETEE-IVR-L', stockQuantity: 18 },
      ],
      createdAt: '2026-10-15T11:00:00Z',
      rating: 4.9,
      reviewCount: 47,
    },

    {
      id: 'prod_men_terry_sweatshirt',
      slug: 'og-boxy-french-terry-sweatshirt',
      name: 'OG Boxy French Terry Sweatshirt',
      tagline: '420 GSM loopback cotton fleece with dropped shoulder lines',
      description:
        'Substantial architectural weight with ultra-soft unbrushed loopback interior. Features clean ribbed cuffs, an athletic V-insert on the crew collar, and an oversized boxy silhouette that holds shape without sagging.',
      category: 'Sweatshirts',
      department: 'men',
      collectionSlug: 'everyday-uniform',
      tags: ['sweatshirt', 'french-terry', 'crewneck', 'grey', 'men', 'oversized-fit'],
      fabric: '100% Organic Cotton Heavyweight Loopback Fleece (420 GSM)',
      fit: 'Oversized Boxy Silhouette with dropped shoulders. True to size.',
      careInstructions: 'Machine wash cold inside out. Flat dry in shade.',
      basePricePaise: 249900, // ₹2,499
      salePricePaise: 219900, // ₹2,199
      isNew: true,
      isBestSeller: true,
      isFeatured: true,
      status: 'published',
      images: [
        '/src/assets/images/outfit_streetwear_coord_1791888587655.jpg',
        '/src/assets/images/hero_fashion_campaign_1791888586032.jpg',
      ],
      variants: [
        { id: 'var_mts_gr_xs', productId: 'prod_men_terry_sweatshirt', size: 'XS', color: 'Heather Grey', colorHex: '#A6A49C', sku: 'OG-M-SWT-GRY-XS', stockQuantity: 10 },
        { id: 'var_mts_gr_s', productId: 'prod_men_terry_sweatshirt', size: 'S', color: 'Heather Grey', colorHex: '#A6A49C', sku: 'OG-M-SWT-GRY-S', stockQuantity: 24 },
        { id: 'var_mts_gr_m', productId: 'prod_men_terry_sweatshirt', size: 'M', color: 'Heather Grey', colorHex: '#A6A49C', sku: 'OG-M-SWT-GRY-M', stockQuantity: 32 },
        { id: 'var_mts_gr_l', productId: 'prod_men_terry_sweatshirt', size: 'L', color: 'Heather Grey', colorHex: '#A6A49C', sku: 'OG-M-SWT-GRY-L', stockQuantity: 22 },
        { id: 'var_mts_gr_xl', productId: 'prod_men_terry_sweatshirt', size: 'XL', color: 'Heather Grey', colorHex: '#A6A49C', sku: 'OG-M-SWT-GRY-XL', stockQuantity: 14 },
        { id: 'var_mts_gr_xxl', productId: 'prod_men_terry_sweatshirt', size: 'XXL', color: 'Heather Grey', colorHex: '#A6A49C', sku: 'OG-M-SWT-GRY-XXL', stockQuantity: 8 },
      ],
      createdAt: '2026-10-16T11:00:00Z',
      rating: 4.8,
      reviewCount: 52,
    },
    {
      id: 'prod_wmn_terry_sweatshirt',
      slug: 'og-minimalist-crewneck-sweatshirt',
      name: 'OG Minimalist Crewneck Sweatshirt',
      tagline: '380 GSM combed fleece with relaxed dropped sleeves in warm ivory',
      description:
        'A refined everyday layer designed with subtle tonal stitching and tailored proportions. Soft brushed fleece lining provides cozy warmth while keeping an uncluttered editorial profile.',
      category: 'Sweatshirts',
      department: 'women',
      collectionSlug: 'everyday-uniform',
      tags: ['sweatshirt', 'crewneck', 'ivory', 'fleece', 'women', 'relaxed-fit'],
      fabric: '100% Combed Ringspun Cotton Brushed Fleece (380 GSM)',
      fit: 'Relaxed Boxy Fit. Model is 5’9” wearing size S.',
      careInstructions: 'Machine wash cold on gentle cycle. Do not bleach.',
      basePricePaise: 229900, // ₹2,299
      salePricePaise: 199900, // ₹1,999
      isNew: true,
      isBestSeller: false,
      isFeatured: true,
      status: 'published',
      images: [
        '/images/women_everyday_essentials.jpg',
        '/src/assets/images/women_tops_editorial_1792062525021.jpg',
      ],
      variants: [
        { id: 'var_wts_iv_xs', productId: 'prod_wmn_terry_sweatshirt', size: 'XS', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-SWT-IVR-XS', stockQuantity: 12 },
        { id: 'var_wts_iv_s', productId: 'prod_wmn_terry_sweatshirt', size: 'S', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-SWT-IVR-S', stockQuantity: 28 },
        { id: 'var_wts_iv_m', productId: 'prod_wmn_terry_sweatshirt', size: 'M', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-SWT-IVR-M', stockQuantity: 24 },
        { id: 'var_wts_iv_l', productId: 'prod_wmn_terry_sweatshirt', size: 'L', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-SWT-IVR-L', stockQuantity: 15 },
        { id: 'var_wts_iv_xl', productId: 'prod_wmn_terry_sweatshirt', size: 'XL', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-SWT-IVR-XL', stockQuantity: 9 },
      ],
      createdAt: '2026-10-16T12:00:00Z',
      rating: 4.9,
      reviewCount: 29,
    },
    {
      id: 'prod_acc_organic_socks',
      slug: 'og-heavyweight-organic-cotton-socks',
      name: 'OG Heavyweight Ribbed Socks (3-Pack)',
      tagline: 'Cushioned organic cotton crew socks with arch support band',
      description:
        'Knit from dense certified organic cotton yarn with targeted terry cushion underfoot and stay-up ribbing that leaves no compression marks. Sold as a convenient 3-pack in monochromatic neutrals.',
      category: 'Accessories',
      department: 'unisex',
      collectionSlug: 'everyday-uniform',
      tags: ['accessories', 'socks', 'organic-cotton', 'basics', 'unisex'],
      fabric: '85% Organic Cotton, 12% Recycled Polyamide, 3% Elastane',
      fit: 'Unisex Ribbed Crew Fit. Elasticated arch support.',
      careInstructions: 'Machine wash warm with like colors.',
      basePricePaise: 89900, // ₹899
      salePricePaise: 79900, // ₹799 (Under ₹999!)
      isNew: true,
      isBestSeller: true,
      isFeatured: false,
      status: 'published',
      images: [
        '/src/assets/images/product_organic_cotton_socks_1792409728818.jpg',
      ],
      variants: [
        { id: 'var_sck_iv_s', productId: 'prod_acc_organic_socks', size: 'S', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-ACC-SCK-IVR-S', stockQuantity: 30 },
        { id: 'var_sck_iv_m', productId: 'prod_acc_organic_socks', size: 'M', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-ACC-SCK-IVR-M', stockQuantity: 50 },
        { id: 'var_sck_iv_l', productId: 'prod_acc_organic_socks', size: 'L', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-ACC-SCK-IVR-L', stockQuantity: 40 },
      ],
      createdAt: '2026-10-16T13:00:00Z',
      rating: 4.9,
      reviewCount: 84,
    },
    {
      id: 'prod_acc_canvas_tote',
      slug: 'og-archival-canvas-tote-bag',
      name: 'OG Archival Canvas Tote Bag',
      tagline: '16 oz heavy natural duck canvas with reinforced handles and interior pocket',
      description:
        'Rugged 16 oz unbleached cotton duck canvas that stands upright on its own. Designed with double-stitched bar-tacked handles, brass snap key loop, and clean internal organizer pocket.',
      category: 'Accessories',
      department: 'unisex',
      collectionSlug: 'warm-minimalism',
      tags: ['accessories', 'tote', 'canvas', 'carry', 'unisex'],
      fabric: '100% Unbleached Heavy Cotton Canvas (16 oz)',
      fit: 'Dimensions: 40cm H x 36cm W x 12cm D. Handle drop: 28cm.',
      careInstructions: 'Spot clean only with cold water and mild soap.',
      basePricePaise: 99900, // ₹999
      salePricePaise: 89900, // ₹899 (Under ₹999!)
      isNew: true,
      isBestSeller: true,
      isFeatured: true,
      status: 'published',
      images: [
        '/src/assets/images/product_canvas_tote_bag_1792409743795.jpg',
      ],
      variants: [
        { id: 'var_tot_ow_m', productId: 'prod_acc_canvas_tote', size: 'M', color: 'Off-White', colorHex: '#F2EFE7', sku: 'OG-ACC-TOT-OW-M', stockQuantity: 35 },
        { id: 'var_tot_ol_l', productId: 'prod_acc_canvas_tote', size: 'L', color: 'Olive', colorHex: '#777B5A', sku: 'OG-ACC-TOT-OLV-L', stockQuantity: 25 },
      ],
      createdAt: '2026-10-16T14:00:00Z',
      rating: 4.8,
      reviewCount: 61,
    },
    {
      id: 'prod_acc_dad_cap',
      slug: 'og-washed-cotton-signature-cap',
      name: 'OG Washed Cotton Signature Cap',
      tagline: 'Low-profile unstructured 6-panel cap with antique brass buckle slider',
      description:
        'Vintage garment-washed chino twill with a soft crown that conforms naturally to the head. Finished with tonal embroidered OffGrid eyelets and a self-fabric strap with an antique brass closure.',
      category: 'Accessories',
      department: 'unisex',
      collectionSlug: 'everyday-uniform',
      tags: ['accessories', 'cap', 'hat', 'cotton', 'unisex'],
      fabric: '100% Garment-Washed Cotton Chino Twill',
      fit: 'Unisex Low Profile Adjustable Fit. 54-62cm circumference.',
      careInstructions: 'Hand wash cold. Shape and air dry.',
      basePricePaise: 119900, // ₹1,199
      salePricePaise: 94900, // ₹949 (Under ₹999!)
      isNew: false,
      isBestSeller: true,
      isFeatured: false,
      status: 'published',
      images: [
        '/src/assets/images/product_washed_dad_cap_1792409758600.jpg',
      ],
      variants: [
        { id: 'var_cap_bk_m', productId: 'prod_acc_dad_cap', size: 'M', color: 'Washed Black', colorHex: '#20211E', sku: 'OG-ACC-CAP-BLK-M', stockQuantity: 28 },
        { id: 'var_cap_ol_l', productId: 'prod_acc_dad_cap', size: 'L', color: 'Olive', colorHex: '#777B5A', sku: 'OG-ACC-CAP-OLV-L', stockQuantity: 22 },
      ],
      createdAt: '2026-10-16T15:00:00Z',
      rating: 4.7,
      reviewCount: 45,
    },

    {
      id: 'prod_men_graphic_tee_cyber',
      slug: 'og-glyph-archival-oversized-graphic-tee',
      name: 'OG Glyph Archival Oversized Graphic Tee',
      tagline: 'Heavyweight 280 GSM combed cotton with high-density architectural glyph screen print',
      description:
        'Designed with an exaggerated dropped shoulder, boxy silhouette, and a high-density screen-printed archival glyph motif on the rear yoke. Pre-shrunk with a silicon enzyme wash for an ultra-soft, weighted hand-feel.',
      category: 'T-Shirts',
      department: 'men',
      collectionSlug: 'everyday-uniform',
      tags: ['men', 't-shirt', 'graphic', 'oversized', 'streetwear', 'heavyweight'],
      fabric: '100% 280 GSM Long-Staple Combed Cotton',
      fit: 'Exaggerated Oversized Boxy Fit. Dropped shoulders with relaxed armholes.',
      careInstructions: 'Machine wash cold inside-out. Do not iron over graphic print. Hang dry in shade.',
      basePricePaise: 189900,
      salePricePaise: 159900,
      isNew: true,
      isBestSeller: false,
      isFeatured: true,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_mgt_bk_s', productId: 'prod_men_graphic_tee_cyber', size: 'S', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-M-GT-CYB-BK-S', stockQuantity: 24 },
        { id: 'var_mgt_bk_m', productId: 'prod_men_graphic_tee_cyber', size: 'M', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-M-GT-CYB-BK-M', stockQuantity: 36 },
        { id: 'var_mgt_bk_l', productId: 'prod_men_graphic_tee_cyber', size: 'L', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-M-GT-CYB-BK-L', stockQuantity: 30 },
        { id: 'var_mgt_bk_xl', productId: 'prod_men_graphic_tee_cyber', size: 'XL', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-M-GT-CYB-BK-XL', stockQuantity: 18 },
        { id: 'var_mgt_iv_m', productId: 'prod_men_graphic_tee_cyber', size: 'M', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-M-GT-CYB-IV-M', stockQuantity: 20 },
        { id: 'var_mgt_iv_l', productId: 'prod_men_graphic_tee_cyber', size: 'L', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-M-GT-CYB-IV-L', stockQuantity: 25 },
      ],
      createdAt: '2026-10-25T10:00:00Z',
      rating: 4.9,
      reviewCount: 38,
    },
    {
      id: 'prod_men_plain_oversized_sand',
      slug: 'og-raw-hem-plain-oversized-tee',
      name: 'OG Raw Hem Plain Oversized Tee',
      tagline: '260 GSM organic cotton with relaxed dropped-shoulder drape and clean blind hem',
      description:
        'The quintessential everyday streetwear tee. Crafted from 100% carded organic jersey cotton with double-needle collar stitching and a relaxed drape that falls straight through the torso.',
      category: 'T-Shirts',
      department: 'men',
      collectionSlug: 'everyday-uniform',
      tags: ['men', 't-shirt', 'plain', 'oversized', 'essential', 'cotton'],
      fabric: '100% Organic Carded Cotton (260 GSM)',
      fit: 'Signature Relaxed Oversized Fit. Size down for regular fit.',
      careInstructions: 'Cold wash with like colors. Tumble dry low or line dry.',
      basePricePaise: 149900,
      salePricePaise: 129900,
      isNew: false,
      isBestSeller: true,
      isFeatured: true,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_mpo_sd_xs', productId: 'prod_men_plain_oversized_sand', size: 'XS', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-M-POT-SND-XS', stockQuantity: 15 },
        { id: 'var_mpo_sd_s', productId: 'prod_men_plain_oversized_sand', size: 'S', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-M-POT-SND-S', stockQuantity: 32 },
        { id: 'var_mpo_sd_m', productId: 'prod_men_plain_oversized_sand', size: 'M', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-M-POT-SND-M', stockQuantity: 45 },
        { id: 'var_mpo_sd_l', productId: 'prod_men_plain_oversized_sand', size: 'L', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-M-POT-SND-L', stockQuantity: 35 },
        { id: 'var_mpo_sd_xl', productId: 'prod_men_plain_oversized_sand', size: 'XL', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-M-POT-SND-XL', stockQuantity: 20 },
        { id: 'var_mpo_sg_m', productId: 'prod_men_plain_oversized_sand', size: 'M', color: 'Stone Grey', colorHex: '#A6A49C', sku: 'OG-M-POT-STN-M', stockQuantity: 28 },
      ],
      createdAt: '2026-10-25T11:00:00Z',
      rating: 4.8,
      reviewCount: 52,
    },
    {
      id: 'prod_men_boxy_tee_obsidian',
      slug: 'og-heavyweight-boxy-cut-tee',
      name: 'OG Heavyweight Boxy Cut Tee',
      tagline: 'Structured 300 GSM combed jersey with wide sleeves and cropped torso proportions',
      description:
        'Tailored with architectural proportions: wide, boxy body paired with a slightly cropped length that sits cleanly at the belt line. Heavy 1.25-inch rib-knit crewneck collar that never sags.',
      category: 'T-Shirts',
      department: 'men',
      collectionSlug: 'everyday-uniform',
      tags: ['men', 't-shirt', 'boxy', 'heavyweight', 'streetwear', 'black'],
      fabric: '100% Dense 300 GSM Combed Jersey Cotton',
      fit: 'Boxy Wide-Shoulder Silhouette. Torso length slightly cropped.',
      careInstructions: 'Cold gentle cycle. Do not bleach. Lay flat to dry.',
      basePricePaise: 169900,
      salePricePaise: 139900,
      isNew: true,
      isBestSeller: false,
      isFeatured: false,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_mbx_ob_s', productId: 'prod_men_boxy_tee_obsidian', size: 'S', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-M-BXT-OBS-S', stockQuantity: 20 },
        { id: 'var_mbx_ob_m', productId: 'prod_men_boxy_tee_obsidian', size: 'M', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-M-BXT-OBS-M', stockQuantity: 38 },
        { id: 'var_mbx_ob_l', productId: 'prod_men_boxy_tee_obsidian', size: 'L', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-M-BXT-OBS-L', stockQuantity: 30 },
        { id: 'var_mbx_ob_xl', productId: 'prod_men_boxy_tee_obsidian', size: 'XL', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-M-BXT-OBS-XL', stockQuantity: 16 },
        { id: 'var_mbx_ch_m', productId: 'prod_men_boxy_tee_obsidian', size: 'M', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-M-BXT-CHR-M', stockQuantity: 22 },
      ],
      createdAt: '2026-10-25T12:00:00Z',
      rating: 4.7,
      reviewCount: 29,
    },
    {
      id: 'prod_men_linen_shirt_olive',
      slug: 'og-relaxed-camp-collar-poplin-shirt',
      name: 'OG Relaxed Camp Collar Poplin Shirt',
      tagline: 'Breathable washed cotton poplin with relaxed open camp collar and straight hem',
      description:
        'Modern relaxed tailoring meets laid-back streetwear sensibility. Cut with a relaxed dropped shoulder, tonal matte corozo buttons, and side hem slits for fluid movement when untucked.',
      category: 'Shirts',
      department: 'men',
      collectionSlug: 'everyday-uniform',
      tags: ['men', 'shirt', 'relaxed', 'poplin', 'buttondown', 'olive'],
      fabric: '100% Compact Washed Cotton Poplin',
      fit: 'Relaxed Straight Cut. Open notch camp collar.',
      careInstructions: 'Machine wash cold delicate. Warm iron or steam for clean drape.',
      basePricePaise: 249900,
      salePricePaise: 219900,
      isNew: false,
      isBestSeller: false,
      isFeatured: true,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_mls_ol_s', productId: 'prod_men_linen_shirt_olive', size: 'S', color: 'Muted Olive', colorHex: '#777B5A', sku: 'OG-M-SH-CMP-OL-S', stockQuantity: 18 },
        { id: 'var_mls_ol_m', productId: 'prod_men_linen_shirt_olive', size: 'M', color: 'Muted Olive', colorHex: '#777B5A', sku: 'OG-M-SH-CMP-OL-M', stockQuantity: 28 },
        { id: 'var_mls_ol_l', productId: 'prod_men_linen_shirt_olive', size: 'L', color: 'Muted Olive', colorHex: '#777B5A', sku: 'OG-M-SH-CMP-OL-L', stockQuantity: 25 },
        { id: 'var_mls_ol_xl', productId: 'prod_men_linen_shirt_olive', size: 'XL', color: 'Muted Olive', colorHex: '#777B5A', sku: 'OG-M-SH-CMP-OL-XL', stockQuantity: 14 },
        { id: 'var_mls_sd_m', productId: 'prod_men_linen_shirt_olive', size: 'M', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-M-SH-CMP-SD-M', stockQuantity: 20 },
      ],
      createdAt: '2026-10-25T13:00:00Z',
      rating: 4.9,
      reviewCount: 42,
    },
    {
      id: 'prod_men_hoodie_charcoal',
      slug: 'og-heavyweight-oversized-pullover-hoodie',
      name: 'OG Heavyweight Oversized Pullover Hoodie',
      tagline: '450 GSM diagonal loopback French terry with double-layered crossover hood',
      description:
        'Unrelenting warmth and substantial weight. Constructed with zero drawstrings for a clean, minimalist silhouette, deep kangaroo pouch pocket with bartack reinforcement, and heavyweight 2x2 ribbing at cuffs and hem.',
      category: 'Sweatshirts',
      department: 'men',
      collectionSlug: 'everyday-uniform',
      tags: ['men', 'sweatshirts', 'hoodie', 'pullover', 'heavyweight', 'streetwear'],
      fabric: '100% 450 GSM Diagonal French Terry Cotton',
      fit: 'Substantial Oversized Fit. Clean stringless structured hood.',
      careInstructions: 'Wash cold inside out. Reshape while damp. Air dry flat.',
      basePricePaise: 349900,
      salePricePaise: 299900,
      isNew: true,
      isBestSeller: true,
      isFeatured: true,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_mhd_ch_s', productId: 'prod_men_hoodie_charcoal', size: 'S', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-M-HD-CHR-S', stockQuantity: 22 },
        { id: 'var_mhd_ch_m', productId: 'prod_men_hoodie_charcoal', size: 'M', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-M-HD-CHR-M', stockQuantity: 35 },
        { id: 'var_mhd_ch_l', productId: 'prod_men_hoodie_charcoal', size: 'L', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-M-HD-CHR-L', stockQuantity: 30 },
        { id: 'var_mhd_ch_xl', productId: 'prod_men_hoodie_charcoal', size: 'XL', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-M-HD-CHR-XL', stockQuantity: 16 },
        { id: 'var_mhd_ob_m', productId: 'prod_men_hoodie_charcoal', size: 'M', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-M-HD-OBS-M', stockQuantity: 26 },
      ],
      createdAt: '2026-10-25T14:00:00Z',
      rating: 5.0,
      reviewCount: 64,
    },
    {
      id: 'prod_men_tactical_cargo_olive',
      slug: 'og-modular-tactical-cargo-pants',
      name: 'OG Modular Tactical Cargo Pants',
      tagline: 'Durable ripstop cotton with 3D bellows pockets and adjustable cinch hems',
      description:
        'Function-first utility trousers constructed from sturdy 280 GSM cotton ripstop. Features ergonomic articulated knee darts, low-profile magnetic snap cargo flaps, and shockcord ankle adjusters to taper over sneakers.',
      category: 'Trousers',
      department: 'men',
      collectionSlug: 'everyday-uniform',
      tags: ['men', 'trousers', 'cargo', 'tactical', 'streetwear', 'pants'],
      fabric: '100% 280 GSM Cotton Ripstop Twill',
      fit: 'Relaxed Ergonomic Fit with Cinchable Ankle Bungees.',
      careInstructions: 'Machine wash cold with similar dark colors. Hang dry.',
      basePricePaise: 329900,
      salePricePaise: 279900,
      isNew: true,
      isBestSeller: false,
      isFeatured: true,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_mtc_ol_s', productId: 'prod_men_tactical_cargo_olive', size: 'S', color: 'Muted Olive', colorHex: '#777B5A', sku: 'OG-M-CG-TAC-OL-S', stockQuantity: 18 },
        { id: 'var_mtc_ol_m', productId: 'prod_men_tactical_cargo_olive', size: 'M', color: 'Muted Olive', colorHex: '#777B5A', sku: 'OG-M-CG-TAC-OL-M', stockQuantity: 30 },
        { id: 'var_mtc_ol_l', productId: 'prod_men_tactical_cargo_olive', size: 'L', color: 'Muted Olive', colorHex: '#777B5A', sku: 'OG-M-CG-TAC-OL-L', stockQuantity: 24 },
        { id: 'var_mtc_ol_xl', productId: 'prod_men_tactical_cargo_olive', size: 'XL', color: 'Muted Olive', colorHex: '#777B5A', sku: 'OG-M-CG-TAC-OL-XL', stockQuantity: 15 },
        { id: 'var_mtc_ob_m', productId: 'prod_men_tactical_cargo_olive', size: 'M', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-M-CG-TAC-OB-M', stockQuantity: 22 },
      ],
      createdAt: '2026-10-25T15:00:00Z',
      rating: 4.8,
      reviewCount: 47,
    },
    {
      id: 'prod_men_pleated_trouser_stone',
      slug: 'og-wide-leg-relaxed-pleated-trousers',
      name: 'OG Wide-Leg Relaxed Pleated Trousers',
      tagline: 'Double-pleated drape trousers with half-elastic waistband and deep slash pockets',
      description:
        'Effortless tailored poise. Cut from a fluid wool-viscose twill with double forward pleats that create an elegant cascading silhouette through the leg. Features internal drawstring and belt loops for versatile styling.',
      category: 'Trousers',
      department: 'men',
      collectionSlug: 'everyday-uniform',
      tags: ['men', 'trousers', 'pleated', 'relaxed', 'tailored', 'pants'],
      fabric: '65% Poly, 30% Rayon, 5% Elastane Suiting Twill',
      fit: 'Wide Straight Leg. Medium rise with relaxed seat.',
      careInstructions: 'Dry clean recommended or machine wash cold gentle cycle.',
      basePricePaise: 299900,
      salePricePaise: 259900,
      isNew: false,
      isBestSeller: true,
      isFeatured: false,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_mpt_sg_s', productId: 'prod_men_pleated_trouser_stone', size: 'S', color: 'Stone Grey', colorHex: '#A6A49C', sku: 'OG-M-TR-PLT-STN-S', stockQuantity: 16 },
        { id: 'var_mpt_sg_m', productId: 'prod_men_pleated_trouser_stone', size: 'M', color: 'Stone Grey', colorHex: '#A6A49C', sku: 'OG-M-TR-PLT-STN-M', stockQuantity: 28 },
        { id: 'var_mpt_sg_l', productId: 'prod_men_pleated_trouser_stone', size: 'L', color: 'Stone Grey', colorHex: '#A6A49C', sku: 'OG-M-TR-PLT-STN-L', stockQuantity: 25 },
        { id: 'var_mpt_sg_xl', productId: 'prod_men_pleated_trouser_stone', size: 'XL', color: 'Stone Grey', colorHex: '#A6A49C', sku: 'OG-M-TR-PLT-STN-XL', stockQuantity: 12 },
        { id: 'var_mpt_sd_m', productId: 'prod_men_pleated_trouser_stone', size: 'M', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-M-TR-PLT-SND-M', stockQuantity: 20 },
      ],
      createdAt: '2026-10-25T16:00:00Z',
      rating: 4.9,
      reviewCount: 58,
    },
    {
      id: 'prod_men_streetwear_jogger_black',
      slug: 'og-heavyweight-french-terry-joggers',
      name: 'OG Heavyweight French Terry Joggers',
      tagline: '400 GSM brushed fleece with extended drawstrings and concealed zipper ankle gussets',
      description:
        'Designed for daily uniform wear with an elevated aesthetic. Heavy custom-knit cotton terry, deep welted side pockets with concealed security zips, and thick elasticated ankle cuffs.',
      category: 'Trousers',
      department: 'men',
      collectionSlug: 'everyday-uniform',
      tags: ['men', 'trousers', 'joggers', 'sweatpants', 'streetwear', 'comfort'],
      fabric: '100% 400 GSM Combed Cotton French Terry',
      fit: 'Tapered Relaxed Street Silhouette with Elasticated Cuffs.',
      careInstructions: 'Cold machine wash with mild detergent. Air dry recommended.',
      basePricePaise: 269900,
      salePricePaise: 229900,
      isNew: false,
      isBestSeller: false,
      isFeatured: false,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_mjg_ob_s', productId: 'prod_men_streetwear_jogger_black', size: 'S', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-M-JG-BLK-S', stockQuantity: 20 },
        { id: 'var_mjg_ob_m', productId: 'prod_men_streetwear_jogger_black', size: 'M', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-M-JG-BLK-M', stockQuantity: 32 },
        { id: 'var_mjg_ob_l', productId: 'prod_men_streetwear_jogger_black', size: 'L', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-M-JG-BLK-L', stockQuantity: 26 },
        { id: 'var_mjg_ob_xl', productId: 'prod_men_streetwear_jogger_black', size: 'XL', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-M-JG-BLK-XL', stockQuantity: 15 },
        { id: 'var_mjg_ch_m', productId: 'prod_men_streetwear_jogger_black', size: 'M', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-M-JG-CHR-M', stockQuantity: 22 },
      ],
      createdAt: '2026-10-25T17:00:00Z',
      rating: 4.7,
      reviewCount: 35,
    },
    {
      id: 'prod_men_utility_jacket_olive',
      slug: 'og-technical-field-zip-jacket',
      name: 'OG Technical Field Zip Jacket',
      tagline: 'Weather-resistant matte nylon shell with dual-entry utility chest pockets and two-way YKK zip',
      description:
        'An architectural outerwear centerpiece. Cut with dropped shoulders, storm-flap collar, two-way heavy metal zipper, and interior mesh lining for all-weather ventilation.',
      category: 'Jackets',
      department: 'men',
      collectionSlug: 'everyday-uniform',
      tags: ['men', 'jackets', 'outerwear', 'jacket', 'utility', 'streetwear'],
      fabric: 'Water-Repellent Matte Technical Nylon Shell, Breathable Mesh Lining',
      fit: 'Boxy Outerwear Fit. Designed for effortless under-layering.',
      careInstructions: 'Wipe clean with damp cloth or hand wash cold gentle. Do not tumble dry.',
      basePricePaise: 449900,
      salePricePaise: 389900,
      isNew: true,
      isBestSeller: true,
      isFeatured: true,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_muj_ol_s', productId: 'prod_men_utility_jacket_olive', size: 'S', color: 'Muted Olive', colorHex: '#777B5A', sku: 'OG-M-JK-FLD-OL-S', stockQuantity: 14 },
        { id: 'var_muj_ol_m', productId: 'prod_men_utility_jacket_olive', size: 'M', color: 'Muted Olive', colorHex: '#777B5A', sku: 'OG-M-JK-FLD-OL-M', stockQuantity: 24 },
        { id: 'var_muj_ol_l', productId: 'prod_men_utility_jacket_olive', size: 'L', color: 'Muted Olive', colorHex: '#777B5A', sku: 'OG-M-JK-FLD-OL-L', stockQuantity: 20 },
        { id: 'var_muj_ol_xl', productId: 'prod_men_utility_jacket_olive', size: 'XL', color: 'Muted Olive', colorHex: '#777B5A', sku: 'OG-M-JK-FLD-OL-XL', stockQuantity: 10 },
        { id: 'var_muj_ob_m', productId: 'prod_men_utility_jacket_olive', size: 'M', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-M-JK-FLD-OB-M', stockQuantity: 18 },
      ],
      createdAt: '2026-10-25T18:00:00Z',
      rating: 5.0,
      reviewCount: 44,
    },
    {
      id: 'prod_wmn_graphic_tee_distortion',
      slug: 'og-studio-typographic-oversized-tee',
      name: 'OG Studio Typographic Oversized Tee',
      tagline: 'Subtle tonal screen-printed typographic back graphic on 240 GSM organic cotton',
      description:
        'A feminine relaxed cut featuring generous dropped shoulders and extended sleeves that hit just above the elbow. Washed in natural mineral tones for an authentic vintage hand-feel.',
      category: 'T-Shirts & Tops',
      department: 'women',
      collectionSlug: 'everyday-uniform',
      tags: ['women', 't-shirt', 'graphic', 'oversized', 'streetwear', 'tops'],
      fabric: '100% 240 GSM Organic Cotton Jersey',
      fit: 'Slouchy Relaxed Fit with Extended Drop Sleeves.',
      careInstructions: 'Cold gentle wash. Wash inside-out. Do not iron over graphic print.',
      basePricePaise: 169900,
      salePricePaise: 139900,
      isNew: true,
      isBestSeller: false,
      isFeatured: true,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_wgt_iv_xs', productId: 'prod_wmn_graphic_tee_distortion', size: 'XS', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-GT-TYP-IV-XS', stockQuantity: 16 },
        { id: 'var_wgt_iv_s', productId: 'prod_wmn_graphic_tee_distortion', size: 'S', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-GT-TYP-IV-S', stockQuantity: 28 },
        { id: 'var_wgt_iv_m', productId: 'prod_wmn_graphic_tee_distortion', size: 'M', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-GT-TYP-IV-M', stockQuantity: 35 },
        { id: 'var_wgt_iv_l', productId: 'prod_wmn_graphic_tee_distortion', size: 'L', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-GT-TYP-IV-L', stockQuantity: 20 },
        { id: 'var_wgt_ch_m', productId: 'prod_wmn_graphic_tee_distortion', size: 'M', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-W-GT-TYP-CH-M', stockQuantity: 22 },
      ],
      createdAt: '2026-10-25T19:00:00Z',
      rating: 4.9,
      reviewCount: 41,
    },
    {
      id: 'prod_wmn_ribbed_crop_top_sand',
      slug: 'og-seamless-heavy-rib-crop-top',
      name: 'OG Seamless Heavy Rib Crop Top',
      tagline: 'Sculpting wide-rib stretch modal knit with crew neckline and clean banded hem',
      description:
        'An essential layering staple. Crafted from ultra-dense modal-cotton ribbing that contours comfortably without constriction. Clean self-bound neckline and finished crop length that pairs seamlessly with high-rise bottoms.',
      category: 'T-Shirts & Tops',
      department: 'women',
      collectionSlug: 'everyday-uniform',
      tags: ['women', 'tops', 'crop', 'basic', 'ribbed', 'minimal'],
      fabric: '92% Modal, 8% Elastane Dense 2x2 Rib',
      fit: 'Fitted Contoured Silhouette. Cropped right above high waistband.',
      careInstructions: 'Cold gentle machine wash. Lay flat to preserve rib elasticity.',
      basePricePaise: 129900,
      salePricePaise: 99900,
      isNew: false,
      isBestSeller: true,
      isFeatured: true,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_wrc_sd_xs', productId: 'prod_wmn_ribbed_crop_top_sand', size: 'XS', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-W-TP-CRB-SD-XS', stockQuantity: 20 },
        { id: 'var_wrc_sd_s', productId: 'prod_wmn_ribbed_crop_top_sand', size: 'S', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-W-TP-CRB-SD-S', stockQuantity: 35 },
        { id: 'var_wrc_sd_m', productId: 'prod_wmn_ribbed_crop_top_sand', size: 'M', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-W-TP-CRB-SD-M', stockQuantity: 40 },
        { id: 'var_wrc_sd_l', productId: 'prod_wmn_ribbed_crop_top_sand', size: 'L', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-W-TP-CRB-SD-L', stockQuantity: 22 },
        { id: 'var_wrc_iv_s', productId: 'prod_wmn_ribbed_crop_top_sand', size: 'S', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-TP-CRB-IV-S', stockQuantity: 25 },
        { id: 'var_wrc_ch_m', productId: 'prod_wmn_ribbed_crop_top_sand', size: 'M', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-W-TP-CRB-CH-M', stockQuantity: 30 },
      ],
      createdAt: '2026-10-25T20:00:00Z',
      rating: 4.8,
      reviewCount: 67,
    },
    {
      id: 'prod_wmn_fitted_mockneck_stone',
      slug: 'og-fitted-mockneck-long-sleeve-top',
      name: 'OG Fitted Mockneck Long Sleeve Top',
      tagline: 'Ultra-soft micromodal blend with subtle standing collar and clean raw edge cuffs',
      description:
        'A streamlined minimalist basic engineered for refined layering. Features an understated 1-inch mock collar, second-skin fit, and fluid fabric drape that retains its shape throughout wear.',
      category: 'T-Shirts & Tops',
      department: 'women',
      collectionSlug: 'everyday-uniform',
      tags: ['women', 'tops', 'fitted', 'mockneck', 'longsleeve', 'basic'],
      fabric: '90% MicroModal, 10% Lycra (220 GSM)',
      fit: 'Precision Second-Skin Body Hugging Fit.',
      careInstructions: 'Hand wash or delicate machine wash cold. Do not tumble dry.',
      basePricePaise: 149900,
      salePricePaise: 119900,
      isNew: false,
      isBestSeller: false,
      isFeatured: false,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_wfm_sg_xs', productId: 'prod_wmn_fitted_mockneck_stone', size: 'XS', color: 'Stone Grey', colorHex: '#A6A49C', sku: 'OG-W-TP-MCK-ST-XS', stockQuantity: 15 },
        { id: 'var_wfm_sg_s', productId: 'prod_wmn_fitted_mockneck_stone', size: 'S', color: 'Stone Grey', colorHex: '#A6A49C', sku: 'OG-W-TP-MCK-ST-S', stockQuantity: 26 },
        { id: 'var_wfm_sg_m', productId: 'prod_wmn_fitted_mockneck_stone', size: 'M', color: 'Stone Grey', colorHex: '#A6A49C', sku: 'OG-W-TP-MCK-ST-M', stockQuantity: 32 },
        { id: 'var_wfm_sg_l', productId: 'prod_wmn_fitted_mockneck_stone', size: 'L', color: 'Stone Grey', colorHex: '#A6A49C', sku: 'OG-W-TP-MCK-ST-L', stockQuantity: 18 },
        { id: 'var_wfm_ob_s', productId: 'prod_wmn_fitted_mockneck_stone', size: 'S', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-W-TP-MCK-OB-S', stockQuantity: 24 },
      ],
      createdAt: '2026-10-25T21:00:00Z',
      rating: 4.7,
      reviewCount: 33,
    },
    {
      id: 'prod_wmn_boyfriend_poplin_ivory',
      slug: 'og-boyfriend-oversized-poplin-shirt',
      name: 'OG Boyfriend Oversized Poplin Shirt',
      tagline: 'Crisp 80s two-ply organic cotton with elongated cuffs and curved split hem',
      description:
        'Borrowed-from-the-boys proportion perfected for women. Designed with dramatic dropped shoulders, deep box pleat at back, mother-of-pearl buttons, and an elongated curved hem ideal for loose styling.',
      category: 'Shirts',
      department: 'women',
      collectionSlug: 'everyday-uniform',
      tags: ['women', 'shirts', 'poplin', 'boyfriend', 'relaxed', 'oversized'],
      fabric: '100% Two-Ply Crisp Organic Cotton Poplin',
      fit: 'Generous Boyfriend Oversized Fit. Elongated drape.',
      careInstructions: 'Warm machine wash. Iron medium heat while slightly damp.',
      basePricePaise: 269900,
      salePricePaise: 229900,
      isNew: true,
      isBestSeller: false,
      isFeatured: true,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_wbp_iv_xs', productId: 'prod_wmn_boyfriend_poplin_ivory', size: 'XS', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-SH-BF-IV-XS', stockQuantity: 16 },
        { id: 'var_wbp_iv_s', productId: 'prod_wmn_boyfriend_poplin_ivory', size: 'S', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-SH-BF-IV-S', stockQuantity: 28 },
        { id: 'var_wbp_iv_m', productId: 'prod_wmn_boyfriend_poplin_ivory', size: 'M', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-SH-BF-IV-M', stockQuantity: 34 },
        { id: 'var_wbp_iv_l', productId: 'prod_wmn_boyfriend_poplin_ivory', size: 'L', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-SH-BF-IV-L', stockQuantity: 20 },
        { id: 'var_wbp_sg_m', productId: 'prod_wmn_boyfriend_poplin_ivory', size: 'M', color: 'Stone Grey', colorHex: '#A6A49C', sku: 'OG-W-SH-BF-SG-M', stockQuantity: 20 },
      ],
      createdAt: '2026-10-25T22:00:00Z',
      rating: 4.9,
      reviewCount: 45,
    },
    {
      id: 'prod_wmn_fleece_hoodie_ivory',
      slug: 'og-cropped-raw-edge-fleece-hoodie',
      name: 'OG Cropped Raw-Edge Fleece Hoodie',
      tagline: '420 GSM brushed organic fleece with dropped shoulders and relaxed cropped hem',
      description:
        'Cozy warmth meets sharp street aesthetic. Cut with wide sculptural sleeves, a double-lined crossover hood, and an unfinished roll hem that hits comfortably above the hip.',
      category: 'Sweatshirts',
      department: 'women',
      collectionSlug: 'everyday-uniform',
      tags: ['women', 'sweatshirts', 'hoodie', 'cropped', 'fleece', 'streetwear'],
      fabric: '100% 420 GSM Brushed Organic Cotton Fleece',
      fit: 'Cropped Boxy Silhouette. Wide sculptural sleeve drape.',
      careInstructions: 'Cold wash gentle. Dry flat in shade. Do not tumble dry.',
      basePricePaise: 299900,
      salePricePaise: 259900,
      isNew: false,
      isBestSeller: true,
      isFeatured: true,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_wfh_iv_xs', productId: 'prod_wmn_fleece_hoodie_ivory', size: 'XS', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-HD-CRP-IV-XS', stockQuantity: 18 },
        { id: 'var_wfh_iv_s', productId: 'prod_wmn_fleece_hoodie_ivory', size: 'S', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-HD-CRP-IV-S', stockQuantity: 30 },
        { id: 'var_wfh_iv_m', productId: 'prod_wmn_fleece_hoodie_ivory', size: 'M', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-HD-CRP-IV-M', stockQuantity: 36 },
        { id: 'var_wfh_iv_l', productId: 'prod_wmn_fleece_hoodie_ivory', size: 'L', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-W-HD-CRP-IV-L', stockQuantity: 20 },
        { id: 'var_wfh_ol_m', productId: 'prod_wmn_fleece_hoodie_ivory', size: 'M', color: 'Muted Olive', colorHex: '#777B5A', sku: 'OG-W-HD-CRP-OL-M', stockQuantity: 24 },
      ],
      createdAt: '2026-10-25T23:00:00Z',
      rating: 4.8,
      reviewCount: 51,
    },
    {
      id: 'prod_wmn_wide_leg_trouser_sand',
      slug: 'og-high-rise-column-wide-trousers',
      name: 'OG High-Rise Column Wide Trousers',
      tagline: 'Fluid tailored crepe with deep front pleats, slant pockets, and clean floor-grazing length',
      description:
        'Architectural tailoring engineered with a flattering high waist, structured front waistband, and wide parallel legs that fall in clean, dramatic folds.',
      category: 'Trousers',
      department: 'women',
      collectionSlug: 'everyday-uniform',
      tags: ['women', 'trousers', 'wide-leg', 'pleated', 'tailored', 'pants'],
      fabric: 'Fluid Medium-Weight Double Crepe (Polyester/Viscose blend)',
      fit: 'High-Rise Column Wide-Leg. Floor-skimming hem.',
      careInstructions: 'Dry clean or delicate cold wash in wash bag. Hang to dry.',
      basePricePaise: 319900,
      salePricePaise: 269900,
      isNew: true,
      isBestSeller: false,
      isFeatured: true,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_wwt_sd_xs', productId: 'prod_wmn_wide_leg_trouser_sand', size: 'XS', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-W-TR-COL-SD-XS', stockQuantity: 16 },
        { id: 'var_wwt_sd_s', productId: 'prod_wmn_wide_leg_trouser_sand', size: 'S', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-W-TR-COL-SD-S', stockQuantity: 28 },
        { id: 'var_wwt_sd_m', productId: 'prod_wmn_wide_leg_trouser_sand', size: 'M', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-W-TR-COL-SD-M', stockQuantity: 32 },
        { id: 'var_wwt_sd_l', productId: 'prod_wmn_wide_leg_trouser_sand', size: 'L', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-W-TR-COL-SD-L', stockQuantity: 18 },
        { id: 'var_wwt_ch_s', productId: 'prod_wmn_wide_leg_trouser_sand', size: 'S', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-W-TR-COL-CH-S', stockQuantity: 22 },
      ],
      createdAt: '2026-10-26T00:00:00Z',
      rating: 4.9,
      reviewCount: 59,
    },
    {
      id: 'prod_wmn_parachute_cargo_charcoal',
      slug: 'og-parachute-utility-cargo-pants',
      name: 'OG Parachute Utility Cargo Pants',
      tagline: 'Lightweight crisp technical cotton-nylon with knee pleats and toggle hems',
      description:
        'Modern streetwear silhouette infused with utilitarian edge. Features an elastic bungee waistband, deep bellowed cargo pockets, and adjustable ankle toggles that convert from relaxed wide leg to balloon taper.',
      category: 'Trousers',
      department: 'women',
      collectionSlug: 'everyday-uniform',
      tags: ['women', 'trousers', 'cargo', 'parachute', 'streetwear', 'pants'],
      fabric: '65% Cotton, 35% Technical Nylon Crinkle Shell',
      fit: 'Convertible Parachute Fit. Adjustable elastic bungee waist and cuffs.',
      careInstructions: 'Machine wash cold gentle. Do not tumble dry.',
      basePricePaise: 289900,
      salePricePaise: 249900,
      isNew: false,
      isBestSeller: true,
      isFeatured: true,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_wpc_ch_xs', productId: 'prod_wmn_parachute_cargo_charcoal', size: 'XS', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-W-CG-PCH-CH-XS', stockQuantity: 18 },
        { id: 'var_wpc_ch_s', productId: 'prod_wmn_parachute_cargo_charcoal', size: 'S', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-W-CG-PCH-CH-S', stockQuantity: 30 },
        { id: 'var_wpc_ch_m', productId: 'prod_wmn_parachute_cargo_charcoal', size: 'M', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-W-CG-PCH-CH-M', stockQuantity: 35 },
        { id: 'var_wpc_ch_l', productId: 'prod_wmn_parachute_cargo_charcoal', size: 'L', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-W-CG-PCH-CH-L', stockQuantity: 16 },
        { id: 'var_wpc_ol_s', productId: 'prod_wmn_parachute_cargo_charcoal', size: 'S', color: 'Muted Olive', colorHex: '#777B5A', sku: 'OG-W-CG-PCH-OL-S', stockQuantity: 24 },
      ],
      createdAt: '2026-10-26T01:00:00Z',
      rating: 4.8,
      reviewCount: 49,
    },
    {
      id: 'prod_wmn_coord_olive_set',
      slug: 'og-minimalist-linen-blend-co-ord-set',
      name: 'OG Minimalist Linen-Blend Co-ord Set',
      tagline: 'Matching boxy short-sleeve shirt and high-waist relaxed tailored shorts in earthy olive',
      description:
        'An effortless two-piece warm-weather uniform. Features a cropped camp-collar button shirt paired with matching pleated elastic-back trousers crafted from a tactile linen-tencel weave.',
      category: 'Co-ord Sets',
      department: 'women',
      collectionSlug: 'everyday-uniform',
      tags: ['women', 'co-ord sets', 'coord', 'set', 'linen', 'outfit'],
      fabric: '55% European Linen, 45% Tencel Lyocell',
      fit: 'Tailored Relaxed Fit Two-Piece Set.',
      careInstructions: 'Gentle cold machine wash. Hang dry in shade. Warm iron.',
      basePricePaise: 429900,
      salePricePaise: 369900,
      isNew: true,
      isBestSeller: false,
      isFeatured: true,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_wcs_ol_xs', productId: 'prod_wmn_coord_olive_set', size: 'XS', color: 'Muted Olive', colorHex: '#777B5A', sku: 'OG-W-CD-LNN-OL-XS', stockQuantity: 14 },
        { id: 'var_wcs_ol_s', productId: 'prod_wmn_coord_olive_set', size: 'S', color: 'Muted Olive', colorHex: '#777B5A', sku: 'OG-W-CD-LNN-OL-S', stockQuantity: 24 },
        { id: 'var_wcs_ol_m', productId: 'prod_wmn_coord_olive_set', size: 'M', color: 'Muted Olive', colorHex: '#777B5A', sku: 'OG-W-CD-LNN-OL-M', stockQuantity: 28 },
        { id: 'var_wcs_ol_l', productId: 'prod_wmn_coord_olive_set', size: 'L', color: 'Muted Olive', colorHex: '#777B5A', sku: 'OG-W-CD-LNN-OL-L', stockQuantity: 15 },
        { id: 'var_wcs_sd_s', productId: 'prod_wmn_coord_olive_set', size: 'S', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-W-CD-LNN-SD-S', stockQuantity: 18 },
      ],
      createdAt: '2026-10-26T02:00:00Z',
      rating: 5.0,
      reviewCount: 36,
    },

    {
      id: 'prod_unisex_graphic_tee_architect',
      slug: 'og-monolith-coordinates-unisex-graphic-tee',
      name: 'OG Monolith Coordinates Unisex Graphic Tee',
      tagline: '280 GSM combed cotton with subtle monochrome architectural coordinate typography',
      description:
        'Understated street philosophy in physical form. Minimalist typographic coordinates printed on heavy combed cotton jersey with seamless tubular sides and twin-needle hems. Universally flattering unisex drape.',
      category: 'T-Shirts',
      department: 'unisex',
      collectionSlug: 'everyday-uniform',
      tags: ['unisex', 't-shirt', 'graphic', 'minimalist', 'oversized', 'streetwear'],
      fabric: '100% 280 GSM Ring-Spun Combed Cotton',
      fit: 'Universal Relaxed Streetwear Fit. Straight tubular body.',
      careInstructions: 'Cold gentle cycle inside out. Do not tumble dry.',
      basePricePaise: 179900,
      salePricePaise: 149900,
      isNew: true,
      isBestSeller: false,
      isFeatured: true,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_ugt_ob_xs', productId: 'prod_unisex_graphic_tee_architect', size: 'XS', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-U-GT-MCO-OB-XS', stockQuantity: 15 },
        { id: 'var_ugt_ob_s', productId: 'prod_unisex_graphic_tee_architect', size: 'S', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-U-GT-MCO-OB-S', stockQuantity: 28 },
        { id: 'var_ugt_ob_m', productId: 'prod_unisex_graphic_tee_architect', size: 'M', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-U-GT-MCO-OB-M', stockQuantity: 36 },
        { id: 'var_ugt_ob_l', productId: 'prod_unisex_graphic_tee_architect', size: 'L', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-U-GT-MCO-OB-L', stockQuantity: 30 },
        { id: 'var_ugt_ob_xl', productId: 'prod_unisex_graphic_tee_architect', size: 'XL', color: 'Obsidian Black', colorHex: '#101110', sku: 'OG-U-GT-MCO-OB-XL', stockQuantity: 18 },
        { id: 'var_ugt_iv_m', productId: 'prod_unisex_graphic_tee_architect', size: 'M', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-U-GT-MCO-IV-M', stockQuantity: 24 },
      ],
      createdAt: '2026-10-26T04:00:00Z',
      rating: 4.8,
      reviewCount: 35,
    },

    {
      id: 'prod_unisex_oversized_sweatshirt_ivory',
      slug: 'og-studio-boxy-crewneck-sweatshirt',
      name: 'OG Studio Boxy Crewneck Sweatshirt',
      tagline: 'Plush 400 GSM unbrushed cotton fleece with dropped shoulder seams and thick ribbed collar',
      description:
        'The essential unisex layer for cool days. Clean, unbranded aesthetic that pairs effortlessly with tailored trousers or denim. Pre-washed to eliminate shrinkage.',
      category: 'Sweatshirts',
      department: 'unisex',
      collectionSlug: 'everyday-uniform',
      tags: ['unisex', 'sweatshirts', 'crewneck', 'oversized', 'fleece'],
      fabric: '100% 400 GSM Combed Cotton Loopback Fleece',
      fit: 'Oversized Relaxed Fit with Dropped Armholes.',
      careInstructions: 'Gentle wash cold. Line dry in shade.',
      basePricePaise: 289900,
      salePricePaise: 249900,
      isNew: false,
      isBestSeller: false,
      isFeatured: false,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_uos_iv_xs', productId: 'prod_unisex_oversized_sweatshirt_ivory', size: 'XS', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-U-SW-BXY-IV-XS', stockQuantity: 18 },
        { id: 'var_uos_iv_s', productId: 'prod_unisex_oversized_sweatshirt_ivory', size: 'S', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-U-SW-BXY-IV-S', stockQuantity: 26 },
        { id: 'var_uos_iv_m', productId: 'prod_unisex_oversized_sweatshirt_ivory', size: 'M', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-U-SW-BXY-IV-M', stockQuantity: 35 },
        { id: 'var_uos_iv_l', productId: 'prod_unisex_oversized_sweatshirt_ivory', size: 'L', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-U-SW-BXY-IV-L', stockQuantity: 24 },
        { id: 'var_uos_iv_xl', productId: 'prod_unisex_oversized_sweatshirt_ivory', size: 'XL', color: 'Warm Ivory', colorHex: '#F2EFE7', sku: 'OG-U-SW-BXY-IV-XL', stockQuantity: 16 },
        { id: 'var_uos_sg_m', productId: 'prod_unisex_oversized_sweatshirt_ivory', size: 'M', color: 'Stone Grey', colorHex: '#A6A49C', sku: 'OG-U-SW-BXY-SG-M', stockQuantity: 20 },
      ],
      createdAt: '2026-10-26T06:00:00Z',
      rating: 4.8,
      reviewCount: 48,
    },
    {
      id: 'prod_unisex_drawstring_trouser_stone',
      slug: 'og-relaxed-easy-drawstring-trousers',
      name: 'OG Relaxed Easy Drawstring Trousers',
      tagline: 'Dense cotton-twill with elasticated drawstring waist and straight tailored leg',
      description:
        'The bridge between tailored elegance and street comfort. Features a comfortable elastic waist with natural cotton drawcord, deep side pockets, and a clean straight leg that stacks effortlessly over boots or trainers.',
      category: 'Trousers',
      department: 'unisex',
      collectionSlug: 'everyday-uniform',
      tags: ['unisex', 'trousers', 'drawstring', 'relaxed', 'twill', 'pants'],
      fabric: '100% 260 GSM Washed Cotton Chino Twill',
      fit: 'Relaxed Straight Cut with Flexible Elastic-Drawstring Waist.',
      careInstructions: 'Machine wash cold with like colors. Tumble dry low.',
      basePricePaise: 279900,
      salePricePaise: 239900,
      isNew: true,
      isBestSeller: false,
      isFeatured: true,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_udt_sg_s', productId: 'prod_unisex_drawstring_trouser_stone', size: 'S', color: 'Stone Grey', colorHex: '#A6A49C', sku: 'OG-U-TR-DRW-ST-S', stockQuantity: 18 },
        { id: 'var_udt_sg_m', productId: 'prod_unisex_drawstring_trouser_stone', size: 'M', color: 'Stone Grey', colorHex: '#A6A49C', sku: 'OG-U-TR-DRW-ST-M', stockQuantity: 30 },
        { id: 'var_udt_sg_l', productId: 'prod_unisex_drawstring_trouser_stone', size: 'L', color: 'Stone Grey', colorHex: '#A6A49C', sku: 'OG-U-TR-DRW-ST-L', stockQuantity: 24 },
        { id: 'var_udt_sg_xl', productId: 'prod_unisex_drawstring_trouser_stone', size: 'XL', color: 'Stone Grey', colorHex: '#A6A49C', sku: 'OG-U-TR-DRW-ST-XL', stockQuantity: 15 },
        { id: 'var_udt_ch_m', productId: 'prod_unisex_drawstring_trouser_stone', size: 'M', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-U-TR-DRW-CH-M', stockQuantity: 25 },
      ],
      createdAt: '2026-10-26T07:00:00Z',
      rating: 4.9,
      reviewCount: 53,
    },
    {
      id: 'prod_unisex_heavyweight_essential_tee_sand',
      slug: 'og-uniform-heavyweight-basic-tee',
      name: 'OG Uniform Heavyweight Basic Tee',
      tagline: '280 GSM single-jersey combed cotton with high-density ribbed collar that holds shape',
      description:
        'A foundational piece built for longevity. Knitted with zero lateral seams, reinforced shoulders, and dense combed cotton yarns that develop a richer character with every wash.',
      category: 'T-Shirts',
      department: 'unisex',
      collectionSlug: 'everyday-uniform',
      tags: ['unisex', 't-shirt', 'plain', 'essential', 'basic', 'heavyweight'],
      fabric: '100% 280 GSM Single-Jersey Combed Cotton',
      fit: 'Standard Relaxed Unisex Silhouette.',
      careInstructions: 'Machine wash cold inside out. Tumble dry low or hang dry.',
      basePricePaise: 139900,
      salePricePaise: 114900,
      isNew: false,
      isBestSeller: true,
      isFeatured: true,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_uet_sd_xs', productId: 'prod_unisex_heavyweight_essential_tee_sand', size: 'XS', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-U-TE-UNF-SD-XS', stockQuantity: 20 },
        { id: 'var_uet_sd_s', productId: 'prod_unisex_heavyweight_essential_tee_sand', size: 'S', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-U-TE-UNF-SD-S', stockQuantity: 35 },
        { id: 'var_uet_sd_m', productId: 'prod_unisex_heavyweight_essential_tee_sand', size: 'M', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-U-TE-UNF-SD-M', stockQuantity: 45 },
        { id: 'var_uet_sd_l', productId: 'prod_unisex_heavyweight_essential_tee_sand', size: 'L', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-U-TE-UNF-SD-L', stockQuantity: 30 },
        { id: 'var_uet_sd_xl', productId: 'prod_unisex_heavyweight_essential_tee_sand', size: 'XL', color: 'Warm Sand', colorHex: '#D6C7AE', sku: 'OG-U-TE-UNF-SD-XL', stockQuantity: 18 },
        { id: 'var_uet_ch_m', productId: 'prod_unisex_heavyweight_essential_tee_sand', size: 'M', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-U-TE-UNF-CH-M', stockQuantity: 26 },
      ],
      createdAt: '2026-10-26T08:00:00Z',
      rating: 4.9,
      reviewCount: 68,
    },
    {
      id: 'prod_unisex_statement_utility_vest',
      slug: 'og-archival-modular-tactical-vest',
      name: 'OG Archival Modular Tactical Vest',
      tagline: 'High-density Cordura nylon vest with MOLLE webbing, 5 utility pockets, and side buckle straps',
      description:
        'A statement streetwear layering piece. Engineered with tactical quick-release side buckles, heavy-duty metal zippers, hidden interior passport pouch, and ventilated back panel. Worn effortlessly over tees or hoodies.',
      category: 'Jackets',
      department: 'unisex',
      collectionSlug: 'everyday-uniform',
      tags: ['unisex', 'jackets', 'outerwear', 'vest', 'tactical', 'statement', 'streetwear'],
      fabric: '500D Technical Cordura Nylon with Breathable Air-Mesh Back',
      fit: 'Adjustable Tactical Vest. Side compression straps fit sizes XS through XXL.',
      careInstructions: 'Spot clean with damp cloth. Do not machine wash.',
      basePricePaise: 349900,
      salePricePaise: 289900,
      isNew: true,
      isBestSeller: false,
      isFeatured: true,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80'],
      variants: [
        { id: 'var_uvs_ch_s', productId: 'prod_unisex_statement_utility_vest', size: 'S', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-U-VST-MOD-CH-S', stockQuantity: 12 },
        { id: 'var_uvs_ch_m', productId: 'prod_unisex_statement_utility_vest', size: 'M', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-U-VST-MOD-CH-M', stockQuantity: 22 },
        { id: 'var_uvs_ch_l', productId: 'prod_unisex_statement_utility_vest', size: 'L', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-U-VST-MOD-CH-L', stockQuantity: 18 },
        { id: 'var_uvs_ch_xl', productId: 'prod_unisex_statement_utility_vest', size: 'XL', color: 'Charcoal', colorHex: '#20211E', sku: 'OG-U-VST-MOD-CH-XL', stockQuantity: 10 },
        { id: 'var_uvs_ol_m', productId: 'prod_unisex_statement_utility_vest', size: 'M', color: 'Muted Olive', colorHex: '#777B5A', sku: 'OG-U-VST-MOD-OL-M', stockQuantity: 15 },
      ],
      createdAt: '2026-10-26T09:00:00Z',
      rating: 5.0,
      reviewCount: 27,
    },
  ];

  const discountCodes: DiscountCode[] = [
    {
      id: 'disc_001',
      code: 'OFFGRID10',
      type: 'percent',
      value: 10,
      minOrderPaise: 100000, // ₹1,000
      timesUsed: 42,
      isActive: true,
    },
    {
      id: 'disc_002',
      code: 'OGFIRST',
      type: 'flat',
      value: 30000, // ₹300
      minOrderPaise: 199900, // ₹1,999
      timesUsed: 18,
      isActive: true,
    },
    {
      id: 'disc_003',
      code: 'OGVIP',
      type: 'percent',
      value: 20,
      minOrderPaise: 350000, // ₹3,500
      timesUsed: 5,
      isActive: true,
    },
  ];

  const reviews: Review[] = [
    {
      id: 'rev_001',
      productId: 'prod_polo_olive',
      userName: 'Aarav Mehta',
      rating: 5,
      comment:
        'The collar holds its structure perfectly, even after multiple washes. The olive tone has this subtle richness that looks significantly higher-end than standard fast fashion.',
      verifiedPurchase: true,
      createdAt: '2026-09-15T14:30:00Z',
    },
    {
      id: 'rev_002',
      productId: 'prod_trousers_sand',
      userName: 'Kabir Singhania',
      rating: 5,
      comment:
        'Best trousers I own. The single pleat gives incredible movement and the fabric drapes like a tailored Japanese pair. Fits true to size.',
      verifiedPurchase: true,
      createdAt: '2026-09-20T11:15:00Z',
    },
    {
      id: 'rev_003',
      productId: 'prod_tee_oversized',
      userName: 'Rohan V.',
      rating: 5,
      comment:
        'Heavyweight 280 GSM cotton is legitimate. No see-through, thick neckline ribbing that does not bacon-wave. Clean minimalism at its best.',
      verifiedPurchase: true,
      createdAt: '2026-09-28T09:40:00Z',
    },
  ];

  const sampleOrder: Order = {
    id: 'ord_sample_101',
    orderNumber: 'OG-2026-1042',
    userId: 'usr_cust_001',
    customerName: 'Prabhat Deora',
    customerEmail: 'prabhat18deora@gmail.com',
    customerPhone: '+91 98765 43210',
    items: [
      {
        id: 'ord_item_01',
        orderId: 'ord_sample_101',
        productId: 'prod_polo_olive',
        variantId: 'var_polo_ol_l',
        productName: 'OG Everyday Polo',
        variantLabel: 'Olive / L',
        pricePaise: 219900,
        quantity: 1,
        imageUrl: '/src/assets/images/product_polo_olive_1791888587605.jpg',
      },
      {
        id: 'ord_item_02',
        orderId: 'ord_sample_101',
        productId: 'prod_trousers_sand',
        variantId: 'var_tr_sand_m',
        productName: 'OG Pleated Relaxed Trousers',
        variantLabel: 'Sand Beige / M',
        pricePaise: 289900,
        quantity: 1,
        imageUrl: '/src/assets/images/category_trousers_look_1791888586736.jpg',
      },
    ],
    shippingAddress: {
      id: 'addr_sample',
      fullName: 'Prabhat Deora',
      phone: '+91 98765 43210',
      line1: '402, Sunset Boulevard, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400050',
      country: 'India',
    },
    subtotalPaise: 509800,
    discountPaise: 50980,
    discountCode: 'OFFGRID10',
    shippingChargesPaise: 0,
    taxPaise: 0,
    totalPaise: 458820,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'razorpay',
    paymentId: 'pay_og_sample_99321',
    trackingNumber: 'BLUEDART-8829103948',
    courierName: 'Blue Dart Express',
    notes: 'Signature required at doorstep delivery',
    createdAt: '2026-10-02T12:00:00Z',
    updatedAt: '2026-10-04T15:20:00Z',
  };

  const mediaImages: ImageRecord[] = [
    {
      id: 'img_001',
      url: '/src/assets/images/hero_find_your_way_1792064208834.jpg',
      title: 'Homepage Hero Campaign Banner',
      department: 'GENERAL',
      imageType: 'HERO',
      category: 'Campaign',
      isPrimary: true,
      altText: 'OffGrid OG modern campaign banner showing balanced minimalist streetwear aesthetic with male and female models',
      createdAt: '2026-10-15T00:00:00Z',
    },
    {
      id: 'img_002',
      url: '/src/assets/images/hero_fashion_campaign_1791888586032.jpg',
      title: "Men's Editorial Campaign Hero Banner",
      department: 'MEN',
      imageType: 'HERO',
      category: 'Jackets',
      productId: 'prod_bomber_jacket',
      isPrimary: true,
      altText: 'Male model wearing minimalist outerwear jacket in architectural urban setting',
      createdAt: '2026-10-15T01:00:00Z',
    },
    {
      id: 'img_003',
      url: '/src/assets/images/hero_women_campaign_1792061306400.jpg',
      title: "Women's Collection Autumn/Winter Campaign Hero Banner",
      department: 'WOMEN',
      imageType: 'HERO',
      category: 'Outerwear',
      productId: 'prod_wmn_outerwear_blazer',
      isPrimary: true,
      altText: 'Female model wearing tailored minimalist oversized blazer with architectural presence',
      createdAt: '2026-10-15T02:00:00Z',
    },
    {
      id: 'img_004',
      url: '/src/assets/images/campaign_editorial_layering_1791888586191.jpg',
      title: 'Men Warm Minimalism Layering Look',
      department: 'MEN',
      imageType: 'LIFESTYLE',
      category: 'Overshirts',
      productId: 'prod_overshirt_sand',
      isPrimary: true,
      altText: 'Male fashion model showcasing tactile sand beige overshirt and layered styling',
      createdAt: '2026-10-15T03:00:00Z',
    },
    {
      id: 'img_005',
      url: '/src/assets/images/product_tee_heavyweight_1791888627295.jpg',
      title: 'Men Heavyweight Boxy T-Shirt',
      department: 'MEN',
      imageType: 'PRODUCT',
      category: 'T-Shirts',
      productId: 'prod_tee_heavyweight',
      isPrimary: true,
      altText: 'Men heavyweight 280 GSM combed cotton washed black boxy t-shirt',
      createdAt: '2026-10-15T04:00:00Z',
    },
    {
      id: 'img_006',
      url: '/src/assets/images/product_polo_olive_1791888587605.jpg',
      title: 'Men OG Everyday Polo Olive',
      department: 'MEN',
      imageType: 'PRODUCT',
      category: 'Polos',
      productId: 'prod_polo_olive',
      isPrimary: true,
      altText: 'Men classic textured pique polo shirt in muted olive tone',
      createdAt: '2026-10-15T05:00:00Z',
    },
    {
      id: 'img_007',
      url: '/src/assets/images/product_oxford_shirt_1791888627723.jpg',
      title: 'Men Relaxed Oxford Shirt',
      department: 'MEN',
      imageType: 'PRODUCT',
      category: 'Shirts',
      productId: 'prod_oxford_shirt',
      isPrimary: true,
      altText: 'Men crisp washed white oxford button-down shirt with relaxed cut',
      createdAt: '2026-10-15T06:00:00Z',
    },
    {
      id: 'img_008',
      url: '/src/assets/images/category_trousers_look_1791888586736.jpg',
      title: 'Men Pleated Wool-Blend Trousers',
      department: 'MEN',
      imageType: 'MODEL',
      category: 'Trousers',
      productId: 'prod_trouser_charcoal',
      isPrimary: true,
      altText: 'Male model styled in deep charcoal pleated fluid drape trousers',
      createdAt: '2026-10-15T07:00:00Z',
    },

    {
      id: 'img_010',
      url: '/src/assets/images/product_bomber_jacket_1791888628108.jpg',
      title: 'Men Minimalist Shell Bomber',
      department: 'MEN',
      imageType: 'PRODUCT',
      category: 'Jackets',
      productId: 'prod_bomber_jacket',
      isPrimary: false,
      altText: 'Men weather-resistant matte black minimalist shell bomber jacket',
      createdAt: '2026-10-15T09:00:00Z',
    },
    {
      id: 'img_011',
      url: '/src/assets/images/outfit_streetwear_coord_1791888587655.jpg',
      title: 'Men Boxy French Terry Sweatshirt & Co-ord',
      department: 'MEN',
      imageType: 'PRODUCT',
      category: 'Sweatshirts',
      productId: 'prod_men_terry_sweatshirt',
      isPrimary: true,
      altText: 'Men heavyweight 420 GSM loopback cotton fleece sweatshirt in heather grey',
      createdAt: '2026-10-15T10:00:00Z',
    },
    {
      id: 'img_012',
      url: '/src/assets/images/women_tops_editorial_1792062525021.jpg',
      title: 'Women Sculpted Minimalist Top Editorial',
      department: 'WOMEN',
      imageType: 'MODEL',
      category: 'Tops',
      productId: 'prod_wmn_cropped_tank',
      isPrimary: true,
      altText: 'Female fashion model wearing sculpted ribbed knit crop top in warm ivory',
      createdAt: '2026-10-15T11:00:00Z',
    },
    {
      id: 'img_013',
      url: '/src/assets/images/women_relaxed_poplin_shirt_1792409673934.jpg',
      title: 'Women Relaxed Washed Poplin Shirt',
      department: 'WOMEN',
      imageType: 'PRODUCT',
      category: 'Shirts',
      productId: 'prod_wmn_relaxed_shirt',
      isPrimary: true,
      altText: 'Women oversized boyfriend poplin shirt in crisp off-white cotton silk',
      createdAt: '2026-10-15T12:00:00Z',
    },
    {
      id: 'img_014',
      url: '/src/assets/images/women_fluid_wide_trousers_1792409690642.jpg',
      title: 'Women Fluid Wide-Leg Trousers',
      department: 'WOMEN',
      imageType: 'PRODUCT',
      category: 'Trousers',
      productId: 'prod_wmn_wide_trousers',
      isPrimary: true,
      altText: 'Women high-waisted fluid drape wide-leg trousers in sand beige',
      createdAt: '2026-10-15T13:00:00Z',
    },
    {
      id: 'img_015',
      url: '/src/assets/images/product_women_jeans_1792061307710.jpg',
      title: 'Women Straight-Leg Organic Jeans',
      department: 'WOMEN',
      imageType: 'PRODUCT',
      category: 'Jeans',
      productId: 'prod_wmn_organic_denim',
      isPrimary: true,
      altText: 'Female model wearing washed indigo straight-leg high-waisted denim jeans',
      createdAt: '2026-10-15T14:00:00Z',
    },
    {
      id: 'img_016',
      url: '/src/assets/images/product_women_dress_1792061307251.jpg',
      title: 'Women Column Knit Maxi Slip Dress',
      department: 'WOMEN',
      imageType: 'PRODUCT',
      category: 'Dresses',
      productId: 'prod_wmn_ribbed_maxi_dress',
      isPrimary: true,
      altText: 'Female model wearing elegant ribbed column knit maxi slip dress in warm sand',
      createdAt: '2026-10-15T15:00:00Z',
    },
    {
      id: 'img_017',
      url: '/src/assets/images/product_women_coord_1792061307583.jpg',
      title: 'Women Modular Utilitarian Co-ord Set',
      department: 'WOMEN',
      imageType: 'PRODUCT',
      category: 'Co-ord Sets',
      productId: 'prod_wmn_utilitarian_coord',
      isPrimary: true,
      altText: 'Female model wearing coordinated cropped utility jacket and pleated wide trouser set',
      createdAt: '2026-10-15T16:00:00Z',
    },
    {
      id: 'img_018',
      url: '/src/assets/images/women_outerwear_blazer_1792062522398.jpg',
      title: 'Women Architectural Oversized Blazer',
      department: 'WOMEN',
      imageType: 'PRODUCT',
      category: 'Jackets',
      productId: 'prod_wmn_outerwear_blazer',
      isPrimary: true,
      altText: 'Women double-breasted structured oversized blazer in charcoal black',
      createdAt: '2026-10-15T17:00:00Z',
    },
    {
      id: 'img_019',
      url: '/images/women_graphic_tees.jpg',
      title: 'Women Graphic Tees Reference Model',
      department: 'WOMEN',
      imageType: 'MODEL',
      category: 'T-Shirts',
      productId: 'prod_wmn_vintage_graphic_tee',
      isPrimary: true,
      altText: 'Woman wearing cream oversized vintage graphic T-shirt with blue jeans',
      createdAt: '2026-10-15T18:00:00Z',
    },
    {
      id: 'img_020',
      url: '/images/women_oversized_tees.jpg',
      title: 'Women Oversized Tees Reference Model',
      department: 'WOMEN',
      imageType: 'MODEL',
      category: 'Oversized T-Shirts',
      productId: 'prod_wmn_oversized_streetwear_tee',
      isPrimary: true,
      altText: 'Woman wearing washed black oversized streetwear graphic T-shirt with grey jeans',
      createdAt: '2026-10-15T19:00:00Z',
    },
    {
      id: 'img_021',
      url: '/images/women_everyday_essentials.jpg',
      title: 'Women Everyday Essentials Minimal Artifact Tee',
      department: 'WOMEN',
      imageType: 'PRODUCT',
      category: 'T-Shirts',
      productId: 'prod_wmn_essential_artifact_tee',
      isPrimary: true,
      altText: 'Clean flat-lay view of cream minimalist botanical emblem graphic heavyweight t-shirt',
      createdAt: '2026-10-15T20:00:00Z',
    },
    {
      id: 'img_022',
      url: '/src/assets/images/product_organic_cotton_socks_1792409728818.jpg',
      title: 'Unisex Heavyweight Ribbed Socks (3-Pack)',
      department: 'UNISEX',
      imageType: 'PRODUCT',
      category: 'Accessories',
      productId: 'prod_acc_organic_socks',
      isPrimary: true,
      altText: 'Unisex organic cotton cushioned ribbed crew socks 3-pack in warm ivory',
      createdAt: '2026-10-15T21:00:00Z',
    },
    {
      id: 'img_023',
      url: '/src/assets/images/product_canvas_tote_bag_1792409743795.jpg',
      title: 'Unisex Archival Canvas Tote Bag',
      department: 'UNISEX',
      imageType: 'PRODUCT',
      category: 'Accessories',
      productId: 'prod_acc_canvas_tote',
      isPrimary: true,
      altText: 'Unisex heavy 16 oz unbleached natural duck canvas tote bag',
      createdAt: '2026-10-15T22:00:00Z',
    },
    {
      id: 'img_024',
      url: '/src/assets/images/product_washed_dad_cap_1792409758600.jpg',
      title: 'Unisex Washed Cotton Signature Cap',
      department: 'UNISEX',
      imageType: 'PRODUCT',
      category: 'Accessories',
      productId: 'prod_acc_dad_cap',
      isPrimary: true,
      altText: 'Unisex low-profile washed chino twill 6-panel cap with brass slider',
      createdAt: '2026-10-15T23:00:00Z',
    },
    {
      id: 'img_025',
      url: '/src/assets/images/brand_logo_new.png',
      title: 'OffGrid OG Brand Identity Logo',
      department: 'GENERAL',
      imageType: 'BANNER',
      category: 'Branding',
      isPrimary: true,
      altText: 'OffGrid OG authentic brand logo wordmark',
      createdAt: '2026-10-16T00:00:00Z',
    },

    {
      id: 'img_026',
      url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Glyph Archival Oversized Graphic Tee',
      department: 'MEN',
      imageType: 'PRODUCT',
      category: 'T-Shirts',
      productId: 'prod_men_graphic_tee_cyber',
      isPrimary: true,
      altText: 'OG Glyph Archival Oversized Graphic Tee on minimalist studio background',
      createdAt: '2026-10-25T10:00:00Z',
    },
    {
      id: 'img_027',
      url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Raw Hem Plain Oversized Tee',
      department: 'MEN',
      imageType: 'PRODUCT',
      category: 'T-Shirts',
      productId: 'prod_men_plain_oversized_sand',
      isPrimary: true,
      altText: 'OG Raw Hem Plain Oversized Tee on minimalist studio background',
      createdAt: '2026-10-25T11:00:00Z',
    },
    {
      id: 'img_028',
      url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Heavyweight Boxy Cut Tee',
      department: 'MEN',
      imageType: 'PRODUCT',
      category: 'T-Shirts',
      productId: 'prod_men_boxy_tee_obsidian',
      isPrimary: true,
      altText: 'OG Heavyweight Boxy Cut Tee on minimalist studio background',
      createdAt: '2026-10-25T12:00:00Z',
    },
    {
      id: 'img_029',
      url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Relaxed Camp Collar Poplin Shirt',
      department: 'MEN',
      imageType: 'PRODUCT',
      category: 'Shirts',
      productId: 'prod_men_linen_shirt_olive',
      isPrimary: true,
      altText: 'OG Relaxed Camp Collar Poplin Shirt on minimalist studio background',
      createdAt: '2026-10-25T13:00:00Z',
    },
    {
      id: 'img_030',
      url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Heavyweight Oversized Pullover Hoodie',
      department: 'MEN',
      imageType: 'PRODUCT',
      category: 'Sweatshirts',
      productId: 'prod_men_hoodie_charcoal',
      isPrimary: true,
      altText: 'OG Heavyweight Oversized Pullover Hoodie on minimalist studio background',
      createdAt: '2026-10-25T14:00:00Z',
    },
    {
      id: 'img_031',
      url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Modular Tactical Cargo Pants',
      department: 'MEN',
      imageType: 'PRODUCT',
      category: 'Trousers',
      productId: 'prod_men_tactical_cargo_olive',
      isPrimary: true,
      altText: 'OG Modular Tactical Cargo Pants on minimalist studio background',
      createdAt: '2026-10-25T15:00:00Z',
    },
    {
      id: 'img_032',
      url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Wide-Leg Relaxed Pleated Trousers',
      department: 'MEN',
      imageType: 'PRODUCT',
      category: 'Trousers',
      productId: 'prod_men_pleated_trouser_stone',
      isPrimary: true,
      altText: 'OG Wide-Leg Relaxed Pleated Trousers on minimalist studio background',
      createdAt: '2026-10-25T16:00:00Z',
    },
    {
      id: 'img_033',
      url: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Heavyweight French Terry Joggers',
      department: 'MEN',
      imageType: 'PRODUCT',
      category: 'Trousers',
      productId: 'prod_men_streetwear_jogger_black',
      isPrimary: true,
      altText: 'OG Heavyweight French Terry Joggers on minimalist studio background',
      createdAt: '2026-10-25T17:00:00Z',
    },
    {
      id: 'img_034',
      url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Technical Field Zip Jacket',
      department: 'MEN',
      imageType: 'PRODUCT',
      category: 'Jackets',
      productId: 'prod_men_utility_jacket_olive',
      isPrimary: true,
      altText: 'OG Technical Field Zip Jacket on minimalist studio background',
      createdAt: '2026-10-25T18:00:00Z',
    },
    {
      id: 'img_035',
      url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Studio Typographic Oversized Tee',
      department: 'WOMEN',
      imageType: 'PRODUCT',
      category: 'T-Shirts & Tops',
      productId: 'prod_wmn_graphic_tee_distortion',
      isPrimary: true,
      altText: 'OG Studio Typographic Oversized Tee on minimalist studio background',
      createdAt: '2026-10-25T19:00:00Z',
    },
    {
      id: 'img_036',
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Seamless Heavy Rib Crop Top',
      department: 'WOMEN',
      imageType: 'PRODUCT',
      category: 'T-Shirts & Tops',
      productId: 'prod_wmn_ribbed_crop_top_sand',
      isPrimary: true,
      altText: 'OG Seamless Heavy Rib Crop Top on minimalist studio background',
      createdAt: '2026-10-25T20:00:00Z',
    },
    {
      id: 'img_037',
      url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Fitted Mockneck Long Sleeve Top',
      department: 'WOMEN',
      imageType: 'PRODUCT',
      category: 'T-Shirts & Tops',
      productId: 'prod_wmn_fitted_mockneck_stone',
      isPrimary: true,
      altText: 'OG Fitted Mockneck Long Sleeve Top on minimalist studio background',
      createdAt: '2026-10-25T21:00:00Z',
    },
    {
      id: 'img_038',
      url: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Boyfriend Oversized Poplin Shirt',
      department: 'WOMEN',
      imageType: 'PRODUCT',
      category: 'Shirts',
      productId: 'prod_wmn_boyfriend_poplin_ivory',
      isPrimary: true,
      altText: 'OG Boyfriend Oversized Poplin Shirt on minimalist studio background',
      createdAt: '2026-10-25T22:00:00Z',
    },
    {
      id: 'img_039',
      url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Cropped Raw-Edge Fleece Hoodie',
      department: 'WOMEN',
      imageType: 'PRODUCT',
      category: 'Sweatshirts',
      productId: 'prod_wmn_fleece_hoodie_ivory',
      isPrimary: true,
      altText: 'OG Cropped Raw-Edge Fleece Hoodie on minimalist studio background',
      createdAt: '2026-10-25T23:00:00Z',
    },
    {
      id: 'img_040',
      url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=80',
      title: 'OG High-Rise Column Wide Trousers',
      department: 'WOMEN',
      imageType: 'PRODUCT',
      category: 'Trousers',
      productId: 'prod_wmn_wide_leg_trouser_sand',
      isPrimary: true,
      altText: 'OG High-Rise Column Wide Trousers on minimalist studio background',
      createdAt: '2026-10-26T00:00:00Z',
    },
    {
      id: 'img_041',
      url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Parachute Utility Cargo Pants',
      department: 'WOMEN',
      imageType: 'PRODUCT',
      category: 'Trousers',
      productId: 'prod_wmn_parachute_cargo_charcoal',
      isPrimary: true,
      altText: 'OG Parachute Utility Cargo Pants on minimalist studio background',
      createdAt: '2026-10-26T01:00:00Z',
    },
    {
      id: 'img_042',
      url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Minimalist Linen-Blend Co-ord Set',
      department: 'WOMEN',
      imageType: 'PRODUCT',
      category: 'Co-ord Sets',
      productId: 'prod_wmn_coord_olive_set',
      isPrimary: true,
      altText: 'OG Minimalist Linen-Blend Co-ord Set on minimalist studio background',
      createdAt: '2026-10-26T02:00:00Z',
    },

    {
      id: 'img_044',
      url: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Monolith Coordinates Unisex Graphic Tee',
      department: 'UNISEX',
      imageType: 'PRODUCT',
      category: 'T-Shirts',
      productId: 'prod_unisex_graphic_tee_architect',
      isPrimary: true,
      altText: 'OG Monolith Coordinates Unisex Graphic Tee on minimalist studio background',
      createdAt: '2026-10-26T04:00:00Z',
    },

    {
      id: 'img_046',
      url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Studio Boxy Crewneck Sweatshirt',
      department: 'UNISEX',
      imageType: 'PRODUCT',
      category: 'Sweatshirts',
      productId: 'prod_unisex_oversized_sweatshirt_ivory',
      isPrimary: true,
      altText: 'OG Studio Boxy Crewneck Sweatshirt on minimalist studio background',
      createdAt: '2026-10-26T06:00:00Z',
    },
    {
      id: 'img_047',
      url: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Relaxed Easy Drawstring Trousers',
      department: 'UNISEX',
      imageType: 'PRODUCT',
      category: 'Trousers',
      productId: 'prod_unisex_drawstring_trouser_stone',
      isPrimary: true,
      altText: 'OG Relaxed Easy Drawstring Trousers on minimalist studio background',
      createdAt: '2026-10-26T07:00:00Z',
    },
    {
      id: 'img_048',
      url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Uniform Heavyweight Basic Tee',
      department: 'UNISEX',
      imageType: 'PRODUCT',
      category: 'T-Shirts',
      productId: 'prod_unisex_heavyweight_essential_tee_sand',
      isPrimary: true,
      altText: 'OG Uniform Heavyweight Basic Tee on minimalist studio background',
      createdAt: '2026-10-26T08:00:00Z',
    },
    {
      id: 'img_049',
      url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80',
      title: 'OG Archival Modular Tactical Vest',
      department: 'UNISEX',
      imageType: 'PRODUCT',
      category: 'Jackets',
      productId: 'prod_unisex_statement_utility_vest',
      isPrimary: true,
      altText: 'OG Archival Modular Tactical Vest on minimalist studio background',
      createdAt: '2026-10-26T09:00:00Z',
    },
  ];

  return {
    users: [adminUser, demoCustomer],
    products,
    categories,
    collections,
    orders: [sampleOrder],
    payments: [],
    discountCodes,
    newsletterSubscriptions: [
      { id: 'sub_001', email: 'subscriber@offgridog.in', subscribedAt: '2026-10-01T10:00:00Z', isActive: true },
    ],
    reviews,
    settings: DEFAULT_SETTINGS,
    auditLogs: [
      {
        id: 'log_001',
        action: 'STORE_INITIALIZED',
        performedBy: 'System',
        details: 'Initial OffGrid OG catalog, inventory, and security bootstrapped.',
        timestamp: new Date().toISOString(),
      },
    ],
    mediaImages,
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        const seed = getSeedDatabase();
        let updated = false;

        // Ensure all categories from seed are present and synchronized
        if (!Array.isArray(parsed.categories)) parsed.categories = [];
        for (const cat of seed.categories) {
          const idx = parsed.categories.findIndex((c: Category) => c.slug === cat.slug || c.id === cat.id);
          if (idx === -1) {
            parsed.categories.push(cat);
            updated = true;
          } else {
            if (cat.image && parsed.categories[idx].image !== cat.image) {
              parsed.categories[idx].image = cat.image;
              updated = true;
            }
            if (cat.department && parsed.categories[idx].department !== cat.department) {
              parsed.categories[idx].department = cat.department;
              updated = true;
            }
          }
        }

        // Ensure all collections from seed are present and synced
        if (!Array.isArray(parsed.collections)) parsed.collections = [];
        for (const col of seed.collections) {
          const idx = parsed.collections.findIndex((c: Collection) => c.slug === col.slug);
          if (idx === -1) {
            parsed.collections.push(col);
            updated = true;
          } else {
            if (col.department && parsed.collections[idx].department !== col.department) {
              parsed.collections[idx].department = col.department;
              updated = true;
            }
            if (col.bannerImage && parsed.collections[idx].bannerImage !== col.bannerImage) {
              parsed.collections[idx].bannerImage = col.bannerImage;
              updated = true;
            }
          }
        }

        // Ensure all products from seed are present and department/image audited
        if (!Array.isArray(parsed.products)) parsed.products = [];
        for (const prod of seed.products) {
          const existing = parsed.products.find((p: Product) => p.id === prod.id || p.slug === prod.slug);
          if (!existing) {
            parsed.products.push(prod);
            updated = true;
          } else {
            // Unconditionally sync audited department from seed
            if (prod.department && existing.department !== prod.department) {
              existing.department = prod.department;
              updated = true;
            }
            // Sync audited product images if mismatched
            if (prod.images && JSON.stringify(existing.images) !== JSON.stringify(prod.images)) {
              existing.images = prod.images;
              updated = true;
            }
            if (prod.rating && (!existing.rating || existing.rating !== prod.rating)) {
              existing.rating = prod.rating;
              existing.reviewCount = prod.reviewCount;
              updated = true;
            }
          }
        }

        // Ensure mediaImages are initialized
        if (!Array.isArray(parsed.mediaImages) || parsed.mediaImages.length === 0) {
          parsed.mediaImages = seed.mediaImages;
          updated = true;
        } else {
          // Ensure all seed media images are present
          for (const sImg of seed.mediaImages) {
            const hasImg = parsed.mediaImages.some((m: ImageRecord) => m.url === sImg.url || m.id === sImg.id);
            if (!hasImg) {
              parsed.mediaImages.push(sImg);
              updated = true;
            }
          }
        }

        // Ensure all products have rating and reviewCount
        for (const p of parsed.products) {
          if (!p.rating) {
            p.rating = p.isBestSeller ? 4.9 : 4.8;
            p.reviewCount = p.isBestSeller ? 48 : 28;
            updated = true;
          }
        }

        // Ensure all existing male products without department have department: 'men'
        for (const p of parsed.products) {
          if (!p.department) {
            if (p.id.includes('_wmn_') || p.tags?.includes('women')) {
              p.department = 'women';
            } else if (p.tags?.includes('unisex')) {
              p.department = 'unisex';
            } else {
              p.department = 'men';
            }
            updated = true;
          }
        }

        if (updated) {
          this.saveDataDirect(parsed);
        }
        return parsed;
      } catch (err) {
        console.error('Failed to parse database file, resetting to seed:', err);
      }
    }
    const seed = getSeedDatabase();
    this.saveDataDirect(seed);
    return seed;
  }

  private saveDataDirect(data: DatabaseSchema) {
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  public save() {
    this.saveDataDirect(this.data);
  }

  public getRawData(): DatabaseSchema {
    return this.data;
  }

  // --- Users & Auth ---
  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.findUserById(id);
    if (!user) return undefined;
    Object.assign(user, updates);
    this.save();
    return user;
  }

  // --- Products & Variants ---
  public getProducts(options?: {
    category?: string;
    collection?: string;
    search?: string;
    department?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: 'recommended' | 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'rating_desc';
    onlyPublished?: boolean;
  }): Product[] {
    let list = [...this.data.products];

    if (options?.onlyPublished ?? true) {
      list = list.filter((p) => p.status === 'published');
    }

    if (options?.department && options.department !== 'all') {
      const dept = options.department.toLowerCase();
      if (dept === 'women') {
        list = list.filter(
          (p) =>
            (p.department === 'women' || (p.department === 'unisex' && !p.id.includes('_men_'))) &&
            !p.tags?.includes('men')
        );
      } else if (dept === 'men') {
        list = list.filter(
          (p) =>
            (p.department === 'men' || p.department === 'unisex' || !p.department) &&
            !p.id.includes('_wmn_') &&
            !p.tags?.includes('women')
        );
      } else if (dept === 'unisex') {
        list = list.filter((p) => p.department === 'unisex');
      }
    }

    if (options?.category && options.category !== 'all') {
      const catLower = options.category.toLowerCase();
      list = list.filter(
        (p) =>
          p.category.toLowerCase() === catLower ||
          p.tags.some((t) => t.toLowerCase() === catLower)
      );
    }

    if (options?.collection && options.collection !== 'all') {
      list = list.filter((p) => p.collectionSlug === options.collection);
    }

    if (options?.search) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (options?.minPrice !== undefined) {
      list = list.filter((p) => (p.salePricePaise || p.basePricePaise) >= options.minPrice!);
    }
    if (options?.maxPrice !== undefined) {
      list = list.filter((p) => (p.salePricePaise || p.basePricePaise) <= options.maxPrice!);
    }

    if (options?.sort) {
      if (options.sort === 'newest') {
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (options.sort === 'price_asc') {
        list.sort((a, b) => (a.salePricePaise || a.basePricePaise) - (b.salePricePaise || b.basePricePaise));
      } else if (options.sort === 'price_desc') {
        list.sort((a, b) => (b.salePricePaise || b.basePricePaise) - (a.salePricePaise || a.basePricePaise));
      } else if (options.sort === 'popular') {
        list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || (b.reviewCount || 0) - (a.reviewCount || 0));
      } else if (options.sort === 'rating_desc') {
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviewCount || 0) - (a.reviewCount || 0));
      } else if (options.sort === 'recommended') {
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
      }
    }

    return list;
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.data.products.find((p) => p.slug === slug);
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find((p) => p.id === id);
  }

  public createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Product {
    const id = `prod_${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: new Date().toISOString(),
    };
    this.data.products.push(newProduct);
    this.logAudit('PRODUCT_CREATED', 'Admin', `Created product "${newProduct.name}" (${newProduct.id})`);
    this.save();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const product = this.getProductById(id);
    if (!product) return undefined;
    Object.assign(product, updates);
    this.logAudit('PRODUCT_UPDATED', 'Admin', `Updated product "${product.name}" (${product.id})`);
    this.save();
    return product;
  }

  public deleteProduct(id: string): boolean {
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    const [deleted] = this.data.products.splice(index, 1);
    this.logAudit('PRODUCT_DELETED', 'Admin', `Deleted product "${deleted.name}" (${deleted.id})`);
    this.save();
    return true;
  }

  // --- Inventory & Order Atomic Operations ---
  public validateAndReserveStock(items: { variantId: string; quantity: number }[]): {
    success: boolean;
    error?: string;
  } {
    // 1. Verify all variants exist and have sufficient stock
    for (const item of items) {
      let found = false;
      for (const p of this.data.products) {
        const v = p.variants.find((v) => v.id === item.variantId);
        if (v) {
          found = true;
          if (v.stockQuantity < item.quantity) {
            return {
              success: false,
              error: `Insufficient stock for ${p.name} (${v.color} / ${v.size}). Available: ${v.stockQuantity}`,
            };
          }
          break;
        }
      }
      if (!found) {
        return { success: false, error: `Variant ID ${item.variantId} not found` };
      }
    }

    // 2. Decrement stock atomically
    for (const item of items) {
      for (const p of this.data.products) {
        const v = p.variants.find((v) => v.id === item.variantId);
        if (v) {
          v.stockQuantity -= item.quantity;
          break;
        }
      }
    }
    this.save();
    return { success: true };
  }

  public rollbackStock(items: { variantId: string; quantity: number }[]) {
    for (const item of items) {
      for (const p of this.data.products) {
        const v = p.variants.find((v) => v.id === item.variantId);
        if (v) {
          v.stockQuantity += item.quantity;
          break;
        }
      }
    }
    this.save();
  }

  // --- Orders ---
  public getOrders(userId?: string): Order[] {
    if (userId) {
      return this.data.orders.filter((o) => o.userId === userId);
    }
    return [...this.data.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  public createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    const timestamp = Date.now();
    const orderNumber = `OG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord_${timestamp}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.orders.unshift(newOrder);
    this.logAudit('ORDER_PLACED', newOrder.customerEmail, `Order ${orderNumber} created for ₹${(newOrder.totalPaise / 100).toFixed(2)}`);
    this.save();
    return newOrder;
  }

  public updateOrderStatus(
    orderId: string,
    updates: {
      status?: Order['status'];
      paymentStatus?: Order['paymentStatus'];
      trackingNumber?: string;
      courierName?: string;
      notes?: string;
    }
  ): Order | undefined {
    const order = this.getOrderById(orderId);
    if (!order) return undefined;
    if (updates.status) order.status = updates.status;
    if (updates.paymentStatus) order.paymentStatus = updates.paymentStatus;
    if (updates.trackingNumber !== undefined) order.trackingNumber = updates.trackingNumber;
    if (updates.courierName !== undefined) order.courierName = updates.courierName;
    if (updates.notes !== undefined) order.notes = updates.notes;
    order.updatedAt = new Date().toISOString();
    this.logAudit('ORDER_UPDATED', 'Admin', `Order ${order.orderNumber} status changed to ${order.status}/${order.paymentStatus}`);
    this.save();
    return order;
  }

  // --- Discounts ---
  public validateDiscountCode(code: string, subtotalPaise: number): {
    valid: boolean;
    discount?: DiscountCode;
    discountAmountPaise: number;
    error?: string;
  } {
    const disc = this.data.discountCodes.find(
      (d) => d.code.toUpperCase() === code.toUpperCase() && d.isActive
    );
    if (!disc) {
      return { valid: false, discountAmountPaise: 0, error: 'Invalid or expired promotional code' };
    }
    if (subtotalPaise < disc.minOrderPaise) {
      const minINR = Math.round(disc.minOrderPaise / 100);
      return {
        valid: false,
        discountAmountPaise: 0,
        error: `Code requires a minimum subtotal of ₹${minINR.toLocaleString('en-IN')}`,
      };
    }
    let discountAmountPaise = 0;
    if (disc.type === 'percent') {
      discountAmountPaise = Math.round((subtotalPaise * disc.value) / 100);
    } else {
      discountAmountPaise = Math.min(disc.value, subtotalPaise);
    }
    return { valid: true, discount: disc, discountAmountPaise };
  }

  public incrementDiscountUsage(code: string) {
    const disc = this.data.discountCodes.find((d) => d.code.toUpperCase() === code.toUpperCase());
    if (disc) {
      disc.timesUsed += 1;
      this.save();
    }
  }

  // --- Newsletter ---
  public addNewsletterSubscriber(email: string): { success: boolean; message: string } {
    const normalized = email.toLowerCase().trim();
    const existing = this.data.newsletterSubscriptions.find((s) => s.email === normalized);
    if (existing) {
      return { success: true, message: 'You are already subscribed to OffGrid OG drops.' };
    }
    this.data.newsletterSubscriptions.push({
      id: `sub_${Date.now()}`,
      email: normalized,
      subscribedAt: new Date().toISOString(),
      isActive: true,
    });
    this.save();
    return { success: true, message: 'Welcome to OffGrid OG. You are now on the private drop list.' };
  }

  // --- Settings ---
  public getSettings(): StoreSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    Object.assign(this.data.settings, updates);
    this.logAudit('SETTINGS_UPDATED', 'Admin', 'Store settings and announcements updated');
    this.save();
    return this.data.settings;
  }

  // --- Media & Image Management ---
  public getMediaImages(filter?: {
    department?: string;
    imageType?: string;
    needsReview?: boolean;
    search?: string;
  }): ImageRecord[] {
    let list = [...(this.data.mediaImages || [])];

    if (filter?.department && filter.department !== 'ALL') {
      const deptUpper = filter.department.toUpperCase();
      list = list.filter((img) => img.department.toUpperCase() === deptUpper);
    }

    if (filter?.imageType && filter.imageType !== 'ALL') {
      const typeUpper = filter.imageType.toUpperCase();
      list = list.filter((img) => img.imageType.toUpperCase() === typeUpper);
    }

    if (filter?.needsReview !== undefined) {
      list = list.filter((img) => !!img.needsReview === filter.needsReview);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(
        (img) =>
          img.title.toLowerCase().includes(q) ||
          img.altText.toLowerCase().includes(q) ||
          img.category.toLowerCase().includes(q) ||
          (img.productId && img.productId.toLowerCase().includes(q))
      );
    }

    return list;
  }

  public getMediaImageById(id: string): ImageRecord | undefined {
    return (this.data.mediaImages || []).find((img) => img.id === id);
  }

  public createMediaImage(imageData: Omit<ImageRecord, 'id' | 'createdAt'>): ImageRecord {
    if (!this.data.mediaImages) this.data.mediaImages = [];
    const newImage: ImageRecord = {
      ...imageData,
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
    };

    if (newImage.isPrimary && newImage.productId) {
      for (const img of this.data.mediaImages) {
        if (img.productId === newImage.productId) {
          img.isPrimary = false;
        }
      }
      const product = this.getProductById(newImage.productId);
      if (product) {
        product.images = [newImage.url, ...product.images.filter((u) => u !== newImage.url)];
      }
    }

    this.data.mediaImages.unshift(newImage);
    this.logAudit('IMAGE_ADDED', 'Admin', `Added image "${newImage.title}" (${newImage.department} / ${newImage.imageType})`);
    this.save();
    return newImage;
  }

  public updateMediaImage(id: string, updates: Partial<ImageRecord>): ImageRecord | undefined {
    if (!this.data.mediaImages) this.data.mediaImages = [];
    const image = this.data.mediaImages.find((img) => img.id === id);
    if (!image) return undefined;

    Object.assign(image, updates);

    if (image.isPrimary && image.productId) {
      for (const img of this.data.mediaImages) {
        if (img.id !== image.id && img.productId === image.productId) {
          img.isPrimary = false;
        }
      }
      const product = this.getProductById(image.productId);
      if (product) {
        product.images = [image.url, ...product.images.filter((u) => u !== image.url)];
      }
    }

    this.logAudit('IMAGE_UPDATED', 'Admin', `Updated image "${image.title}" (${image.department} / ${image.imageType})`);
    this.save();
    return image;
  }

  public deleteMediaImage(id: string): boolean {
    if (!this.data.mediaImages) return false;
    const idx = this.data.mediaImages.findIndex((img) => img.id === id);
    if (idx === -1) return false;
    const removed = this.data.mediaImages.splice(idx, 1)[0];
    this.logAudit('IMAGE_DELETED', 'Admin', `Deleted image "${removed.title}" (${removed.id})`);
    this.save();
    return true;
  }

  public setPrimaryImage(id: string): ImageRecord | undefined {
    if (!this.data.mediaImages) return undefined;
    const target = this.data.mediaImages.find((img) => img.id === id);
    if (!target) return undefined;

    target.isPrimary = true;
    if (target.productId) {
      for (const img of this.data.mediaImages) {
        if (img.id !== target.id && img.productId === target.productId) {
          img.isPrimary = false;
        }
      }
      const product = this.getProductById(target.productId);
      if (product) {
        product.images = [target.url, ...product.images.filter((u) => u !== target.url)];
      }
    }
    this.logAudit('PRIMARY_IMAGE_SET', 'Admin', `Set primary image "${target.title}" for product ${target.productId || 'unassigned'}`);
    this.save();
    return target;
  }

  // --- Audit Logs ---
  public logAudit(action: string, performedBy: string, details: string) {
    const log: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      action,
      performedBy,
      details,
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs.pop();
    }
  }

  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }
}

export const db = new Database();
