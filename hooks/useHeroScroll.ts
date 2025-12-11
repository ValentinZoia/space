import { useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * Hook para manejar el scroll del hero con animación de opacidad
 */
export function useHeroScroll() {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"],
    });

    // El hero se mantiene visible hasta el 50% del scroll, luego desaparece
    const heroTextOpacity = useTransform(
        scrollYProgress,
        [0, 0.5, 0.5001],
        [1, 1, 1],
    );

    return {
        ref,
        scrollYProgress,
        heroTextOpacity,
    };
}
