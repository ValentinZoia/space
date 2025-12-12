import { useScroll } from "motion/react";
import { useRef } from "react";

/**
 * Hook para manejar el scroll del contenedor principal
 */
export function useContainerScroll() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    return {
        containerRef,
        scrollYProgress,
    };
}
