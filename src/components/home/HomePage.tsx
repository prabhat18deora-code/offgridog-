import React from 'react';
import { HeroSection } from './HeroSection.tsx';
import { CategorySection } from './CategorySection.tsx';
import { NewArrivalsSection } from './NewArrivalsSection.tsx';
import { FeaturedCampaignSection } from './FeaturedCampaignSection.tsx';
import { BestSellersSection } from './BestSellersSection.tsx';
import { OutfitInspirationSection } from './OutfitInspirationSection.tsx';
import { BrandStorySection } from './BrandStorySection.tsx';

export function HomePage() {
  return (
    <div className="w-full">
      <HeroSection />
      <CategorySection />
      <NewArrivalsSection />
      <FeaturedCampaignSection />
      <BestSellersSection />
      <OutfitInspirationSection />
      <BrandStorySection />
    </div>
  );
}
