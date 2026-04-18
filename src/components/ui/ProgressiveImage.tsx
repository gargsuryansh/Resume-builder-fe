import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon } from 'lucide-react'

interface ProgressiveImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
}

export const ProgressiveImage = ({ src, alt, className, placeholder }: ProgressiveImageProps) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => setLoaded(true)
    img.onerror = () => setError(true)
  }, [src])

  return (
    <div className={`relative overflow-hidden bg-bg-tertiary ${className}`}>
      <AnimatePresence>
        {!loaded && !error && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {placeholder ? (
              <img src={placeholder} alt={alt} className="w-full h-full object-cover blur-lg scale-110" />
            ) : (
              <div className="w-full h-full flex items-center justify-center animate-pulse">
                <ImageIcon className="text-text-muted" size={24} />
              </div>
            )}
          </motion.div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-tertiary text-text-muted">
             <ImageIcon size={24} />
          </div>
        )}
      </AnimatePresence>

      <motion.img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${loaded ? 'opacity-100' : 'opacity-0'}`}
        transition={{ duration: 0.5 }}
      />
    </div>
  )
}
