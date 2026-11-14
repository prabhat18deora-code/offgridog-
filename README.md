# OffGrid OG - Contemporary Fashion E-Commerce

> *"Outside the ordinary. Beyond the grid."*

Production-ready, full-stack fashion e-commerce web application for **OffGrid OG**, an independent contemporary menswear and minimalist streetwear label designed for India.

---

## 1. Brand Identity & Visual System

- **Primary Background**: Warm Ivory (`#F7F5F0`)
- **Secondary Background**: Sand Beige (`#E7DFD2`)
- **Primary Text**: Deep Charcoal (`#20211E`)
- **Secondary Text**: Muted Gray (`#77766F`)
- **Accent**: Olive Earth (`#62684A`)
- **Dark Sections**: (`#191A18`)
- **Typography**: Space Grotesk / Plus Jakarta Sans geometric sans paired with Syne editorial display headings.

---

## 2. Architecture & Tech Stack

- **Frontend**: React 19 SPA, Tailwind CSS v4, Lucide React icons, Motion animations
- **Backend**: Full-stack Express server (`server.ts`) mounting Vite dev middleware in development and serving optimized static assets in production
- **Database Engine**: Persistent, atomic ACID-safe JSON relational store (`data/offgrid_db.json`) modeling all 22 required entities (Users, Products, Variants, Orders, OrderItems, Payments, Addresses, Discounts, Reviews, Settings, AuditLogs)
- **Currency Calculation**: Integer Paise arithmetic (`100 paise = ₹1.00`) across all cart, discounts, taxes, and shipping operations to eliminate floating-point currency errors
- **Payments**: Razorpay integration with server-side HMAC-SHA256 signature verification + Cash on Delivery (COD)
- **Security**: PBKDF2 password hashing with salt, HMAC session authentication, role-based authorization for administrative routes

---

## 3. Core Store Features

1. **Homepage**:
   - Configurable announcement bar
   - Strict Top Bar Contract navigation with live cart counter and search trigger
   - Campaign Hero: Lifestyle photography featuring model in olive polo + sand trousers in architectural gallery
   - Shop by Category: T-Shirts, Polos, Shirts, Trousers, Overshirts, Jackets, Complete Outfits
   - New Arrivals grid with hover transitions and quick size selector
   - Featured Editorial Campaign: *"LESS NOISE. MORE YOU."*
   - Best Sellers grid
   - Lookbook Capsule: *"Shop the Look"* multi-item add to bag
   - Brand Story: *"NOT HERE TO FIT IN."*
   - Private Drops email subscription with database capture
   - Comprehensive footer with working policy modals (Shipping, 7-Day Returns, Size Guide, Privacy, Terms)

2. **Catalog & Shop**:
   - Real-time multi-attribute filtering (Category, Size XS–XXL, Color, Price Range Slider, In Stock Only)
   - Real-time search by keyword, fabric, tag, or SKU
   - Sorting by Newest, Popularity, Price Low→High, Price High→Low
   - Zero-pill clean metadata styling

3. **Product Detail Page (PDP)**:
   - High-resolution gallery with thumbnail switcher
   - Color swatch selector and interactive size selector
   - Real stock availability indicator with low-stock warnings
   - Interactive Size Guide modal (chest, waist, length in inches and cm)
   - Indian Delivery PIN code estimator (6-digit check)
   - Accordions for Fabric & Materials, Fit & Silhouette, Care Instructions, Shipping
   - Customer Reviews with verified purchase badges and star rating submissions
   - Related product recommendations

4. **Shopping Cart & Checkout**:
   - Slide-over Cart Drawer with free shipping progress bar (Free delivery over ₹1,999)
   - Promo code validation (`OFFGRID10`, `OGFIRST`, `OGVIP`)
   - Complete checkout with Indian address validation and state picker
   - Razorpay payment simulation & verification or Cash on Delivery (COD)
   - Atomic inventory deduction during checkout to prevent overselling
   - Printable order confirmation invoice receipt with delivery tracking timeline

5. **Customer Dashboard**:
   - Account login and registration
   - Saved shipping addresses manager
   - Order history with live courier tracking updates
   - Wishlist manager with one-click move to bag

6. **Admin Dashboard (`/admin`)**:
   - Protected route requiring admin role authorization
   - Default credentials: `admin@offgridog.in` / `admin_offgrid_2026`
   - Real-time KPI cards: Net sales in ₹, total orders, AOV, subscriber count
   - Low-stock inventory warnings (< 12 units)
   - Garment Catalog manager: create, edit prices/descriptions, delete garments
   - Order Fulfillment manager: update status, record courier name and tracking AWB #
   - Promo Code creator (Percentage or Flat discount with minimum spend thresholds)
   - Storefront content editor (announcement bar, hero headlines, story copy)
   - System Audit Log viewer

---

## 4. Default Seed Accounts

- **Admin Account**:
  - Email: `admin@offgridog.in`
  - Password: `admin_offgrid_2026`
- **Customer Account**:
  - Email: `prabhat18deora@gmail.com`
  - Password: `customer_2026`

---

## 5. Automated Tests

Run the test suite:
```bash
npx tsx tests/commerce.test.ts
```
Verifies catalog integrity, search indexing, discount calculations, atomic inventory reservations, overselling guards, and order creation.
