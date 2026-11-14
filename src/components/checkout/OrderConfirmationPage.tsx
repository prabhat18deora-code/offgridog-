import React, { useState, useEffect } from 'react';
import { CheckCircle2, Package, Truck, ArrowRight, Printer, MapPin, Calendar, Clock } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { Order } from '../../types.ts';

export function OrderConfirmationPage() {
  const { currentSlug, navigateTo } = useStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentSlug) return;
    fetch(`/api/orders/${currentSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [currentSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F2EFE7] flex items-center justify-center p-8">
        <p className="text-xs uppercase tracking-widest text-[#A6A49C] font-bold">Retrieving Order Details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F2EFE7] flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <p className="text-base text-[#20211E] font-medium">Order details not found.</p>
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="px-6 py-2.5 bg-[#20211E] text-white text-xs font-bold uppercase rounded-xs"
          >
            Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'confirmed', label: 'Order Confirmed', done: true },
    { key: 'processing', label: 'Crafting & Packing', done: ['processing', 'shipped', 'delivered'].includes(order.status) },
    { key: 'shipped', label: 'Dispatched via Courier', done: ['shipped', 'delivered'].includes(order.status) },
    { key: 'delivered', label: 'Delivered', done: order.status === 'delivered' },
  ];

  return (
    <div className="min-h-screen bg-[#F2EFE7] py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Confirmation Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 mx-auto">
            <CheckCircle2 size={32} />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#777B5A]">Thank You for Your Order</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase font-brand-display text-[#20211E]">
            Order {order.orderNumber} Confirmed
          </h1>
          <p className="text-sm text-[#A6A49C] max-w-md mx-auto">
            A confirmation receipt has been dispatched to{' '}
            <span className="font-semibold text-[#20211E]">{order.customerEmail}</span>.
          </p>
        </div>

        {/* Fulfillment Tracking Stepper */}
        <div className="p-6 bg-white/70 rounded-sm border border-[#353630/20] space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#20211E]">Order Timeline &amp; Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {steps.map((st, idx) => (
              <div key={st.key} className="space-y-1 text-center sm:text-left">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      st.done ? 'bg-[#777B5A] text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className={`h-[2px] flex-1 ${st.done ? 'bg-[#777B5A]' : 'bg-gray-200'} hidden sm:block`} />
                </div>
                <p className={`text-xs font-bold ${st.done ? 'text-[#20211E]' : 'text-[#A6A49C]'}`}>{st.label}</p>
              </div>
            ))}
          </div>

          {order.trackingNumber && (
            <div className="mt-4 p-3 bg-[#D6C7AE]/40 rounded-xs border border-[#353630/20] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-[#777B5A]" />
                <span>
                  Courier: <strong className="text-[#20211E]">{order.courierName || 'Blue Dart Express'}</strong> &middot;{' '}
                  Tracking: <strong className="font-mono text-[#20211E]">{order.trackingNumber}</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Invoice Receipt Card */}
        <div className="p-8 bg-white/80 rounded-sm border border-[#353630/20] space-y-6 print:border-none print:shadow-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#353630/20] pb-4">
            <div>
              <span className="text-lg font-extrabold tracking-widest font-brand-display uppercase text-[#20211E]">
                OFFGRID OG
              </span>
              <p className="text-[11px] text-[#A6A49C]">Contemporary Fashion &middot; India</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#A6A49C] block">Order Date</span>
              <span className="text-xs font-bold text-[#20211E]">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#A6A49C]">
            <div>
              <h3 className="font-bold uppercase tracking-wider text-[#20211E] mb-1">Delivering To</h3>
              <p className="font-semibold text-[#20211E]">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
              </p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>

            <div>
              <h3 className="font-bold uppercase tracking-wider text-[#20211E] mb-1">Payment Method</h3>
              <p className="font-semibold text-[#20211E] uppercase">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Razorpay Online (Prepaid)'}
              </p>
              <p>Payment Status: <span className="font-bold text-[#777B5A] uppercase">{order.paymentStatus}</span></p>
              {order.paymentId && <p className="font-mono text-[10px]">Reference: {order.paymentId}</p>}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border-t border-[#353630/20] pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#20211E] mb-3">Itemized Garments</h3>
            <div className="divide-y divide-[#353630/20]/60">
              {order.items.map((it) => (
                <div key={it.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={it.imageUrl} alt={it.productName} className="w-10 h-12 object-cover rounded-xs border shrink-0" />
                    <div>
                      <p className="font-semibold text-[#20211E]">{it.productName}</p>
                      <p className="text-[11px] text-[#A6A49C]">{it.variantLabel}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[#A6A49C] mr-3">Qty: {it.quantity}</span>
                    <span className="font-bold text-[#20211E] tabular-nums">
                      ₹{((it.pricePaise * it.quantity) / 100).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-[#353630/20] pt-4 space-y-1.5 text-xs text-[#A6A49C]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#20211E] tabular-nums">
                ₹{(order.subtotalPaise / 100).toLocaleString('en-IN')}
              </span>
            </div>
            {order.discountPaise > 0 && (
              <div className="flex justify-between text-[#777B5A]">
                <span>Promotional Savings ({order.discountCode})</span>
                <span className="font-semibold tabular-nums">
                  -₹{(order.discountPaise / 100).toLocaleString('en-IN')}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Express Delivery Fee</span>
              <span className="font-semibold text-[#20211E] tabular-nums">
                {order.shippingChargesPaise === 0 ? 'COMPLIMENTARY' : `₹${(order.shippingChargesPaise / 100).toLocaleString('en-IN')}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-[#20211E] border-t border-[#353630/20] pt-2">
              <span>Total Paid / Payable</span>
              <span className="tabular-nums">₹{(order.totalPaise / 100).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto px-6 py-3 bg-[#D6C7AE] text-[#20211E] hover:bg-[#353630/20] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2"
          >
            <Printer size={15} />
            <span>Print Invoice Receipt</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('shop')}
            className="w-full sm:w-auto px-8 py-3 bg-[#20211E] text-white hover:bg-[#777B5A] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
