import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Order } from './types.ts';

// Configured Supabase Project ID provided by the user
export const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID || 'gacsjkbvtmlwwyiegfgw';
export const SUPABASE_URL = process.env.SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_KEY ||
  '';

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!SUPABASE_KEY) {
    return null;
  }
  if (!clientInstance) {
    try {
      clientInstance = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      console.log(`[Supabase] Initialized client for Project ID: ${SUPABASE_PROJECT_ID} (${SUPABASE_URL})`);
    } catch (err) {
      console.error('[Supabase] Failed to initialize client:', err);
      return null;
    }
  }
  return clientInstance;
}

export interface SupabaseSyncResult {
  success: boolean;
  orderId: string;
  projectId: string;
  ordersTableSaved: boolean;
  orderItemsTableSaved: boolean;
  error?: string;
  details?: any;
}

/**
 * Transforms an application Order into the schema structure for Supabase 'orders' table
 */
export function formatSupabaseOrderPayload(order: Order) {
  return {
    id: order.id,
    user_id: order.userId || null,
    customer_name: order.customerName,
    customer_email: order.customerEmail,
    customer_phone: order.customerPhone,
    shipping_address_line1: order.shippingAddress.line1,
    shipping_address_line2: order.shippingAddress.line2 || null,
    shipping_city: order.shippingAddress.city,
    shipping_state: order.shippingAddress.state,
    shipping_pincode: order.shippingAddress.pinCode,
    shipping_country: order.shippingAddress.country || 'India',
    subtotal_paise: order.subtotalPaise,
    subtotal_inr: (order.subtotalPaise / 100).toFixed(2),
    discount_paise: order.discountPaise || 0,
    discount_inr: ((order.discountPaise || 0) / 100).toFixed(2),
    discount_code: order.discountCode || null,
    shipping_charges_paise: order.shippingChargesPaise || 0,
    shipping_charges_inr: ((order.shippingChargesPaise || 0) / 100).toFixed(2),
    total_paise: order.totalPaise,
    total_inr: (order.totalPaise / 100).toFixed(2),
    status: order.status,
    payment_status: order.paymentStatus,
    payment_method: order.paymentMethod,
    payment_id: order.paymentId || null,
    tracking_number: order.trackingNumber || null,
    courier_name: order.courierName || null,
    notes: order.notes || null,
    // JSON representation of all item rows ensures 100% item detail persistence in the orders table
    items: order.items,
    created_at: order.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Transforms order line items into rows for the Supabase 'order_items' table
 */
export function formatSupabaseOrderItems(order: Order) {
  return order.items.map((it) => ({
    id: it.id,
    order_id: order.id,
    product_id: it.productId,
    product_name: it.productName,
    variant_id: it.variantId,
    variant_label: it.variantLabel,
    price_paise: it.pricePaise,
    price_inr: (it.pricePaise / 100).toFixed(2),
    quantity: it.quantity,
    image_url: it.imageUrl || '',
    created_at: order.createdAt || new Date().toISOString(),
  }));
}

/**
 * Synchronizes an order to Supabase backend tables ('orders' and 'order_items')
 */
export async function syncOrderToSupabase(order: Order): Promise<SupabaseSyncResult> {
  const result: SupabaseSyncResult = {
    success: false,
    orderId: order.id,
    projectId: SUPABASE_PROJECT_ID,
    ordersTableSaved: false,
    orderItemsTableSaved: false,
  };

  const client = getSupabaseClient();
  if (!client) {
    const msg = `[Supabase] Note: SUPABASE_KEY / SUPABASE_ANON_KEY is not configured in the environment. ` +
      `Target Project: ${SUPABASE_PROJECT_ID} (${SUPABASE_URL}). ` +
      `Order ${order.id} was saved locally and will be ready to sync once credentials are set.`;
    console.warn(msg);
    result.error = 'SUPABASE_KEY not set in environment';
    return result;
  }

  try {
    // 1. Upsert into 'orders' table
    const orderPayload = formatSupabaseOrderPayload(order);
    const { error: orderError } = await client
      .from('orders')
      .upsert(orderPayload, { onConflict: 'id' });

    if (orderError) {
      console.error(`[Supabase] Error inserting order ${order.id} into 'orders' table:`, orderError.message);
      result.error = orderError.message;
      result.details = orderError;
    } else {
      result.ordersTableSaved = true;
      console.log(`[Supabase] Successfully saved order ${order.id} to Supabase 'orders' table.`);
    }

    // 2. Upsert into 'order_items' table (if lines exist)
    if (order.items && order.items.length > 0) {
      const itemsPayload = formatSupabaseOrderItems(order);
      const { error: itemsError } = await client
        .from('order_items')
        .upsert(itemsPayload, { onConflict: 'id' });

      if (itemsError) {
        console.warn(`[Supabase] Notice inserting items for order ${order.id} into 'order_items' table:`, itemsError.message);
      } else {
        result.orderItemsTableSaved = true;
        console.log(`[Supabase] Successfully saved ${itemsPayload.length} order items for ${order.id} to Supabase 'order_items' table.`);
      }
    }

    result.success = result.ordersTableSaved;
    return result;
  } catch (err: any) {
    console.error(`[Supabase] Unexpected exception while syncing order ${order.id}:`, err);
    result.error = err.message || 'Unknown network error';
    return result;
  }
}

/**
 * Updates order status and tracking in Supabase
 */
export async function updateOrderStatusInSupabase(
  orderId: string,
  status: string,
  trackingNumber?: string,
  courierName?: string
) {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const updatePayload: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (trackingNumber !== undefined) updatePayload.tracking_number = trackingNumber;
    if (courierName !== undefined) updatePayload.courier_name = courierName;

    const { error } = await client
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId);

    if (error) {
      console.error(`[Supabase] Failed to update order ${orderId} status:`, error.message);
      return false;
    }
    console.log(`[Supabase] Updated status of order ${orderId} to '${status}' in Supabase.`);
    return true;
  } catch (err) {
    console.error(`[Supabase] Error updating order status for ${orderId}:`, err);
    return false;
  }
}

