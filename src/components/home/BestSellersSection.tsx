import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { ProductCard } from '../common/ProductCard.tsx';

export function BestSellersSection() {
  const { products, navigateTo } = useStore();

  const bestSellers = products.filter((p) => p.isBestSeller && p.status === 'published').slice(0, 4);

  return (
    <section className="w-full py-16 lg:py-24 bg-[#181916] border-b border-[#353630]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#777B5A]">Most Wanted</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F2EFE7] font-brand-display uppercase mt-1">
              Best Sellers
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('shop', 'bestseller')}
            className="text-xs font-bold uppercase tracking-wider text-[#F2EFE7] hover:text-[#777B5A] transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>View All Best Sellers</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
}
