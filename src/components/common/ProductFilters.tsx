import React, { useState } from 'react';
import {
  Filter,
  X,
  ArrowUpDown,
  Search,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { Product } from '../../types.ts';

// -------------------------------------------------------------
// Filter State Definition
// -------------------------------------------------------------
export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  colors: string[];
  availability: 'all' | 'in_stock' | 'out_of_stock';
  fits: string[];
  search: string;
  sort: 'recommended' | 'newest' | 'popular' | 'price_asc' | 'price_desc' | 'rating_desc';
}

export const INITIAL_FILTER_STATE: FilterState = {
  category: 'all',
  minPrice: 0,
  maxPrice: 8000,
  sizes: [],
  colors: [],
  availability: 'all',
  fits: [],
  search: '',
  sort: 'recommended',
};

// -------------------------------------------------------------
// Category Definitions per Collection
// -------------------------------------------------------------
export const MEN_CATEGORIES = [
  'T-Shirts',
  'Oversized T-Shirts',
  'Shirts',
  'Polos',
  'Trousers',
  'Jeans',
  'Co-ord Sets',
  'Sweatshirts',
  'Jackets',
  'Accessories',
];

export const WOMEN_CATEGORIES = [
  'T-Shirts',
  'Oversized T-Shirts',
  'Shirts',
  'Tops',
  'Trousers',
  'Jeans',
  'Co-ord Sets',
  'Sweatshirts',
  'Jackets',
  'Dresses',
  'Accessories',
];

export const ALL_CATEGORIES = [
  'T-Shirts',
  'Oversized T-Shirts',
  'Shirts',
  'Polos',
  'Tops',
  'Trousers',
  'Jeans',
  'Co-ord Sets',
  'Sweatshirts',
  'Jackets',
  'Dresses',
  'Accessories',
];

// -------------------------------------------------------------
// Colour Swatches Definition with Accessible Aliases & Hex
// -------------------------------------------------------------
export interface ColorSwatchItem {
  name: string;
  hex: string;
  borderClass: string;
  aliases: string[];
}

export const CATALOG_COLOR_SWATCHES: ColorSwatchItem[] = [
  {
    name: 'Black',
    hex: '#101110',
    borderClass: 'border-[#101110]',
    aliases: ['black', 'charcoal black', 'washed black', 'charcoal'],
  },
  {
    name: 'White',
    hex: '#F2EFE7',
    borderClass: 'border-[#353630/20]',
    aliases: ['white', 'off-white', 'washed ecru', 'ecru'],
  },
  {
    name: 'Beige',
    hex: '#D6C7AE',
    borderClass: 'border-[#353630/20]',
    aliases: ['beige', 'sand beige', 'warm ivory', 'natural ivory', 'vintage cream', 'ivory', 'cream', 'sand'],
  },
  {
    name: 'Olive',
    hex: '#777B5A',
    borderClass: 'border-[#777B5A]',
    aliases: ['olive', 'olive earth', 'sage', 'green'],
  },
  {
    name: 'Brown',
    hex: '#796653',
    borderClass: 'border-[#796653]',
    aliases: ['brown', 'mocha brown', 'chestnut brown', 'mocha', 'chestnut'],
  },
  {
    name: 'Grey',
    hex: '#A6A49C',
    borderClass: 'border-[#A6A49C]',
    aliases: ['grey', 'gray', 'heather grey', 'slate'],
  },
  {
    name: 'Navy',
    hex: '#1E293B',
    borderClass: 'border-[#1E293B]',
    aliases: ['navy', 'deep navy', 'blue', 'washed indigo', 'indigo'],
  },
];

// -------------------------------------------------------------
// Fits / Product Types
// -------------------------------------------------------------
export const FIT_OPTIONS = [
  { id: 'Oversized Fit', label: 'Oversized Fit', tagKeyword: 'oversized' },
  { id: 'Regular Fit', label: 'Regular Fit', tagKeyword: 'regular' },
  { id: 'Relaxed Fit', label: 'Relaxed Fit', tagKeyword: 'relaxed' },
  { id: 'Slim Fit', label: 'Slim Fit', tagKeyword: 'slim' },
  { id: 'Unisex', label: 'Unisex', tagKeyword: 'unisex' },
];

export const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

