import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, User as UserIcon, Menu, X, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { BrandLogo } from './BrandLogo.tsx';

export function Header() {
  const {
    navigateTo,
    currentView,
    currentSlug,
    cartSummary,
    wishlist,
    user,
    settings,
    setIsCartOpen,
    setIsSearchOpen,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cartSummary.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#292F23] border-b border-[#62694F] transition-colors">
      {/* Announcement Bar */}
      {settings?.announcementEnabled && settings.announcementText && (
        <aside
          aria-label="Announcement"
          className="w-full bg-[#292F23] border-b border-[#62694F]/40 text-[#F2EFE7] py-2 px-4 text-center text-xs font-medium tracking-wide flex items-center justify-center gap-2"
        >
          <span>{settings.announcementText}</span>
        </aside>
      )}

      {/* Main Top Bar Contract: Zone 1 (Brand) — Zone 2 (4-5 Nav Links) — Zone 3 (Primary Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-8">
        {/* Mobile menu hamburger toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#F2EFE7] hover:text-[#777B5A] transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Zone 1: Single Brand Element */}
        <button
          type="button"
          onClick={() => {
            navigateTo('home');
            setMobileMenuOpen(false);
          }}
          className="text-left cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#777B5A] rounded py-1 shrink-0"
        >
          <BrandLogo variant="compact" invert={false} />
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#F2EFE7]">
          <button
            type="button"
            onClick={() => navigateTo('shop', 'men')}
            className={`whitespace-nowrap shrink-0 hover:text-[#777B5A] transition-colors py-1 ${
              currentView === 'shop' && (currentSlug === 'men' || !currentSlug) ? 'text-[#777B5A] font-semibold' : ''
            }`}
          >
            Men
          </button>
          <button
            type="button"
            onClick={() => navigateTo('women')}
            className={`whitespace-nowrap shrink-0 hover:text-[#777B5A] transition-colors py-1 ${
              currentView === 'women' ? 'text-[#777B5A] font-semibold' : ''
            }`}
          >
            Women
          </button>
          <button
            type="button"
            onClick={() => navigateTo('shop', 'all')}
            className={`whitespace-nowrap shrink-0 hover:text-[#777B5A] transition-colors py-1 ${
              currentView === 'shop' && currentSlug === 'all' ? 'text-[#777B5A] font-semibold' : ''
            }`}
          >
            All Apparel
          </button>
          <button
            type="button"
            onClick={() => navigateTo('shop', 'new')}
            className={`whitespace-nowrap shrink-0 hover:text-[#777B5A] transition-colors py-1 ${
              currentView === 'shop' && currentSlug === 'new' ? 'text-[#777B5A] font-semibold' : ''
            }`}
          >
            New Arrivals
          </button>
          <button
            type="button"
            onClick={() => navigateTo('shop', 'bestseller')}
            className={`whitespace-nowrap shrink-0 hover:text-[#777B5A] transition-colors py-1 ${
              currentView === 'shop' && currentSlug === 'bestseller' ? 'text-[#777B5A] font-semibold' : ''
            }`}
          >
            Best Sellers
          </button>
          <button
            type="button"
            onClick={() => navigateTo('shop', 'collections')}
            className={`whitespace-nowrap shrink-0 hover:text-[#777B5A] transition-colors py-1 ${
              currentView === 'shop' && currentSlug === 'collections' ? 'text-[#777B5A] font-semibold' : ''
            }`}
          >
            Collections
          </button>
          <button
            type="button"
            onClick={() => navigateTo('about')}
            className={`whitespace-nowrap shrink-0 hover:text-[#777B5A] transition-colors py-1 ${
              currentView === 'about' ? 'text-[#777B5A] font-semibold' : ''
            }`}
          >
            About Us
          </button>
        </nav>

        {/* Zone 3: Primary action controls */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Admin link badge if logged in as admin */}
          {user?.role === 'admin' && (
            <button
              type="button"
              onClick={() => navigateTo('admin')}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-[#20211E] text-white rounded hover:bg-[#777B5A] transition-colors"
            >
              <ShieldCheck size={14} />
              <span>Admin</span>
            </button>
          )}

          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search clothing"
            className="p-2 text-[#F2EFE7] hover:text-[#777B5A] transition-colors rounded-full hover:bg-[#20211E]"
          >
            <Search size={20} />
          </button>

          {/* Wishlist */}
          <button
            type="button"
            onClick={() => navigateTo('account')}
            aria-label={`Wishlist (${wishlist.length} saved)`}
            className="relative p-2 text-[#F2EFE7] hover:text-[#777B5A] transition-colors rounded-full hover:bg-[#20211E]"
          >
            <Heart size={20} className={wishlist.length > 0 ? 'fill-[#777B5A] text-[#777B5A]' : ''} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#777B5A] text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Account */}
          <button
            type="button"
            onClick={() => navigateTo('account')}
            aria-label="Account details"
            className="p-2 text-[#F2EFE7] hover:text-[#777B5A] transition-colors rounded-full hover:bg-[#20211E]"
          >
            <UserIcon size={20} />
          </button>

          {/* Shopping Bag Button */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Shopping bag (${totalCartCount} items)`}
            className="relative flex items-center gap-2.5 px-3.5 py-2 bg-[#505840] text-white rounded hover:bg-[#414936] border border-[#62694F] active:scale-95 transition-all text-xs font-bold tracking-wider uppercase cursor-pointer"
          >
            <ShoppingBag size={17} strokeWidth={1.75} />
            <span className="font-semibold text-xs tracking-wider">BAG</span>
            <span className="tabular-nums font-bold bg-[#777B5A] text-white text-[11px] px-1.5 py-0.2 min-w-[18px] text-center rounded-full">
              {totalCartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#292F23] border-b border-[#62694F] px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-base font-semibold tracking-wide text-[#F2EFE7]">
            <button
              type="button"
              onClick={() => {
                navigateTo('shop', 'men');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 border-b border-[#62694F] hover:text-[#777B5A] flex items-center justify-between"
            >
              <span>Men</span>
              <span className="text-xs text-[#D0C8B7] font-normal">Collection</span>
            </button>
            <button
              type="button"
              onClick={() => {
                navigateTo('women');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 border-b border-[#62694F] hover:text-[#777B5A] flex items-center justify-between ${
                currentView === 'women' ? 'text-[#777B5A]' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span>Women</span>
                <span className="bg-[#777B5A] text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                  New
                </span>
              </div>
              <span className="text-xs text-[#D0C8B7] font-normal">Collection</span>
            </button>
            <button
              type="button"
              onClick={() => {
                navigateTo('shop', 'all');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 border-b border-[#62694F] hover:text-[#777B5A] flex items-center justify-between"
            >
              <span>All Apparel</span>
              <span className="text-xs text-[#D0C8B7] font-normal">Full Catalog</span>
            </button>
            <button
              type="button"
              onClick={() => {
                navigateTo('shop', 'new');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 border-b border-[#353630] hover:text-[#777B5A]"
            >
              New Arrivals
            </button>
            <button
              type="button"
              onClick={() => {
                navigateTo('shop', 'bestseller');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 border-b border-[#353630] hover:text-[#777B5A]"
            >
              Best Sellers
            </button>
            <button
              type="button"
              onClick={() => {
                navigateTo('shop', 'collections');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 border-b border-[#353630] hover:text-[#777B5A]"
            >
              Collections
            </button>
            <button
              type="button"
              onClick={() => {
                navigateTo('about');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 border-b border-[#353630] hover:text-[#777B5A]"
            >
              About OffGrid OG
            </button>
            <button
              type="button"
              onClick={() => {
                navigateTo('account');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 border-b border-[#353630] hover:text-[#777B5A]"
            >
              My Account &amp; Orders
            </button>
            {user?.role === 'admin' && (
              <button
                type="button"
                onClick={() => {
                  navigateTo('admin');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 text-[#777B5A] font-bold flex items-center gap-2"
              >
                <ShieldCheck size={18} />
                Admin Dashboard
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
