interface GradientTextProps {
  children: React.ReactNode
  className?: string
  animate?: boolean
}

export const GradientText = ({ children, className, animate = false }: GradientTextProps) => (
  <span
    className={`bg-clip-text text-transparent bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-glow ${
      animate ? 'animate-gradient' : ''
    } ${className ?? ''}`}
    style={{
      backgroundSize: animate ? '200% 200%' : 'auto',
      animation: animate ? 'gradient-shift 4s ease infinite' : 'none',
    }}
  >
    {children}
  </span>
)
