import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { Toaster } from 'sonner'
import { CursorGlow } from '@components/ui/CursorGlow'
import { BackgroundParticles } from '@components/ui/BackgroundParticles'
import { ScrollProgress } from '@components/ui/ScrollProgress'
import { OnboardingFlow } from '@components/onboarding/OnboardingFlow'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/builder': 'Resume Builder',
  '/tailor': 'AI Resume Tailor',
  '/analyzer': 'AI Resume Analyzer',
  '/jobs': 'Job Search',
  '/cover-letter': 'Cover Letter Generator',
  '/interview-prep': 'Interview Preparation',
  '/history': 'Tailor History',
  '/scraper': 'Job Scraper',
  '/settings': 'Settings',
}

const pageVariants = {
  initial: { opacity: 0, y: 12, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -8, filter: 'blur(4px)' },
}

const pageTransition = {
  type: 'tween',
  ease: [0.25, 0.1, 0.25, 1],
  duration: 0.3,
}

export const AppShell = () => {
  const location = useLocation()
  const title = pageTitles[location.pathname] ?? 'ResumeForge Pro'

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary relative">
      <ScrollProgress />
      <BackgroundParticles />
      <CursorGlow />
      <OnboardingFlow />
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col ml-64 overflow-hidden relative z-10">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Toaster
        position="bottom-right"
        expand={true}
        richColors
        closeButton
        toastOptions={{
          style: {
            background: 'rgba(28, 35, 51, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            color: '#F9FAFB',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 24px rgba(99, 102, 241, 0.1)',
            borderRadius: '12px',
            padding: '16px 20px',
            fontSize: '14px',
          },
        }}
      />
    </div>
  )
}
