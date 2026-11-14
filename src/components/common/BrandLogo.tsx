import React, { useState } from 'react';
import brandLogoNew from '../../assets/images/brand_logo_new.png';
import brandLogoTagline from '../../assets/images/brand_logo_tagline.svg';

interface BrandLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'monogram';
  invert?: boolean;
}

export function BrandLogo({ className = '', variant = 'compact', invert = false }: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);

  // Directly imported brand logo assets using the new uploaded logo
  const logoSrc = brandLogoNew;
  const fullLogoSrc = brandLogoNew;

  if (!imageError) {
    if (variant === 'full') {
      return (
        <div className={`flex flex-col items-center select-none ${className}`}>
          <img
            src={fullLogoSrc}
            alt="OffGrid OG - Wear Your Own Path"
            onError={() => setImageError(true)}
            className="w-44 sm:w-56 h-auto object-contain rounded-xl shadow-md border border-[#62694F]/40"
          />
        </div>
      );
    }

    if (variant === 'compact') {
      return (
        <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
          <img
            src={logoSrc}
            alt="OffGrid OG - Wear Your Own Path"
            onError={() => setImageError(true)}
            className="h-10 sm:h-12 w-10 sm:w-12 object-cover rounded-md shadow-xs border border-[#62694F]/40 shrink-0"
          />
          <div className="flex flex-col justify-center">
            <span className="text-base sm:text-lg font-black tracking-[0.16em] uppercase font-brand-display text-[#F2EFE7] leading-none">
              OFFGRID <span className="font-serif italic font-bold text-[#D0C8B7]">OG</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.24em] text-[#A6A49C] uppercase mt-1 leading-none">
              WEAR YOUR OWN PATH
            </span>
          </div>
        </div>
      );
    }

    if (variant === 'monogram') {
      return (
        <div className={`inline-flex items-center justify-center ${className}`}>
          <img
            src={logoSrc}
            alt="OffGrid OG"
            onError={() => setImageError(true)}
            className="h-8 w-8 object-cover rounded-sm shadow-xs border border-[#62694F]/40"
          />
        </div>
      );
    }
  }

  // Elegant typographic fallback matching the brand identity
  const textColor = invert ? 'text-white' : 'text-black';
  const subColor = invert ? 'text-white/60' : 'text-neutral-700';
  const lineColor = invert ? 'bg-white/30' : 'bg-black';

  if (variant === 'monogram') {
    return (
      <div className={`inline-flex items-center justify-center font-bold tracking-tighter ${textColor} ${className}`}>
        <span className="text-xl font-brand-display tracking-tight border-2 border-current px-1.5 py-0.5 rounded-sm">
          OG
        </span>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center select-none text-center ${className}`}>
        <div className="relative flex items-center justify-center">
          <span
            className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-[0.2em] uppercase font-brand-display ${textColor}`}
          >
            OFFGRID
          </span>
          <span className={`text-[10px] tracking-normal font-medium align-top ml-1 -mt-3 ${subColor}`}>
            TM
          </span>
        </div>

        <div className="flex items-center gap-3 w-full justify-center my-1.5">
          <div className={`h-[1.5px] w-8 sm:w-12 ${lineColor}`} />
          <span className={`italic font-serif text-xl sm:text-2xl font-black tracking-normal px-1 ${textColor}`}>
            OG
          </span>
          <div className={`h-[1.5px] w-8 sm:w-12 ${lineColor}`} />
        </div>

        <span className={`text-xs sm:text-sm font-bold tracking-[0.28em] uppercase ${textColor}`}>
          WEAR YOUR OWN PATH
        </span>
      </div>
    );
  }

  // Compact Header Fallback
  return (
    <div className={`flex items-baseline gap-1.5 select-none bg-[#F2EFE7] px-3.5 py-1.5 rounded-xs shadow-xs ${className}`}>
      <span className={`text-lg sm:text-xl font-extrabold tracking-[0.16em] uppercase font-brand-display ${textColor}`}>
        OFFGRID
      </span>
      <span className={`text-base font-serif italic font-black ${textColor}`}>
        OG
      </span>
    </div>
  );
}
