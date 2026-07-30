'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Question } from '@/types'

interface QuestionCardProps {
  question: Question
  value?: string | number | string[]
  onChange: (value: string | number | string[]) => void
  questionNumber: number
  totalQuestions: number
  color?: string
}

const slideVariants = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 },
}

export function QuestionCard({
  question,
  value,
  onChange,
  questionNumber,
  totalQuestions,
  color = '#A8791F',
}: QuestionCardProps) {
  return (
    <motion.div
      key={question.id}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <div className="mb-8">
        <span className="text-xs font-mono text-slate-light uppercase tracking-wider">
          Question {questionNumber} of {totalQuestions}
        </span>
        <h3 className="mt-2 font-serif text-2xl md:text-3xl text-charcoal leading-tight">
          {question.text}
        </h3>
      </div>

      <div className="space-y-3">
        {question.type === 'radio' &&
          question.options?.map((option) => {
            const isSelected = value === option
            return (
              <button
                key={option}
                onClick={() => onChange(option)}
                className={cn(
                  'w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200',
                  isSelected
                    ? 'border-gold bg-gold-light/20 shadow-glow-gold'
                    : 'border-slate-lighter bg-white hover:border-slate-light hover:shadow-card'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                      isSelected ? 'border-gold' : 'border-slate-lighter'
                    )}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-base',
                      isSelected ? 'font-medium text-charcoal' : 'text-slate'
                    )}
                  >
                    {option}
                  </span>
                </div>
              </button>
            )
          })}

        {question.type === 'input' && (
          <input
            type="text"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-5 py-4 rounded-xl border-2 border-slate-lighter bg-white text-charcoal text-lg focus:border-gold focus:outline-none focus:shadow-glow-gold transition-all duration-200"
            placeholder="Type your answer..."
          />
        )}

        {question.type === 'currency' && (
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg text-slate font-medium">
              ₹
            </span>
            <input
              type="number"
              value={(value as number) || ''}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full pl-10 pr-5 py-4 rounded-xl border-2 border-slate-lighter bg-white text-charcoal text-lg focus:border-gold focus:outline-none focus:shadow-glow-gold transition-all duration-200"
              placeholder="0"
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}
