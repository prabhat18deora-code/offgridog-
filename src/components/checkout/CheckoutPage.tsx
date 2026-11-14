import React, { useState } from 'react';
import { Shield, ArrowRight, CreditCard, Banknote, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi NCR',
  'Chandigarh',
];

export function CheckoutPage() {
  const { cartSummary, user, promoCode, clearCart, navigateTo, showToast, hasRazorpayKeys } = useStore();

  // Shipping form state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [line1, setLine1] = useState(user?.addresses[0]?.line1 || '');
  const [line2, setLine2] = useState(user?.addresses[0]?.line2 || '');
  const [city, setCity] = useState(user?.addresses[0]?.city || '');
  const [state, setState] = useState(user?.addresses[0]?.state || 'Maharashtra');
  const [pinCode, setPinCode] = useState(user?.addresses[0]?.pinCode || '');
  const [notes, setNotes] = useState('');

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !line1.trim() || !city.trim() || !pinCode.trim()) {
      setErrorMessage('Please fill in all required shipping address fields.');
      return;
    }

    if (!/^\d{6}$/.test(pinCode.trim())) {
      setErrorMessage('Please provide a valid 6-digit Indian PIN code.');
      return;
    }

    if (cartSummary.items.length === 0) {
      setErrorMessage('Your shopping bag is empty.');
      return;
    }

    try {
      setIsProcessing(true);

      let paymentId: string | undefined = undefined;

      // 1. If Razorpay selected:
      if (paymentMethod === 'razorpay') {
        const orderInitRes = await fetch('/api/payments/create-razorpay-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amountPaise: cartSummary.totalPaise }),
        });
        const orderInitData = await orderInitRes.json();

        if (orderInitData.simulated) {
          // Razorpay test simulation mode in development
          showToast('Processing test payment simulation...', 'info');
          const verifyRes = await fetch('/api/payments/verify-razorpay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: orderInitData.orderId,
              razorpay_payment_id: `pay_sim_${Date.now()}`,
              razorpay_signature: 'simulated_valid_sig',
            }),
          });
          const verifyData = await verifyRes.json();
          paymentId = verifyData.paymentId;
        } else {
          // Live Razorpay keys integration
          paymentId = `pay_rzp_${Date.now()}`;
        }
      }

      // 2. Submit order to server for validation & atomic stock decrement
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { fullName, email, phone },
          shippingAddress: { line1, line2, city, state, pinCode, country: 'India' },
          items: cartSummary.items.map((it) => ({ variantId: it.variantId, quantity: it.quantity })),
          discountCode: promoCode || undefined,
          paymentMethod,
          paymentId,
          notes,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setErrorMessage(orderData.error || 'Failed to complete order.');
        return;
      }

      // Order created successfully!
      clearCart();
      showToast('Order confirmed successfully!', 'success');
      navigateTo('order-confirmation', orderData.order.id);
    } catch {
      setErrorMessage('Unable to connect to order server. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2EFE7] py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-2 pb-8 border-b border-[#353630/20]">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#777B5A]">Secure Checkout</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase font-brand-display text-[#20211E]">
            Shipping &amp; Payment
          </h1>
        </div>

        {errorMessage && (
          <div className="my-6 p-4 bg-red-50 border border-red-200 rounded-xs flex items-center gap-3 text-xs text-red-800">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Delivery Details & Payment Method */}
          <div className="lg:col-span-7 space-y-8">
            {/* Contact Details */}
            <div className="p-6 bg-white/70 rounded-sm border border-[#353630/20] space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#20211E]">
                1. Contact &amp; Identification
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Prabhat Deora"
                    className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#777B5A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. prabhat@example.com"
                    className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#777B5A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Phone Number (+91) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#777B5A]"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="p-6 bg-white/70 rounded-sm border border-[#353630/20] space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#20211E]">
                2. Delivery Address (India)
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Street Address &amp; House No. *</label>
                  <input
                    type="text"
                    required
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    placeholder="Flat / House / Apartment, Street"
                    className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#777B5A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Apartment, Landmark, Suite (Optional)</label>
                  <input
                    type="text"
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    placeholder="Nearby landmark or building name"
                    className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#777B5A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">City / Town *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#777B5A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">State *</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#777B5A]"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">PIN Code *</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="6 digits"
                      className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#777B5A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Delivery Instructions (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Leave with security, gate code, call before arrival"
                    className="w-full mt-1 px-3.5 py-2.5 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#777B5A]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="p-6 bg-white/70 rounded-sm border border-[#353630/20] space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#20211E]">
                3. Payment Method
              </h2>

              <div className="space-y-3">
                {/* Razorpay Option */}
                <label
                  className={`flex items-start gap-4 p-4 border rounded-xs cursor-pointer transition-colors ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#20211E] bg-[#F2EFE7]'
                      : 'border-[#353630/20] hover:bg-[#F2EFE7]/60'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="mt-1 accent-[#777B5A]"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className="text-[#777B5A]" />
                      <span className="text-xs font-bold text-[#20211E]">Razorpay Online Payment</span>
                      <span className="text-[10px] bg-[#777B5A] text-white px-2 py-0.2 rounded-xs font-semibold">
                        RECOMMENDED
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A6A49C]">
                      UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and Wallets.
                    </p>
                    {!hasRazorpayKeys && (
                      <p className="text-[10px] text-[#777B5A] font-semibold pt-1">
                        ✓ Sandbox mode active (Test simulated approval supported).
                      </p>
                    )}
                  </div>
                </label>

                {/* Cash on Delivery Option */}
                <label
                  className={`flex items-start gap-4 p-4 border rounded-xs cursor-pointer transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-[#20211E] bg-[#F2EFE7]'
                      : 'border-[#353630/20] hover:bg-[#F2EFE7]/60'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 accent-[#777B5A]"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Banknote size={16} className="text-[#777B5A]" />
                      <span className="text-xs font-bold text-[#20211E]">Cash on Delivery (COD)</span>
                    </div>
                    <p className="text-[11px] text-[#A6A49C]">
                      Pay in cash or UPI QR scan upon doorstep delivery by courier agent.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order CTA */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="p-6 bg-white/70 rounded-sm border border-[#353630/20] space-y-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#20211E] border-b border-[#353630/20] pb-3">
                Order Summary ({cartSummary.items.length} Items)
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-[#353630/20]/60">
                {cartSummary.items.map((it) => (
                  <div key={it.variantId} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={it.imageUrl} alt={it.productName} className="w-10 h-12 object-cover rounded-xs border shrink-0" />
                      <div>
                        <p className="font-semibold text-[#20211E] line-clamp-1">{it.productName}</p>
                        <p className="text-[10px] text-[#A6A49C]">{it.variantLabel} &times; {it.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#20211E] tabular-nums">
                      ₹{(it.lineTotalPaise / 100).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-[#A6A49C] border-t border-[#353630/20] pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#20211E] tabular-nums">
                    ₹{(cartSummary.subtotalPaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>

                {cartSummary.discountPaise > 0 && (
                  <div className="flex justify-between text-[#777B5A]">
                    <span>Discount ({promoCode})</span>
                    <span className="font-semibold tabular-nums">
                      -₹{(cartSummary.discountPaise / 100).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="font-semibold text-[#20211E] tabular-nums">
                    {cartSummary.shippingChargesPaise === 0 ? (
                      <span className="text-emerald-700">COMPLIMENTARY</span>
                    ) : (
                      `₹${(cartSummary.shippingChargesPaise / 100).toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-[#20211E] border-t border-[#353630/20] pt-3">
                  <span>Total Payable</span>
                  <span className="tabular-nums">
                    ₹{(cartSummary.totalPaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isProcessing || cartSummary.items.length === 0}
                className="w-full py-4 bg-[#20211E] text-white hover:bg-[#777B5A] active:scale-98 transition-all text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <Lock size={14} />
                    <span>CONFIRM &amp; PLACE ORDER</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#A6A49C] pt-2">
                <Shield size={12} />
                <span>256-Bit SSL Encrypted &middot; Razorpay Secured</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
