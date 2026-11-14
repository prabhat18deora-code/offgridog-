-- =========================================================================
-- OffGrid OG: Supabase PostgreSQL Schema for Orders & Checkout
-- Project ID: gacsjkbvtmlwwyiegfgw
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/gacsjkbvtmlwwyiegfgw/sql/new
-- =========================================================================

-- 1. Create 'orders' table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address_line1 TEXT NOT NULL,
    shipping_address_line2 TEXT,
    shipping_city TEXT NOT NULL,
    shipping_state TEXT NOT NULL,
    shipping_pincode TEXT NOT NULL,
    shipping_country TEXT DEFAULT 'India',
    subtotal_paise BIGINT NOT NULL,
    subtotal_inr NUMERIC(10, 2) NOT NULL,
    discount_paise BIGINT DEFAULT 0,
    discount_inr NUMERIC(10, 2) DEFAULT 0,
    discount_code TEXT,
    shipping_charges_paise BIGINT DEFAULT 0,
    shipping_charges_inr NUMERIC(10, 2) DEFAULT 0,
    total_paise BIGINT NOT NULL,
    total_inr NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'confirmed',
    payment_status TEXT DEFAULT 'pending',
    payment_method TEXT DEFAULT 'cod',
    payment_id TEXT,
    tracking_number TEXT,
    courier_name TEXT,
    notes TEXT,
    items JSONB DEFAULT '[]'::jsonb
);

-- 2. Create 'order_items' table for granular line-item analytics
CREATE TABLE IF NOT EXISTS public.order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    variant_id TEXT NOT NULL,
    variant_label TEXT NOT NULL,
    price_paise BIGINT NOT NULL,
    price_inr NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes for fast customer & order lookups
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 5. Policies:
-- Allow the backend service role or authenticated app to read & insert
DROP POLICY IF EXISTS "Allow service role and anon insert for orders" ON public.orders;
CREATE POLICY "Allow service role and anon insert for orders"
    ON public.orders
    FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role and anon insert for order items" ON public.order_items;
CREATE POLICY "Allow service role and anon insert for order items"
    ON public.order_items
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Done! Your Supabase database is now configured to store all order form submissions.
