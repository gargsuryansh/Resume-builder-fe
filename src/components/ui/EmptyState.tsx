import { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border-default rounded-lg bg-bg-secondary/50">
    <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center text-text-muted mb-4">
      {icon}
    </div>
    <h3 className="text-heading-sm text-text-primary mb-2">{title}</h3>
    <p className="text-body-md text-text-muted max-w-sm mb-6">{description}</p>
    {action}
  </div>
)
