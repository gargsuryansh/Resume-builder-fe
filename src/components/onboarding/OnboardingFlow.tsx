import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Zap, Target, FileText } from 'lucide-react'
import { GlassCard } from '@components/ui/GlassCard'
import { useSettingsStore } from '@store/settingsStore'

const Sparkles = ({ className, size }: { className?: string, size?: number }) => (
  <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className={className}>
    <svg xmlns="http://www.w3.org/2000/svg" width={size ?? 24} height={size ?? 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
  </motion.div>
)

const STEPS = [
  {
    icon: <Zap className="text-brand-glow" size={32} />,
    title: "Welcome to ResumeForge Pro",
    description: "Your enterprise-grade AI engine for crafting high-impact resumes and landing your dream job.",
    target: "null"
  },
  {
    icon: <FileText className="text-brand-primary" size={32} />,
    title: "Step 1: Build Your Base",
    description: "Start by entering your experience and details in the Resume Builder. This forms the foundation for all AI tailoring.",
    target: "nav-builder"
  },
  {
    icon: <Target className="text-brand-glow" size={32} />,
    title: "Step 2: Tailor for Success",
    description: "Paste any Job Description into the AI Tailor. We'll rewrite your bullets to match keywords and boost your ATS score.",
    target: "nav-tailor"
  },
  {
    icon: <Sparkles className="text-purple-400" size={32} />,
    title: "Step 3: Analyze & Polish",
    description: "Use the AI Analyzer to get a deep audit of your content, identifying gaps and structural improvements.",
    target: "nav-analyzer"
  }
]

export const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const { hasCompletedOnboarding, setHasCompletedOnboarding } = useSettingsStore()

  useEffect(() => {
    if (!hasCompletedOnboarding) {
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [hasCompletedOnboarding])

  if (!isVisible) return null

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      close()
    }
  }

  const close = () => {
    setIsVisible(false)
    setHasCompletedOnboarding(true)
  }

  const step = STEPS[currentStep]

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={close}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard elevated className="p-8 text-center space-y-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-2">
              <button onClick={close} className="p-2 text-text-muted hover:text-white transition-colors">
                <X size={18} />
              </button>
           </div>

           <div className="flex justify-center">{step.icon}</div>
           
           <div className="space-y-2">
              <h3 className="text-display text-2xl font-black italic">{step.title}</h3>
              <p className="text-body-md text-text-secondary leading-relaxed">
                {step.description}
              </p>
           </div>

           <div className="flex items-center justify-between pt-4">
             <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-brand-glow' : 'w-1.5 bg-bg-tertiary'}`}
                  />
                ))}
             </div>
             <button
               onClick={handleNext}
               className="btn-primary flex items-center gap-2 group"
             >
               {currentStep === STEPS.length - 1 ? 'Get Started' : 'Next Step'} 
               <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </button>
           </div>

           <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-brand-primary/10 blur-[80px] -z-10" />
           <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 blur-[80px] -z-10" />
        </GlassCard>
      </motion.div>
    </div>
  )
}
