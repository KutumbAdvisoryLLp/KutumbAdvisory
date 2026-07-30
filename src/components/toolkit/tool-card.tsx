'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ToolIcon } from './tool-icons'

interface ToolCardProps {
  icon: string
  title: string
  description: string
  time: string
  category?: string
  onClick: () => void
  variant?: 'calculator' | 'checklist' | 'assessment'
  featured?: boolean
}

const badgeStyle = 'bg-gold/10 text-gold border-gold/20'

export function ToolCard({ icon, title, description, time, category, onClick, variant = 'calculator', featured = false }: ToolCardProps) {
  if (featured) {
    return (
      <motion.button
        onClick={onClick}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="w-full text-center bg-white rounded-3xl border border-gold/20 shadow-card hover:shadow-[0_12px_40px_rgba(32,27,98,0.10),0_4px_12px_rgba(168,121,31,0.08)] transition-all duration-300 group relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="p-8 md:p-10 relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-glow-gold transition-all duration-300">
            <ToolIcon id={icon} className="w-10 h-10" />
          </div>
          <span className={cn('inline-block text-[11px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border mb-4', badgeStyle)}>
            FREE
          </span>
          <h3 className="font-serif text-[28px] md:text-[30px] text-navy mb-2 leading-tight">
            {title}
          </h3>
          <p className="text-[15px] text-slate leading-relaxed mb-6 max-w-md">
            {description}
          </p>
          <div className="flex items-center gap-5">
            <span className="text-sm text-slate-light">{time}</span>
            <span className="text-sm font-medium text-gold flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
              Open Tool
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </div>
        </div>
      </motion.button>
    )
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.008 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'w-full bg-white rounded-2xl border border-slate-lighter/15 shadow-sm hover:shadow-[0_12px_32px_rgba(32,27,98,0.08)] transition-all duration-300 group relative overflow-hidden flex flex-col',
        'min-h-[340px]',
        'hover:border-gold/30'
      )}
    >
      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Hover glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="px-5 py-5 md:px-6 md:py-6 flex flex-col flex-1 relative z-10">
        {/* Top row: icon + badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/15 to-gold/5 flex items-center justify-center group-hover:scale-110 group-hover:shadow-glow-gold transition-all duration-300 group-hover:rotate-[-4deg]">
            <ToolIcon id={icon} className="w-7 h-7" />
          </div>
          <span className={cn('text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border flex-shrink-0', badgeStyle)}>
            FREE
          </span>
        </div>

        {/* Middle: title + description — primary visual anchor */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="font-serif text-[20px] md:text-[22px] text-navy leading-snug font-semibold line-clamp-2">
            {title}
          </h3>
          <p className="text-[14px] md:text-[15px] text-slate leading-snug mt-1.5 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Bottom: time + arrow */}
        <div className="flex items-center justify-between pt-3 mt-2">
          <span className="text-[12px] text-slate-light">{time}</span>
          <span className="text-[12px] font-medium text-gold/70 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:gap-1.5">
            Open
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </div>
    </motion.button>
  )
}
