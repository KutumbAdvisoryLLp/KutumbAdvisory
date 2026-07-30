'use client'

import { cn } from '@/lib/utils'

interface LockedContentProps {
  children: React.ReactNode
  blur?: number
  className?: string
  onUnlockRequest?: () => void
}

export function LockedContent({
  children,
  blur = 8,
  className,
  onUnlockRequest,
}: LockedContentProps) {
  return (
    <div className={cn('relative group', className)}>
      <div
        className="select-none"
        style={{ filter: `blur(${blur}px)`, pointerEvents: 'none' }}
      >
        {children}
      </div>
      <div
        onClick={onUnlockRequest}
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
      >
        <div className="flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#A8791F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span className="text-sm font-medium text-gold">
            Unlock to view
          </span>
        </div>
      </div>
    </div>
  )
}