// Quick Price Presets
export const PRICE_PRESETS = [
  { id: 'all', label: 'All Prices', min: 0, max: 8000 },
  { id: 'under_999', label: 'Under ₹999', min: 0, max: 999 },
  { id: '999_1499', label: '₹999–₹1,499', min: 999, max: 1499 },
  { id: '1500_1999', label: '₹1,500–₹1,999', min: 1500, max: 1999 },
  { id: '2000_plus', label: '₹2,000+', min: 2000, max: 8000 },
];

// -------------------------------------------------------------
// Product Category Matching Helper
// -------------------------------------------------------------
export function matchProductCategory(product: Product, targetCategory: string): boolean {
  if (targetCategory === 'all') return true;

  const target = targetCategory.toLowerCase().trim();
  const prodCat = (product.category || '').toLowerCase();
  const prodName = (product.name || '').toLowerCase();
  const prodFit = (product.fit || '').toLowerCase();
  const prodTags = (product.tags || []).map((t) => t.toLowerCase());
  const prodColl = (product.collectionSlug || '').toLowerCase();

  if (target === 'oversized t-shirts' || target === 'oversized tees') {
    const isTee =
      prodCat.includes('shirt') ||
      prodCat.includes('top') ||
      prodTags.includes('tee') ||
      prodTags.includes('t-shirt');
    const isOversized =
      prodName.includes('oversized') ||
      prodFit.includes('oversized') ||
      prodTags.includes('oversized') ||
      prodTags.includes('oversized-tees') ||
      prodColl.includes('oversized');
    return isTee && isOversized;
  }

  if (target === 't-shirts') {
    return (
      prodCat === 't-shirts' ||
      prodTags.includes('t-shirt') ||
      prodTags.includes('tee') ||
      (prodCat === 't-shirts & tops' && !prodName.includes('cropped'))
    );
  }

  if (target === 'tops') {
    return (
      prodTags.includes('tops') ||
      prodTags.includes('cropped') ||
      prodName.toLowerCase().includes('top') ||
      (prodCat === 't-shirts & tops' && prodName.toLowerCase().includes('cropped'))
    );
  }

  if (target === 'shirts') {
    return (
      (prodCat === 'shirts' || prodCat === 'overshirts' || prodTags.includes('shirt') || prodTags.includes('oxford')) &&
      !prodCat.includes('t-shirt') &&
      !prodTags.includes('tee')
    );
  }

  if (target === 'polos') {
    return prodCat === 'polos' || prodTags.includes('polo');
  }

  if (target === 'trousers') {
    return prodCat === 'trousers' || prodTags.includes('trousers') || prodTags.includes('pleated');
  }

  if (target === 'jeans') {
    return prodCat === 'jeans' || prodTags.includes('jeans') || prodTags.includes('denim');
  }

  if (target === 'co-ord sets' || target === 'complete outfits') {
    return (
      prodCat === 'co-ord sets' ||
      prodCat === 'complete outfits' ||
      prodTags.includes('coord') ||
      prodTags.includes('set') ||
      prodTags.includes('outfit')
    );
  }

  if (target === 'sweatshirts') {
    return (
      prodCat === 'sweatshirts' ||
      prodTags.includes('sweatshirt') ||
      prodTags.includes('crewneck') ||
      prodTags.includes('fleece')
    );
  }

  if (target === 'jackets') {
    return (
      prodCat === 'jackets' ||
      prodCat === 'outerwear' ||
      prodTags.includes('jacket') ||
      prodTags.includes('blazer') ||
      prodTags.includes('bomber')
    );
  }

  if (target === 'dresses') {
    return prodCat === 'dresses' || prodTags.includes('dress');
  }

  if (target === 'accessories') {
    return (
      prodCat === 'accessories' ||
      prodTags.includes('accessories') ||
      prodTags.includes('bag') ||
      prodTags.includes('tote') ||
      prodTags.includes('cap') ||
      prodTags.includes('socks')
    );
  }

  return prodCat === target || prodTags.includes(target);
}

// -------------------------------------------------------------
// Product Color Matching Helper
// -------------------------------------------------------------
export function matchProductColor(product: Product, selectedColorNames: string[]): boolean {
  if (selectedColorNames.length === 0) return true;

  const validAliases = selectedColorNames.flatMap((colorName) => {
    const swatch = CATALOG_COLOR_SWATCHES.find((s) => s.name.toLowerCase() === colorName.toLowerCase());
    return swatch ? swatch.aliases : [colorName.toLowerCase()];
  });

  return product.variants.some((v) => {
    const variantColorLower = v.color.toLowerCase();
    return validAliases.some((alias) => variantColorLower.includes(alias) || alias.includes(variantColorLower));
  });
}

