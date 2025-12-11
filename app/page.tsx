"use client";

import { useState } from 'react';
import { HeroSection } from '@/components/sections/hero-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { FixedBackground } from '@/components/layout/fixed-background';
import SplashScreen from '@/components/sections/splash-screen';
import { useContainerScroll } from '@/hooks/useContainerScroll';

function Page() {
  const [showSplash, setShowSplash] = useState(true);
  const { containerRef } = useContainerScroll();

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* AuroraHero y Header siempre fijos */}
      <FixedBackground />

      {/* Contenedor principal con scroll */}
      <div ref={containerRef} className="w-full h-[1400vh] relative">
        {/* Hero Section que desaparece */}
        <HeroSection />

        {/* Espaciador invisible para los primeros 700vh */}
        <div className='w-full h-[700vh]' />

        {/* Projects Section con scroll horizontal */}
        <ProjectsSection />
      </div>
    </>
  );
}

export default Page;
