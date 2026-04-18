import { clsx } from 'clsx'

interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

export const LoadingSkeleton = ({ className, lines = 1 }: LoadingSkeletonProps) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={clsx(
          'animate-pulse rounded bg-bg-tertiary',
          i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full',
          'h-4',
          className
        )}
      />
    ))}
  </div>
)
