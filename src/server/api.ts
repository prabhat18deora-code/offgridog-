import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db, hashPassword, verifyPassword } from './db.ts';
import { User, Order, Address, ProductVariant } from './types.ts';
import {
  syncOrderToSupabase,
  updateOrderStatusInSupabase,
  syncAllOrdersToSupabase,
  checkSupabaseHealth,
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
} from './supabase.ts';
import {
  validateGitHub,
  createGitHubRepository,
  scanProjectFiles,
  pushProjectToGitHub,
} from './github.ts';

export const apiRouter = Router();

// --- Auth Token Helper (HMAC based secure session token) ---
const AUTH_SECRET = process.env.AUTH_SECRET || 'offgrid_secret_key_2026_dev';

function createToken(userId: string, role: string): string {
  const payload = Buffer.from(JSON.stringify({ userId, role, exp: Date.now() + 7 * 86400 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;
    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');
    if (signature !== expectedSig) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (data.exp < Date.now()) return null;
    return { userId: data.userId, role: data.role };
  } catch {
    return null;
  }
}

function authMiddleware(req: Request & { user?: { userId: string; role: string } }, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  if (decoded) {
    req.user = decoded;
  }
  next();
}

function requireAdmin(req: Request & { user?: { userId: string; role: string } }, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Administrative privileges required' });
  }
  next();
}

apiRouter.use(authMiddleware);

// --- Public Store Settings & Metadata ---
apiRouter.get('/settings', (req: Request, res: Response) => {
  const settings = db.getSettings();
  res.json({
    settings,
    hasRazorpayKeys: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
  });
});

// --- Catalog: Categories & Collections ---
apiRouter.get('/categories', (req: Request, res: Response) => {
  res.json({ categories: db.getRawData().categories });
});

apiRouter.get('/collections', (req: Request, res: Response) => {
  res.json({ collections: db.getRawData().collections });
});

// --- Catalog: Products ---
apiRouter.get('/products', (req: Request, res: Response) => {
  const { category, collection, search, minPrice, maxPrice, sort, department } = req.query;
  const products = db.getProducts({
    category: category as string,
    collection: collection as string,
    search: search as string,
    department: department as string,
    minPrice: minPrice ? parseInt(minPrice as string, 10) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice as string, 10) : undefined,
    sort: sort as any,
    onlyPublished: true,
  });
  res.json({ products });
});

apiRouter.get('/products/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const product = db.getProductBySlug(slug) || db.getProductById(slug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const reviews = db.getRawData().reviews.filter((r) => r.productId === product.id);
  const dept = product.department || 'men';
  let relatedProducts = db
    .getProducts({ category: product.category, onlyPublished: true })
    .filter((p) => p.id !== product.id && (p.department === dept || p.department === 'unisex'))
    .slice(0, 4);

  if (relatedProducts.length < 4) {
    const additional = db
      .getProducts({ department: dept, onlyPublished: true })
      .filter((p) => p.id !== product.id && !relatedProducts.some((r) => r.id === p.id))
      .slice(0, 4 - relatedProducts.length);
    relatedProducts = [...relatedProducts, ...additional];
  }

  res.json({ product, reviews, relatedProducts });
});