/**
 * Batch syncs multiple orders to Supabase
 */
export async function syncAllOrdersToSupabase(orders: Order[]): Promise<{
  total: number;
  synced: number;
  failed: number;
  results: SupabaseSyncResult[];
}> {
  const results: SupabaseSyncResult[] = [];
  let synced = 0;
  let failed = 0;

  for (const ord of orders) {
    const res = await syncOrderToSupabase(ord);
    results.push(res);
    if (res.success) {
      synced++;
    } else {
      failed++;
    }
  }

  return {
    total: orders.length,
    synced,
    failed,
    results,
  };
}

/**
 * Checks connection and table presence in Supabase
 */
export async function checkSupabaseHealth() {
  const client = getSupabaseClient();
  const info = {
    projectId: SUPABASE_PROJECT_ID,
    supabaseUrl: SUPABASE_URL,
    hasApiKey: Boolean(SUPABASE_KEY),
    connected: false,
    ordersTableExists: false,
    message: '',
  };

  if (!client) {
    info.message = `Supabase Project ID configured as '${SUPABASE_PROJECT_ID}' (${SUPABASE_URL}). SUPABASE_KEY / SUPABASE_ANON_KEY is not yet set in environment.`;
    return info;
  }

  try {
    const { count, error } = await client
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (error) {
      info.message = `Connected to ${SUPABASE_URL}, but query to 'orders' table returned: ${error.message}. (Ensure the 'orders' table is created in Supabase SQL editor)`;
      info.connected = true;
      info.ordersTableExists = false;
    } else {
      info.connected = true;
      info.ordersTableExists = true;
      info.message = `Connected successfully! Table 'orders' found (${count ?? 0} existing records).`;
    }
  } catch (err: any) {
    info.connected = false;
    info.message = `Network error connecting to ${SUPABASE_URL}: ${err.message}`;
  }

  return info;
}
