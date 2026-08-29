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

        {question.type === 'yesno' && (
          <div className="flex gap-3 sm:gap-4 mt-2">
            {(question.options ?? ['Yes', 'No']).map((opt) => {
              const isSelected = value === opt
              const isYes = opt === 'Yes'
              const isNo = opt === 'No'
              const isUnsure = !isYes && !isNo
              const icon = isYes ? '✓' : isNo ? '✗' : '?'
              return (
                <button
                  key={opt}
                  onClick={() => onChange(opt)}
                  className={cn(
                    'flex-1 py-5 rounded-2xl border-2 text-lg font-semibold transition-all duration-300',
                    isSelected && isYes
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                      : isSelected && isNo
                        ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                        : isSelected && isUnsure
                          ? 'border-slate-light bg-slate-lighter/40 text-slate shadow-[0_0_20px_rgba(100,116,139,0.12)]'
                          : 'border-slate-lighter bg-white text-slate hover:border-slate-light hover:shadow-card'
                  )}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-2xl">{icon}</span>
                    <span className={isUnsure ? 'text-sm sm:text-base' : undefined}>{opt}</span>
                  </div>
                </button>
              )
            })}
          </div>
        )}

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