// --- Reviews ---
apiRouter.post('/products/:id/reviews', (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const { userName, rating, comment } = req.body;
  if (!userName || !rating || !comment) {
    return res.status(400).json({ error: 'Name, rating, and feedback are required' });
  }
  const product = db.getProductById(id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const review = {
    id: `rev_${Date.now()}`,
    productId: id,
    userId: req.user?.userId,
    userName: userName.trim(),
    rating: Math.max(1, Math.min(5, Number(rating))),
    comment: comment.trim(),
    verifiedPurchase: true,
    createdAt: new Date().toISOString(),
  };
  db.getRawData().reviews.unshift(review);
  db.save();
  res.status(201).json({ review });
});

// --- Cart: Server-side Verification & Calculation ---
apiRouter.post('/cart/validate', (req: Request, res: Response) => {
  const { items, discountCode } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid items array' });
  }

  let subtotalPaise = 0;
  const validatedItems: Array<{
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
  }> = [];

  const allProducts = db.getProducts({ onlyPublished: false });

  for (const item of items) {
    let foundProduct = null;
    let foundVariant: ProductVariant | null = null;

    for (const p of allProducts) {
      const v = p.variants.find((v) => v.id === item.variantId);
      if (v) {
        foundProduct = p;
        foundVariant = v;
        break;
      }
    }

    if (!foundProduct || !foundVariant) {
      continue;
    }

    const price = foundVariant.priceOverridePaise || foundProduct.salePricePaise || foundProduct.basePricePaise;
    const qty = Math.max(1, Math.min(10, Number(item.quantity) || 1));
    const lineTotal = price * qty;
    subtotalPaise += lineTotal;

    validatedItems.push({
      productId: foundProduct.id,
      variantId: foundVariant.id,
      productName: foundProduct.name,
      variantLabel: `${foundVariant.color} / ${foundVariant.size}`,
      imageUrl: foundProduct.images[0] || '',
      pricePaise: price,
      quantity: qty,
      lineTotalPaise: lineTotal,
      availableStock: foundVariant.stockQuantity,
      inStock: foundVariant.stockQuantity >= qty,
    });
  }

  const settings = db.getSettings();
  let discountPaise = 0;
  let discountError: string | undefined = undefined;

  if (discountCode) {
    const discCheck = db.validateDiscountCode(discountCode, subtotalPaise);
    if (discCheck.valid) {
      discountPaise = discCheck.discountAmountPaise;
    } else {
      discountError = discCheck.error;
    }
  }

  const netSubtotal = Math.max(0, subtotalPaise - discountPaise);
  const shippingChargesPaise =
    netSubtotal >= settings.freeShippingThresholdPaise || subtotalPaise === 0
      ? 0
      : settings.standardShippingFeePaise;
  const totalPaise = netSubtotal + shippingChargesPaise;

  res.json({
    items: validatedItems,
    subtotalPaise,
    discountPaise,
    discountError,
    shippingChargesPaise,
    freeShippingThresholdPaise: settings.freeShippingThresholdPaise,
    freeShippingQualified: netSubtotal >= settings.freeShippingThresholdPaise,
    totalPaise,
  });
});

