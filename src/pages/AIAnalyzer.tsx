import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, AlertCircle, CheckCircle2, ArrowRight, Zap, Loader2 } from 'lucide-react'
import { useResumeStore } from '@store/resumeStore'
import { analyzeResume } from '@lib/api'
import { GlassCard } from '@components/ui/GlassCard'
import { SectionHeader } from '@components/ui/SectionHeader'
import { ScoreRing } from '@components/ui/ScoreRing'
import { EmptyState } from '@components/ui/EmptyState'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import type { AnalyzerResponse } from '@lib/types'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export const AIAnalyzer = () => {
  const navigate = useNavigate()
  const { getActiveResume } = useResumeStore()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalyzerResponse | null>(null)
  const [targetRole, setTargetRole] = useState('')
  const [loadingText, setLoadingText] = useState('Scanning resume structure...')

  const resume = getActiveResume()

  const tips = [
    "Scanning resume structure...",
    "Checking ATS compatibility...",
    "Detecting keyword density...",
    "Analyzing readability...",
    "Identifying power verbs...",
  ]

  const handleAnalyze = async () => {
    if (!resume) return
    if (!resume.personalInfo.name || !resume.personalInfo.email) {
      return toast.error("Complete your profile (Name and Email) first.")
    }

    setIsAnalyzing(true)
    let tipIdx = 0
    const interval = setInterval(() => {
      tipIdx = (tipIdx + 1) % tips.length
      setLoadingText(tips[tipIdx])
    }, 2000)

    try {
      const data = await analyzeResume(resume, targetRole)
      setResult(data)
      toast.success("Analysis complete!")
    } catch (e: any) {
      toast.error(e.message || "Analysis failed")
    } finally {
      clearInterval(interval)
      setIsAnalyzing(false)
    }
  }

  if (!resume) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <EmptyState
          icon={<AlertCircle />}
          title="No resume to analyze"
          description="Build your resume first to get AI-powered insights."
          action={<button onClick={() => navigate('/builder')} className="btn-primary">Go to Resume Builder →</button>}
        />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <SectionHeader
        title="AI Resume Analyzer"
        subtitle="Get a comprehensive audit of your resume structure, content, and ATS compatibility."
      />

      {/* Input Section */}
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-label text-text-secondary">Target Role (optional)</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="input-field"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="btn-primary flex items-center justify-center gap-2 h-[46px]"
          >
            {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
            {isAnalyzing ? "Analyzing..." : "Analyze My Resume"}
          </button>
        </div>
      </GlassCard>

      <AnimatePresence mode="wait">
        {isAnalyzing && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 space-y-4"
          >
            <Loader2 size={48} className="text-brand-glow animate-spin" />
            <p className="text-heading-sm text-brand-glow animate-pulse">{loadingText}</p>
          </motion.div>
        )}

        {result && !isAnalyzing && (
          <motion.div
            key="results"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Overall Score */}
            <motion.div variants={itemVariants}>
              <GlassCard elevated className="p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="shrink-0">
                  <ScoreRing score={result.overallScore} size={200} label="Overall Score" />
                </div>
                <div className="space-y-4 text-center md:text-left">
                  <h3 className="text-display text-4xl">
                    {result.overallScore >= 80 ? "Excellent!" : result.overallScore >= 60 ? "Good" : "Needs Work"}
                  </h3>
                  <p className="text-body-lg text-text-secondary max-w-md">
                    Your resume has a strong foundation. Following the suggestions below could boost your ATS visibility significantly.
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Score Breakdown Bars */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(result.scores).map(([key, value]) => (
                <GlassCard key={key} className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-label uppercase text-text-muted">{key.replace('_', ' ')}</span>
                    <span className="text-body-sm font-bold">{value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-bg-tertiary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-brand rounded-full"
                    />
                  </div>
                </GlassCard>
              ))}
            </motion.div>

            {/* Strengths & Weaknesses */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-6 border-success/20">
                <div className="flex items-center gap-2 mb-4 text-success">
                  <CheckCircle2 size={18} />
                  <h4 className="font-bold">✅ Strengths</h4>
                </div>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-body-md text-text-secondary flex gap-2">
                      <span className="text-success text-xs mt-1.5">•</span> {s}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-6 border-error/20">
                <div className="flex items-center gap-2 mb-4 text-error">
                  <AlertCircle size={18} />
                  <h4 className="font-bold">⚠️ Weaknesses</h4>
                </div>
                <ul className="space-y-2">
                  {result.weaknesses.map((w, i) => (
                    <li key={i} className="text-body-md text-text-secondary flex gap-2">
                      <span className="text-error text-xs mt-1.5">•</span> {w}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>

            {/* Improvement Suggestions */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="section-header">💡 Improvement Suggestions</h3>
              <div className="grid grid-cols-1 gap-4">
                {result.improvementSuggestions.map((s, i) => (
                  <GlassCard
                    key={i}
                    className={`p-5 flex items-center justify-between border-l-4 ${
                      s.priority === 'high' ? 'border-l-error' : s.priority === 'medium' ? 'border-l-warning' : 'border-l-info'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                          s.priority === 'high' ? 'bg-error/20 text-error' : s.priority === 'medium' ? 'bg-warning/20 text-warning' : 'bg-info/20 text-info'
                        }`}>
                          {s.priority} priority
                        </span>
                        <span className="text-label text-text-muted">Category: {s.category}</span>
                      </div>
                      <p className="text-body-md font-medium text-text-primary">{s.suggestion}</p>
                      <p className="text-body-sm text-text-muted mt-1">Impact: {s.impact_estimate}</p>
                    </div>
                    <button
                      onClick={() => navigate('/builder')}
                      className="p-2 hover:bg-bg-tertiary rounded-full transition-colors text-text-muted hover:text-white"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </GlassCard>
                ))}
              </div>
            </motion.div>

            {/* Resume Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <GlassCard className="p-6 text-center">
                  <p className="text-label text-text-muted mb-1">Word Count</p>
                  <p className="text-heading-md">{result.wordCount}</p>
               </GlassCard>
               <GlassCard className="p-6 text-center">
                  <p className="text-label text-text-muted mb-1">Readability</p>
                  <p className="text-heading-md">{result.readabilityScore}/100</p>
               </GlassCard>
               <GlassCard className="p-6 text-center">
                  <p className="text-label text-text-muted mb-1">Passive Voice</p>
                  <p className={`text-heading-md ${result.passiveVoicePercentage > 10 ? 'text-warning' : 'text-success'}`}>
                    {result.passiveVoicePercentage}%
                  </p>
               </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
