import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  elevated?: boolean
  hoverable?: boolean
  onClick?: () => void
}

export const GlassCard = ({
  children,
  className,
  elevated = false,
  hoverable = false,
  onClick,
}: GlassCardProps) => {
  return (
    <motion.div
      className={clsx(
        elevated ? 'glass-card-elevated' : 'glass-card',
        hoverable && 'cursor-pointer',
        className
      )}
      whileHover={hoverable ? { y: -2, boxShadow: '0 8px 32px rgba(99,102,241,0.15)' } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
