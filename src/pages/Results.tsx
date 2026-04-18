import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, TrendingUp, Sparkles, Download, Share2, AlertCircle, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTailorStore } from '@store/tailorStore'
import { useSettingsStore } from '@store/settingsStore'
import { GlassCard } from '@components/ui/GlassCard'
import { ScoreRing } from '@components/ui/ScoreRing'
import { ResumePreview } from '@components/shared/ResumePreview'
import { KeywordChip } from '@components/ui/KeywordChip'
import { EmptyState } from '@components/ui/EmptyState'
import { SectionHeader } from '@components/ui/SectionHeader'
import confetti from 'canvas-confetti'

export const Results = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { sessions } = useTailorStore()
  const { defaultExportFormat } = useSettingsStore()
  
  const session = sessions.find(s => s.sessionId === sessionId)

  useEffect(() => {
    if (session && session.improvement >= 20) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#8B5CF6', '#10B981'],
      })
    }
  }, [session])

  if (!session) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <EmptyState 
           icon={<CheckCircle2 />}
           title="Session Not Found"
           description="The requested tailoring session could not be found or has been deleted."
           action={<button onClick={() => navigate('/history')} className="btn-secondary">Go to History</button>}
        />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/tailor')} className="p-2 hover:bg-bg-tertiary rounded-md transition-colors text-text-muted hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-heading-md">Tailor Results: {session.targetRole}</h2>
            <p className="text-body-sm text-text-muted">{new Date(session.tailoredAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex gap-3">
           <button className="btn-primary !py-2 !px-4 flex items-center gap-2">
             <Download size={16} /> Export Tailored
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Analysis side */}
        <div className="w-1/2 overflow-y-auto p-8 space-y-8 border-r border-border-subtle">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
             <GlassCard className="p-8 h-full flex flex-col items-center justify-center text-center space-y-4">
                <ScoreRing 
                  score={session.atsScoreAfter} 
                  showDelta 
                  delta={session.improvement} 
                  label="ATS Match Score"
                />
                <div className="pt-4">
                   <p className="text-display text-4xl italic text-brand-glow">
                      {session.improvement > 30 ? "Unstoppable!" : session.improvement > 15 ? "Massive Leap!" : "Solid Gains"}
                   </p>
                   <p className="text-body-sm text-text-muted mt-2">
                     Your resume is now significantly more visible to ATS filters for this role.
                   </p>
                </div>
             </GlassCard>
           </motion.div>

           <div>
             <SectionHeader title="Keyword Analysis" />
             <div className="space-y-4 mt-3">
               <div>
                 <p className="text-body-sm text-text-muted mb-2">Matched ({session.matchedKeywords.length})</p>
                 <div className="flex flex-wrap gap-2">
                   {session.matchedKeywords.map(k => <KeywordChip key={k} label={k} type="matched" />)}
                 </div>
               </div>
               {session.missingKeywords.length > 0 && (
                 <div>
                   <p className="text-body-sm text-text-muted mb-2">Still Missing ({session.missingKeywords.length})</p>
                   <div className="flex flex-wrap gap-2">
                     {session.missingKeywords.map(k => <KeywordChip key={k} label={k} type="missing" />)}
                   </div>
                 </div>
               )}
             </div>
           </div>

           <div>
             <h3 className="section-header">AI Suggestions</h3>
             <ul className="space-y-3 mt-3">
               {session.suggestions.map((s, i) => (
                 <li key={i} className="flex gap-3 text-body-md text-text-secondary bg-bg-tertiary p-3 rounded-md">
                   <Zap size={16} className="text-brand-glow shrink-0 mt-0.5" />
                   <span>{s}</span>
                 </li>
               ))}
             </ul>
           </div>
        </div>

        {/* Preview Side */}
        <div className="w-1/2 overflow-y-auto bg-bg-secondary p-8">
           <div className="max-w-[800px] mx-auto scale-90 origin-top">
              <ResumePreview resume={session.tailoredResume} />
           </div>
        </div>
      </div>
    </div>
  )
}
