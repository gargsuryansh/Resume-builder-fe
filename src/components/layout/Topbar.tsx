import { CommandPalette } from '@components/ui/CommandPalette'
import { BackendStatusBanner } from '@components/ui/BackendStatusBanner'
import { useResumeStore } from '@store/resumeStore'

interface TopbarProps {
  title: string
}

export const Topbar = ({ title }: TopbarProps) => {
  const { getActiveResume, getProfileCompletion } = useResumeStore()
  const resume = getActiveResume()
  const completion = resume ? getProfileCompletion(resume) : 0

  return (
    <header className="h-16 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
      <h1 className="text-heading-md text-text-primary">{title}</h1>
      <div className="flex items-center gap-4">
        <CommandPalette />
        <BackendStatusBanner />
        {resume && (
          <div className="flex items-center gap-2 text-body-sm text-text-muted">
            <span>Profile</span>
            <div className="w-24 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-brand rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
            <span>{completion}%</span>
          </div>
        )}
      </div>
    </header>
  )
}
