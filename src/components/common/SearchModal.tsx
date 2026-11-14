import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, products, navigateTo } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const results = query.trim()
    ? products
        .filter((p) => {
          const q = query.toLowerCase().trim();
          return (
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
          );
        })
        .slice(0, 5)
    : [];

  const handleSelectProduct = (slug: string) => {
    setIsSearchOpen(false);
    navigateTo('product', slug);
  };

  const handleSearchAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearchOpen(false);
    navigateTo('shop', query.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-[#F2EFE7] rounded-sm border border-[#353630]/20 shadow-2xl p-6 z-10 space-y-5">
        <form onSubmit={handleSearchAll} className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6A49C]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search polos, trousers, oversized tees, overshirts..."
            className="w-full pl-11 pr-10 py-3.5 bg-white border border-[#353630]/20 rounded-xs text-sm text-[#20211E] focus:outline-none focus:border-[#777B5A]"
          />
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
          >
            <X size={18} />
          </button>
        </form>

        {/* Quick Suggestions / Results */}
        {query.trim() && (
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#A6A49C]">
              Suggestions ({results.length})
            </h4>

            {results.length === 0 ? (
              <p className="text-xs text-[#A6A49C] py-4 text-center">No matching clothing found for "{query}".</p>
            ) : (
              <div className="divide-y divide-[#353630]/20">
                {results.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod.slug)}
                    className="py-2.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/60 p-2 rounded-xs transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={prod.images[0]} alt={prod.name} className="w-10 h-12 object-cover rounded-xs border border-[#353630]/20" />
                      <div>
                        <p className="text-xs font-semibold text-[#20211E]">{prod.name}</p>
                        <p className="text-[11px] text-[#A6A49C]">{prod.category} &middot; {prod.tagline}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#20211E] tabular-nums">
                      ₹{((prod.salePricePaise || prod.basePricePaise) / 100).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Trending Searches Tags */}
        {!query.trim() && (
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A6A49C]">Popular Searches:</span>
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              {['Everyday Polo', 'Pleated Trousers', 'Heavyweight Tee', 'Mocha Overshirt', 'Complete Outfits'].map(
                (term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="px-3 py-1 bg-white border border-[#353630]/20 text-[#20211E] rounded-xs hover:border-[#777B5A] transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
