import { motion } from 'framer-motion'
import { Plus, Zap, FileText, CheckCircle2, AlertCircle, BarChart3, Clock, TrendingUp } from 'lucide-react'
import { useResumeStore } from '@store/resumeStore'
import { useTailorStore } from '@store/tailorStore'
import { GlassCard } from '@components/ui/GlassCard'
import { SpotlightCard } from '@components/ui/SpotlightCard'
import { MagneticButton } from '@components/ui/MagneticButton'
import { GradientText } from '@components/ui/GradientText'
import { SectionHeader } from '@components/ui/SectionHeader'
import { BackendStatusBanner } from '@components/ui/BackendStatusBanner'
import { EmptyState } from '@components/ui/EmptyState'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 }
}

const sentence = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const word = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export const Dashboard = () => {
  const navigate = useNavigate()
  const { resumes, getActiveResume, getProfileCompletion } = useResumeStore()
  const { sessions } = useTailorStore()
  const activeResume = getActiveResume()
  const completion = activeResume ? getProfileCompletion(activeResume) : 0

  const recentSessions = sessions.slice(0, 3)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="space-y-4">
        <motion.div variants={sentence} initial="hidden" animate="visible" className="flex flex-wrap gap-x-2">
          {["Welcome", "back", "to"].map((w, i) => (
            <motion.span key={i} variants={word} className="text-display text-text-primary">
              {w}
            </motion.span>
          ))}
          <motion.span variants={word}>
            <GradientText animate className="text-display italic">ResumeForge Pro.</GradientText>
          </motion.span>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.6 }} 
          className="text-body-lg text-text-muted max-w-2xl"
        >
          Your AI-powered command center for resume optimization and career growth. 
          Everything you need to land your next role is right here.
        </motion.p>
      </section>

      {/* Main Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Active Resume Status */}
        <motion.div variants={itemVariants} className="lg:col-span-8">
           <SpotlightCard className="p-8 h-full flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-start relative z-10">
                 <div className="space-y-2">
                    <p className="text-label text-brand-glow uppercase tracking-widest">Active Profile</p>
                    <h3 className="text-heading-lg">{activeResume?.personalInfo.name || "Master Resume"}</h3>
                    <p className="text-body-md text-text-muted">{activeResume?.personalInfo.email || "No email provided"}</p>
                 </div>
                 <div className="flex flex-col items-end gap-2 text-right">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-bg-tertiary border border-border-subtle">
                       <CheckCircle2 size={14} className="text-success" />
                       <span className="text-label text-success">Synced</span>
                    </div>
                    <p className="text-[10px] text-text-muted flex items-center gap-1 uppercase">
                      <Clock size={10} /> Updated {format(new Date(), 'MMM dd, HH:mm')}
                    </p>
                 </div>
              </div>

              <div className="mt-12 space-y-4 relative z-10">
                 <div className="flex justify-between items-end">
                    <div>
                       <p className="text-heading-md">{completion}%</p>
                       <p className="text-label text-text-muted uppercase">Profile Completion</p>
                    </div>
                    <button onClick={() => navigate('/builder')} className="text-body-sm text-brand-glow hover:underline">
                       Complete Profile →
                    </button>
                 </div>
                 <div className="h-2 w-full bg-bg-tertiary rounded-full overflow-hidden">
                    <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${completion}%` }}
                       transition={{ duration: 1, delay: 0.5 }}
                       className="h-full bg-gradient-brand rounded-full shadow-glow-sm"
                    />
                 </div>
              </div>
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[100px] -z-0 translate-x-1/2 -translate-y-1/2" />
           </SpotlightCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
           <MagneticButton
             onClick={() => navigate('/tailor')}
             className="w-full p-6 glass-card border-brand-primary/30 flex items-center gap-4 hover:bg-brand-primary/10 group transition-all"
           >
              <div className="w-12 h-12 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-glow group-hover:scale-110 transition-transform">
                 <Zap size={24} />
              </div>
              <div className="text-left">
                 <p className="font-bold text-body-lg group-hover:text-brand-glow">Quick Tailor</p>
                 <p className="text-xs text-text-muted">Optimize for a JD in seconds</p>
              </div>
           </MagneticButton>

           <MagneticButton
             onClick={() => navigate('/builder')}
             className="w-full p-6 glass-card border-purple-500/30 flex items-center gap-4 hover:bg-purple-500/10 group transition-all"
           >
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                 <Plus size={24} />
              </div>
              <div className="text-left">
                 <p className="font-bold text-body-lg group-hover:text-purple-400">Add Resume</p>
                 <p className="text-xs text-text-muted">Create a new specialized profile</p>
              </div>
           </MagneticButton>
        </motion.div>

        {/* System Health / Secondary Stats */}
        <motion.div variants={itemVariants} className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
           <GlassCard className="p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <TrendingUp size={20} />
                 </div>
              </div>
              <div className="mt-4">
                 <p className="text-heading-md">{sessions.filter(s => s.improvement > 20).length}</p>
                 <p className="text-label text-text-muted uppercase">Major Improvements</p>
              </div>
           </GlassCard>

           <GlassCard className="p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                    <BarChart3 size={20} />
                 </div>
              </div>
              <div className="mt-4">
                 <p className="text-heading-md">{resumes.length}</p>
                 <p className="text-label text-text-muted uppercase">Total Resumes</p>
              </div>
           </GlassCard>

           <div className="md:col-span-2">
              <BackendStatusBanner />
           </div>
        </motion.div>

        {/* Recent Tailoring Sessions */}
        <motion.div variants={itemVariants} className="lg:col-span-12 space-y-4">
           <div className="flex justify-between items-center">
              <SectionHeader title="Recent Intelligence" />
              <button onClick={() => navigate('/history')} className="text-body-sm text-text-muted hover:text-brand-glow">
                View All History →
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentSessions.length > 0 ? (
                recentSessions.map(session => (
                  <GlassCard key={session.sessionId} className="p-6 space-y-4 group">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-body-md font-bold group-hover:text-brand-glow transition-colors">{session.targetRole}</p>
                           <p className="text-[10px] text-text-muted uppercase">{format(new Date(session.tailoredAt), 'MMM dd, yyyy')}</p>
                        </div>
                        <div className={`text-body-sm font-bold bg-success/10 text-success px-2 py-0.5 rounded`}>
                           +{session.improvement}%
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 bg-bg-tertiary rounded-full overflow-hidden">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${session.atsScoreAfter}%` }}
                              className="h-full bg-success rounded-full"
                           />
                        </div>
                        <span className="text-[10px] font-bold text-success">{session.atsScoreAfter}%</span>
                     </div>
                     <button 
                       onClick={() => navigate(`/results/${session.sessionId}`)}
                       className="w-full btn-secondary !py-2 !text-xs"
                     >
                        View Full Analysis
                     </button>
                  </GlassCard>
                ))
              ) : (
                <div className="md:col-span-3">
                   <EmptyState 
                    icon={<AlertCircle size={32} />}
                    title="No activity yet"
                    description="Run your first tailoring session to see AI insights here."
                    action={<button onClick={() => navigate('/tailor')} className="btn-primary !py-2">Start Tailoring</button>}
                   />
                </div>
              )}
           </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