// -------------------------------------------------------------
// Product Fit Matching Helper
// -------------------------------------------------------------
export function matchProductFit(product: Product, selectedFits: string[]): boolean {
  if (selectedFits.length === 0) return true;

  return selectedFits.some((fitLabel) => {
    const fitLower = fitLabel.toLowerCase();
    const prodFitLower = (product.fit || '').toLowerCase();
    const prodTags = (product.tags || []).map((t) => t.toLowerCase());

    if (fitLower.includes('unisex')) {
      return product.department === 'unisex' || prodTags.includes('unisex');
    }
    if (fitLower.includes('oversized')) {
      return prodFitLower.includes('oversized') || prodTags.includes('oversized');
    }
    if (fitLower.includes('regular')) {
      return prodFitLower.includes('regular') || prodTags.includes('regular');
    }
    if (fitLower.includes('relaxed')) {
      return prodFitLower.includes('relaxed') || prodTags.includes('relaxed');
    }
    if (fitLower.includes('slim')) {
      return prodFitLower.includes('slim') || prodTags.includes('slim');
    }
    return prodFitLower.includes(fitLower);
  });
}

// -------------------------------------------------------------
// Master Filter & Sort Engine
// -------------------------------------------------------------
export function filterAndSortCatalog(
  products: Product[],
  filters: FilterState,
  department: 'men' | 'women' | 'all' | 'unisex' = 'all'
): Product[] {
  let list = [...products].filter((p) => p.status === 'published');

  // 1. Department Scope
  if (department === 'unisex') {
    list = list.filter(
      (p) =>
        p.department === 'unisex' ||
        p.tags.some((t) => t.toLowerCase() === 'unisex') ||
        p.id.toLowerCase().includes('unisex')
    );
  } else if (department === 'women') {
    list = list.filter(
      (p) =>
        (p.department === 'women' ||
          (p.department === 'unisex' && !p.id.includes('_men_')) ||
          (!p.department && (p.id.includes('_wmn_') || p.tags.some((t) => t.toLowerCase() === 'women')))) &&
        !p.id.includes('_men_')
    );
  } else if (department === 'men') {
    list = list.filter(
      (p) =>
        (p.department === 'men' ||
          p.department === 'unisex' ||
          (!p.department && !p.id.includes('_wmn_') && !p.tags.some((t) => t.toLowerCase() === 'women'))) &&
        !p.id.includes('_wmn_') &&
        !p.tags.some((t) => t.toLowerCase() === 'women')
    );
  }

  // 2. Category
  if (filters.category && filters.category !== 'all') {
    list = list.filter((p) => matchProductCategory(p, filters.category));
  }

  // 3. Price Range (in INR)
  list = list.filter((p) => {
    const priceINR = (p.salePricePaise || p.basePricePaise) / 100;
    return priceINR >= filters.minPrice && priceINR <= filters.maxPrice;
  });

  // 4. Sizes (if any sizes selected, product must have at least one selected size in stock)
  if (filters.sizes.length > 0) {
    list = list.filter((p) =>
      p.variants.some((v) => filters.sizes.includes(v.size) && v.stockQuantity > 0)
    );
  }

  // 5. Colors
  if (filters.colors.length > 0) {
    list = list.filter((p) => matchProductColor(p, filters.colors));
  }

  // 6. Availability
  if (filters.availability === 'in_stock') {
    list = list.filter((p) => p.variants.some((v) => v.stockQuantity > 0));
  } else if (filters.availability === 'out_of_stock') {
    list = list.filter((p) => p.variants.every((v) => v.stockQuantity <= 0));
  }

  // 7. Product Type / Fit
  if (filters.fits.length > 0) {
    list = list.filter((p) => matchProductFit(p, filters.fits));
  }

  // 8. Search query
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.fit.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // 9. Sorting
  if (filters.sort === 'newest') {
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (filters.sort === 'price_asc') {
    list.sort((a, b) => (a.salePricePaise || a.basePricePaise) - (b.salePricePaise || b.basePricePaise));
  } else if (filters.sort === 'price_desc') {
    list.sort((a, b) => (b.salePricePaise || b.basePricePaise) - (a.salePricePaise || a.basePricePaise));
  } else if (filters.sort === 'popular') {
    list.sort(
      (a, b) =>
        (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) ||
        (b.reviewCount || 0) - (a.reviewCount || 0)
    );
  } else if (filters.sort === 'rating_desc') {
    list.sort(
      (a, b) =>
        (b.rating || 0) - (a.rating || 0) ||
        (b.reviewCount || 0) - (a.reviewCount || 0)
    );
  } else {
    // 'recommended': Featured and bestsellers first, then newest
    list.sort((a, b) => {
      const scoreB = (b.isFeatured ? 2 : 0) + (b.isBestSeller ? 1 : 0);
      const scoreA = (a.isFeatured ? 2 : 0) + (a.isBestSeller ? 1 : 0);
      if (scoreB !== scoreA) return scoreB - scoreA;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  return list;
}

// -------------------------------------------------------------
// Component: Desktop Sidebar
// -------------------------------------------------------------
interface FilterSidebarProps {
  filters: FilterState;
  onChange: (updater: (prev: FilterState) => FilterState) => void;
  onReset: () => void;
  baseProducts: Product[];
  department: 'men' | 'women' | 'unisex' | 'all';
  className?: string;
}

export function ProductFilterSidebar({
  filters,
  onChange,
  onReset,
  baseProducts,
  department,
  className = '',
}: FilterSidebarProps) {
  // Determine relevant categories for this department
  const categoriesList =
    department === 'men'
      ? MEN_CATEGORIES
      : department === 'women'
      ? WOMEN_CATEGORIES
      : ALL_CATEGORIES;

  // Toggle single size in array
  const toggleSize = (size: string) => {
    onChange((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
      };
    });
  };

  // Toggle single color in array
  const toggleColor = (colorName: string) => {
    onChange((prev) => {
      const exists = prev.colors.includes(colorName);
      return {
        ...prev,
        colors: exists ? prev.colors.filter((c) => c !== colorName) : [...prev.colors, colorName],
      };
    });
  };

  // Toggle single fit in array
  const toggleFit = (fitId: string) => {
    onChange((prev) => {
      const exists = prev.fits.includes(fitId);
      return {
        ...prev,
        fits: exists ? prev.fits.filter((f) => f !== fitId) : [...prev.fits, fitId],
      };
    });
  };

  // Calculate dynamic availability for sizes within the base products
  const isSizeAvailable = (size: string): boolean => {
    return baseProducts.some((p) =>
      p.variants.some((v) => v.size === size && v.stockQuantity > 0)
    );
  };

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 8000 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.availability !== 'all' ||
    filters.fits.length > 0 ||
    filters.search.length > 0;

  return (
    <aside
      className={`space-y-7 p-6 bg-[#181916] rounded-xs border border-[#353630] shadow-xs text-[#F2EFE7] ${className}`}
      aria-label="Product Filters"
    >
      {/* 1. Header & Reset Action */}
      <div className="flex items-center justify-between pb-4 border-b border-[#353630]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-[#777B5A]" />
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2EFE7]">
            Filters
          </h2>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-[#777B5A]" title="Active filters applied" />
          )}
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] font-bold text-[#777B5A] hover:text-[#F2EFE7] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 2. Category Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#F2EFE7]">
            Category
          </h3>
          <span className="text-[11px] text-[#A6A49C] tabular-nums">
            {categoriesList.length} Categories
          </span>
        </div>

        <div className="space-y-1 max-h-64 overflow-y-auto pr-1 text-xs">
          <button
            type="button"
            onClick={() => onChange((prev) => ({ ...prev, category: 'all' }))}
            className={`w-full text-left py-2 px-3 rounded-xs transition-colors flex items-center justify-between cursor-pointer ${
              filters.category === 'all'
                ? 'bg-[#20211E] text-white font-bold border border-[#777B5A]'
                : 'text-[#F2EFE7] hover:bg-[#20211E] border border-transparent'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[11px] tabular-nums opacity-80">{baseProducts.length}</span>
          </button>

          {categoriesList.map((cat) => {
            const count = baseProducts.filter((p) => matchProductCategory(p, cat)).length;
            const isSelected = filters.category.toLowerCase() === cat.toLowerCase();

            return (
              <button
                key={cat}
                type="button"
                onClick={() =>
                  onChange((prev) => ({
                    ...prev,
                    category: isSelected ? 'all' : cat,
                  }))
                }
                className={`w-full text-left py-2 px-3 rounded-xs transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#20211E] text-white font-bold border border-[#777B5A]'
                    : 'text-[#F2EFE7] hover:bg-[#20211E] border border-transparent'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[11px] tabular-nums ${isSelected ? 'text-white/80' : 'text-[#A6A49C]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-[#353630]" />

      {/* 3. Price Range Filter with Inputs & Quick Selection Presets */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#F2EFE7]">
            Price Range
          </h3>
          <span className="text-xs font-bold text-[#777B5A] tabular-nums">
            ₹{filters.minPrice.toLocaleString('en-IN')} – ₹{filters.maxPrice.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Min / Max Numeric Inputs */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#A6A49C] block mb-1">
              Min Price
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A6A49C] text-xs">₹</span>
              <input
                type="number"
                min="0"
                max={filters.maxPrice}
                step="100"
                value={filters.minPrice}
                onChange={(e) => {
                  const val = Math.max(0, Number(e.target.value) || 0);
                  onChange((prev) => ({ ...prev, minPrice: Math.min(val, prev.maxPrice) }));
                }}
                className="w-full pl-6 pr-2 py-1.5 bg-[#20211E] border border-[#353630] rounded-xs text-xs font-semibold text-[#F2EFE7] focus:border-[#777B5A] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-[#A6A49C] block mb-1">
              Max Price
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A6A49C] text-xs">₹</span>
              <input
                type="number"
                min={filters.minPrice}
                max="10000"
                step="100"
                value={filters.maxPrice}
                onChange={(e) => {
                  const val = Math.max(filters.minPrice, Number(e.target.value) || 0);
                  onChange((prev) => ({ ...prev, maxPrice: val }));
                }}
                className="w-full pl-6 pr-2 py-1.5 bg-[#20211E] border border-[#353630] rounded-xs text-xs font-semibold text-[#F2EFE7] focus:border-[#777B5A] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Tactile Range Slider for Smooth Adjustments */}
        <div className="pt-1">
          <input
            type="range"
            min="0"
            max="8000"
            step="100"
            value={filters.maxPrice}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                maxPrice: Math.max(prev.minPrice, Number(e.target.value)),
              }))
            }
            className="w-full accent-[#777B5A] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#A6A49C] mt-1 tabular-nums">
            <span>₹0</span>
            <span>₹4,000</span>
            <span>₹8,000+</span>
          </div>
        </div>

        {/* Quick Selection Presets */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A6A49C] block">
            Quick Presets
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {PRICE_PRESETS.map((preset) => {
              const isActive =
                filters.minPrice === preset.min && filters.maxPrice === preset.max;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      minPrice: preset.min,
                      maxPrice: preset.max,
                    }))
                  }
                  className={`py-1.5 px-2 text-[11px] font-semibold rounded-xs border text-center transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#101110] text-[#F2EFE7] border-[#777B5A]'
                      : 'bg-[#20211E] text-[#F2EFE7] border-[#353630] hover:border-[#777B5A]'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <hr className="border-[#353630]" />

      {/* 4. Size Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#F2EFE7]">
            Size
          </h3>
          {filters.sizes.length > 0 && (
            <button
              type="button"
              onClick={() => onChange((prev) => ({ ...prev, sizes: [] }))}
              className="text-[10px] text-[#777B5A] font-bold hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {ALL_SIZES.map((size) => {
            const isSelected = filters.sizes.includes(size);
            const available = isSizeAvailable(size);

            return (
              <button
                key={size}
                type="button"
                disabled={!available}
                onClick={() => toggleSize(size)}
                title={
                  !available
                    ? `${size} is currently out of stock`
                    : isSelected
                    ? `Remove size ${size}`
                    : `Filter by size ${size}`
                }
                className={`py-2 text-xs font-bold rounded-xs border text-center transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#F2EFE7] text-[#101110] border-[#F2EFE7] shadow-xs'
                    : !available
                    ? 'bg-[#181916] text-[#A6A49C] border-[#353630] cursor-not-allowed line-through opacity-40'
                    : 'bg-[#20211E] text-[#F2EFE7] border-[#353630] hover:border-[#777B5A] hover:bg-[#20211E]'
                }`}
              >
                <span>{size}</span>
                {isSelected && (
                  <Check size={11} className="absolute top-1 right-1 text-[#101110]" />
                )}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-[#A6A49C] leading-tight">
          Select one or multiple sizes. Crossed-out sizes have 0 available inventory in the current view.
        </p>
      </div>

      <hr className="border-[#353630]" />

      {/* 5. Colour Filter with Visual Swatches & Accessible Names */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#F2EFE7]">
            Colour Palette
          </h3>
          {filters.colors.length > 0 && (
            <button
              type="button"
              onClick={() => onChange((prev) => ({ ...prev, colors: [] }))}
              className="text-[10px] text-[#777B5A] font-bold hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          {CATALOG_COLOR_SWATCHES.map((swatch) => {
            const isSelected = filters.colors.includes(swatch.name);
            const count = baseProducts.filter((p) => matchProductColor(p, [swatch.name])).length;

            return (
              <button
                key={swatch.name}
                type="button"
                onClick={() => toggleColor(swatch.name)}
                className={`w-full py-1.5 px-2 rounded-xs border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#20211E] border-[#777B5A] font-bold'
                    : 'border-transparent hover:bg-[#20211E]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-4 h-4 rounded-full border shadow-xs flex items-center justify-center shrink-0 ${swatch.borderClass}`}
                    style={{ backgroundColor: swatch.hex }}
                  >
                    {isSelected && (
                      <Check
                        size={10}
                        className={
                          swatch.name === 'White' || swatch.name === 'Beige'
                            ? 'text-[#20211E]'
                            : 'text-white'
                        }
                      />
                    )}
                  </span>
                  <span className="text-[#F2EFE7]">{swatch.name}</span>
                </div>
                <span className="text-[11px] text-[#A6A49C] tabular-nums">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-[#353630]" />

      {/* 6. Product Type / Fit Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#F2EFE7]">
            Product Type
          </h3>
          {filters.fits.length > 0 && (
            <button
              type="button"
              onClick={() => onChange((prev) => ({ ...prev, fits: [] }))}
              className="text-[10px] text-[#777B5A] font-bold hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          {FIT_OPTIONS.map((fit) => {
            const isSelected = filters.fits.includes(fit.id);
            const count = baseProducts.filter((p) => matchProductFit(p, [fit.id])).length;

            return (
              <button
                key={fit.id}
                type="button"
                onClick={() => toggleFit(fit.id)}
                className={`w-full py-1.5 px-2 rounded-xs text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#20211E] text-white font-bold border border-[#777B5A]'
                    : 'hover:bg-[#20211E] text-[#F2EFE7]'
                }`}
              >
                <span>{fit.label}</span>
                <span className={`text-[11px] tabular-nums ${isSelected ? 'text-white/80' : 'text-[#A6A49C]'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-[#353630]" />

      {/* 7. Availability Filter */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#F2EFE7]">
          Availability
        </h3>
        <div className="space-y-1.5 text-xs font-medium">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'in_stock', label: 'In Stock Only' },
            { id: 'out_of_stock', label: 'Out of Stock' },
          ].map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-2 py-1 px-1 rounded-xs cursor-pointer hover:text-[#777B5A] text-[#F2EFE7]"
            >
              <input
                type="radio"
                name="availability"
                checked={filters.availability === item.id}
                onChange={() =>
                  onChange((prev) => ({
                    ...prev,
                    availability: item.id as any,
                  }))
                }
                className="accent-[#777B5A] w-3.5 h-3.5 cursor-pointer"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

// -------------------------------------------------------------
// Component: Mobile Slide-Out Filter Drawer
// -------------------------------------------------------------
interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (updater: (prev: FilterState) => FilterState) => void;
  onReset: () => void;
  baseProducts: Product[];
  department: 'men' | 'women' | 'unisex' | 'all';
  totalResultsCount: number;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset,
  baseProducts,
  department,
  totalResultsCount,
}: MobileFilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop with subtle blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-[#F2EFE7] h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-white border-b border-[#353630/20] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#777B5A]" />
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[#20211E]">
              Filter & Refine
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#20211E] hover:text-[#777B5A] rounded-full hover:bg-[#F2EFE7] transition-colors cursor-pointer"
            aria-label="Close filters drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <ProductFilterSidebar
            filters={filters}
            onChange={onChange}
            onReset={onReset}
            baseProducts={baseProducts}
            department={department}
            className="p-4"
          />
        </div>

        {/* Drawer Sticky Footer with Quick Actions */}
        <div className="p-4 bg-white border-t border-[#353630/20] space-y-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 bg-[#20211E] text-white text-xs font-bold uppercase tracking-widest rounded-xs hover:bg-[#777B5A] transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Show Results ({totalResultsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onReset();
            }}
            className="w-full py-2 bg-transparent text-[#A6A49C] hover:text-[#20211E] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: Active Filter Chips Bar (Pill-Free, Elegant)
