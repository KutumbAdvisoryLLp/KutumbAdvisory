'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  size?: 'sm' | 'md'
  className?: string
  color?: string
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  className,
  color,
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100)

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-charcoal font-medium">{label}</span>}
          {showPercentage && (
            <span className="text-slate font-mono text-xs">{percentage}%</span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full bg-slate-lighter rounded-full overflow-hidden',
          size === 'sm' ? 'h-1.5' : 'h-2.5'
        )}
      >
        <motion.div
          className={cn('h-full rounded-full', color || 'bg-gold')}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}
