import React from 'react';
import { ArrowRight, RotateCcw, Shield, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export function HeroSection() {
  const { navigateTo } = useStore();

  const heroImage = '/src/assets/images/hero_find_your_way_1792064208834.jpg';

  return (
    <section className="relative w-full overflow-hidden bg-[#101110]">
      {/* Full-bleed Full-Width Cinematic Hero (75-85vh) */}
      <div className="relative w-full min-h-[580px] sm:min-h-[640px] h-[78vh] lg:h-[82vh] lg:min-h-[680px] lg:max-h-[860px] flex items-center">
        {/* Full-width Edge-to-Edge Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={heroImage}
            alt="OffGrid OG Campaign - Male and female models in oversized black t-shirts and relaxed trousers in architectural space"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-[center_32%] sm:object-[center_35%]"
          />
          {/* Subtle soft dark gradient on left side for text readability without obscuring photography */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent sm:from-black/70 sm:via-black/30 sm:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15" />
        </div>

        {/* Content Container Overlaid & Vertically Centered */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 flex flex-col justify-center">
          <div className="max-w-xl lg:max-w-2xl space-y-4 sm:space-y-5 text-left">
            {/* Top Tag: NEW ARRIVALS · SS 2026 */}
            <div className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#D6C7AE] uppercase">
              NEW ARRIVALS &nbsp;&middot;&nbsp; SS 2026
            </div>

            {/* Headline: FIND YOUR OWN WAY. */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white font-brand-display uppercase leading-[0.92] drop-shadow-sm">
              FIND YOUR<br />OWN WAY.
            </h1>

            {/* Description: Everyday essentials. Uncommon perspective. */}
            <p className="text-base sm:text-lg lg:text-xl text-[#F2EFE7]/90 font-normal leading-relaxed max-w-lg drop-shadow-sm pt-1">
              Everyday essentials. Uncommon perspective.
            </p>

            {/* CTA Buttons: SHOP THE COLLECTION & EXPLORE OFFGRID */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              {/* Primary Black Button */}
              <button
                type="button"
                onClick={() => navigateTo('shop')}
                className="h-16 px-8 bg-[#101110] hover:bg-[#20211E] text-white rounded-xs transition-all border border-white/10 shadow-lg flex items-center justify-between sm:justify-center gap-4 group cursor-pointer"
              >
                <div className="text-left text-xs font-bold tracking-[0.16em] uppercase leading-tight">
                  <div>SHOP THE</div>
                  <div>COLLECTION</div>
                </div>
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform ml-1" />
              </button>

              {/* Secondary Translucent Outline Button */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('brand-story');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else navigateTo('about');
                }}
                className="h-16 px-8 bg-black/25 hover:bg-black/40 text-white border border-white/40 hover:border-white text-xs font-bold tracking-[0.16em] uppercase rounded-xs backdrop-blur-xs transition-all flex items-center justify-center text-center leading-tight cursor-pointer"
              >
                <div>
                  <div>EXPLORE</div>
                  <div>OFFGRID</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Value Pillars Bar */}
      <div className="w-full bg-[#181916] border-t border-b border-[#353630] py-4.5 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-xs sm:text-sm font-normal text-[#F2EFE7]">
            <div className="flex items-center gap-3">
              <Truck size={19} strokeWidth={1.5} className="text-[#777B5A] shrink-0" />
              <span>Free Delivery Above ₹1,999</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Cotton Boll Icon */}
              <svg className="w-[19px] h-[19px] text-[#777B5A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-4m0 0a4 4 0 0 1-4-4c0-1.8.8-3.2 2-4 .5-.8 1.2-1.5 2-2 .8.5 1.5 1.2 2 2 1.2.8 2 2.2 2 4a4 4 0 0 1-4 4Zm-5-7a3.5 3.5 0 0 1 3-3.4M17 14a3.5 3.5 0 0 0-3-3.4" />
              </svg>
              <span>Heavyweight 240+ GSM Cottons</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw size={19} strokeWidth={1.5} className="text-[#777B5A] shrink-0" />
              <span>Hassle-Free 7-Day Exchange</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield size={19} strokeWidth={1.5} className="text-[#777B5A] shrink-0" />
              <span>Verified Razorpay &amp; COD</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
