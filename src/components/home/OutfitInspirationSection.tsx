import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

interface OutfitCombo {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  itemProductSlugs: string[];
}

export function OutfitInspirationSection() {
  const { products, addToCart, navigateTo, showToast } = useStore();
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [isAddingAll, setIsAddingAll] = useState(false);

  const outfits: OutfitCombo[] = [
    {
      id: 'look-1',
      title: 'The Contemporary Polo Edit',
      subtitle: 'OG Everyday Polo + Pleated Relaxed Trousers',
      image: '/src/assets/images/hero_fashion_campaign_1791888586032.jpg',
      itemProductSlugs: ['og-everyday-polo-olive', 'og-pleated-relaxed-trousers'],
    },
    {
      id: 'look-2',
      title: 'Architectural Layering',
      subtitle: 'Relaxed Oxford Shirt + Warm Ivory Heavyweight Tee',
      image: '/src/assets/images/product_oxford_shirt_1791888627723.jpg',
      itemProductSlugs: ['og-relaxed-oxford-shirt', 'og-essential-oversized-tee'],
    },
    {
      id: 'look-3',
      title: 'Monochrome Street Uniform',
      subtitle: 'Heavyweight Charcoal Tee + Olive Earth Bottom',
      image: '/src/assets/images/outfit_streetwear_coord_1791888587655.jpg',
      itemProductSlugs: ['og-heavyweight-basic-tee-charcoal', 'og-signature-coord-set'],
    },
  ];

  const currentLook = outfits[activeLookIndex];
  const lookProducts = products.filter((p) => currentLook.itemProductSlugs.includes(p.slug));

  const handleAddAllToCart = async () => {
    setIsAddingAll(true);
    let addedCount = 0;
    for (const prod of lookProducts) {
      const defaultVariant = prod.variants.find((v) => v.stockQuantity > 0) || prod.variants[0];
      if (defaultVariant && defaultVariant.stockQuantity > 0) {
        await addToCart(defaultVariant.id, 1);
        addedCount++;
      }
    }
    setIsAddingAll(false);
    if (addedCount > 0) {
      showToast(`Added ${addedCount} pieces from "${currentLook.title}" to bag`, 'success');
    }
  };

  return (
    <section className="w-full py-16 lg:py-24 bg-[#101110] border-b border-[#353630]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#777B5A]">Lookbook Capsule</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F2EFE7] font-brand-display uppercase mt-1">
              Outfit Inspiration &middot; Shop The Look
            </h2>
          </div>
          {/* Lookbook selector tabs */}
          <div className="flex items-center gap-2">
            {outfits.map((look, idx) => (
              <button
                key={look.id}
                type="button"
                onClick={() => setActiveLookIndex(idx)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                  activeLookIndex === idx
                    ? 'bg-[#20211E] text-[#F2EFE7] border border-[#353630]'
                    : 'bg-[#181916] text-[#A6A49C] hover:text-[#F2EFE7]'
                }`}
              >
                Look 0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Look Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#181916] p-6 lg:p-8 rounded-sm border border-[#353630]">
          {/* Large Editorial Look Image */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xs border border-[#353630] bg-[#20211E]">
              <img
                src={currentLook.image}
                alt={currentLook.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Included Products Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#777B5A]">
                Look 0{activeLookIndex + 1}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#F2EFE7] font-brand-display uppercase mt-1">
                {currentLook.title}
              </h3>
              <p className="text-xs text-[#A6A49C] mt-1">{currentLook.subtitle}</p>
            </div>

            {/* List of included pieces */}
            <div className="space-y-3 divide-y divide-[#353630]">
              {lookProducts.map((prod) => {
                const defaultVar = prod.variants[0];
                const price = defaultVar?.priceOverridePaise || prod.salePricePaise || prod.basePricePaise;
                return (
                  <div key={prod.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-12 h-14 object-cover rounded-xs border border-[#353630] shrink-0"
                      />
                      <div>
                        <h4
                          onClick={() => navigateTo('product', prod.slug)}
                          className="text-xs font-semibold text-[#F2EFE7] hover:text-[#777B5A] cursor-pointer line-clamp-1"
                        >
                          {prod.name}
                        </h4>
                        <span className="text-xs font-bold text-[#F2EFE7] tabular-nums">
                          ₹{(price / 100).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigateTo('product', prod.slug)}
                      className="text-[11px] font-semibold text-[#777B5A] hover:underline flex items-center gap-1 shrink-0"
                    >
                      <span>View</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleAddAllToCart}
                disabled={isAddingAll}
                className="w-full sm:w-auto flex-1 py-3 px-4 bg-[#20211E] text-white border border-[#353630] hover:bg-[#777B5A] text-xs font-bold tracking-wider uppercase rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAddingAll ? (
                  <>
                    <Check size={15} /> Adding Look...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={15} /> Add Entire Look To Bag
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
