import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
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
  WOMEN_CATEGORIES as STANDARD_WOMEN_CATEGORIES,
} from '../common/ProductFilters.tsx';

// 8 Mandatory Women Categories for visual showcase navigation
const WOMEN_CATEGORIES = [
  { name: 'T-Shirts & Tops', slug: 't-shirts-tops', image: '/src/assets/images/women_tops_editorial_1792062525021.jpg' },
  { name: 'Shirts', slug: 'shirts', image: '/src/assets/images/women_relaxed_poplin_shirt_1792409673934.jpg' },
  { name: 'Trousers', slug: 'trousers', image: '/src/assets/images/women_fluid_wide_trousers_1792409690642.jpg' },
  { name: 'Jeans', slug: 'jeans', image: '/src/assets/images/product_women_jeans_1792061307710.jpg' },
  { name: 'Co-ord Sets', slug: 'co-ord-sets', image: '/src/assets/images/product_women_coord_1792061307583.jpg' },
  { name: 'Dresses', slug: 'dresses', image: '/src/assets/images/product_women_dress_1792061307251.jpg' },
  { name: 'Outerwear', slug: 'outerwear', image: '/src/assets/images/women_outerwear_blazer_1792062522398.jpg' },
  { name: 'Accessories', slug: 'accessories', image: '/src/assets/images/product_canvas_tote_bag_1792409743795.jpg' },
];

// 3 Featured Reference Category Cards requested for WOMEN section
export const FEATURED_WOMEN_CARDS = [
  {
    id: 'graphic-tees',
    title: 'GRAPHIC TEES',
    supportingText: 'Express yourself. Wear your story.',
    buttonText: 'SHOP TEES',
    slug: 'graphic-tees',
    targetCategory: 'T-Shirts',
    route: '/women/graphic-tees',
    image: '/images/women_graphic_tees.jpg',
    alt: 'Woman wearing cream oversized vintage graphic T-shirt with blue jeans',
    fitMode: 'cover' as const,
    position: 'object-top',
    tagline: 'Vintage Washes · 240 GSM Combed Cotton',
  },
  {
    id: 'oversized-tees',
    title: 'OVERSIZED TEES',
    supportingText: 'Relaxed fits. Everyday attitude.',
    buttonText: 'EXPLORE STREETWEAR',
    slug: 'oversized-tees',
    targetCategory: 'Oversized T-Shirts',
    route: '/women/oversized-tees',
    image: '/images/women_oversized_tees.jpg',
    alt: 'Woman wearing black oversized graphic T-shirt with grey jeans',
    fitMode: 'cover' as const,
    position: 'object-top',
    tagline: 'Architectural Cuts · 260 GSM Streetwear',
  },
  {
    id: 'essentials',
    title: 'EVERYDAY ESSENTIALS',
    supportingText: 'Comfort meets understated style.',
    buttonText: 'SHOP ESSENTIALS',
    slug: 'essentials',
    targetCategory: 'T-Shirts',
    route: '/women/essentials',
    image: '/images/women_everyday_essentials.jpg',
    alt: 'Cream oversized minimalist graphic T-shirt displayed on clean background',
    fitMode: 'contain' as const,
    position: 'object-center',
    tagline: 'Minimalist Uniform · 100% Organic Jersey',
  },
];