// -------------------------------------------------------------
interface ActiveFilterChipsProps {
  filters: FilterState;
  onChange: (updater: (prev: FilterState) => FilterState) => void;
  onReset: () => void;
}

export function ActiveFilterChips({ filters, onChange, onReset }: ActiveFilterChipsProps) {
  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 8000 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.availability !== 'all' ||
    filters.fits.length > 0 ||
    filters.search.length > 0;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 pb-1 text-xs">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#A6A49C] mr-1">
        Active Filters:
      </span>

      {/* Category */}
      {filters.category !== 'all' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#20211E] text-white rounded-xs text-xs font-semibold shadow-xs">
          <span>{filters.category}</span>
          <button
            type="button"
            onClick={() => onChange((prev) => ({ ...prev, category: 'all' }))}
            className="hover:text-red-300 ml-0.5 cursor-pointer"
            aria-label={`Remove category filter ${filters.category}`}
          >
            <X size={12} />
          </button>
        </span>
      )}

      {/* Price */}
      {(filters.minPrice > 0 || filters.maxPrice < 8000) && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#353630/20] text-[#20211E] rounded-xs text-xs font-semibold shadow-xs">
          <span>₹{filters.minPrice.toLocaleString('en-IN')} – ₹{filters.maxPrice.toLocaleString('en-IN')}</span>
          <button
            type="button"
            onClick={() => onChange((prev) => ({ ...prev, minPrice: 0, maxPrice: 8000 }))}
            className="hover:text-red-600 ml-0.5 cursor-pointer"
            aria-label="Reset price filter"
          >
            <X size={12} />
          </button>
        </span>
      )}

      {/* Sizes */}
      {filters.sizes.map((s) => (
        <span
          key={s}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#353630/20] text-[#20211E] rounded-xs text-xs font-semibold shadow-xs"
        >
          <span>Size: {s}</span>
          <button
            type="button"
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                sizes: prev.sizes.filter((x) => x !== s),
              }))
            }
            className="hover:text-red-600 ml-0.5 cursor-pointer"
            aria-label={`Remove size ${s}`}
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {/* Colors */}
      {filters.colors.map((c) => (
        <span
          key={c}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#353630/20] text-[#20211E] rounded-xs text-xs font-semibold shadow-xs"
        >
          <span>Color: {c}</span>
          <button
            type="button"
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                colors: prev.colors.filter((x) => x !== c),
              }))
            }
            className="hover:text-red-600 ml-0.5 cursor-pointer"
            aria-label={`Remove color ${c}`}
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {/* Fits */}
      {filters.fits.map((f) => (
        <span
          key={f}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#353630/20] text-[#20211E] rounded-xs text-xs font-semibold shadow-xs"
        >
          <span>Fit: {f}</span>
          <button
            type="button"
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                fits: prev.fits.filter((x) => x !== f),
              }))
            }
            className="hover:text-red-600 ml-0.5 cursor-pointer"
            aria-label={`Remove fit ${f}`}
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {/* Availability */}
      {filters.availability !== 'all' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#353630/20] text-[#20211E] rounded-xs text-xs font-semibold shadow-xs">
          <span>{filters.availability === 'in_stock' ? 'In Stock Only' : 'Out of Stock'}</span>
          <button
            type="button"
            onClick={() => onChange((prev) => ({ ...prev, availability: 'all' }))}
            className="hover:text-red-600 ml-0.5 cursor-pointer"
            aria-label="Remove availability filter"
          >
            <X size={12} />
          </button>
        </span>
      )}

      {/* Search */}
      {filters.search && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#353630/20] text-[#20211E] rounded-xs text-xs font-semibold shadow-xs">
          <span>&ldquo;{filters.search}&rdquo;</span>
          <button
            type="button"
            onClick={() => onChange((prev) => ({ ...prev, search: '' }))}
            className="hover:text-red-600 ml-0.5 cursor-pointer"
            aria-label="Clear search query"
          >
            <X size={12} />
          </button>
        </span>
      )}

      {/* Clear All Button */}
      <button
        type="button"
        onClick={onReset}
        className="text-[#777B5A] font-bold hover:underline flex items-center gap-1 ml-2 text-xs cursor-pointer"
      >
        <RotateCcw size={12} />
        <span>Clear All</span>
      </button>
    </div>
  );
}

