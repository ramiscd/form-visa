'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ProgressBar({ 
  value, 
  showLabel = true, 
  size = 'md',
  className 
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(value, 0), 100)

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-medium text-foreground">{percentage}%</span>
        </div>
      )}
      <div className={cn(
        'w-full overflow-hidden rounded-full bg-secondary',
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full rounded-full bg-primary transition-all duration-500 ease-out',
            percentage === 100 && 'bg-green-600'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
