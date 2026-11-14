import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export function CategorySection() {
  const { categories, navigateTo } = useStore();
  const [activeDepartment, setActiveDepartment] = useState<'all' | 'men' | 'women'>('all');

  const filteredCategories = categories.filter((cat) => {
    if (activeDepartment === 'all') return true;
    if (activeDepartment === 'men') return cat.department === 'men';
    if (activeDepartment === 'women') return cat.department === 'women';
    return true;
  });

  const handleCategoryClick = (cat: (typeof categories)[0]) => {
    if (cat.department === 'women') {
      navigateTo('women', cat.name);
    } else {
      navigateTo('shop', cat.name);
    }
  };

  return (
    <section className="w-full py-16 lg:py-24 bg-[#181916] border-b border-[#353630]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header with Department Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#777B5A]">Curated Wardrobe</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F2EFE7] font-brand-display uppercase mt-1">
              Shop by Category
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Department switcher tabs */}
            <div className="flex items-center gap-1 bg-[#20211E] p-1 rounded-xs border border-[#353630]">
              {[
                { id: 'all', label: 'All' },
                { id: 'men', label: "Men's Edit" },
                { id: 'women', label: "Women's Edit" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveDepartment(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                    activeDepartment === tab.id
                      ? 'bg-[#101110] text-[#F2EFE7] shadow-xs'
                      : 'text-[#A6A49C] hover:text-[#F2EFE7]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigateTo(activeDepartment === 'women' ? 'women' : 'shop')}
              className="text-xs font-bold uppercase tracking-wider text-[#F2EFE7] hover:text-[#777B5A] transition-colors inline-flex items-center gap-1 ml-2 self-start sm:self-auto cursor-pointer"
            >
              <span className="hidden sm:inline">View Full Collection</span>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredCategories.map((cat) => {
            const isWomen = cat.department === 'women';
            const isMen = cat.department === 'men';

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className="group relative aspect-[3/4] bg-[#20211E] overflow-hidden rounded-sm border border-[#353630] cursor-pointer"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent transition-opacity group-hover:opacity-95" />

                {/* Department Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-xs ${
                      isWomen
                        ? 'bg-[#D6C7AE] text-[#20211E]'
                        : isMen
                        ? 'bg-[#20211E] text-white'
                        : 'bg-white/80 text-[#20211E]'
                    }`}
                  >
                    {isWomen ? 'WOMEN' : isMen ? 'MEN' : 'UNISEX'}
                  </span>
                </div>

                <div className="absolute bottom-4 inset-x-4 flex items-end justify-between text-white">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold tracking-tight font-brand-display uppercase">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-white/70 line-clamp-1">{cat.description}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 group-hover:bg-[#777B5A] transition-colors">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
