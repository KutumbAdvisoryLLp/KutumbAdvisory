'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { getScoreStatus, getScoreColor } from '@/types'

interface ScoreRingProps {
  score: number
  maxScore: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  label?: string
  className?: string
}

const sizeMap = {
  sm: { ring: 80, stroke: 6, text: '2xl' },
  md: { ring: 120, stroke: 8, text: '4xl' },
  lg: { ring: 160, stroke: 10, text: '5xl' },
  xl: { ring: 200, stroke: 12, text: '6xl' },
}

export function ScoreRing({
  score,
  maxScore,
  size = 'lg',
  animated = true,
  label,
  className,
}: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score)
  const config = sizeMap[size]
  const radius = (config.ring - config.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const percentage = score / maxScore
  const offset = circumference * (1 - percentage)
  const status = getScoreStatus(score)
  const color = getScoreColor(status)

  useEffect(() => {
    if (!animated) return
    const duration = 1500
    const steps = 60
    const increment = score / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= score) {
        setDisplayScore(score)
        clearInterval(timer)
      } else {
        setDisplayScore(Math.round(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [score, animated])

  return (
    <div
      className={cn('flex flex-col items-center gap-2', className)}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={maxScore}
    >
      <svg
        width={config.ring}
        height={config.ring}
        className="transform -rotate-90"
      >
        <circle
          cx={config.ring / 2}
          cy={config.ring / 2}
          r={radius}
          fill="none"
          className="stroke-slate-lighter"
          strokeWidth={config.stroke}
        />
        <motion.circle
          cx={config.ring / 2}
          cy={config.ring / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: config.ring, height: config.ring }}
      >
        <span
          className={`font-serif font-bold text-${config.text}`}
          style={{ color }}
        >
          {displayScore}
        </span>
        <span className="text-sm text-slate">{label || `/${maxScore}`}</span>
      </div>
    </div>
  )
}