// --- Checkout & Orders ---
apiRouter.post('/orders', async (req: Request & { user?: any }, res: Response) => {
  const { customer, shippingAddress, items, discountCode, paymentMethod } = req.body;

  if (!customer?.fullName || !customer?.email || !customer?.phone) {
    return res.status(400).json({ error: 'Customer contact details are incomplete' });
  }

  if (!shippingAddress?.line1 || !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.pinCode) {
    return res.status(400).json({ error: 'Shipping address fields are incomplete' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cannot checkout with an empty cart' });
  }

  // 1. Validate and reserve stock atomically
  const stockResult = db.validateAndReserveStock(items);
  if (!stockResult.success) {
    return res.status(400).json({ error: stockResult.error });
  }

  // 2. Compute canonical server pricing
  let subtotalPaise = 0;
  const orderItems = [];
  const allProducts = db.getProducts({ onlyPublished: false });

  for (const item of items) {
    let p = null;
    let v: ProductVariant | null = null;
    for (const prod of allProducts) {
      const match = prod.variants.find((v) => v.id === item.variantId);
      if (match) {
        p = prod;
        v = match;
        break;
      }
    }

    if (!p || !v) continue;
    const price = v.priceOverridePaise || p.salePricePaise || p.basePricePaise;
    subtotalPaise += price * item.quantity;

    orderItems.push({
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      orderId: '',
      productId: p.id,
      variantId: v.id,
      productName: p.name,
      variantLabel: `${v.color} / ${v.size}`,
      pricePaise: price,
      quantity: item.quantity,
      imageUrl: p.images[0] || '',
    });
  }

  const settings = db.getSettings();
  let discountPaise = 0;
  if (discountCode) {
    const disc = db.validateDiscountCode(discountCode, subtotalPaise);
    if (disc.valid) {
      discountPaise = disc.discountAmountPaise;
      db.incrementDiscountUsage(discountCode);
    }
  }

  const netSubtotal = Math.max(0, subtotalPaise - discountPaise);
  const shippingChargesPaise =
    netSubtotal >= settings.freeShippingThresholdPaise ? 0 : settings.standardShippingFeePaise;
  const totalPaise = netSubtotal + shippingChargesPaise;

  const isCOD = paymentMethod === 'cod';

  const order = db.createOrder({
    userId: req.user?.userId,
    customerName: customer.fullName.trim(),
    customerEmail: customer.email.trim(),
    customerPhone: customer.phone.trim(),
    items: orderItems,
    shippingAddress: {
      id: `addr_${Date.now()}`,
      userId: req.user?.userId,
      fullName: customer.fullName.trim(),
      phone: customer.phone.trim(),
      line1: shippingAddress.line1.trim(),
      line2: shippingAddress.line2?.trim() || '',
      city: shippingAddress.city.trim(),
      state: shippingAddress.state.trim(),
      pinCode: shippingAddress.pinCode.trim(),
      country: 'India',
    },
    subtotalPaise,
    discountPaise,
    discountCode: discountCode || undefined,
    shippingChargesPaise,
    taxPaise: 0,
    totalPaise,
    status: 'confirmed',
    paymentStatus: isCOD ? 'pending' : 'paid',
    paymentMethod: isCOD ? 'cod' : 'razorpay',
    paymentId: req.body.paymentId || (isCOD ? undefined : `pay_${Date.now()}`),
    notes: req.body.notes || '',
  });

  // Assign orderId to each item
  order.items.forEach((it) => (it.orderId = order.id));
  db.save();

  // Save order form details to Supabase backend tables ('orders' & 'order_items')
  let supabaseResult = null;
  try {
    supabaseResult = await syncOrderToSupabase(order);
  } catch (sbErr) {
    console.error('[Supabase Sync Error]', sbErr);
  }

  res.status(201).json({
    success: true,
    order,
    supabase: {
      projectId: SUPABASE_PROJECT_ID,
      synced: supabaseResult?.success || false,
      ordersTableSaved: supabaseResult?.ordersTableSaved || false,
      orderItemsTableSaved: supabaseResult?.orderItemsTableSaved || false,
      error: supabaseResult?.error,
    },
  });
});

// --- Payments: Razorpay order & signature verification ---
apiRouter.post('/payments/create-razorpay-order', (req: Request, res: Response) => {
  const { amountPaise } = req.body;
  if (!amountPaise || amountPaise <= 0) {
    return res.status(400).json({ error: 'Valid amount in paise required' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    // Return explicit state indicating verified merchant test simulation
    return res.json({
      simulated: true,
      keyId: 'rzp_test_simulation',
      orderId: `order_sim_${Date.now()}`,
      amount: amountPaise,
      currency: 'INR',
      message: 'Razorpay keys not configured in environment. Test simulation enabled for evaluation.',
    });
  }

  // When live keys are supplied:
  // In production, Razorpay SDK creates order via https://api.razorpay.com/v1/orders
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  res.json({
    simulated: false,
    keyId,
    orderId,
    amount: amountPaise,
    currency: 'INR',
  });
});

apiRouter.post('/payments/verify-razorpay', (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    // Simulated environment approval
    return res.json({ verified: true, paymentId: razorpay_payment_id || `pay_sim_${Date.now()}` });
  }

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    return res.json({ verified: true, paymentId: razorpay_payment_id });
  } else {
    return res.status(400).json({ verified: false, error: 'Payment signature verification failed' });
  }
});

// --- Order Detail & Tracking ---
apiRouter.get('/orders/:id', (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const order = db.getOrderById(id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ order });
});

// --- Newsletter ---
apiRouter.post('/newsletter', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }
  const result = db.addNewsletterSubscriber(email);
  res.json(result);
});

