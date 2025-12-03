"use client";
import { createContext, ReactNode, useContext } from 'react';
import { useMotionValue, MotionValue } from 'motion/react';

type ColorContextType = {
  color: MotionValue<string>;
};

const ColorContext = createContext<ColorContextType | null>(null);

export const ColorProvider = ({ children }: { children: ReactNode }) => {
  const COLORS = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

  const color = useMotionValue(COLORS[0])

  return (
    <ColorContext.Provider value={{ color }}>
      {children}
    </ColorContext.Provider>
  )
}

export const useColor = () => {
  const ctx = useContext(ColorContext);
  if (!ctx) {
    throw new Error("useColor debe usarse dentro de <ColorProvider>");
  }
  return ctx;
};
