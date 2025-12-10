"use client"
import AuroraHero from '@/components/_components/aurora-hero';
// import FramerCard from '@/components/_components/framer-card';
import Header from '@/components/_components/header';
import HeroText from '@/components/_components/hero-text';
import RocketText from '@/components/_components/rocket-text';
import Section from '@/components/_components/section';
import SplashScreen from '@/components/_components/splash-screen';
import CustomCursor from '@/providers/CursorCustom';
import SmoothScrollProvider from '@/providers/LenisSmoothProvider';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import { useRef, useState } from 'react'

function Page() {
  const [showSplash, setShowSplash] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Scroll del contenedor completo
  const { scrollYProgress: containerScrollProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Ocultar solo el HeroText cuando scrollYProgress llegue a 1
  const heroTextOpacity = useTransform(
    containerScrollProgress,
    [0, 0.5, 0.5001],
    [1, 1, 0]
  );
  const targetRef = useRef(null);

  {/*
    se utiliza el hook useScroll de framer-motion para obtener el
    valor de scrollYProgress, que representa el progreso del
    desplazamiento vertical como un valor entre 0 y 1.
    Este valor se actualiza automáticamente a medida que el usuario
    se desplaza por la página.
    */}
  const { scrollYProgress: horizontalScrollProgress } = useScroll({
    target: targetRef,
  });

  {/*
    utiliza el hook useTransform para transformar el valor de scrollYProgress
    en un valor de desplazamiento horizontal (x). En este caso,
    cuando scrollYProgress es 0, x es "1%", y cuando scrollYProgress es 1,
    x es "-95%". Esto significa que el contenido del carrusel se desplazará
    horizontalmente de "1%" a "-95%" a medida que el usuario se desplaza
    verticalmente por la página.
    */}
  const x = useTransform(horizontalScrollProgress, [0, 1], ["1%", "-95%"]);

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <CustomCursor />
      <SmoothScrollProvider />

      {/* AuroraHero y Header siempre fijos */}
      <div className="w-full fixed top-0 left-0 right-0 h-screen ">
        <AuroraHero>

          <Header />

        </AuroraHero>
      </div>

      <div ref={containerRef} className="w-full h-[1400vh] relative">
        {/* HeroText que desaparece */}
        <motion.div
          className="w-full fixed top-0 left-0 right-0 pointer-events-none"
          style={{
            opacity: heroTextOpacity,
          }}
        >
          <div ref={ref} className='w-full h-[700vh] '>
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

        {/* Espaciador invisible para los primeros 700vh */}
        <div className='w-full h-[700vh]' />

        {/* Contenido que aparece después */}
        <section ref={targetRef} className="relative h-[300vh]">
          <div className="sticky top-0 flex h-screen items-center overflow-hidden">
            <motion.div style={{ x }} className="flex">
              {/* <div className="container px-4 md:px-6 max-w-[1380px] mx-auto pt-20">
                <h1 className='text-6xl font-bold text-white'>HOLAAA</h1>
                <p className='text-white mt-4'>Este contenido aparece después del hero</p>
              </div> */}

              <Section title={"projects"} >
                {/* <FramerCard /> */}
                {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {repositorios.slice(0, 3).map((repo) => (
                    <ProjectCard key={repo.title} {...repo} />
                  ))}
                </div> */}

                <div className="mt-4 w-full flex justify-center">
                  <Link href={"/projetos"} className=" text-[#858585] flex gap-1">
                    Ver Todos los Projectos
                    <ArrowRight />
                  </Link>
                </div>
              </Section>



            </motion.div>
          </div>
        </section>

      </div>
    </>
  )
}

export default Page
