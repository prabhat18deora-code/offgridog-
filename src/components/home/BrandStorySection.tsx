import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export function BrandStorySection() {
  const { navigateTo, settings } = useStore();

  return (
    <section id="brand-story" className="w-full py-20 lg:py-28 bg-[#181916] border-b border-[#353630]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#20211E] text-[#777B5A] border border-[#353630] mx-auto">
          <Compass size={24} />
        </div>

        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#777B5A]">
            The OffGrid Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F2EFE7] font-brand-display uppercase leading-tight text-balance">
            {settings?.brandStoryHeadline || 'NOT HERE TO FIT IN.'}
          </h2>
        </div>

        <p className="text-base sm:text-lg text-[#A6A49C] leading-relaxed max-w-2xl mx-auto font-normal">
          {settings?.brandStoryCopy ||
            'OffGrid OG is built around a simple idea: style should feel like your own. We create a considered wardrobe of versatile essentials, clean silhouettes, and everyday pieces that leave room for individuality.'}
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigateTo('about')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent border border-[#353630] text-[#F2EFE7] text-xs font-bold tracking-[0.18em] uppercase rounded hover:bg-[#20211E] hover:border-[#777B5A] transition-colors cursor-pointer"
          >
            <span>OUR STORY</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
