"use client";

import { motion } from 'motion/react';
import Section from '@/components/sections/section';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ProjectsSection() {
  const { targetRef, x } = useHorizontalScroll();

  return (
    <section ref={targetRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex">
          <Section title={"projects"}>
            <div className="mt-4 w-full flex justify-center">
              <Link href={"/projects"} className="text-[#858585] flex gap-1">
                Ver Todos los Proyectos
                <ArrowRight />
              </Link>
            </div>
          </Section>
        </motion.div>
      </div>
    </section>
  );
}