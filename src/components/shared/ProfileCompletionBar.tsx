import { useResumeStore } from '@store/resumeStore'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

export const ProfileCompletionBar = () => {
  const { getActiveResume, getProfileCompletion } = useResumeStore()
  const resume = getActiveResume()
  
  if (!resume) return null

  const completion = getProfileCompletion(resume)

  const getMessage = () => {
    if (!resume.personalInfo.name || !resume.personalInfo.email) {
      return "Add your name and email to start tailoring"
    }
    if (completion < 50) return "Add work experience to boost your profile"
    if (completion < 80) return "Add skills and projects to reach 100%"
    return "Your profile is looking great!"
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-heading-sm">Profile Completion</h3>
        <span className="text-heading-md text-brand-primary">{completion}%</span>
      </div>
      
      <div className="h-2 w-full bg-bg-tertiary rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${completion}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-gradient-brand rounded-full"
        />
      </div>

      <div className="flex items-center gap-2 text-body-sm text-text-secondary">
        {completion < 100 && <AlertCircle size={14} className="text-warning" />}
        <span>{getMessage()}</span>
      </div>
    </div>
  )
}