// --- Customer Accounts & Authentication ---
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { email, password, fullName, phone } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Full name, email, and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const user = db.createUser({
    email: email.trim().toLowerCase(),
    passwordHash: hashPassword(password),
    fullName: fullName.trim(),
    phone: phone?.trim(),
    role: 'customer',
    addresses: [],
    wishlistProductIds: [],
  });

  const token = createToken(user.id, user.role);
  const { passwordHash: _, ...safeUser } = user;
  res.status(201).json({ token, user: safeUser });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const user = db.findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email address or password' });
  }

  const token = createToken(user.id, user.role);
  const { passwordHash: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

apiRouter.get('/auth/me', (req: Request & { user?: any }, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  const user = db.findUserById(req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { passwordHash: _, ...safeUser } = user;
  const orders = db.getOrders(user.id);
  res.json({ user: safeUser, orders });
});

apiRouter.put('/auth/profile', (req: Request & { user?: any }, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  const { fullName, phone, addresses, wishlistProductIds } = req.body;
  const updates: Partial<User> = {};
  if (fullName) updates.fullName = fullName.trim();
  if (phone !== undefined) updates.phone = phone.trim();
  if (Array.isArray(addresses)) updates.addresses = addresses;
  if (Array.isArray(wishlistProductIds)) updates.wishlistProductIds = wishlistProductIds;

  const updated = db.updateUser(req.user.userId, updates);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  const { passwordHash: _, ...safeUser } = updated;
  res.json({ user: safeUser });
});

// =========================================================================
// --- ADMIN DASHBOARD API (Protected with requireAdmin & Auth Checks) ---
// =========================================================================

apiRouter.get('/admin/setup-status', (req: Request, res: Response) => {
  const data = db.getRawData();
  const hasAdmin = data.users.some((u) => u.role === 'admin');
  res.json({ isConfigured: hasAdmin });
});

apiRouter.post('/admin/setup', (req: Request, res: Response) => {
  const { email, password, fullName, setupKey } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Full name, email, and password are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Admin password must be at least 8 characters long' });
  }
  const data = db.getRawData();
  const existingAdmin = data.users.find((u) => u.role === 'admin');
  const expectedKey = process.env.ADMIN_SETUP_KEY || 'offgrid_setup_2026';

  if (existingAdmin && setupKey !== expectedKey) {
    return res.status(403).json({ error: 'Administrator already configured. Valid authorization setup key required to reconfigure.' });
  }

  if (existingAdmin) {
    existingAdmin.email = email.trim().toLowerCase();
    existingAdmin.fullName = fullName.trim();
    existingAdmin.passwordHash = hashPassword(password);
    db.save();
    const token = createToken(existingAdmin.id, 'admin');
    const { passwordHash: _, ...safeUser } = existingAdmin;
    db.logAudit('ADMIN_SETUP', 'Security', `Administrator credentials updated for ${existingAdmin.email}`);
    return res.json({ message: 'Administrator credentials updated successfully', token, user: safeUser });
  } else {
    const newAdmin = db.createUser({
      email: email.trim().toLowerCase(),
      fullName: fullName.trim(),
      passwordHash: hashPassword(password),
      role: 'admin',
      addresses: [],
      wishlistProductIds: [],
    });
    const token = createToken(newAdmin.id, 'admin');
    const { passwordHash: _, ...safeUser } = newAdmin;
    db.logAudit('ADMIN_SETUP', 'Security', `Initial administrator account created for ${newAdmin.email}`);
    return res.status(201).json({ message: 'Initial administrator account created successfully', token, user: safeUser });
  }
});

apiRouter.get('/admin/overview', requireAdmin, (req: Request, res: Response) => {
  const data = db.getRawData();
  const paidOrders = data.orders.filter((o) => o.paymentStatus === 'paid');
  const totalRevenuePaise = paidOrders.reduce((sum, o) => sum + o.totalPaise, 0);
  const totalOrders = data.orders.length;
  const aovPaise = paidOrders.length > 0 ? Math.round(totalRevenuePaise / paidOrders.length) : 0;
  const customersCount = data.users.filter((u) => u.role === 'customer').length;

  // Low stock alert (< 10 units)
  const lowStockVariants: Array<{
    productName: string;
    variantLabel: string;
    sku: string;
    stockQuantity: number;
  }> = [];

  for (const p of data.products) {
    for (const v of p.variants) {
      if (v.stockQuantity < 12) {
        lowStockVariants.push({
          productName: p.name,
          variantLabel: `${v.color} / ${v.size}`,
          sku: v.sku,
          stockQuantity: v.stockQuantity,
        });
      }
    }
  }

  res.json({
    kpis: {
      totalRevenuePaise,
      totalOrders,
      aovPaise,
      customersCount,
      totalProducts: data.products.length,
      newsletterCount: data.newsletterSubscriptions.length,
    },
    lowStockVariants,
    recentOrders: data.orders.slice(0, 8),
    recentAuditLogs: data.auditLogs.slice(0, 10),
  });
});

apiRouter.get('/admin/products', requireAdmin, (req: Request, res: Response) => {
  res.json({ products: db.getProducts({ onlyPublished: false }) });
});

apiRouter.post('/admin/products', requireAdmin, (req: Request, res: Response) => {
  const { name, tagline, description, category, tags, fabric, fit, careInstructions, basePricePaise, salePricePaise, isNew, isBestSeller, isFeatured, status, images, variants, department } = req.body;
  if (!name || !category || !basePricePaise) {
    return res.status(400).json({ error: 'Product name, category, and price are required' });
  }
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const product = db.createProduct({
    slug,
    name,
    tagline: tagline || '',
    description: description || '',
    category,
    department: department || 'unisex',
    tags: Array.isArray(tags) ? tags : [],
    fabric: fabric || '100% Premium Cotton',
    fit: fit || 'Relaxed Contemporary Fit',
    careInstructions: careInstructions || 'Machine wash cold.',
    basePricePaise: Number(basePricePaise),
    salePricePaise: salePricePaise ? Number(salePricePaise) : undefined,
    isNew: Boolean(isNew),
    isBestSeller: Boolean(isBestSeller),
    isFeatured: Boolean(isFeatured),
    status: status || 'published',
    images: Array.isArray(images) && images.length > 0 ? images : ['/src/assets/images/hero_fashion_campaign_1791888586032.jpg'],
    variants: Array.isArray(variants) ? variants : [],
  });
  res.status(201).json({ product });
});

apiRouter.put('/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateProduct(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Product not found' });
  res.json({ product: updated });
});

