import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, ChevronRight, History as HistoryIcon } from 'lucide-react'
import { useTailorStore } from '@store/tailorStore'
import { SectionHeader } from '@components/ui/SectionHeader'
import { GlassCard } from '@components/ui/GlassCard'
import { EmptyState } from '@components/ui/EmptyState'
import { formatDistanceToNow } from 'date-fns'

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } }
}
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
}

export const History = () => {
  const navigate = useNavigate()
  const { sessions, deleteSession } = useTailorStore()

  if (sessions.length === 0) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <EmptyState 
           icon={<HistoryIcon />}
           title="No History Yet"
           description="You haven't tailored any resumes yet. Head over to the AI Tailor to get started."
           action={<button onClick={() => navigate('/tailor')} className="btn-primary">Go to Tailor</button>}
        />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <SectionHeader 
        title="Tailoring History" 
        subtitle={`You have ${sessions.length} saved sessions.`} 
      />

      <motion.div variants={listVariants} initial="hidden" animate="visible" className="space-y-4">
        <AnimatePresence>
          {sessions.map((session) => (
            <motion.div
              key={session.sessionId}
              variants={itemVariants}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            >
              <GlassCard className="p-5 flex items-center justify-between group">
                 <div className="flex-1 cursor-pointer" onClick={() => navigate(`/results/${session.sessionId}`)}>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-heading-sm font-semibold">{session.targetRole}</h4>
                      <span className="text-body-sm text-text-muted">
                        {formatDistanceToNow(new Date(session.tailoredAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-body-md text-text-secondary">Resume: {session.resumeName}</p>
                 </div>
                 
                 <div className="flex items-center gap-8">
                    <div className="text-right">
                       <p className="text-body-sm text-text-muted mb-1">ATS Score</p>
                       <div className="flex items-center gap-2">
                          <span className="text-heading-sm font-bold text-success">{session.atsScoreAfter}%</span>
                          <span className="text-body-sm text-success bg-success/10 px-1.5 py-0.5 rounded">+{session.improvement}</span>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <button 
                         onClick={(e) => { e.stopPropagation(); deleteSession(session.sessionId) }}
                         className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                       >
                         <Trash2 size={18} />
                       </button>
                       <button 
                         onClick={() => navigate(`/results/${session.sessionId}`)}
                         className="p-2 text-text-muted hover:text-brand-glow hover:bg-brand-primary/10 rounded-md transition-colors"
                       >
                         <ChevronRight size={20} />
                       </button>
                    </div>
                 </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
