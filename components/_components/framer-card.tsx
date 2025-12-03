import { useRef } from 'react'
import { useTransform, motion, useMotionValue, useMotionTemplate } from 'motion/react';
import { useColor } from '@/contexts/ColorContext';

function FramerCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const { color } = useColor();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Rotaciones calculadas automáticamente
  const rotateX = useTransform(y, [0, 600], [-10, 10]);
  const rotateY = useTransform(x, [0, 1000], [-10, 10]);
  const background = useMotionTemplate`radial-gradient(circle, ${color}, transparent)`
  return (
    <div className="flex items-center justify-center h-screen">
      <motion.div
        ref={cardRef}
        className="group relative w-[1000px] h-[600px] bg-[#222] rounded-xl overflow-hidden"
        style={{
          perspective: 900,
          rotateX,
          rotateY,
        }}
        onMouseMove={(e) => {
          const rect = cardRef.current!.getBoundingClientRect();
          x.set(e.clientX - rect.left);
          y.set(e.clientY - rect.top);
        }}
        onMouseLeave={() => {
          x.set(500); // vuelve al centro
          y.set(300);
        }}
      >
        {/* Contenido */}
        <div className="relative z-20 w-full h-full flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">BIENVENIDO A GITHUB</h1>
            <p className="text-lg opacity-80">This is a card</p>
          </div>
        </div>

        {/* Luz siguiendo al cursor */}
        <motion.div
          className="absolute pointer-events-none w-[500px] h-[300px] rounded-[20%] blur-[60px]"
          style={{
            background,
            x: useTransform(x, (v) => v - 250),
            y: useTransform(y, (v) => v - 750),
            opacity: 0,
          }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </div>
  );
}

export default FramerCard
