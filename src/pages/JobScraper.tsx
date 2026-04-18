import { useState } from 'react'
import { Search, Loader2, Copy, Check } from 'lucide-react'
import { scrapeJob } from '@lib/api'
import { useTailorStore } from '@store/tailorStore'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { SectionHeader } from '@components/ui/SectionHeader'
import { GlassCard } from '@components/ui/GlassCard'
import type { ScrapeResponse } from '@lib/types'

export const JobScraper = () => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScrapeResponse | null>(null)
  const [copied, setCopied] = useState(false)
  const { setJobDescription, setTargetRole } = useTailorStore()
  const navigate = useNavigate()

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return toast.error('Please enter a URL')
    
    setLoading(true)
    const toastId = toast.loading('Extracting job details...')
    
    try {
      const data = await scrapeJob(url)
      setResult(data)
      toast.success('Successfully extracted', { id: toastId })
    } catch (error: any) {
      toast.error(error.message || 'Failed to extract job details', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result.description)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied to clipboard')
  }

  const handleUseInTailor = () => {
    if (!result) return
    setJobDescription(result.description)
    if (result.title) setTargetRole(result.title)
    navigate('/tailor')
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <SectionHeader 
        title="Job Scraper" 
        subtitle="Paste a job posting URL (LinkedIn, Indeed, generic) to extract the description instantly." 
      />

      <GlassCard className="p-6 mb-8">
        <form onSubmit={handleScrape} className="flex gap-4">
          <input 
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://linkedin.com/jobs/view/..."
            className="input-field flex-1"
            required
          />
          <button 
            type="submit" 
            disabled={loading || !url}
            className="btn-primary min-w-[120px] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <><Search size={18} /> Extract</>}
          </button>
        </form>
      </GlassCard>

      {result && (
        <GlassCard className="p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border-subtle bg-bg-secondary flex justify-between items-center sticky top-0">
             <div>
               <h3 className="text-heading-sm">{result.title || 'Unknown Title'}</h3>
               <p className="text-body-sm text-text-muted">{result.company || 'Unknown Company'} • {result.source}</p>
             </div>
             <div className="flex gap-3">
                <button onClick={handleCopy} className="btn-secondary !py-2 !px-4 flex items-center gap-2">
                  {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button onClick={handleUseInTailor} className="btn-primary !py-2 !px-4 bg-success text-white border-none">
                  Use in Tailor
                </button>
             </div>
          </div>
          <div className="p-6 overflow-y-auto max-h-[600px] font-mono text-sm leading-relaxed text-text-secondary whitespace-pre-wrap">
             {result.description}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
