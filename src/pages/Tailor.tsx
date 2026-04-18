import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Sparkles, Brain, Network, FileSearch, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTailorStore } from '@store/tailorStore'
import { useResumeStore } from '@store/resumeStore'
import { tailorResume } from '@lib/api'
import { GlassCard } from '@components/ui/GlassCard'
import { MagneticButton } from '@components/ui/MagneticButton'
import { SectionHeader } from '@components/ui/SectionHeader'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

export const Tailor = () => {
  const navigate = useNavigate()
  const { getActiveResume } = useResumeStore()
  const { jobDescription, targetRole, setJobDescription, setTargetRole, addSession } = useTailorStore()
  const [isTailoring, setIsTailoring] = useState(false)
  const [loadingStage, setLoadingStage] = useState(0)
  const activeResume = getActiveResume()

  const STAGES = [
    { icon: <FileSearch size={32} />, label: "Analyzing Requirements", sub: "Deep scanning JD for core competencies..." },
    { icon: <Brain size={32} />, label: "Building Knowledge Base", sub: "Mapping your experience to job needs..." },
    { icon: <Network size={32} />, label: "Rewriting Experience", sub: "Synthesizing AI-powered bullet points..." },
    { icon: <CheckCircle2 size={32} />, label: "Calculating Score", sub: "Finalizing ATS compatibility audit..." },
  ]

  const handleTailor = async () => {
    if (!activeResume) return toast.error('Please select an active resume first.')
    if (jobDescription.length < 50) return toast.error('Job description is too short.')
    if (!targetRole) return toast.error('Please enter a target role.')

    setIsTailoring(true)
    setLoadingStage(0)
    
    const stageInterval = setInterval(() => {
      setLoadingStage(prev => (prev < 3 ? prev + 1 : prev))
    }, 2500)

    try {
      const response = await tailorResume({
        resume: activeResume,
        jobDescription,
        targetRole
      })

      const session = {
        ...response,
        sessionId: uuidv4(),
        tailoredAt: new Date().toISOString(),
        targetRole: targetRole,
        resumeName: activeResume.personalInfo.name,
        atsScoreBefore: 50, // Default baseline for mock
        atsScoreAfter: response.atsScore,
        improvement: response.atsScore - 50
      }

      addSession(session)
      toast.success('Tailoring complete!')
      navigate(`/results/${session.sessionId}`)
    } catch (e: any) {
      toast.error(e.message || 'Tailoring failed')
    } finally {
      clearInterval(stageInterval)
      setIsTailoring(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 h-full flex flex-col">
      <SectionHeader 
        title="AI Resume Tailor" 
        subtitle="Paste a job description to dynamically optimize your resume and defeat ATS." 
      />

      <AnimatePresence mode="wait">
        {isTailoring ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative mb-12">
               <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                 className="w-32 h-32 border-2 border-dashed border-brand-primary/30 rounded-full"
               />
               <motion.div 
                 key={loadingStage}
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="absolute inset-0 flex items-center justify-center text-brand-glow"
               >
                 {STAGES[loadingStage].icon}
               </motion.div>
            </div>
            
            <div className="text-center space-y-2">
               <motion.h3 
                 key={STAGES[loadingStage].label}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="text-heading-md text-brand-glow font-black italic uppercase"
               >
                 {STAGES[loadingStage].label}
               </motion.h3>
               <motion.p 
                 key={STAGES[loadingStage].sub}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="text-body-md text-text-muted"
               >
                 {STAGES[loadingStage].sub}
               </motion.p>
            </div>

            <div className="flex gap-2 mt-12">
               {STAGES.map((_, i) => (
                 <div 
                   key={i} 
                   className={`h-1 rounded-full transition-all duration-500 ${
                     i === loadingStage ? 'w-12 bg-brand-glow shadow-glow' : i < loadingStage ? 'w-4 bg-success' : 'w-4 bg-bg-tertiary'
                   }`}
                 />
               ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 gap-8"
          >
            <GlassCard className="p-8 space-y-8 relative overflow-hidden">
                <div className="space-y-6 max-w-4xl mx-auto">
                   <div className="space-y-4">
                      <div className="flex justify-between items-end">
                         <label className="text-label text-brand-glow uppercase tracking-widest">Active Resume</label>
                         <p className="text-[10px] text-text-muted uppercase">Selection locked for this session</p>
                      </div>
                      <div className="p-4 bg-bg-tertiary/50 border border-border-subtle rounded-md flex items-center justify-between">
                         <div>
                            <p className="font-bold text-text-primary">{activeResume?.personalInfo.name}</p>
                            <p className="text-xs text-text-muted">{activeResume?.personalInfo.email}</p>
                         </div>
                         <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                            <CheckCircle2 size={24} />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <label className="text-label text-brand-glow uppercase tracking-widest">Target Role</label>
                      <input
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="e.g. Senior Frontend Engineer"
                        className="input-field !text-lg !font-bold"
                      />
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-label text-brand-glow uppercase tracking-widest">Job Description</label>
                        <span className={`text-[10px] font-bold uppercase ${jobDescription.length >= 50 ? 'text-success' : 'text-error'}`}>
                           {jobDescription.length} / min 50 chars
                        </span>
                      </div>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the target job description here..."
                        className="input-field min-h-[300px] text-sm font-mono leading-relaxed p-6"
                      />
                   </div>

                   <div className="pt-8">
                      <MagneticButton
                        onClick={handleTailor}
                        disabled={!activeResume || !targetRole || jobDescription.length < 50}
                        className="w-full btn-primary h-14 !text-heading-sm flex items-center justify-center gap-3 overflow-hidden group relative"
                      >
                         <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                         <span className="relative z-10 flex items-center gap-3">
                           Tailor My Resume <Sparkles size={20} className="animate-pulse" />
                         </span>
                      </MagneticButton>
                   </div>
                </div>

                <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-primary/5 blur-[100px] -z-10" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/5 blur-[100px] -z-10" />
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
