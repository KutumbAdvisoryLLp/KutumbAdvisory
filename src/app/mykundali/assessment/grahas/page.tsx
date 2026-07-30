'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import Button from '@/components/Button'
import { ProgressBar } from '@/components/mykundali/progress-bar'
import { QuestionCard } from '@/components/mykundali/question-card'
import { GRAHAS, GRAHA_COLORS, GRAHA_EMOJIS } from '@/lib/kundali/grahas'
import { calculateProgress } from '@/lib/utils'
import type { GrahaId, Answer } from '@/types'

export default function GrahaAssessmentPage() {
  const router = useRouter()
  const [currentGrahaIdx, setCurrentGrahaIdx] = useState(0)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({})

  const graha = GRAHAS[currentGrahaIdx]
  const question = graha.questions[currentQuestionIdx]
  const isLastQuestion = currentQuestionIdx === graha.questions.length - 1
  const isLastGraha = currentGrahaIdx === GRAHAS.length - 1

  const totalQuestions = GRAHAS.reduce((s, g) => s + g.questions.length, 0)
  const answeredCount = Object.keys(answers).length
  const overallProgress = calculateProgress(answeredCount, totalQuestions)

  const currentGrahaProgress = calculateProgress(
    currentQuestionIdx + (answers[question?.id] ? 1 : 0),
    graha.questions.length
  )

  const handleAnswer = useCallback((value: string | number | string[]) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }))
  }, [question.id])

  const handleNext = () => {
    if (isLastQuestion) {
      if (isLastGraha) {
        router.push('/mykundali/assessment/loading')
      } else {
        setCurrentGrahaIdx((i) => i + 1)
        setCurrentQuestionIdx(0)
      }
    } else {
      setCurrentQuestionIdx((i) => i + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((i) => i - 1)
    } else if (currentGrahaIdx > 0) {
      const prevGraha = GRAHAS[currentGrahaIdx - 1]
      setCurrentGrahaIdx((i) => i - 1)
      setCurrentQuestionIdx(prevGraha.questions.length - 1)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handlePrev}
            className="text-sm text-slate hover:text-charcoal transition-colors"
            disabled={currentGrahaIdx === 0 && currentQuestionIdx === 0}
          >
            ← Back
          </button>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1">
              <ProgressBar value={overallProgress} size="sm" showPercentage />
            </div>
            <span className="text-xs font-mono text-slate-light">
              {currentGrahaIdx + 1} of {GRAHAS.length} Grahas
            </span>
          </div>
        </div>

        {/* Graha Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{GRAHA_EMOJIS[graha.id]}</span>
            <div>
              <h2 className="font-serif text-2xl text-navy">
                {graha.name}
              </h2>
              <p className="text-sm text-slate">{graha.subtitle}</p>
            </div>
          </div>
          <p
            className="text-lg font-serif italic pl-4 border-l-2"
            style={{ borderColor: GRAHA_COLORS[graha.id] || '#C9A84C', color: GRAHA_COLORS[graha.id] || '#C9A84C' }}
          >
            &ldquo;{graha.emotion}&rdquo;
          </p>
        </div>

        {/* Question */}
        <div className="min-h-[320px]">
          <AnimatePresence mode="wait">
            <QuestionCard
              key={question.id}
              question={question}
              value={answers[question.id]}
              onChange={handleAnswer}
              questionNumber={currentQuestionIdx + 1}
              totalQuestions={graha.questions.length}
              color={GRAHA_COLORS[graha.id]}
            />
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between">
          <Button showArrow={false} variant="ghost" onClick={handlePrev} disabled={currentGrahaIdx === 0 && currentQuestionIdx === 0}>
            ← Previous
          </Button>

          <div className="flex gap-1.5">
            {graha.questions.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i <= currentQuestionIdx ? 'bg-gold' : 'bg-slate-lighter'
                }`}
              />
            ))}
          </div>

          {isLastQuestion && isLastGraha ? (
            <Button showArrow={false} onClick={handleNext} disabled={!answers[question.id]}>
              See My Results →
            </Button>
          ) : (
            <Button showArrow={false} onClick={handleNext} disabled={!answers[question.id]}>
              {isLastQuestion ? 'Next Graha →' : 'Next →'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
