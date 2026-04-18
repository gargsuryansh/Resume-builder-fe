import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Loader2, Sparkles, Copy, Download, RefreshCw, Edit3, Save, Check } from 'lucide-react'
import { generateCoverLetter } from '@lib/api'
import { useResumeStore } from '@store/resumeStore'
import { useTailorStore } from '@store/tailorStore'
import { GlassCard } from '@components/ui/GlassCard'
import { SectionHeader } from '@components/ui/SectionHeader'
import { toast } from 'sonner'
import type { CoverLetterRequest, CoverLetterTone, CoverLetterResponse } from '@lib/types'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
}

const TONES: { value: CoverLetterTone; label: string; desc: string; icon: string }[] = [
  { value: 'professional', label: 'Professional', desc: 'Formal, business-standard tone.', icon: '👔' },
  { value: 'friendly', label: 'Friendly', desc: 'Warm and approachable vibe.', icon: '🤝' },
  { value: 'enthusiastic', label: 'Enthusiastic', desc: 'High energy and passion.', icon: '🔥' },
  { value: 'concise', label: 'Concise', desc: 'Brief and to the point.', icon: '🎯' },
]

export const CoverLetter = () => {
  const { getActiveResume } = useResumeStore()
  const { jobDescription, setJobDescription } = useTailorStore()
  const resume = getActiveResume()

  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<CoverLetterResponse | null>(null)
  const [tone, setTone] = useState<CoverLetterTone>('professional')
  const [companyName, setCompanyName] = useState('')
  const [managerName, setManagerName] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!resume) return toast.error("Select an active resume first.")
    if (jobDescription.length < 50) return toast.error("Job description is too short.")

    setIsGenerating(true)
    const toastId = toast.loading('AI is crafting your cover letter...')

    try {
      const payload: CoverLetterRequest = {
        resume,
        jobDescription,
        tone,
        companyName: companyName || null,
        hiringManagerName: managerName || null,
      }
      const data = await generateCoverLetter(payload)
      setResult(data)
      setEditedContent(data.coverLetter)
      toast.success('Cover letter generated!', { id: toastId })
    } catch (e: any) {
      toast.error(e.message || 'Generation failed', { id: toastId })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent || result?.coverLetter || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied to clipboard')
  }

  const handleDownload = () => {
    const content = editedContent || result?.coverLetter || ''
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Cover_Letter_${companyName || 'Application'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Downloaded as Text file')
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <SectionHeader
        title="Cover Letter Generator"
        subtitle="Generate personalized, high-impact cover letters based on your resume and the target role."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Panel */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-5 space-y-6">
          <GlassCard className="p-6 space-y-4">
             <div>
               <label className="text-label text-text-secondary block mb-1">Target Job Description *</label>
               <textarea
                 value={jobDescription}
                 onChange={(e) => setJobDescription(e.target.value)}
                 className="input-field min-h-[200px] text-sm font-mono scrollbar-thin"
                 placeholder="Paste the job description here..."
               />
               <p className="text-[10px] text-text-muted mt-1 float-right">
                 {jobDescription.length} characters (min 50)
               </p>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-label text-text-secondary">Company Name</label>
                  <input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="input-field"
                    placeholder="Acme Corp"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-label text-text-secondary">Manager Name</label>
                  <input
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="input-field"
                    placeholder="optional"
                  />
                </div>
             </div>

             <div className="space-y-2">
               <label className="text-label text-text-secondary">Selection Tone</label>
               <div className="grid grid-cols-2 gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={`p-3 text-left rounded-md border transition-all ${
                        tone === t.value
                          ? 'bg-brand-primary/10 border-brand-primary border-2'
                          : 'bg-bg-tertiary border-border-default hover:border-text-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                         <span className="text-lg">{t.icon}</span>
                         {tone === t.value && <div className="w-1.5 h-1.5 rounded-full bg-brand-glow animate-pulse" />}
                      </div>
                      <p className="text-body-sm font-bold text-text-primary">{t.label}</p>
                      <p className="text-[10px] text-text-muted">{t.desc}</p>
                    </button>
                  ))}
               </div>
             </div>

             <button
               onClick={handleGenerate}
               disabled={isGenerating || jobDescription.length < 50 || !resume}
               className="btn-primary w-full flex items-center justify-center gap-2 h-[48px] mt-4"
             >
               {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
               {isGenerating ? 'Drafting...' : 'Generate Cover Letter'}
             </button>
          </GlassCard>
        </motion.div>

        {/* Output Panel */}
        <div className="lg:col-span-7 h-full min-h-[600px]">
          <AnimatePresence mode="wait">
             {isGenerating ? (
               <motion.div
                 key="loading"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="h-full flex flex-col items-center justify-center space-y-6"
               >
                 <div className="relative">
                    <div className="w-20 h-20 border-4 border-brand-primary/20 rounded-full animate-spin border-t-brand-glow" />
                    <Mail size={32} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-glow" />
                 </div>
                 <div className="text-center space-y-2">
                    <p className="text-heading-sm text-brand-glow animate-pulse">AI is writing your letter...</p>
                    <p className="text-body-sm text-text-muted">Aligning your experience with job requirements</p>
                 </div>
               </motion.div>
             ) : result ? (
               <motion.div
                 key="result"
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="space-y-4"
               >
                 <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                       <div className="text-center">
                          <p className="text-[10px] text-text-muted uppercase font-bold">Words</p>
                          <p className="text-body-sm font-mono text-brand-glow">{result.wordCount}</p>
                       </div>
                       <div className="text-center">
                          <p className="text-[10px] text-text-muted uppercase font-bold">Read Time</p>
                          <p className="text-body-sm font-mono text-brand-glow">~{Math.round(result.estimatedReadTime/60)}m</p>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={handleCopy} className="btn-secondary !p-2">
                         {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
                       </button>
                       <button onClick={handleDownload} className="btn-secondary !p-2">
                         <Download size={18} />
                       </button>
                       <button onClick={() => setIsEditing(!isEditing)} className={`btn-secondary !p-2 ${isEditing ? 'bg-brand-primary/10 text-brand-glow' : ''}`}>
                         {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
                       </button>
                       <button onClick={handleGenerate} className="btn-secondary !p-2">
                         <RefreshCw size={18} />
                       </button>
                    </div>
                 </div>

                 <GlassCard className="p-8 min-h-[500px] shadow-glow-sm relative">
                    {isEditing ? (
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full h-[500px] bg-transparent border-none focus:ring-0 text-text-primary p-0 leading-relaxed resize-none scrollbar-hide"
                        autoFocus
                      />
                    ) : (
                      <div className="whitespace-pre-wrap leading-relaxed text-text-secondary select-text">
                        {editedContent}
                      </div>
                    )}
                    
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-[80px] -z-10 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 blur-[80px] -z-10 pointer-events-none" />
                 </GlassCard>
               </motion.div>
             ) : (
               <motion.div
                 key="empty"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="h-full flex flex-col items-center justify-center p-12 text-center"
               >
                 <GlassCard elevated className="p-12 flex flex-col items-center max-w-sm border-dashed">
                    <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center text-text-muted mb-4">
                       <Mail size={32} />
                    </div>
                    <h3 className="text-heading-sm mb-2">Ready to Apply?</h3>
                    <p className="text-body-md text-text-muted">
                      Your AI-crafted cover letter will appear here once you fill in the details and click generate.
                    </p>
                 </GlassCard>
               </motion.div>
             )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
