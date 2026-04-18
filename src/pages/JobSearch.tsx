import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Briefcase, MapPin, Loader2, Bookmark, X, Trash2, SlidersHorizontal } from 'lucide-react'
import { searchJobs } from '@lib/api'
import { useJobSearchStore } from '@store/jobSearchStore'
import { useTailorStore } from '@store/tailorStore'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { GlassCard } from '@components/ui/GlassCard'
import { SectionHeader } from '@components/ui/SectionHeader'
import { JobCard } from '@components/shared/JobCard'
import { LoadingSkeleton } from '@components/ui/LoadingSkeleton'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import type { JobListing, JobSearchResponse } from '@lib/types'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

export const JobSearch = () => {
  const navigate = useNavigate()
  const { filters, setFilters, savedJobs, saveJob, removeSavedJob, isJobSaved, recentSearches, addRecentSearch } = useJobSearchStore()
  const { setJobDescription, setTargetRole } = useTailorStore()
  
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<JobListing[]>([])
  const [total, setTotal] = useState(0)

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setLoading(true)
    const toastId = toast.loading('Searching for matching jobs...')
    
    try {
      const data = await searchJobs(filters)
      setResults(data.results)
      setTotal(data.total)
      addRecentSearch(filters)
      toast.success(`Found ${data.total} jobs`, { id: toastId })
    } catch (error: any) {
      toast.error(error.message || 'Search failed', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const handleTailor = (job: JobListing) => {
    setJobDescription(job.title + '\n' + job.description_preview)
    setTargetRole(job.title)
    navigate('/tailor')
  }

  const applyRecentFilter = (filter: any) => {
    setFilters(filter)
    // Small delay to allow state to settle
    setTimeout(() => handleSearch(), 100)
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="flex justify-between items-end">
        <SectionHeader
          title="Job Search"
          subtitle="Find roles that match your profile and send them directly to the AI Tailor."
        />
        <Sheet>
          <SheetTrigger asChild>
            <button className="btn-secondary flex items-center gap-2 relative">
              <Bookmark size={18} /> Saved Jobs
              {savedJobs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-primary text-[10px] font-bold rounded-full flex items-center justify-center text-white">
                  {savedJobs.length}
                </span>
              )}
            </button>
          </SheetTrigger>
          <SheetContent className="bg-bg-primary border-border-subtle text-text-primary overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-text-primary flex items-center gap-2">
                 <Bookmark className="text-brand-glow" /> Saved Jobs
              </SheetTitle>
            </SheetHeader>
            <div className="space-y-4">
              {savedJobs.length === 0 ? (
                <div className="py-10 text-center text-text-muted">
                   <Bookmark size={32} className="mx-auto mb-2 opacity-20" />
                   <p>No saved jobs yet.</p>
                </div>
              ) : (
                savedJobs.map(job => (
                  <GlassCard key={job.id} className="p-4 space-y-3">
                    <div>
                      <h4 className="font-bold text-body-md line-clamp-1">{job.title}</h4>
                      <p className="text-body-sm text-text-muted">{job.company}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleTailor(job)} className="flex-1 btn-primary !py-1.5 !text-[11px] !px-2">Tailor</button>
                      <button onClick={() => removeSavedJob(job.id)} className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </GlassCard>
                ))
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Filter Bar */}
      <GlassCard className="p-4 sticky top-4 z-30 shadow-glow-sm">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1">
            <label className="text-label text-text-secondary ml-1">Job Title / Keywords</label>
            <div className="relative">
               <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
               <input
                 value={filters.role || ''}
                 onChange={(e) => setFilters({ role: e.target.value })}
                 placeholder="Software Engineer, Design..."
                 className="input-field pl-10"
               />
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-label text-text-secondary ml-1">Location</label>
            <div className="relative">
               <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
               <input
                 value={filters.location || ''}
                 onChange={(e) => setFilters({ location: e.target.value })}
                 placeholder="Remote, Bangalore, NYC..."
                 className="input-field pl-10"
               />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-label text-text-secondary ml-1">Experience</label>
            <select
              value={filters.experience || ''}
              onChange={(e) => setFilters({ experience: e.target.value })}
              className="input-field"
            >
              <option value="">Any Experience</option>
              <option value="0-2">Junior (0-2 yrs)</option>
              <option value="3-5">Mid-level (3-5 yrs)</option>
              <option value="5-8">Senior (5-8 yrs)</option>
              <option value="8+">Lead (8+ yrs)</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2 h-[46px] px-8"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </GlassCard>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-label text-text-muted mr-2">Recent:</span>
          {recentSearches.map((s, i) => (
            <button
              key={i}
              onClick={() => applyRecentFilter(s)}
              className="text-body-sm bg-bg-tertiary hover:bg-bg-elevated text-text-secondary px-3 py-1 rounded-full border border-border-subtle transition-colors"
            >
              {s.role || 'Any'} in {s.location || 'Everywhere'}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map(i => (
              <GlassCard key={i} className="p-6 space-y-4">
                <LoadingSkeleton className="h-6 w-1/3" />
                <LoadingSkeleton className="h-4 w-1/4" />
                <LoadingSkeleton className="h-20 w-full" />
                <div className="flex gap-4">
                  <LoadingSkeleton className="h-10 flex-1" />
                  <LoadingSkeleton className="h-10 w-20" />
                </div>
              </GlassCard>
            ))}
          </div>
        ) : results.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6"
          >
            {results.map(job => (
              <motion.div key={job.id} variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}>
                <JobCard
                  job={job}
                  onSave={saveJob}
                  onTailor={handleTailor}
                  isSaved={isJobSaved(job.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center">
            <Briefcase size={48} className="text-text-muted opacity-20 mb-4" />
            <h4 className="text-heading-sm font-semibold mb-2">
              {filters.role || filters.location ? "No jobs found" : "Ready to start your search?"}
            </h4>
            <p className="text-body-md text-text-muted max-w-sm">
              {filters.role || filters.location ? "Try adjusting your filters or search keywords." : "Enter a role and location above to find your next opportunity."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
