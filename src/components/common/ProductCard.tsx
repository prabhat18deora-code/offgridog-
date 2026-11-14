import React, { useState } from 'react';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Product, ProductVariant } from '../../types.ts';
import { useStore } from '../../context/StoreContext.tsx';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { navigateTo, isWishlisted, toggleWishlist, addToCart } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants[0] || null
  );
  const [isAdding, setIsAdding] = useState(false);

  const isSaved = isWishlisted(product.id);
  const defaultFallback =
    product.department === 'women'
      ? '/src/assets/images/hero_women_campaign_1792061306400.jpg'
      : product.department === 'men'
      ? '/src/assets/images/hero_fashion_campaign_1791888586032.jpg'
      : '/src/assets/images/hero_find_your_way_1792064208834.jpg';
  const primaryImage = product.images[0] || defaultFallback;
  const secondaryImage = product.images[1] || primaryImage;

  const currentPrice = selectedVariant?.priceOverridePaise || product.salePricePaise || product.basePricePaise;
  const hasSale = product.salePricePaise && product.salePricePaise < product.basePricePaise;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedVariant) return;
    setIsAdding(true);
    await addToCart(selectedVariant.id, 1);
    setTimeout(() => setIsAdding(false), 800);
  };

  const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);

  return (
    <div
      onClick={() => navigateTo('product', product.slug)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor="card"
      className="group flex flex-col cursor-pointer transition-luxury select-none"
    >
      {/* Image Container */}
      <div
        data-cursor="view"
        className="relative aspect-[3/4] w-full bg-[#20211E] overflow-hidden rounded-sm border border-[#353630]"
      >
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges - Subtle clean unboxed text kicker */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {product.isNew && (
            <span className="text-[10px] font-bold tracking-widest uppercase bg-[#101110] text-[#F2EFE7] border border-[#353630] px-2 py-0.5 rounded-xs">
              NEW
            </span>
          )}
          {product.isBestSeller && !product.isNew && (
            <span className="text-[10px] font-bold tracking-widest uppercase bg-[#777B5A] text-white px-2 py-0.5 rounded-xs">
              BEST SELLER
            </span>
          )}
          {totalStock <= 15 && totalStock > 0 && (
            <span className="text-[10px] font-semibold tracking-wider uppercase bg-[#796653] text-[#F2EFE7] px-2 py-0.5 rounded-xs">
              LOW STOCK
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-3 right-3 p-2 rounded-full bg-[#20211E]/80 backdrop-blur-sm text-[#F2EFE7] hover:text-[#777B5A] hover:bg-[#20211E] border border-[#353630] transition-colors shadow-xs"
        >
          <Heart size={17} className={isSaved ? 'fill-[#777B5A] text-[#777B5A]' : ''} />
        </button>

        {/* Hover Quick Action Drawer */}
        <div
          className={`absolute bottom-0 inset-x-0 p-3 bg-[#20211E]/95 backdrop-blur-md border-t border-[#353630] transition-all duration-300 flex flex-col gap-2 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quick Size Select */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#A6A49C] text-[11px] font-medium">Select Size:</span>
            <div className="flex items-center gap-1">
              {product.variants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                const isOutOfStock = v.stockQuantity <= 0;
                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => setSelectedVariant(v)}
                    className={`w-6 h-6 text-[10px] font-bold rounded-xs flex items-center justify-center transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#F2EFE7] text-[#101110]'
                        : isOutOfStock
                        ? 'text-[#A6A49C]/40 line-through cursor-not-allowed'
                        : 'text-[#F2EFE7] hover:bg-[#353630]'
                    }`}
                  >
                    {v.size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Add Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!selectedVariant || selectedVariant.stockQuantity <= 0}
            className="w-full py-2 bg-[#101110] border border-[#353630] text-[#F2EFE7] hover:bg-[#777B5A] hover:text-white text-xs font-semibold tracking-wider uppercase rounded-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isAdding ? (
              <>
                <Check size={14} /> Added
              </>
            ) : selectedVariant && selectedVariant.stockQuantity <= 0 ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingBag size={14} /> Quick Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="pt-3 pb-1 space-y-1">
        <div className="flex items-center justify-between text-[11px] text-[#A6A49C]">
          <span>{product.category}</span>
          {product.rating ? (
            <span className="inline-flex items-center gap-1 font-medium text-[#F2EFE7]">
              <span className="text-[#777B5A] text-xs leading-none">★</span>
              <span className="tabular-nums font-semibold">{product.rating.toFixed(1)}</span>
              {product.reviewCount && <span className="text-[#A6A49C] text-[10px] tabular-nums">({product.reviewCount})</span>}
            </span>
          ) : (
            <span>{product.variants.length} Sizes</span>
          )}
        </div>

        <h3 className="text-sm font-semibold text-[#F2EFE7] group-hover:text-[#777B5A] transition-colors line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-sm font-bold text-[#F2EFE7] tabular-nums">
            ₹{(currentPrice / 100).toLocaleString('en-IN')}
          </span>
          {hasSale && (
            <span className="text-xs text-[#A6A49C] line-through tabular-nums">
              ₹{(product.basePricePaise / 100).toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
