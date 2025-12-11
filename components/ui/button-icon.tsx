import { useColor } from '@/contexts/ColorContext';
import { motion, useMotionTemplate } from 'motion/react'
import React from 'react'

function ButtonIcon({ icon, text }: { icon?: React.ReactNode, text?: string }) {
  const { color } = useColor();
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;
  return (
    <motion.button
      whileHover={{
        scale: 1.015,
      }}
      whileTap={{
        scale: 0.985
      }}
      style={{
        border,
        boxShadow
      }}
      className='cursor-pointer group relative flex w-fit items-center gap-1.5 rounded-sm bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50'
    >
      {text && <span>{text}</span>}
      {icon}
    </motion.button>
  )
}

export default ButtonIcon
