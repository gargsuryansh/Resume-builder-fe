import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { cn } from '@lib/utils'

interface AnimatedNumberProps {
  value: number
  duration?: number
  className?: string
  style?: React.CSSProperties
  prefix?: string
  suffix?: string
  decimals?: number
}

export const AnimatedNumber = ({
  value,
  duration = 800,
  className,
  style,
  prefix = '',
  suffix = '',
  decimals = 0,
}: AnimatedNumberProps) => {
  const spring = useSpring(0, { duration, bounce: 0 })
  const display = useTransform(spring, (v) => {
    const fixed = v.toFixed(decimals)
    const parts = fixed.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return `${prefix}${parts.join('.')}${suffix}`
  })

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span className={cn("font-mono", className)} style={style}>{display}</motion.span>
}