// -------------------------------------------------------------
// Component: Filter Toolbar (Search + Mobile Drawer + Sort)
// -------------------------------------------------------------
interface FilterToolbarProps {
  filters: FilterState;
  onChange: (updater: (prev: FilterState) => FilterState) => void;
  onOpenMobileFilters: () => void;
  totalFilteredCount: number;
}

export function FilterToolbar({
  filters,
  onChange,
  onOpenMobileFilters,
  totalFilteredCount,
}: FilterToolbarProps) {
  const activeCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 8000 ? 1 : 0) +
    filters.sizes.length +
    filters.colors.length +
    (filters.availability !== 'all' ? 1 : 0) +
    filters.fits.length +
    (filters.search.length > 0 ? 1 : 0);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-white rounded-xs border border-[#353630/20] shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6A49C]" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange((prev) => ({ ...prev, search: e.target.value }))}
          placeholder="Search garments, textures, cuts, fabrics..."
          className="w-full pl-9 pr-8 py-2 text-xs bg-[#F2EFE7] border border-[#353630/20] rounded-xs focus:outline-none focus:border-[#20211E] text-[#20211E] placeholder:text-[#A6A49C]"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onChange((prev) => ({ ...prev, search: '' }))}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A6A49C] hover:text-[#20211E] cursor-pointer"
            aria-label="Clear search text"
          >
            <X size={13} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2.5 shrink-0 justify-between sm:justify-end">
        {/* Mobile Filter Drawer Button */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="lg:hidden flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-[#20211E] text-white rounded-xs hover:bg-[#777B5A] transition-colors cursor-pointer"
        >
          <Filter size={13} />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-white text-[#20211E] text-[10px] font-extrabold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        {/* Working Sort Dropdown with actual product attributes */}
        <div className="flex items-center gap-2 text-xs">
          <ArrowUpDown size={13} className="text-[#A6A49C] hidden sm:block" />
          <span className="text-[#A6A49C] font-medium hidden sm:inline">Sort:</span>
          <select
            value={filters.sort}
            onChange={(e) => onChange((prev) => ({ ...prev, sort: e.target.value as any }))}
            aria-label="Sort product catalog"
            className="px-3 py-2 bg-[#F2EFE7] border border-[#353630/20] rounded-xs text-xs font-semibold text-[#20211E] focus:outline-none focus:border-[#20211E] cursor-pointer"
          >
            <option value="recommended">Recommended</option>
            <option value="newest">Newest Arrivals</option>
            <option value="popular">Best Sellers</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Customer Rating</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: Empty Filter Results State
// -------------------------------------------------------------
export function FilterEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="py-20 text-center space-y-4 bg-white rounded-xs border border-[#353630/20] p-8 max-w-2xl mx-auto shadow-xs">
      <div className="w-12 h-12 rounded-full bg-[#F2EFE7] border border-[#353630/20] text-[#777B5A] flex items-center justify-center mx-auto">
        <Filter size={20} />
      </div>
      <h3 className="text-base font-bold font-brand-display uppercase tracking-tight text-[#20211E]">
        No garments match your active filters
      </h3>
      <p className="text-xs text-[#A6A49C] max-w-sm mx-auto leading-relaxed">
        Try broadening your price range, clearing size or colour restrictions, or resetting categories to explore all available styles.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="px-6 py-2.5 bg-[#20211E] text-white hover:bg-[#777B5A] text-xs font-bold uppercase tracking-widest rounded-xs transition-colors shadow-xs cursor-pointer"
      >
        Reset All Filters
      </button>
    </div>
  );
}