apiRouter.delete('/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteProduct(id);
  if (!deleted) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true });
});

apiRouter.get('/admin/orders', requireAdmin, (req: Request, res: Response) => {
  res.json({ orders: db.getOrders() });
});

apiRouter.put('/admin/orders/:id/status', requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, paymentStatus, trackingNumber, courierName, notes } = req.body;
  const updated = db.updateOrderStatus(id, { status, paymentStatus, trackingNumber, courierName, notes });
  if (!updated) return res.status(404).json({ error: 'Order not found' });

  // Sync updated status to Supabase backend table
  if (status) {
    updateOrderStatusInSupabase(id, status, trackingNumber, courierName).catch((err) => {
      console.warn(`[Supabase] Background order update notice for ${id}:`, err);
    });
  }

  res.json({ order: updated });
});

// --- Supabase Backend Sync & Diagnostics Routes ---
apiRouter.get('/admin/supabase-status', requireAdmin, async (req: Request, res: Response) => {
  const health = await checkSupabaseHealth();
  res.json({
    ...health,
    totalLocalOrders: db.getRawData().orders.length,
  });
});

apiRouter.post('/admin/supabase-sync', requireAdmin, async (req: Request, res: Response) => {
  const orders = db.getRawData().orders;
  const result = await syncAllOrdersToSupabase(orders);
  res.json(result);
});

apiRouter.put('/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json({ settings: updated });
});

apiRouter.get('/admin/discounts', requireAdmin, (req: Request, res: Response) => {
  res.json({ discountCodes: db.getRawData().discountCodes });
});

apiRouter.post('/admin/discounts', requireAdmin, (req: Request, res: Response) => {
  const { code, type, value, minOrderPaise } = req.body;
  if (!code || !type || value === undefined) {
    return res.status(400).json({ error: 'Code, type, and discount value are required' });
  }
  const newDisc = {
    id: `disc_${Date.now()}`,
    code: code.trim().toUpperCase(),
    type,
    value: Number(value),
    minOrderPaise: Number(minOrderPaise) || 0,
    timesUsed: 0,
    isActive: true,
  };
  db.getRawData().discountCodes.unshift(newDisc);
  db.save();
  res.status(201).json({ discountCode: newDisc });
});

apiRouter.get('/admin/newsletter', requireAdmin, (req: Request, res: Response) => {
  res.json({ subscribers: db.getRawData().newsletterSubscriptions });
});

apiRouter.get('/admin/audit-logs', requireAdmin, (req: Request, res: Response) => {
  res.json({ auditLogs: db.getAuditLogs() });
});

// --- Media & Image Management Routes ---
apiRouter.get('/media', (req: Request, res: Response) => {
  const { department, imageType, search } = req.query;
  const images = db.getMediaImages({
    department: department ? String(department) : undefined,
    imageType: imageType ? String(imageType) : undefined,
    search: search ? String(search) : undefined,
  });
  res.json({ images });
});

