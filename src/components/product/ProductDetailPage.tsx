import React, { useState, useEffect } from 'react';
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Check,
  ChevronDown,
  Star,
  Plus,
  Minus,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { Product, ProductVariant, Review } from '../../types.ts';
import { ProductCard } from '../common/ProductCard.tsx';

export function ProductDetailPage() {
  const {
    currentSlug,
    products,
    navigateTo,
    addToCart,
    isWishlisted,
    toggleWishlist,
    setSizeGuideOpen,
    showToast,
  } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isBuyingNow, setIsBuyingNow] = useState<boolean>(false);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string>('fabric');

  // India PIN delivery checker
  const [pinCode, setPinCode] = useState<string>('');
  const [pinStatus, setPinStatus] = useState<{ checked: boolean; valid?: boolean; message?: string } | null>(null);

  // New review form state
  const [reviewName, setReviewName] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  useEffect(() => {
    if (!currentSlug) return;
    const found = products.find((p) => p.slug === currentSlug || p.id === currentSlug);
    if (found) {
      setProduct(found);
      setSelectedVariant(found.variants[0] || null);
      setActiveImageIndex(0);
      setQuantity(1);

      // Fetch dynamic reviews & related from API
      fetch(`/api/products/${found.slug}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.reviews) setReviews(data.reviews);
          if (data.relatedProducts) setRelatedProducts(data.relatedProducts);
        })
        .catch(console.error);
    }
  }, [currentSlug, products]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F2EFE7] flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <p className="text-base text-[#20211E] font-medium">Garment not found.</p>
          <button
            type="button"
            onClick={() => navigateTo('shop')}
            className="px-6 py-2.5 bg-[#20211E] text-white text-xs font-bold uppercase rounded-xs"
          >
            Return to Catalog
          </button>
        </div>
      </div>
    );
  }

  const isSaved = isWishlisted(product.id);
  const currentPrice = selectedVariant?.priceOverridePaise || product.salePricePaise || product.basePricePaise;
  const hasSale = product.salePricePaise && product.salePricePaise < product.basePricePaise;
  const stock = selectedVariant ? selectedVariant.stockQuantity : 0;
  const isOutOfStock = stock <= 0;

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      showToast('Please select a size first', 'error');
      return;
    }
    if (isOutOfStock) {
      showToast('Selected variant is currently sold out', 'error');
      return;
    }
    setIsAdding(true);
    await addToCart(selectedVariant.id, quantity);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) {
      showToast('Please select a size first', 'error');
      return;
    }
    if (isOutOfStock) {
      showToast('Selected variant is currently sold out', 'error');
      return;
    }
    setIsBuyingNow(true);
    await addToCart(selectedVariant.id, quantity);
    navigateTo('checkout');
    setIsBuyingNow(false);
  };

  const handleCheckPin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinCode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setPinStatus({ checked: true, valid: false, message: 'Please enter a valid 6-digit Indian PIN code' });
      return;
    }
    // Estimated delivery logic
    setPinStatus({
      checked: true,
      valid: true,
      message: `Standard Delivery by ${new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })}. Cash on Delivery eligible.`,
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      showToast('Please provide your name and review', 'error');
      return;
    }
    try {
      setIsSubmittingReview(true);
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: reviewName,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviews([data.review, ...reviews]);
        setReviewName('');
        setReviewComment('');
        showToast('Review submitted. Thank you!', 'success');
      } else {
        showToast(data.error || 'Failed to submit review', 'error');
      }
    } catch {
      showToast('Network error while posting review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? '' : id);
  };

  return (
    <div className="min-h-screen bg-[#F2EFE7] py-8 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#A6A49C]">
          <button type="button" onClick={() => navigateTo('home')} className="hover:text-[#20211E]">
            Home
          </button>
          <span aria-hidden="true">/</span>
          <button type="button" onClick={() => navigateTo('shop')} className="hover:text-[#20211E]">
            Shop
          </button>
          <span aria-hidden="true">/</span>
          <button type="button" onClick={() => navigateTo('shop', product.category)} className="hover:text-[#20211E]">
            {product.category}
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-[#20211E] font-medium truncate max-w-xs">{product.name}</span>
        </div>

        {/* Contiguous Purchase Module PDP Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Gallery: Thumbnails & Main Image */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[580px] shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-20 md:w-20 md:h-24 rounded-xs overflow-hidden border transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#20211E] ring-1 ring-[#20211E]'
                      : 'border-[#353630/20] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Stage Image */}
            <div
              data-cursor="view"
              className="relative aspect-[3/4] w-full bg-[#D6C7AE] rounded-sm overflow-hidden border border-[#353630/20] shadow-xs"
            >
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                className="absolute top-4 right-4 p-3 rounded-full bg-[#F2EFE7]/85 backdrop-blur-sm text-[#20211E] hover:text-[#777B5A] transition-colors shadow-xs"
              >
                <Heart size={20} className={isSaved ? 'fill-[#777B5A] text-[#777B5A]' : ''} />
              </button>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Header info */}
            <div className="space-y-2 border-b border-[#353630/20] pb-5">
              <div className="flex items-center justify-between text-xs text-[#A6A49C]">
                <span className="font-bold uppercase tracking-[0.18em] text-[#777B5A]">{product.category}</span>
                {selectedVariant && (
                  <span className="font-mono text-[11px] text-[#A6A49C]">SKU: {selectedVariant.sku}</span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#20211E] font-brand-display uppercase">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#A6A49C]">{product.tagline}</p>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-2xl font-extrabold text-[#20211E] tabular-nums">
                  ₹{(currentPrice / 100).toLocaleString('en-IN')}
                </span>
                {hasSale && (
                  <span className="text-base text-[#A6A49C] line-through tabular-nums">
                    ₹{(product.basePricePaise / 100).toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[11px] text-[#A6A49C] ml-1">(Inclusive of all GST taxes)</span>
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#20211E]">
                  Color: <span className="font-normal text-[#A6A49C]">{selectedVariant?.color}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                {product.variants
                  .filter((v, i, arr) => arr.findIndex((x) => x.color === v.color) === i)
                  .map((v) => {
                    const isSelected = selectedVariant?.color === v.color;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${
                          isSelected ? 'border-[#20211E] scale-110' : 'border-transparent hover:scale-105'
                        }`}
                        title={v.color}
                      >
                        <span
                          className="w-full h-full rounded-full block border border-black/10"
                          style={{ backgroundColor: v.colorHex }}
                        />
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Size Selector with Size Guide trigger */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#20211E]">Select Size</span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-[#777B5A] font-semibold hover:underline flex items-center gap-1"
                >
                  <Ruler size={14} /> Size Guide
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  const isOut = v.stockQuantity <= 0;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={isOut}
                      onClick={() => setSelectedVariant(v)}
                      className={`py-2 text-xs font-bold rounded-xs border text-center transition-all ${
                        isSelected
                          ? 'bg-[#20211E] text-white border-[#20211E]'
                          : isOut
                          ? 'bg-gray-100 text-gray-400 border-gray-200 line-through cursor-not-allowed'
                          : 'bg-[#F2EFE7] border-[#353630/20] text-[#20211E] hover:border-[#20211E]'
                      }`}
                    >
                      {v.size}
                    </button>
                  );
                })}
              </div>

              {/* Stock availability indicator */}
              <div className="text-xs pt-1">
                {isOutOfStock ? (
                  <span className="text-red-700 font-semibold">Sold Out in this size</span>
                ) : stock < 12 ? (
                  <span className="text-[#777B5A] font-semibold">Only {stock} pieces remaining</span>
                ) : (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <Check size={14} /> In Stock &middot; Ready to dispatch
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Stepper & Add to Bag / Buy Now buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#353630/20] bg-[#F2EFE7] rounded-xs px-2 py-2">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-[#A6A49C] hover:text-[#20211E] disabled:opacity-30"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-xs font-bold tabular-nums text-[#20211E]">{quantity}</span>
                  <button
                    type="button"
                    disabled={quantity >= Math.min(10, stock)}
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    className="p-1 text-[#A6A49C] hover:text-[#20211E] disabled:opacity-30"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Primary Add to Bag */}
                <button
                  type="button"
                  disabled={isOutOfStock || isAdding}
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 bg-[#20211E] text-white hover:bg-[#101110] active:scale-98 transition-all text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isAdding ? (
                    <>
                      <Check size={16} /> Added to Bag
                    </>
                  ) : isOutOfStock ? (
                    'Sold Out'
                  ) : (
                    <>
                      <ShoppingBag size={16} /> Add To Bag
                    </>
                  )}
                </button>
              </div>

              {/* Instant Buy Now */}
              <button
                type="button"
                disabled={isOutOfStock || isBuyingNow}
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 bg-[#777B5A] text-white hover:bg-[#777B5A] active:scale-98 transition-all text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap size={16} /> Buy Now &middot; Instant Checkout
              </button>
            </div>

            {/* India PIN Code Delivery Checker */}
            <div className="pt-4 p-4 bg-[#D6C7AE]/30 rounded-xs border border-[#353630/20] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#20211E] flex items-center gap-1.5">
                <Truck size={14} className="text-[#777B5A]" /> Estimate Delivery in India
              </span>
              <form onSubmit={handleCheckPin} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit PIN code (e.g. 400001)"
                  className="flex-1 px-3 py-1.5 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#777B5A]"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#20211E] text-white text-xs font-semibold rounded-xs hover:bg-[#777B5A] transition-colors"
                >
                  Check
                </button>
              </form>
              {pinStatus?.checked && (
                <p
                  className={`text-xs font-medium pt-1 ${
                    pinStatus.valid ? 'text-emerald-800' : 'text-red-700'
                  }`}
                >
                  {pinStatus.message}
                </p>
              )}
            </div>

            {/* Accordion Sections: Fabric, Fit, Care, Shipping */}
            <div className="border-t border-[#353630/20] divide-y divide-[#353630/20] text-xs pt-2">
              {/* Description & Overview */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('description')}
                  className="w-full py-3 flex items-center justify-between text-left font-bold text-[#20211E] uppercase tracking-wider"
                >
                  <span>Description</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${openAccordion === 'description' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openAccordion === 'description' && (
                  <p className="pb-4 text-[#A6A49C] leading-relaxed">{product.description}</p>
                )}
              </div>

              {/* Fabric & Materials */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('fabric')}
                  className="w-full py-3 flex items-center justify-between text-left font-bold text-[#20211E] uppercase tracking-wider"
                >
                  <span>Fabric &amp; Composition</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${openAccordion === 'fabric' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openAccordion === 'fabric' && (
                  <p className="pb-4 text-[#A6A49C] leading-relaxed">{product.fabric}</p>
                )}
              </div>

              {/* Fit & Sizing */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('fit')}
                  className="w-full py-3 flex items-center justify-between text-left font-bold text-[#20211E] uppercase tracking-wider"
                >
                  <span>Fit &amp; Silhouette</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${openAccordion === 'fit' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openAccordion === 'fit' && (
                  <p className="pb-4 text-[#A6A49C] leading-relaxed">{product.fit}</p>
                )}
              </div>

              {/* Garment Care */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('care')}
                  className="w-full py-3 flex items-center justify-between text-left font-bold text-[#20211E] uppercase tracking-wider"
                >
                  <span>Care Instructions</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${openAccordion === 'care' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openAccordion === 'care' && (
                  <p className="pb-4 text-[#A6A49C] leading-relaxed">{product.careInstructions}</p>
                )}
              </div>

              {/* Shipping & Returns */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full py-3 flex items-center justify-between text-left font-bold text-[#20211E] uppercase tracking-wider"
                >
                  <span>Shipping &amp; 7-Day Returns</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${openAccordion === 'shipping' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openAccordion === 'shipping' && (
                  <div className="pb-4 space-y-2 text-[#A6A49C] leading-relaxed">
                    <p>
                      Complimentary courier shipping across India on orders above ₹1,999. Orders dispatched within 24–48
                      hours from our Mumbai hub.
                    </p>
                    <p>
                      We accept unwashed, unworn exchanges and returns with original tags attached within 7 days of
                      doorstep delivery.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="pt-8 border-t border-[#353630/20] space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-brand-display uppercase text-[#20211E]">
                Client Reviews ({reviews.length})
              </h2>
              <div className="flex items-center gap-2 pt-1 text-xs text-[#A6A49C]">
                <div className="flex items-center text-[#777B5A]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-current" />
                  ))}
                </div>
                <span>5.0 / 5.0 Average Rating</span>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 bg-[#D6C7AE]/25 rounded-xs border border-[#353630/20] space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#20211E]">{rev.userName}</span>
                  <span className="text-[11px] text-[#A6A49C]">
                    {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center text-[#777B5A]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={12} className="fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#20211E]/80 leading-relaxed">{rev.comment}</p>
                {rev.verifiedPurchase && (
                  <div className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                    <Check size={12} /> Verified Purchase
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Review Form */}
          <div className="p-6 bg-[#D6C7AE]/40 rounded-sm border border-[#353630/20] max-w-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#20211E]">Share Your Experience</h3>
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#777B5A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Rating</label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setReviewRating(val)}
                      className="p-1 text-[#777B5A]"
                    >
                      <Star size={18} className={val <= reviewRating ? 'fill-current' : 'text-gray-300'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#A6A49C] uppercase">Feedback &amp; Fit</label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How does the fabric, silhouette, and drape feel?"
                  className="w-full px-3 py-2 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#777B5A]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="px-6 py-2.5 bg-[#20211E] text-white text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-[#777B5A] transition-colors"
              >
                {isSubmittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="pt-10 border-t border-[#353630/20] space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold font-brand-display uppercase text-[#20211E]">
              Pair With &middot; Recommended
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
