import React, { useState } from 'react';
import { ChevronDown, ArrowRight, Check, AlertCircle, ShieldCheck, ArrowUp } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import brandLogoNew from '../../assets/images/brand_logo_new.png';
import brandLogoTagline from '../../assets/images/brand_logo_tagline.svg';

export function Footer() {
  const { navigateTo, setPolicyModal, setSizeGuideOpen, showToast } = useStore();

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  // Newsletter State
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Mobile Accordion State (all open by default on desktop, collapsible on mobile)
  const [mobileOpen, setMobileOpen] = useState<{ [key: string]: boolean }>({
    shop: false,
    about: false,
    help: false,
    touch: true,
  });

  const toggleSection = (key: string) => {
    setMobileOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const validateEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setSubStatus('error');
      setFeedbackMessage('Please enter an email address.');
      showToast('Please enter an email address.', 'error');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setSubStatus('error');
      setFeedbackMessage('Please enter a valid email address (e.g. name@domain.com).');
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    try {
      setSubStatus('loading');
      setFeedbackMessage('');

      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.message && data.message.toLowerCase().includes('already')) {
          setSubStatus('duplicate');
          setFeedbackMessage(data.message);
          showToast(data.message, 'info');
        } else {
          setSubStatus('success');
          setFeedbackMessage(data.message || 'You have successfully subscribed to OffGrid OG private drops.');
          showToast(data.message || 'Subscribed successfully', 'success');
          setEmail('');
        }
      } else {
        setSubStatus('error');
        setFeedbackMessage(data.error || 'Subscription could not be completed. Please try again.');
        showToast(data.error || 'Subscription failed', 'error');
      }
    } catch {
      setSubStatus('error');
      setFeedbackMessage('Network error. Unable to connect to server. Please try again later.');
      showToast('Network error. Please try again later.', 'error');
    }
  };

  return (
    <footer className="w-full bg-[#292F23] text-[#F2EFE7] border-t border-[#62694F] pt-12 lg:pt-16 pb-12 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 5-Area Responsive Grid: Brand (Logo + Statement), SHOP, ABOUT, HELP, STAY IN TOUCH */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
          
          {/* ========================================================= */}
          {/* AREA 1: BRAND (Logo + Statement on Far Left)              */}
          {/* ========================================================= */}
          <div className="lg:col-span-3 border-b border-[#62694F] pb-6 md:border-b-0 md:pb-0 space-y-3.5">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="inline-block text-left group cursor-pointer focus:outline-none"
              aria-label="OffGrid OG - Return to Home"
            >
              <img
                src={brandLogoNew}
                alt="OffGrid OG - Wear Your Own Path"
                className="w-[140px] sm:w-[160px] lg:w-[175px] h-auto object-cover rounded-lg shadow-sm border border-[#62694F]/40 transition-opacity duration-200 group-hover:opacity-90 select-none"
              />
            </button>

            {/* Brand Statements */}
            <div className="space-y-1.5 pt-0.5 text-xs text-[#A6A49C] leading-relaxed max-w-xs">
              <p className="font-semibold text-[#F2EFE7] tracking-tight">
                Wear your own path.
              </p>
              <p className="text-[#A6A49C] text-[11px] sm:text-xs">
                Everyday essentials. Uncommon perspective.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* AREA 2: SHOP                                              */}
          {/* ========================================================= */}
          <div className="lg:col-span-2 border-b border-[#353630] pb-6 md:border-b-0 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('shop')}
              className="w-full flex items-center justify-between text-left md:pointer-events-none group py-1"
              aria-expanded={mobileOpen.shop}
            >
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2EFE7] group-hover:text-[#777B5A] transition-colors">
                SHOP
              </h3>
              <ChevronDown
                size={16}
                className={`text-[#A6A49C] transition-transform duration-200 md:hidden ${
                  mobileOpen.shop ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div className={`mt-3.5 ${mobileOpen.shop ? 'block' : 'hidden'} md:block`}>
              <ul className="space-y-2 text-xs sm:text-sm text-[#A6A49C]">
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('shop', 'men')}
                    className="hover:text-[#20211E] transition-colors text-left py-0.5 inline-block"
                  >
                    Men
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('women')}
                    className="hover:text-[#20211E] transition-colors text-left py-0.5 inline-block"
                  >
                    Women
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('shop', 'new-arrivals')}
                    className="hover:text-[#20211E] transition-colors text-left py-0.5 inline-block"
                  >
                    New Arrivals
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('shop', 'best-sellers')}
                    className="hover:text-[#20211E] transition-colors text-left py-0.5 inline-block"
                  >
                    Best Sellers
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('shop', 'collections')}
                    className="hover:text-[#20211E] transition-colors text-left py-0.5 inline-block"
                  >
                    All Collections
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('shop', 'T-Shirts')}
                    className="hover:text-[#20211E] transition-colors text-left py-0.5 inline-block"
                  >
                    T-Shirts
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('shop', 'Shirts')}
                    className="hover:text-[#20211E] transition-colors text-left py-0.5 inline-block"
                  >
                    Shirts
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('shop', 'Trousers')}
                    className="hover:text-[#20211E] transition-colors text-left py-0.5 inline-block"
                  >
                    Trousers
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('shop', 'Oversized T-Shirts')}
                    className="hover:text-[#20211E] transition-colors text-left py-0.5 inline-block"
                  >
                    Oversized Tees
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* ========================================================= */}
          {/* AREA 3: ABOUT                                             */}
          {/* ========================================================= */}
          <div className="lg:col-span-2 border-b border-[#353630] pb-6 md:border-b-0 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('about')}
              className="w-full flex items-center justify-between text-left md:pointer-events-none group py-1"
              aria-expanded={mobileOpen.about}
            >
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2EFE7] group-hover:text-[#777B5A] transition-colors">
                ABOUT
              </h3>
              <ChevronDown
                size={16}
                className={`text-[#A6A49C] transition-transform duration-200 md:hidden ${
                  mobileOpen.about ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div className={`mt-3.5 ${mobileOpen.about ? 'block' : 'hidden'} md:block space-y-3.5`}>
              <ul className="space-y-2 text-xs sm:text-sm text-[#A6A49C]">
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('about', 'story')}
                    className="hover:text-[#20211E] transition-colors text-left py-0.5 inline-block"
                  >
                    Our Story
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('about', 'brand')}
                    className="hover:text-[#20211E] transition-colors text-left py-0.5 inline-block"
                  >
                    About OffGrid OG
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('about', 'philosophy')}
                    className="hover:text-[#20211E] transition-colors text-left py-0.5 inline-block"
                  >
                    Our Philosophy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('about', 'contact')}
                    className="hover:text-[#20211E] transition-colors text-left py-0.5 inline-block"
                  >
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* ========================================================= */}
          {/* AREA 4: HELP                                              */}
          {/* ========================================================= */}
          <div className="lg:col-span-2 border-b border-[#353630] pb-6 md:border-b-0 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('help')}
              className="w-full flex items-center justify-between text-left md:pointer-events-none group py-1"
              aria-expanded={mobileOpen.help}
            >
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2EFE7] group-hover:text-[#777B5A] transition-colors">
                HELP
              </h3>
              <ChevronDown
                size={16}
                className={`text-[#A6A49C] transition-transform duration-200 md:hidden ${
                  mobileOpen.help ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div className={`mt-3.5 ${mobileOpen.help ? 'block' : 'hidden'} md:block`}>
              <ul className="space-y-2 text-xs sm:text-sm text-[#D0C8B7]">
                <li>
                  <button
                    type="button"
                    onClick={() => setPolicyModal('contact')}
                    className="hover:text-[#F2EFE7] transition-colors text-left py-0.5 inline-block"
                  >
                    Contact Support
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setPolicyModal('faq')}
                    className="hover:text-[#F2EFE7] transition-colors text-left py-0.5 inline-block"
                  >
                    FAQs
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setPolicyModal('shipping')}
                    className="hover:text-[#F2EFE7] transition-colors text-left py-0.5 inline-block"
                  >
                    Shipping &amp; Delivery
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setPolicyModal('returns')}
                    className="hover:text-[#F2EFE7] transition-colors text-left py-0.5 inline-block"
                  >
                    Returns &amp; Exchanges
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('account', 'track')}
                    className="hover:text-[#F2EFE7] transition-colors text-left py-0.5 inline-block"
                  >
                    Track Your Order
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="hover:text-[#F2EFE7] transition-colors text-left py-0.5 inline-block"
                  >
                    Size Guide
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setPolicyModal('privacy')}
                    className="hover:text-[#F2EFE7] transition-colors text-left py-0.5 inline-block"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setPolicyModal('terms')}
                    className="hover:text-[#F2EFE7] transition-colors text-left py-0.5 inline-block"
                  >
                    Terms &amp; Conditions
                  </button>
                </li>
                <li className="pt-2.5 mt-2.5 border-t border-[#62694F]/40 flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => navigateTo('admin', 'login')}
                    className="hover:text-[#F2EFE7] text-[#D0C8B7]/80 hover:text-[#F2EFE7] transition-colors text-left py-0.5 inline-block uppercase text-xs tracking-wider font-semibold cursor-pointer"
                  >
                    ADMIN PANEL
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('admin', 'github')}
                    className="hover:text-[#F2EFE7] text-[#D0C8B7]/70 hover:text-[#777B5A] transition-colors text-left py-0.5 inline-block uppercase text-[11px] tracking-wider font-medium cursor-pointer flex items-center gap-1.5"
                  >
                    <span>GITHUB PUSH</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* ========================================================= */}
          {/* AREA 5: STAY IN TOUCH                                     */}
          {/* ========================================================= */}
          <div className="lg:col-span-3">
            <button
              type="button"
              onClick={() => toggleSection('touch')}
              className="w-full flex items-center justify-between text-left md:pointer-events-none group py-1"
              aria-expanded={mobileOpen.touch}
            >
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2EFE7] group-hover:text-[#777B5A] transition-colors">
                STAY IN TOUCH
              </h3>
              <ChevronDown
                size={16}
                className={`text-[#A6A49C] transition-transform duration-200 md:hidden ${
                  mobileOpen.touch ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div className={`mt-3.5 ${mobileOpen.touch ? 'block' : 'hidden'} md:block space-y-3.5`}>
              <p className="text-xs text-[#A6A49C] leading-relaxed">
                Get early access to new drops, exclusive updates, and the latest from OffGrid OG.
              </p>

              {/* Newsletter Form */}
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (subStatus !== 'idle') setSubStatus('idle');
                    }}
                    placeholder="Enter your email address"
                    aria-label="Email address for newsletter"
                    className="w-full bg-[#20211E] border border-[#353630] px-3.5 py-2 text-xs text-[#F2EFE7] placeholder-[#A6A49C] focus:outline-none focus:border-[#777B5A] transition-colors rounded-none"
                  />
                  <button
                    type="submit"
                    disabled={subStatus === 'loading'}
                    className="shrink-0 px-4 py-2 bg-[#20211E] border border-[#353630] text-[#F2EFE7] hover:bg-[#777B5A] hover:text-white text-xs font-bold uppercase tracking-wider rounded-none transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
                  >
                    <span>{subStatus === 'loading' ? 'Joining...' : 'SUBSCRIBE'}</span>
                    {subStatus !== 'loading' && <ArrowRight size={13} />}
                  </button>
                </div>

                {/* Inline Message Banner */}
                {feedbackMessage && (
                  <div
                    className={`p-2.5 text-[11px] leading-tight flex items-start gap-2 border rounded-none ${
                      subStatus === 'success'
                        ? 'bg-emerald-950/80 text-emerald-200 border-emerald-700'
                        : subStatus === 'duplicate'
                        ? 'bg-[#20211E] text-[#F2EFE7] border-[#353630]'
                        : 'bg-red-950/80 text-red-200 border-red-800'
                    }`}
                  >
                    {subStatus === 'success' && <Check size={14} className="shrink-0 text-emerald-400 mt-0.5" />}
                    {subStatus === 'duplicate' && <ShieldCheck size={14} className="shrink-0 text-[#777B5A] mt-0.5" />}
                    {subStatus === 'error' && <AlertCircle size={14} className="shrink-0 text-red-400 mt-0.5" />}
                    <span>{feedbackMessage}</span>
                  </div>
                )}

                <p className="text-[11px] text-[#A6A49C] leading-tight">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>

              {/* Social Media Links */}
              <div className="pt-1.5 space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#A6A49C] block">
                  Follow Our Journey
                </span>
                <div className="flex items-center gap-2.5">
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/offgridog"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram @offgridog"
                    className="w-8 h-8 rounded-none border border-[#353630] bg-[#20211E] flex items-center justify-center text-[#A6A49C] hover:text-[#F2EFE7] hover:border-[#777B5A] transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>

                  {/* Pinterest */}
                  <a
                    href="https://www.pinterest.com/offgridog"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Pinterest @offgridog"
                    className="w-8 h-8 rounded-none border border-[#353630] bg-[#20211E] flex items-center justify-center text-[#A6A49C] hover:text-[#F2EFE7] hover:border-[#777B5A] transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                    </svg>
                  </a>

                  {/* Twitter / X */}
                  <a
                    href="https://twitter.com/offgridog"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="X (formerly Twitter) @offgridog"
                    className="w-8 h-8 rounded-none border border-[#353630] bg-[#20211E] flex items-center justify-center text-[#A6A49C] hover:text-[#F2EFE7] hover:border-[#777B5A] transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* FOOTER BOTTOM BAR: Copyright, Legal & Back to Top         */}
        {/* ========================================================= */}
        <div className="mt-12 pt-8 border-t border-[#353630] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A6A49C]">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 text-center sm:text-left">
            <p className="font-medium text-[#F2EFE7]/80">
              &copy; {new Date().getFullYear()} OffGrid OG. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-[11px]">
              <button
                type="button"
                onClick={() => setPolicyModal('privacy')}
                className="hover:text-[#F2EFE7] transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span className="text-[#A6A49C]/60">•</span>
              <button
                type="button"
                onClick={() => setPolicyModal('terms')}
                className="hover:text-[#F2EFE7] transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
            </div>
          </div>

          {/* Back to top button */}
          <button
            type="button"
            onClick={scrollToTop}
            className="group relative inline-flex items-center gap-2.5 px-4.5 py-2.5 border border-[#353630] bg-[#20211E] text-[#F2EFE7] hover:bg-[#181916] hover:text-[#F2EFE7] hover:border-[#777B5A] text-xs font-semibold tracking-wider uppercase transition-all duration-300 ease-out hover:-translate-y-1 shadow-xs hover:shadow-md active:scale-95 active:translate-y-0 cursor-pointer focus:outline-none"
            aria-label="Back to top"
          >
            <span className="transition-colors duration-300">Back to Top</span>
            <span className="inline-flex items-center justify-center w-4 h-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
              <ArrowUp
                size={14}
                className="text-[#777B5A] group-hover:text-[#D6C7AE] animate-bounce motion-reduce:animate-none transition-colors duration-300"
              />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
