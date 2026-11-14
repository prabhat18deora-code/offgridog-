import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import unisexEditorialImage from '../../assets/images/hero_find_your_way_1792064208834.jpg';

export function FeaturedCampaignSection() {
  const { navigateTo } = useStore();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  // Viewport entrance observer (triggers once)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // Play entrance animation only once
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Subtle, gentle scroll parallax for the image
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
              const centerDiff = window.innerHeight / 2 - (rect.top + rect.height / 2);
              // Controlled, subtle parallax offset (max ±12px)
              const offset = Math.max(-12, Math.min(12, centerDiff * 0.035));
              setParallaxOffset(offset);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Unisex Fashion Editorial"
      className="relative w-full bg-[#101110] text-[#F2EFE7] overflow-hidden py-16 lg:py-24 border-b border-[#353630]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* 1. Left Side: Large Landscape Image Container */}
          <div
            className={`lg:col-span-7 relative order-1 lg:order-1 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="group relative aspect-[16/10] sm:aspect-[16/10] w-full overflow-hidden rounded-sm border border-[#353630] bg-[#20211E]">
              {/* Parallax layer with gentle vertical scroll offset */}
              <div
                className="w-full h-full will-change-transform transition-transform duration-300 ease-out motion-reduce:transform-none"
                style={{ transform: `translateY(${parallaxOffset}px)` }}
              >
                {/* Outer zoom wrapper: handles smooth hover zoom */}
                <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none">
                  {/* Inner image: runs the continuous slow cinematic zoom from 100% to 105% */}
                  <img
                    src={unisexEditorialImage}
                    alt="OffGrid OG Unisex Collection - Two models in coordinated neutral oversized outfits in architectural concrete space"
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover object-center transform-gpu ${
                      isVisible ? 'animate-cinematic-zoom' : ''
                    } motion-reduce:animate-none`}
                  />
                </div>
              </div>

              {/* Sophisticated subtle vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-75" />
            </div>
          </div>

          {/* 2. Right Side: Descriptive Content */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-2">
            {/* Small Collection Label (Fades in first) */}
            <div>
              <span
                className={`inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#D6C7AE]/80 transition-all duration-700 ease-out motion-reduce:transition-none ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
                style={{ transitionDelay: '250ms' }}
              >
                UNISEX COLLECTION
              </span>
            </div>

            {/* Main Heading (Reveals line by line) */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-brand-display uppercase leading-tight text-balance">
              <span className="block overflow-hidden py-0.5">
                <span
                  className={`block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                  }`}
                  style={{ transitionDelay: '400ms' }}
                >
                  EFFORTLESS STYLE.
                </span>
              </span>
              <span className="block overflow-hidden py-0.5">
                <span
                  className={`block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                  }`}
                  style={{ transitionDelay: '550ms' }}
                >
                  NO BOUNDARIES.
                </span>
              </span>
            </h2>

            {/* Description (Gentle upward entrance) */}
            <p
              className={`text-sm sm:text-base text-[#F2EFE7]/80 leading-relaxed max-w-lg transition-all duration-700 ease-out motion-reduce:transition-none ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '700ms' }}
            >
              Designed beyond labels. Relaxed silhouettes, understated tones, and everyday essentials that bring comfort and individuality together.
            </p>

            {/* CTA Button (Fades in last with interactive hover and click feedback) */}
            <div
              className={`pt-2 transition-all duration-700 ease-out motion-reduce:transition-none ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '850ms' }}
            >
              <button
                type="button"
                onClick={() => navigateTo('shop', 'unisex')}
                className="group px-8 py-3.5 bg-[#F2EFE7] text-[#20211E] text-xs font-bold tracking-[0.15em] uppercase rounded hover:bg-[#777B5A] hover:text-white active:scale-[0.97] transition-all duration-300 ease-out inline-flex items-center gap-3 cursor-pointer shadow-xs hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#777B5A]"
              >
                <span>EXPLORE UNISEX</span>
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transform-none"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
