import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export const CursorGlow = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isTouch, setIsTouch] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    
    if (isTouch || shouldReduceMotion) return

    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [isTouch, shouldReduceMotion])

  if (isTouch || shouldReduceMotion) return null

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999] mix-blend-screen"
      style={{
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        left: 0,
        top: 0,
      }}
      animate={{ x: position.x - 200, y: position.y - 200 }}
      transition={{ type: 'spring', damping: 30, stiffness: 200, restDelta: 0.001 }}
    />
  )
}
