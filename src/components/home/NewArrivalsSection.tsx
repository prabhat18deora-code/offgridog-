import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { ProductCard } from '../common/ProductCard.tsx';

export function NewArrivalsSection() {
  const { products, navigateTo } = useStore();
  const [selectedDept, setSelectedDept] = useState<'all' | 'men' | 'women'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const availableCategories =
    selectedDept === 'women'
      ? ['all', 'T-Shirts & Tops', 'Shirts', 'Trousers', 'Co-ord Sets', 'Outerwear']
      : selectedDept === 'men'
      ? ['all', 'Polos', 'Trousers', 'T-Shirts', 'Sweatshirts', 'Jeans']
      : ['all', 'Polos', 'Trousers', 'T-Shirts', 'Co-ord Sets', 'Jeans'];

  const deptFiltered = products.filter((p) => {
    if (p.status !== 'published') return false;
    if (selectedDept === 'men') {
      return (
        (p.department === 'men' || p.department === 'unisex') &&
        !p.id.includes('_wmn_') &&
        !p.tags.includes('women')
      );
    }
    if (selectedDept === 'women') {
      return (
        (p.department === 'women' || (p.department === 'unisex' && !p.id.includes('_men_'))) &&
        !p.tags.includes('men')
      );
    }
    return true;
  });

  const categoryFiltered =
    selectedCategory === 'all'
      ? deptFiltered
      : deptFiltered.filter(
          (p) =>
            p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase()))
        );

  const displayProducts = categoryFiltered.slice(0, 4);

  return (
    <section className="w-full py-16 lg:py-24 bg-[#101110] border-b border-[#353630]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header with department and category filter tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#777B5A]">Season 2026 Drop</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F2EFE7] font-brand-display uppercase mt-1">
              New Arrivals
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Department segmented button */}
            <div className="flex items-center gap-1 bg-[#20211E] p-1 rounded-xs border border-[#353630]">
              {[
                { id: 'all', label: 'All' },
                { id: 'men', label: 'Men' },
                { id: 'women', label: 'Women' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setSelectedDept(d.id as any);
                    setSelectedCategory('all');
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-xs transition-colors ${
                    selectedDept === d.id
                      ? 'bg-[#181916] text-[#F2EFE7] shadow-xs'
                      : 'text-[#A6A49C] hover:text-[#F2EFE7]'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Interactive Category Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none max-w-full">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors whitespace-nowrap shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-[#20211E] text-[#F2EFE7] border border-[#353630]'
                      : 'text-[#A6A49C] hover:text-[#F2EFE7] hover:bg-[#20211E]/60'
                  }`}
                >
                  {cat === 'all' ? 'All Pieces' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="pt-4 text-center">
          <button
            type="button"
            onClick={() => navigateTo(selectedDept === 'women' ? 'women' : 'shop', 'new')}
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#353630] text-xs font-bold uppercase tracking-wider text-[#F2EFE7] hover:bg-[#20211E] hover:border-[#777B5A] transition-colors rounded-xs"
          >
            <span>Explore All {selectedDept === 'women' ? "Women's" : selectedDept === 'men' ? "Men's" : ''} New Arrivals</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
