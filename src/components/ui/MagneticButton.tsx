import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface MagneticButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export const MagneticButton = ({
  children, onClick, className, disabled
}: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const shouldReduceMotion = useReducedMotion()

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || shouldReduceMotion) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setPosition({ x: x * 0.3, y: y * 0.3 })
  }

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 })

  return (
    <motion.button
      ref={ref}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      className={className}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}
