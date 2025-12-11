/**
 * Tipos para los componentes de scroll
 */
export interface ScrollProgress {
  scrollYProgress: number;
}

/**
 * Props para componentes de sección
 */
export interface SectionProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Props para el componente Hero
 */
export interface HeroSectionProps {
  className?: string;
}

/**
 * Props para el componente de Projects
 */
export interface ProjectsSectionProps {
  className?: string;
}

/**
 * Props para el SplashScreen
 */
export interface SplashScreenProps {
  onComplete: () => void;
}

/**
 * Props para componentes con animación
 */
export interface AnimatedComponentProps {
  scrollYProgress?: number;
  className?: string;
}