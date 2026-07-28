import React from 'react';
import HeroSection from '@/components/hero/HeroSection';
import CategorySection from '@/components/categories/CategorySection';
import FeatureSection from '@/components/feature/FeatureSection';
import ServiceSection from '@/components/services/ServiceSection';
import ProductSection from '@/components/products/ProductSection';
import LookbookSection from '@/components/lookbook/LookbookSection';
import NewsletterSection from '@/components/newsletter/NewsletterSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeatureSection />
      <ServiceSection />
      <ProductSection />
      <LookbookSection />
      <NewsletterSection />
    </>
  );
}
