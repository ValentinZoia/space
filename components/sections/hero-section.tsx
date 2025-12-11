"use client";

import { motion } from 'motion/react';
import HeroText from '@/components/sections/hero-text';
import RocketText from '@/components/sections/rocket-text';
import { useHeroScroll } from '@/hooks/useHeroScroll';

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className = "" }: HeroSectionProps) {
  const { ref, scrollYProgress, heroTextOpacity } = useHeroScroll();

  return (
    <motion.div
      className={`w-full fixed top-0 left-0 right-0 pointer-events-none ${className}`}
      style={{
        opacity: heroTextOpacity,
      }}
    >
      <div ref={ref} className='w-full h-[700vh]'>
        <div className='min-h-screen w-full flex justify-center items-center'>
          <div className="container px-4 md:px-6 z-40 max-w-[1380px] mx-auto pointer-events-auto min-h-screen flex justify-center items-center">
            <section className="py-12 md:py-12 lg:py-24 flex">
              <div className="container m-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <HeroText
                      scrollYProgress={scrollYProgress}
                      rocketText={<RocketText scrollYProgress={scrollYProgress} />}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
}