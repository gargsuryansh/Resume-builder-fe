import { motion } from 'framer-motion'
import { Briefcase, MapPin, Calendar, ExternalLink, Zap, Bookmark, BookmarkCheck } from 'lucide-react'
import { GlassCard } from '@components/ui/GlassCard'
import type { JobListing } from '@lib/types'

interface JobCardProps {
  job: JobListing
  onSave: (job: JobListing) => void
  onTailor: (job: JobListing) => void
  isSaved: boolean
}

export const JobCard = ({ job, onSave, onTailor, isSaved }: JobCardProps) => {
  const getMatchColor = (score: number) => {
    if (score >= 70) return 'text-success bg-success/10'
    if (score >= 40) return 'text-warning bg-warning/10'
    return 'text-error bg-error/10'
  }

  return (
    <GlassCard hoverable className="p-6 relative group overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-heading-sm font-bold text-text-primary group-hover:text-brand-glow transition-colors">
              {job.title}
            </h4>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${getMatchColor(job.match_score)}`}>
              🌟 {job.match_score}% MATCH
            </span>
          </div>
          <div className="flex items-center gap-3 text-body-sm text-text-muted">
            <span className="flex items-center gap-1"><Briefcase size={14} /> {job.company}</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
          </div>
        </div>
        <button
          onClick={() => onSave(job)}
          className={`p-2 rounded-md transition-all ${isSaved ? 'text-brand-glow bg-brand-primary/10' : 'text-text-muted hover:text-white hover:bg-bg-tertiary'}`}
        >
          {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-4 text-body-sm text-text-secondary">
        {job.salary_range && <span className="bg-bg-tertiary px-2 py-1 rounded">{job.salary_range}</span>}
        <span className="bg-bg-tertiary px-2 py-1 rounded">{job.experience_required}</span>
        <span className="flex items-center gap-1"><Calendar size={14} /> {job.posted_date}</span>
        <span className="text-brand-glow">{job.source}</span>
      </div>

      <p className="text-body-sm text-text-muted line-clamp-2 mb-6 leading-relaxed">
        {job.description_preview}
      </p>

      <div className="flex gap-2 mb-6">
        {job.skills_required.slice(0, 4).map(skill => (
          <span key={skill} className="text-[10px] bg-bg-tertiary border border-border-subtle text-text-secondary px-2 py-0.5 rounded">
            {skill}
          </span>
        ))}
        {job.skills_required.length > 4 && (
          <span className="text-[10px] text-text-muted">+{job.skills_required.length - 4} more</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onTailor(job)}
          className="flex-1 btn-primary !py-2 !text-sm flex items-center justify-center gap-2"
        >
          <Zap size={16} /> Tailor for This
        </button>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary !py-2 !px-4 flex items-center justify-center gap-2 text-sm"
        >
          View Original <ExternalLink size={14} />
        </a>
      </div>

      {/* Background glow on hover */}
      <div className="absolute -inset-x-20 -top-20 -z-10 h-40 w-full bg-brand-primary/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </GlassCard>
  )
}
