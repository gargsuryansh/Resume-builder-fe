import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Loader2, Sparkles, ChevronDown, Check, Star, Mic, Play, FileText, Download } from 'lucide-react'
import { generateInterviewQuestions } from '@lib/api'
import { useResumeStore } from '@store/resumeStore'
import { useTailorStore } from '@store/tailorStore'
import { GlassCard } from '@components/ui/GlassCard'
import { SectionHeader } from '@components/ui/SectionHeader'
import { toast } from 'sonner'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import type { InterviewQuestion, InterviewPrepResponse, QuestionCategory } from '@lib/types'

const CATEGORIES: { value: QuestionCategory; label: string; icon: string; color: string }[] = [
  { value: 'behavioral', label: 'Behavioral', icon: '🎭', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { value: 'technical', label: 'Technical', icon: '💻', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { value: 'situational', label: 'Situational', icon: '🏗️', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { value: 'cultural_fit', label: 'Cultural Fit', icon: '🤝', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
]

export const InterviewPrep = () => {
  const { getActiveResume } = useResumeStore()
  const { jobDescription, setJobDescription } = useTailorStore()
  const resume = getActiveResume()

  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<InterviewPrepResponse | null>(null)
  const [selectedCats, setSelectedCats] = useState<QuestionCategory[]>(['behavioral', 'technical', 'situational'])
  const [questionCount, setQuestionCount] = useState(12)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [importantQuestions, setImportantQuestions] = useState<Set<string>>(new Set())

  const handleGenerate = async () => {
    if (!resume) return toast.error("Select an active resume.")
    if (jobDescription.length < 50) return toast.error("Provide a job description.")
    if (selectedCats.length === 0) return toast.error("Select at least one category.")

    setIsGenerating(true)
    const toastId = toast.loading('Generating personalized interview questions...')

    try {
      const data = await generateInterviewQuestions({
        resume,
        jobDescription,
        questionCount,
        categories: selectedCats
      })
      setResult(data)
      toast.success(`Generated ${data.total} questions`, { id: toastId })
    } catch (e: any) {
      toast.error(e.message || 'Generation failed', { id: toastId })
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleCategory = (cat: QuestionCategory) => {
    setSelectedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const toggleImportant = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = new Set(importantQuestions)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setImportantQuestions(next)
  }

  const filteredQuestions = result?.questions.filter(q =>
    activeFilter === 'all' || q.category === activeFilter
  ) || []

  const difficultyColor = (d: string) => {
    if (d === 'easy') return 'text-success'
    if (d === 'medium') return 'text-warning'
    return 'text-error'
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <SectionHeader
        title="Interview Preparation"
        subtitle="Get ready with personalized AI-generated interview questions and answer frameworks based on your resume."
      />

      <AnimatePresence mode="wait">
        {!result || isGenerating ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassCard className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-label text-text-secondary">Target Job Description *</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="input-field min-h-[150px] font-mono text-sm leading-relaxed"
                  placeholder="Paste the JD here..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                   <label className="text-label text-text-secondary">Categories (Select All That Apply)</label>
                   <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map(c => (
                        <button
                          key={c.value}
                          onClick={() => toggleCategory(c.value)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all ${
                            selectedCats.includes(c.value)
                              ? 'bg-brand-primary text-white border-brand-primary shadow-glow-sm'
                              : 'bg-bg-tertiary text-text-secondary border-border-default hover:border-text-muted'
                          }`}
                        >
                          <span>{c.icon}</span> {c.label}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-label text-text-secondary">Number of Questions: {questionCount}</label>
                   <input
                     type="range"
                     min="5"
                     max="25"
                     step="1"
                     value={questionCount}
                     onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                     className="w-full h-1.5 bg-bg-tertiary rounded-lg appearance-none cursor-pointer accent-brand-primary"
                   />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || jobDescription.length < 50}
                className="btn-primary w-full flex items-center justify-center gap-2 h-12"
              >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {isGenerating ? 'Analyzing Requirements...' : 'Generate Personalized Questions'}
              </button>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-wrap gap-2">
                   <button
                     onClick={() => setActiveFilter('all')}
                     className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                       activeFilter === 'all' ? 'bg-brand-primary text-white' : 'bg-bg-tertiary text-text-muted hover:text-white'
                     }`}
                   >
                     ALL ({result.total})
                   </button>
                   {CATEGORIES.filter(c => result.questions.some(q => q.category === c.value)).map(c => (
                     <button
                        key={c.value}
                        onClick={() => setActiveFilter(c.value)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                          activeFilter === c.value ? c.color : 'bg-bg-tertiary text-text-muted hover:text-white'
                        }`}
                     >
                        <span>{c.icon}</span> {c.label.toUpperCase()} ({result.questions.filter(q => q.category === c.value).length})
                     </button>
                   ))}
                </div>
                <div className="flex gap-2">
                   <button onClick={() => setResult(null)} className="btn-secondary !py-1.5 !px-3 text-xs">
                     <RefreshCw className="mr-2" size={14} /> NEW SET
                   </button>
                   <button className="btn-secondary !py-1.5 !px-3 text-xs">
                     <Download className="mr-2" size={14} /> EXPORT PDF
                   </button>
                </div>
             </div>

             <Accordion type="single" collapsible className="space-y-3">
                {filteredQuestions.map((q, idx) => {
                  const category = CATEGORIES.find(c => c.value === q.category)
                  const isStarred = importantQuestions.has(q.id)
                  
                  return (
                    <AccordionItem key={q.id} value={q.id} className="border-none">
                       <GlassCard className="overflow-hidden">
                          <AccordionTrigger className="px-6 py-4 hover:no-underline">
                             <div className="flex flex-1 items-start gap-4 text-left">
                                <span className="text-display text-2xl text-text-muted opacity-30 mt-1">{(idx + 1).toString().padStart(2, '0')}</span>
                                <div className="space-y-1">
                                   <div className="flex items-center gap-3">
                                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${category?.color}`}>
                                        {category?.label}
                                      </span>
                                      <span className={`text-[10px] font-black uppercase ${difficultyColor(q.difficulty)}`}>
                                        {q.difficulty}
                                      </span>
                                   </div>
                                   <h4 className="text-body-lg font-bold text-text-primary group-hover:text-brand-glow transition-colors">
                                      {q.question}
                                   </h4>
                                </div>
                                <button
                                  onClick={(e) => toggleImportant(q.id, e)}
                                  className={`ml-auto shrink-0 p-2 transition-colors ${isStarred ? 'text-amber-400' : 'text-text-muted hover:text-white'}`}
                                >
                                   <Star size={20} fill={isStarred ? 'currentColor' : 'none'} />
                                </button>
                             </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6 pt-2">
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border-subtle">
                                <div className="md:col-span-2 space-y-6">
                                   {q.linked_bullet && (
                                     <div className="flex gap-3 p-3 bg-brand-primary/5 rounded-md border border-brand-primary/10">
                                        <FileText className="text-brand-glow shrink-0 mt-0.5" size={16} />
                                        <div>
                                           <p className="text-[10px] font-bold text-brand-glow uppercase mb-1">Linked to your experience</p>
                                           <p className="text-body-sm text-text-secondary italic">"{q.linked_bullet}"</p>
                                        </div>
                                     </div>
                                   )}
                                   
                                   <div className="space-y-2">
                                      <p className="text-label text-text-muted flex items-center gap-2 uppercase tracking-widest"><MessageCircle size={12} /> Suggested Framework</p>
                                      <p className="text-body-md text-text-primary bg-bg-tertiary p-4 rounded-md leading-relaxed">
                                         {q.suggested_answer_framework}
                                      </p>
                                   </div>

                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                         <p className="text-label text-text-muted flex items-center gap-2 uppercase tracking-widest"><Check size={12} /> Preparation Tips</p>
                                         <ul className="space-y-1.5">
                                            {q.preparation_tips.map((tip, i) => (
                                              <li key={i} className="text-body-sm text-text-secondary flex gap-2">
                                                 <span className="text-brand-glow mt-1.5 shrink-0 w-1 h-1 rounded-full bg-brand-glow" /> {tip}
                                              </li>
                                            ))}
                                         </ul>
                                      </div>
                                      <div className="space-y-2">
                                         <p className="text-label text-text-muted flex items-center gap-2 uppercase tracking-widest"><Play size={12} /> Likely Follow-ups</p>
                                         <ul className="space-y-1.5">
                                            {q.common_followups.map((f, i) => (
                                              <li key={i} className="text-body-sm text-text-secondary flex gap-2">
                                                 <span className="text-text-muted mt-1.5 shrink-0 w-1 h-1 rounded-full bg-text-muted" /> {f}
                                              </li>
                                            ))}
                                         </ul>
                                      </div>
                                   </div>
                                </div>
                                
                                <div className="space-y-4">
                                   <GlassCard className="p-4 bg-bg-elevated border-border-default h-full flex flex-col items-center justify-center text-center space-y-4">
                                      <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-glow">
                                         <Mic size={24} />
                                      </div>
                                      <div>
                                         <h5 className="font-bold text-body-md mb-1">Practice Mode</h5>
                                         <p className="text-[10px] text-text-muted mb-4 uppercase tracking-widest leading-tight">Test your answer against the framework</p>
                                         <button className="btn-primary !px-4 !py-2 !text-xs w-full">START DRILL</button>
                                      </div>
                                   </GlassCard>
                                </div>
                             </div>
                          </AccordionContent>
                       </GlassCard>
                    </AccordionItem>
                  )
                })}
             </Accordion>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const RefreshCw = ({ className, size }: { className?: string, size?: number }) => (
  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className={className}>
    <svg xmlns="http://www.w3.org/2000/svg" width={size ?? 24} height={size ?? 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
  </motion.div>
)
