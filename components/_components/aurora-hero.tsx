import React, { useEffect } from 'react'
import { motion, useMotionTemplate, animate } from 'motion/react';
import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useColor } from '@/contexts/ColorContext';

const COLORS = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"]

function AuroraHero({ children }: { children: React.ReactNode }) {
  const { color } = useColor();

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50% , ${color})`

  // const border = useMotionTemplate`1px solid ${color}`;
  // const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;


  useEffect(() => {

    animate(color, COLORS, {
      ease: 'easeInOut',
      duration: 10,
      repeat: Infinity,
      repeatType: 'mirror'
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <motion.section
      style={{
        backgroundImage,



      }}
      className='relative grid min-h-screen  overflow-hidden bg-gray-950 text-gray-200'>

      {children}
      <div className='absolute inset-0 z-0'>
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>
    </motion.section>
  )
}

export default AuroraHero