export function WomenPage() {
  const { products, currentSlug, navigateTo } = useStore();
  const gridRef = useRef<HTMLDivElement>(null);

  const resolveInitialCategory = (slug: string | null): string => {
    if (!slug) return 'all';
    const s = slug.toLowerCase().trim();
    if (s === 'graphic-tees' || s === 'graphic tees') return 'T-Shirts';
    if (s === 'oversized-tees' || s === 'oversized tees') return 'Oversized T-Shirts';
    if (s === 'essentials' || s === 'everyday essentials') return 'T-Shirts';
    const match = WOMEN_CATEGORIES.find(
      (c) => c.slug.toLowerCase() === s || c.name.toLowerCase() === s
    );
    return match ? match.name : slug;
  };

  // Filter States
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...INITIAL_FILTER_STATE,
    category: resolveInitialCategory(currentSlug),
    sort: 'recommended',
  }));

  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Sync category if currentSlug changes externally
  useEffect(() => {
    if (currentSlug) {
      setFilters((prev) => ({
        ...prev,
        category: resolveInitialCategory(currentSlug),
      }));
    }
  }, [currentSlug]);

  // Base women products
  const womenBaseProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.status === 'published' &&
        (p.department === 'women' ||
          p.department === 'unisex' ||
          p.tags.some((t) => t.toLowerCase() === 'women' || t.toLowerCase() === 'unisex') ||
          p.id.includes('_wmn_'))
    );
  }, [products]);

  // Filtered and sorted products for Women
  const filteredProducts = useMemo(() => {
    return filterAndSortCatalog(products, filters, 'women');
  }, [products, filters]);

  const resetFilters = () => {
    setFilters({
      ...INITIAL_FILTER_STATE,
      category: 'all',
      sort: filters.sort,
    });
  };

  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F2EFE7]">
      {/* 1. Women's Hero Section */}
      <section className="relative w-full bg-[#101110] text-[#F2EFE7] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/hero_women_campaign_1792061306400.jpg"
            alt="OffGrid OG Women's Fashion Campaign"
            className="w-full h-full object-cover object-top opacity-55 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101110] via-[#101110]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101110]/80 via-transparent to-[#101110]/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 flex flex-col justify-end min-h-[580px] lg:min-h-[680px]">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D6C7AE] rounded-xs">
              <Sparkles size={12} className="text-[#777B5A]" />
              <span>Women&apos;s Capsule &middot; Autumn/Winter</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-brand-display tracking-tight uppercase leading-[0.95] text-white">
              HER STYLE.<br />
              <span className="text-[#D6C7AE]">HER RULES.</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#F2EFE7]/85 font-normal max-w-lg leading-relaxed">
              Effortless essentials. Uncompromising individuality. Tailored silhouettes, tactile organic fabrics, and versatile modular staples calibrated for modern everyday elegance.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={scrollToGrid}
                className="px-8 py-4 bg-[#777B5A] text-white hover:bg-[#777B5A] active:scale-95 text-xs font-bold uppercase tracking-widest rounded-xs transition-all shadow-lg flex items-center gap-3 cursor-pointer"
              >
                <span>SHOP WOMEN</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, category: 'Dresses' }));
                  scrollToGrid();
                }}
                className="px-6 py-4 bg-white/10 hover:bg-white/20 text-[#F2EFE7] border border-white/20 text-xs font-bold uppercase tracking-widest rounded-xs transition-colors backdrop-blur-sm cursor-pointer"
              >
                Explore Dresses
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WOMEN'S COLLECTION Featured Category Showcase */}
      <section className="border-b border-[#353630/20] bg-[#F2EFE7] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          {/* Section Heading Contract: Eyebrow + Title + Subtitle */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-block text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#777B5A]">
              OFFGRID OG / WOMEN
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-brand-display uppercase tracking-tight text-[#20211E]">
              WOMEN&apos;S COLLECTION
            </h2>
            <p className="text-sm sm:text-base text-[#A6A49C] font-normal max-w-lg mx-auto">
              Discover your style. Define your own rules.
            </p>
          </div>

          {/* Desktop: 3 visually balanced cards in one row | Tablet/Mobile: 2-col or single-col */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {FEATURED_WOMEN_CARDS.map((card, idx) => {
              const isSelected = filters.category === card.targetCategory;

              return (
                <article
                  key={card.id}
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, category: card.targetCategory }));
                    navigateTo('women', card.slug);
                    scrollToGrid();
                  }}
                  className={`group relative flex flex-col bg-white rounded-xs border transition-all duration-300 shadow-xs hover:shadow-xl cursor-pointer overflow-hidden ${
                    isSelected ? 'border-[#20211E] ring-2 ring-[#777B5A]' : 'border-[#353630/20] hover:border-[#20211E]'
                  }`}
                >
                  {/* Image Frame with Consistent Aspect Ratio & Gentle Hover Zoom */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2EFE7]">
                    <img
                      src={card.image}
                      alt={card.alt}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      className={`w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 ${
                        card.fitMode === 'contain'
                          ? 'object-contain p-6 sm:p-8'
                          : `object-cover ${card.position}`
                      }`}
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#20211E]/80 backdrop-blur-xs text-[10px] font-bold uppercase tracking-widest text-white rounded-xs">
                      0{idx + 1} / Capsule
                    </div>
                  </div>

                  {/* Typography & CTA Neatly Below Image */}
                  <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between gap-5 bg-white border-t border-[#353630/20]">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#777B5A] block">
                        {card.tagline}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold font-brand-display uppercase tracking-tight text-[#20211E] group-hover:text-[#777B5A] transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#A6A49C] leading-relaxed">
                        {card.supportingText}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilters((prev) => ({ ...prev, category: card.targetCategory }));
                        navigateTo('women', card.slug);
                        scrollToGrid();
                      }}
                      className="w-full py-3.5 px-4 bg-[#20211E] text-white group-hover:bg-[#777B5A] text-xs font-bold uppercase tracking-widest rounded-xs flex items-center justify-between transition-all duration-300 shadow-xs active:scale-[0.98] cursor-pointer"
                    >
                      <span>{card.buttonText}</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Quick-Switch Subcategory Filters Bar */}
          <div className="pt-6 border-t border-[#353630/20] flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A6A49C] mr-1 hidden sm:inline-block">
              Categories:
            </span>
            <button
              type="button"
              onClick={() => {
                setFilters((prev) => ({ ...prev, category: 'all' }));
                navigateTo('women');
                scrollToGrid();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xs border transition-colors cursor-pointer ${
                filters.category === 'all'
                  ? 'bg-[#20211E] text-white border-[#20211E]'
                  : 'bg-white text-[#20211E] border-[#353630/20] hover:border-[#777B5A]'
              }`}
            >
              All Pieces ({womenBaseProducts.length})
            </button>

            {STANDARD_WOMEN_CATEGORIES.map((cat) => {
              const isActive = filters.category.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      category: isActive ? 'all' : cat,
                    }));
                    scrollToGrid();
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xs border transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#20211E] text-white border-[#20211E]'
                      : 'bg-white text-[#20211E] border-[#353630/20] hover:border-[#777B5A]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Main Product Grid & Interactive Filtering Section */}
      <section ref={gridRef} id="women-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-6 sm:space-y-8">
        {/* Breadcrumb & Header info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#353630/20]">
          <div>
            <nav className="flex items-center gap-1.5 text-xs text-[#A6A49C] mb-1.5" aria-label="Breadcrumb">
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
                  setFilters((prev) => ({ ...prev, category: 'all' }));
                }}
                className={`hover:text-[#20211E] transition-colors cursor-pointer ${
                  filters.category === 'all' ? 'text-[#20211E] font-semibold' : ''
                }`}
              >
                Women
              </button>
              {filters.category !== 'all' && (
                <>
                  <ChevronRight size={12} />
                  <span className="text-[#20211E] font-semibold">{filters.category}</span>
                </>
              )}
            </nav>
            <h2 className="text-2xl sm:text-3xl font-bold font-brand-display uppercase tracking-tight text-[#20211E]">
              {filters.category === 'all' ? "Women's Collection" : filters.category}
            </h2>
            <p className="text-xs sm:text-sm text-[#A6A49C] mt-1">
              Showing <strong className="text-[#20211E] tabular-nums">{filteredProducts.length}</strong> of{' '}
              {womenBaseProducts.length} women&apos;s pieces
            </p>
          </div>
        </div>

        {/* Toolbar: Search, Mobile Drawer Toggle, Sort Dropdown */}
        <FilterToolbar
          filters={filters}
          onChange={setFilters}
          onOpenMobileFilters={() => setMobileFilterOpen(true)}
          totalFilteredCount={filteredProducts.length}
        />

        {/* Active Removable Chips */}
        <ActiveFilterChips
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
        />

        {/* Main 2-Column Split: Sticky Desktop Filter Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start pt-2">
          {/* Desktop Left Sidebar Filters */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            <ProductFilterSidebar
              filters={filters}
              onChange={setFilters}
              onReset={resetFilters}
              baseProducts={womenBaseProducts}
              department="women"
            />
          </div>

          {/* Product Grid Area (3 Columns on Large Screens) */}
          <main className="lg:col-span-3 min-w-0">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <FilterEmptyState onReset={resetFilters} />
            )}
          </main>
        </div>
      </section>

      {/* Mobile Slide-Out Filter Drawer */}
      <MobileFilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
        baseProducts={womenBaseProducts}
        department="women"
        totalResultsCount={filteredProducts.length}
      />
    </div>
  );
}
