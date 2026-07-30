'use client'

import { motion } from 'framer-motion'

interface CrossSellProps {
  toolName: string
  onStartAssessment?: () => void
}

export function CrossSell({ toolName, onStartAssessment }: CrossSellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-5 bg-navy rounded-2xl border border-gold/20"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-gold-light text-sm font-medium mb-1">
            You&apos;ve just evaluated one part of your financial life.
          </p>
          <p className="text-white/60 text-sm leading-relaxed">
            Your family&apos;s financial wellbeing depends on nine interconnected pillars.
            Financial Kundali analyzes all nine together and creates a personalized
            Financial Blueprint with actionable recommendations.
          </p>
        </div>
        <button
          onClick={onStartAssessment}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-navy rounded-xl font-medium text-sm hover:bg-gold-dark transition-colors whitespace-nowrap flex-shrink-0"
        >
          Begin Your Financial Kundali →
        </button>
      </div>
    </motion.div>
  )
}
