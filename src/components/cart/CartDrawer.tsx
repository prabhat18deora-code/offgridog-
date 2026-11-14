import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cartSummary,
    updateCartQuantity,
    removeFromCart,
    applyPromoCode,
    promoCode,
    isCartLoading,
    navigateTo,
  } = useStore();

  const [inputCode, setInputCode] = useState(promoCode);

  if (!isCartOpen) return null;

  const thresholdPaise = cartSummary.freeShippingThresholdPaise;
  const currentNetSubtotal = Math.max(0, cartSummary.subtotalPaise - cartSummary.discountPaise);
  const remainingForFreeShip = Math.max(0, thresholdPaise - currentNetSubtotal);
  const progressPercent = Math.min(100, Math.round((currentNetSubtotal / thresholdPaise) * 100));

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    await applyPromoCode(inputCode);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative ml-auto w-full max-w-md bg-[#F2EFE7] h-full shadow-2xl flex flex-col z-10">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#353630/20] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#20211E]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#20211E]">
              Shopping Bag ({cartSummary.items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-gray-500 hover:text-[#20211E] rounded-full hover:bg-[#D6C7AE]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#D6C7AE]/60 px-5 py-3 border-b border-[#353630/20]">
          {cartSummary.freeShippingQualified ? (
            <p className="text-xs font-bold text-[#777B5A] flex items-center gap-1.5">
              <span>✓ You qualify for complimentary express shipping!</span>
            </p>
          ) : (
            <div className="space-y-1.5">
              <p className="text-xs text-[#20211E]">
                Add{' '}
                <span className="font-bold tabular-nums">
                  ₹{(remainingForFreeShip / 100).toLocaleString('en-IN')}
                </span>{' '}
                more to unlock Free Express Shipping.
              </p>
              <div className="w-full bg-[#353630/20] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#777B5A] h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartSummary.items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="text-sm text-[#A6A49C]">Your shopping bag is currently empty.</p>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigateTo('shop');
                }}
                className="px-6 py-2.5 bg-[#20211E] text-white text-xs font-bold uppercase tracking-wider rounded-xs"
              >
                Explore The Collection
              </button>
            </div>
          ) : (
            cartSummary.items.map((item) => (
              <div
                key={item.variantId}
                className="flex gap-4 p-3 bg-white/70 rounded-xs border border-[#353630/20]/60 items-center"
              >
                {/* Thumbnail */}
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-16 h-20 object-cover rounded-xs border border-[#353630/20] shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-xs font-semibold text-[#20211E] truncate">{item.productName}</h4>
                  <p className="text-[11px] text-[#A6A49C]">{item.variantLabel}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-[#20211E] tabular-nums">
                      ₹{(item.pricePaise / 100).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center border border-[#353630/20] rounded-xs bg-[#F2EFE7]">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.variantId, item.quantity - 1)}
                        className="p-1 text-[#A6A49C] hover:text-[#20211E]"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-xs font-bold tabular-nums text-[#20211E]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.variantId, item.quantity + 1)}
                        className="p-1 text-[#A6A49C] hover:text-[#20211E]"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.variantId)}
                      className="text-[#A6A49C] hover:text-red-700 p-1"
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Drawer Footer with Price Breakdown */}
        {cartSummary.items.length > 0 && (
          <div className="p-5 bg-[#F2EFE7] border-t border-[#353630/20] space-y-4">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6A49C]" />
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder="Promo Code (e.g. OFFGRID10)"
                  className="w-full pl-8 pr-2 py-2 text-xs uppercase bg-white border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#777B5A]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#20211E] text-white text-xs font-semibold rounded-xs hover:bg-[#777B5A] transition-colors"
              >
                Apply
              </button>
            </form>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#A6A49C] border-t border-[#353630/20] pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#20211E] tabular-nums">
                  ₹{(cartSummary.subtotalPaise / 100).toLocaleString('en-IN')}
                </span>
              </div>

              {cartSummary.discountPaise > 0 && (
                <div className="flex justify-between text-[#777B5A]">
                  <span>Promotional Discount</span>
                  <span className="font-semibold tabular-nums">
                    -₹{(cartSummary.discountPaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-[#20211E] tabular-nums">
                  {cartSummary.shippingChargesPaise === 0 ? (
                    <span className="text-emerald-700">FREE</span>
                  ) : (
                    `₹${(cartSummary.shippingChargesPaise / 100).toLocaleString('en-IN')}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm font-extrabold text-[#20211E] pt-2 border-t border-[#353630/20]">
                <span>Total Payable</span>
                <span className="tabular-nums">
                  ₹{(cartSummary.totalPaise / 100).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              type="button"
              disabled={isCartLoading || cartSummary.items.length === 0}
              onClick={handleCheckout}
              className="w-full py-4 bg-[#20211E] text-white hover:bg-[#777B5A] active:scale-98 transition-all text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={16} />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#A6A49C] pt-1">
              <ShieldCheck size={13} />
              <span>Safe &amp; Encrypted Indian Payments &middot; 7-Day Exchange</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
