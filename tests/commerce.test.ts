import { db } from '../src/server/db.ts';

async function runTests() {
  console.log('--- Starting OffGrid OG Commerce Engine Unit & Logic Tests ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // Test 1: Product catalog seed integrity
  const products = db.getProducts({ onlyPublished: false });
  assert(products.length >= 8, 'Initial catalog contains all 8 seed garments');

  // Test 2: Category and search filtering
  const polos = db.getProducts({ category: 'Polos' });
  assert(polos.length > 0 && polos.every((p) => p.category === 'Polos'), 'Category filtering returns only Polos');

  const searchResults = db.getProducts({ search: 'heavyweight' });
  assert(searchResults.length > 0, 'Search query correctly indexes garment descriptions and tags');

  // Test 3: Discount code calculation
  const discPercent = db.validateDiscountCode('OFFGRID10', 250000); // 10% on ₹2,500
  assert(discPercent.valid && discPercent.discountAmountPaise === 25000, '10% discount calculates exactly ₹250 (25000 paise)');

  const discMinOrderFail = db.validateDiscountCode('OGFIRST', 100000); // min is 199900
  assert(!discMinOrderFail.valid, 'Discount code enforces minimum order subtotal requirement');

  // Test 4: Inventory validation and atomic reservation
  const testVariantId = 'var_polo_ol_s';
  const initialStock = products.find((p) => p.id === 'prod_polo_olive')?.variants.find((v) => v.id === testVariantId)?.stockQuantity || 0;

  const reserveSuccess = db.validateAndReserveStock([{ variantId: testVariantId, quantity: 2 }]);
  assert(reserveSuccess.success, 'Stock reservation succeeds for in-stock quantity');

  const postStock = db.getProductById('prod_polo_olive')?.variants.find((v) => v.id === testVariantId)?.stockQuantity || 0;
  assert(postStock === initialStock - 2, 'Stock quantity decrements atomically by exact quantity');

  // Rollback test
  db.rollbackStock([{ variantId: testVariantId, quantity: 2 }]);
  const restoredStock = db.getProductById('prod_polo_olive')?.variants.find((v) => v.id === testVariantId)?.stockQuantity || 0;
  assert(restoredStock === initialStock, 'Stock rollback accurately restores reserved inventory');

  // Test 5: Overselling prevention
  const overReserve = db.validateAndReserveStock([{ variantId: testVariantId, quantity: 99999 }]);
  assert(!overReserve.success, 'Overselling is strictly prevented when requested quantity exceeds stock');

  // Test 6: Order creation & audit logging
  const initialLogs = db.getAuditLogs().length;
  const newOrder = db.createOrder({
    customerName: 'Test Customer',
    customerEmail: 'test@example.com',
    customerPhone: '+91 99999 88888',
    items: [],
    shippingAddress: {
      id: 'addr_test',
      fullName: 'Test Customer',
      phone: '+91 99999 88888',
      line1: '123 MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560001',
      country: 'India',
    },
    subtotalPaise: 299900,
    discountPaise: 0,
    shippingChargesPaise: 0,
    taxPaise: 0,
    totalPaise: 299900,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'razorpay',
  });
  assert(Boolean(newOrder.orderNumber && newOrder.id), 'Order created with formatted orderNumber (e.g. OG-2026-XXXX)');
  assert(db.getAuditLogs().length === initialLogs + 1, 'Audit log created automatically upon order creation');

  console.log(`\n--- Test Summary: ${passed} passed, ${failed} failed ---`);
  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
