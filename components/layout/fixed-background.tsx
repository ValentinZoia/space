"use client";

import AuroraHero from '@/components/features/aurora-hero';
import Header from '@/components/layout/header';

interface FixedBackgroundProps {
  children?: React.ReactNode;
}

export function FixedBackground({ children }: FixedBackgroundProps) {
  return (
    <div className="w-full fixed top-0 left-0 right-0 h-screen">
      <AuroraHero>
        <Header />
        {children}
      </AuroraHero>
    </div>
  );
}