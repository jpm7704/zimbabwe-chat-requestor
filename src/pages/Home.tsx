
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ProcessSection from '@/components/home/ProcessSection';
import StatsSection from '@/components/home/StatsSection';
import SupportTypesSection from '@/components/home/SupportTypesSection';
import CTASection from '@/components/home/CTASection';

const Home = () => {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ProcessSection />
      <SupportTypesSection />
      <CTASection />
    </>
  );
};

export default Home;