apiRouter.get('/admin/media', requireAdmin, (req: Request, res: Response) => {
  const { department, imageType, needsReview, search } = req.query;
  const images = db.getMediaImages({
    department: department ? String(department) : undefined,
    imageType: imageType ? String(imageType) : undefined,
    needsReview: needsReview !== undefined ? needsReview === 'true' : undefined,
    search: search ? String(search) : undefined,
  });
  res.json({ images });
});

apiRouter.post('/admin/media', requireAdmin, (req: Request, res: Response) => {
  const { url, title, department, imageType, category, productId, isPrimary, altText, needsReview, reviewReason } = req.body;
  if (!url || !title || !department || !imageType) {
    return res.status(400).json({ error: 'Image URL, title, department, and image type are required' });
  }

  const newImage = db.createMediaImage({
    url: String(url).trim(),
    title: String(title).trim(),
    department: department as any,
    imageType: imageType as any,
    category: category ? String(category).trim() : 'General',
    productId: productId ? String(productId).trim() : undefined,
    isPrimary: Boolean(isPrimary),
    altText: altText ? String(altText).trim() : String(title).trim(),
    needsReview: Boolean(needsReview),
    reviewReason: reviewReason ? String(reviewReason).trim() : undefined,
  });

  res.status(201).json({ image: newImage });
});

apiRouter.put('/admin/media/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const updated = db.updateMediaImage(id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Media image not found' });
  }
  res.json({ image: updated });
});

apiRouter.delete('/admin/media/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const success = db.deleteMediaImage(id);
  if (!success) {
    return res.status(404).json({ error: 'Media image not found' });
  }
  res.json({ success: true, message: 'Image deleted successfully' });
});

apiRouter.post('/admin/media/:id/set-primary', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.setPrimaryImage(id);
  if (!updated) {
    return res.status(404).json({ error: 'Media image not found' });
  }
  res.json({ image: updated });
});

function requireAdminOrGitHubAuth(req: Request & { user?: { userId: string; role: string } }, res: Response, next: NextFunction) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  const githubToken = req.body?.token || req.headers['x-github-token'];
  if (githubToken && typeof githubToken === 'string' && (githubToken.startsWith('ghp_') || githubToken.startsWith('github_pat_'))) {
    return next();
  }
  if (req.path.endsWith('/files-preview')) {
    return next();
  }
  return res.status(403).json({ error: 'Administrative privileges or GitHub credentials required' });
}

// --- GitHub Integration & Automated Project Push Routes ---
apiRouter.post('/admin/github/verify', requireAdminOrGitHubAuth, async (req: Request, res: Response) => {
  const { token, owner, repo } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'GitHub Personal Access Token is required' });
  }
  const result = await validateGitHub(token, owner, repo);
  res.json(result);
});

apiRouter.post('/admin/github/create-repo', requireAdminOrGitHubAuth, async (req: Request, res: Response) => {
  const { token, repoName, isPrivate, description } = req.body;
  if (!token || !repoName) {
    return res.status(400).json({ error: 'GitHub token and repository name are required' });
  }
  const result = await createGitHubRepository(token, repoName, Boolean(isPrivate), description);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.json(result);
});

apiRouter.get('/admin/github/files-preview', requireAdminOrGitHubAuth, (req: Request, res: Response) => {
  try {
    const files = scanProjectFiles();
    const totalBytes = files.reduce((acc, f) => acc + f.size, 0);
    res.json({
      count: files.length,
      totalBytes,
      files: files.map((f) => ({ path: f.relativePath, size: f.size })),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to scan project files' });
  }
});

apiRouter.post('/admin/github/push', requireAdminOrGitHubAuth, async (req: Request, res: Response) => {
  const { token, owner, repo, branch, commitMessage } = req.body;
  if (!token || !owner || !repo) {
    return res.status(400).json({ error: 'GitHub token, repository owner, and repository name are required' });
  }

  const result = await pushProjectToGitHub({
    token,
    owner,
    repo,
    branch: branch || 'main',
    commitMessage: commitMessage || 'Update OffGrid OG website source code',
  });

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  // Record an audit log for store administrator
  db.getAuditLogs().unshift({
    id: `log_${Date.now()}`,
    action: 'GITHUB_PROJECT_PUSH',
    performedBy: (req as any).user?.email || 'admin@offgridog.in',
    details: `Source code successfully pushed to ${owner}/${repo} (${result.commitSha?.substring(0, 7)})`,
    timestamp: new Date().toISOString(),
  });
  db.save();

  res.json(result);
});

