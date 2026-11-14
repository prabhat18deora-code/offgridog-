import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { ProductCard } from '../common/ProductCard.tsx';
import {
  FilterState,
  INITIAL_FILTER_STATE,
  filterAndSortCatalog,
  ProductFilterSidebar,
  MobileFilterDrawer,
  ActiveFilterChips,
  FilterToolbar,
  FilterEmptyState,
} from '../common/ProductFilters.tsx';
import { ChevronRight, Sparkles } from 'lucide-react';

export function ShopPage() {
  const { products, currentSlug, navigateTo } = useStore();

  // Determine current department scope from slug or URL
  const initialDepartment: 'men' | 'all' | 'unisex' =
    currentSlug === 'unisex' ? 'unisex' : currentSlug === 'all' ? 'all' : 'men';
  const [department, setDepartment] = useState<'men' | 'all' | 'unisex'>(initialDepartment);

  // Sync department and filters if slug changes
  useEffect(() => {
    if (currentSlug === 'all' || currentSlug === 'collections') {
      setDepartment('all');
    } else if (currentSlug === 'unisex') {
      setDepartment('unisex');
    } else if (currentSlug === 'men') {
      setDepartment('men');
    }

    if (currentSlug) {
      const slugLower = currentSlug.toLowerCase();
      if (slugLower === 'new' || slugLower === 'new-arrivals') {
        setFilters((prev) => ({ ...prev, sort: 'newest', category: 'all' }));
      } else if (slugLower === 'bestseller' || slugLower === 'best-sellers') {
        setFilters((prev) => ({ ...prev, sort: 'popular', category: 'all' }));
      } else if (slugLower === 'collections') {
        setFilters((prev) => ({ ...prev, sort: 'recommended', category: 'all' }));
      } else if (slugLower === 'unisex') {
        setFilters((prev) => ({ ...prev, category: 'all' }));
      } else if (slugLower !== 'men' && slugLower !== 'all') {
        setFilters((prev) => ({ ...prev, category: currentSlug }));
      }
    }
  }, [currentSlug]);

  // Filter State
  const [filters, setFilters] = useState<FilterState>(() => {
    let initialCategory = 'all';
    let initialSort: FilterState['sort'] = 'recommended';

    if (currentSlug) {
      const slugLower = currentSlug.toLowerCase();
      if (slugLower === 'new' || slugLower === 'new-arrivals') {
        initialSort = 'newest';
      } else if (slugLower === 'bestseller' || slugLower === 'best-sellers') {
        initialSort = 'popular';
      } else if (slugLower !== 'men' && slugLower !== 'all' && slugLower !== 'collections') {
        initialCategory = currentSlug;
      }
    }

    return {
      ...INITIAL_FILTER_STATE,
      category: initialCategory,
      sort: initialSort,
    };
  });

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Base products for the current department
  const baseProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.status !== 'published') return false;
      if (department === 'unisex') {
        return (
          p.department === 'unisex' ||
          p.tags.some((t) => t.toLowerCase() === 'unisex') ||
          p.id.toLowerCase().includes('unisex')
        );
      }
      if (department === 'men') {
        return (
          p.department === 'men' ||
          p.department === 'unisex' ||
          (!p.department && !p.id.includes('_wmn_') && !p.tags.includes('women'))
        );
      }
      return true;
    });
  }, [products, department]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return filterAndSortCatalog(products, filters, department);
  }, [products, filters, department]);

  const handleResetFilters = () => {
    setFilters({
      ...INITIAL_FILTER_STATE,
      category: 'all',
      sort: filters.sort, // preserve chosen sort
    });
  };

  return (
    <div className="min-h-screen bg-[#F2EFE7] py-8 sm:py-12 text-[#20211E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Breadcrumb & Header Title */}
        <div className="space-y-3 pb-2 border-b border-[#353630/20]">
          <nav className="flex items-center gap-1.5 text-xs text-[#A6A49C]" aria-label="Breadcrumb">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="hover:text-[#20211E] transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight size={12} />
            <button
              type="button"
              onClick={() => {
                if (department === 'unisex') {
                  navigateTo('shop', 'unisex');
                } else {
                  setDepartment('men');
                  navigateTo('shop', 'men');
                }
              }}
              className={`hover:text-[#20211E] transition-colors cursor-pointer font-semibold text-[#20211E]`}
            >
              {department === 'unisex' ? 'Unisex' : department === 'all' ? 'All Apparel' : 'Men'}
            </button>
            {filters.category !== 'all' && (
              <>
                <ChevronRight size={12} />
                <span className="text-[#20211E] font-semibold">{filters.category}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#777B5A] mb-1">
                {department === 'unisex'
                  ? 'OFFGRID OG / UNISEX'
                  : department === 'men'
                  ? 'OFFGRID OG / MEN'
                  : 'OFFGRID OG / APPAREL'}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#20211E] font-brand-display uppercase leading-none">
                {filters.category !== 'all'
                  ? filters.category
                  : department === 'unisex'
                  ? 'Unisex Collection'
                  : department === 'men'
                  ? "Men's Collection"
                  : 'All Apparel'}
              </h1>
              <p className="text-xs sm:text-sm text-[#A6A49C] mt-2 max-w-xl">
                Showing{' '}
                <span className="font-bold text-[#20211E] tabular-nums">
                  {filteredProducts.length}
                </span>{' '}
                of {baseProducts.length} essential styles engineered for relaxed structure and enduring composure.
              </p>
            </div>

            {/* Department Scope Switcher */}
            <div className="inline-flex p-1 bg-white border border-[#353630/20] rounded-xs text-xs font-semibold shrink-0 shadow-xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setDepartment('men');
                  navigateTo('shop', 'men');
                }}
                className={`px-4 py-2 rounded-xs transition-all cursor-pointer ${
                  department === 'men'
                    ? 'bg-[#20211E] text-white shadow-xs font-bold'
                    : 'text-[#A6A49C] hover:text-[#20211E]'
                }`}
              >
                Men&apos;s Collection
              </button>
              <button
                type="button"
                onClick={() => {
                  setDepartment('all');
                  navigateTo('shop', 'all');
                }}
                className={`px-4 py-2 rounded-xs transition-all cursor-pointer ${
                  department === 'all'
                    ? 'bg-[#20211E] text-white shadow-xs font-bold'
                    : 'text-[#A6A49C] hover:text-[#20211E]'
                }`}
              >
                All Apparel
              </button>
            </div>
          </div>
        </div>

        {/* Toolbar: Search + Mobile Drawer Toggle + Working Sort Dropdown */}
        <FilterToolbar
          filters={filters}
          onChange={setFilters}
          onOpenMobileFilters={() => setMobileDrawerOpen(true)}
          totalFilteredCount={filteredProducts.length}
        />

        {/* Removable Active Filters Chips Bar */}
        <ActiveFilterChips
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
        />

        {/* Main 2-Column Split: Sticky/Collapsible Desktop Filter Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start pt-2">
          {/* Desktop Filter Sidebar (1 Column) */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            <ProductFilterSidebar
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              baseProducts={baseProducts}
              department={department}
            />
          </div>

          {/* Product Grid Area (3 Columns) */}
          <main className="lg:col-span-3 min-w-0">
            {filteredProducts.length === 0 ? (
              <FilterEmptyState onReset={handleResetFilters} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Slide-Out Filter Drawer */}
      <MobileFilterDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        baseProducts={baseProducts}
        department={department}
        totalResultsCount={filteredProducts.length}
      />
    </div>
  );
}
