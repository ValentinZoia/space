import { useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

/**
 * Hook para manejar el scroll horizontal del carrusel de proyectos
 */
export function useHorizontalScroll() {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Transformar scroll vertical en movimiento horizontal
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return {
    targetRef,
    x
  };
}