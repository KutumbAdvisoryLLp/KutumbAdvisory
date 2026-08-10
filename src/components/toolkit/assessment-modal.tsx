'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RefreshCw } from 'lucide-react'
import { CrossSell } from './cross-sell'
import { ToolIcon } from './tool-icons'
import { ScoreRing } from '@/components/mykundali/score-ring'
import type { AssessmentDef } from '@/lib/kundali/toolkit'

interface AssessmentModalProps {
  assessment: AssessmentDef
  onClose: () => void
  onStartAssessment?: () => void
}

function getStatus(score: number): { label: string; color: string } {
  if (score >= 8) return { label: 'Excellent', color: '#2D9B6E' }
  if (score >= 6) return { label: 'Good', color: '#C9A84C' }
  if (score >= 4) return { label: 'Fair', color: '#D4A84B' }
  return { label: 'Needs Attention', color: '#C0392B' }
}

function getSuggestions(score: number, title: string): string[] {
  const base = score < 4
    ? ['Start by creating a basic plan for this area', 'Consider consulting a financial advisor']
    : score < 6
    ? ['Review current practices and identify gaps', 'Set specific targets for improvement']
    : score < 8
    ? ['Fine-tune your approach for better results', 'Consider professional optimization']
    : ['Your practices are strong — maintain consistency', 'Review periodically for changes']
  return base
}

export function AssessmentModal({ assessment, onClose, onStartAssessment }: AssessmentModalProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [showCrossSell, setShowCrossSell] = useState(false)

  const totalScore = useMemo(() => {
    let s = 0
    for (const [qId, val] of Object.entries(answers)) {
      const q = assessment.questions.find(q => q.id === qId)
      if (q) {
        const opt = q.options.find(o => o.value === val)
        if (opt) s += opt.score
      }
    }
    return Math.round(s / (assessment.questions.length * 10) * 10)
  }, [answers, assessment.questions])

  const status = getStatus(totalScore)
  const suggestions = getSuggestions(totalScore, assessment.title)

  const handleSubmit = () => {
    setShowResult(true)
    setShowCrossSell(true)
  }

  const handleReset = () => {
    setAnswers({})
    setShowResult(false)
    setShowCrossSell(false)
  }

  const allAnswered = assessment.questions.every(q => answers[q.id])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-navy/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-modal max-w-xl w-full max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden"
        >
          <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 border-b border-slate-lighter/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-navy-light/20 to-navy-light/5 flex items-center justify-center shrink-0">
                <ToolIcon id={assessment.id} className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="font-serif text-lg sm:text-xl text-navy">{assessment.title}</h2>
                <p className="text-xs text-slate">{assessment.time}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-lighter/20 transition-colors shrink-0">
              <X size={16} className="text-slate" />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            {!showResult ? (
              <div className="space-y-6">
                {assessment.questions.map((q, qi) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: qi * 0.08 }}
                  >
                    <p className="text-sm font-medium text-charcoal mb-3">
                      {qi + 1}. {q.text}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt) => {
                        const selected = answers[q.id] === opt.value
                        return (
                          <button
                            key={opt.value}
                            onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.value }))}
                            className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                              selected
                                ? 'border-navy bg-navy/5 text-navy font-medium'
                                : 'border-slate-lighter/30 bg-white text-slate hover:border-navy-mid/20'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                selected ? 'border-navy' : 'border-slate-lighter'
                              }`}>
                                {selected && <div className="w-2 h-2 rounded-full bg-navy" />}
                              </div>
                              <span className="text-sm">{opt.label}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                ))}

                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className="w-full py-3 bg-navy text-white rounded-xl font-medium hover:bg-navy-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {allAnswered ? 'See My Score →' : 'Answer all questions to see your score'}
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center py-4">
                  <ScoreRing score={totalScore} maxScore={10} size="lg" animated />
                  <div className="mt-3 text-center">
                    <span className="text-lg font-medium" style={{ color: status.color }}>{status.label}</span>
                    <p className="text-xs text-slate mt-1">{assessment.title}</p>
                  </div>
                </div>

                <div className="p-5 bg-navy rounded-2xl">
                  <h3 className="text-gold font-serif text-lg mb-3">Suggestions</h3>
                  <ul className="space-y-2">
                    {suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                        <span className="text-gold mt-0.5">→</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-xs text-slate text-center leading-relaxed">
                  This is a quick assessment of one area of your financial life.
                  For a complete evaluation of all 9 pillars, try the full Financial Kundali.
                </p>

                <div className="flex gap-3">
                  <button onClick={handleReset} className="flex items-center justify-center gap-2 flex-1 py-3 border-2 border-slate-lighter rounded-xl text-sm text-slate hover:border-slate-light transition-colors">
                    <RefreshCw size={14} /> Retake
                  </button>
                </div>

                {showCrossSell && <CrossSell toolName={assessment.title} onStartAssessment={onStartAssessment} />}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
