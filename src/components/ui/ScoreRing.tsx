import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedNumber } from './AnimatedNumber'

interface ScoreRingProps {
  score: number
  size?: number
  showDelta?: boolean
  delta?: number
  label?: string
}

const getColor = (score: number): string => {
  if (score >= 70) return '#10B981'
  if (score >= 40) return '#F59E0B'
  return '#EF4444'
}

export const ScoreRing = ({ score, size = 160, showDelta, delta, label }: ScoreRingProps) => {
  const color = getColor(score)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glowing Background Ring */}
        <div 
          className="absolute inset-2 rounded-full blur-2xl opacity-20 transition-colors duration-1000"
          style={{ backgroundColor: color }}
        />
        
        <CircularProgressbar
          value={score}
          text=""
          strokeWidth={6}
          styles={buildStyles({
            pathColor: color,
            trailColor: 'rgba(31, 41, 55, 0.5)',
            pathTransitionDuration: 1.5,
            strokeLinecap: 'round',
          })}
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            key={score}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <AnimatedNumber
              value={score}
              className="text-4xl font-black tracking-tighter"
              style={{ color }}
              suffix="%"
            />
          </motion.div>
        </div>
      </div>
      
      {label && <p className="text-label text-text-muted mt-2">{label}</p>}
      
      <AnimatePresence>
        {showDelta && delta !== undefined && delta !== 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            className={`flex items-center gap-1 font-bold text-body-md ${delta > 0 ? 'text-success' : 'text-error'}`}
          >
            <span>{delta > 0 ? '↑' : '↓'} {Math.abs(delta)} points</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
