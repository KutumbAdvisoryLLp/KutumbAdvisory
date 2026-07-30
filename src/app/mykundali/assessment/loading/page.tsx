'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const messages = [
  'Analyzing Wealth Architecture...',
  'Evaluating Financial Strength...',
  'Generating Financial Kundali...',
  'Finding Financial Doshas...',
  'Preparing Personalized Recommendations...',
  'Calculating Your Financial Health Score...',
]

export default function LoadingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [messageIdx, setMessageIdx] = useState(0)
  const [showCheck, setShowCheck] = useState(false)

  useEffect(() => {
    const duration = 4000
    const interval = 50
    const step = 100 / (duration / interval)

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step
        if (next >= 100) {
          clearInterval(progressTimer)
          return 100
        }
        return next
      })
    }, interval)

    const messageTimer = setInterval(() => {
      setMessageIdx((prev) => (prev + 1) % messages.length)
    }, 2500)

    return () => {
      clearInterval(progressTimer)
      clearInterval(messageTimer)
    }
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      setShowCheck(true)
      const timer = setTimeout(() => {
        router.push('/mykundali/assessment/preview')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [progress, router])

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center px-6">
      {/* Mandala */}
      <div
        className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-gold/30 flex items-center justify-center mb-10"
        style={{
          animation: 'rotateMandala 20s linear infinite',
        }}
      >
        <div
          className="w-20 h-20 md:w-28 md:h-28 rounded-full border border-gold/20 flex items-center justify-center"
          style={{
            animation: 'rotateMandala 15s linear infinite reverse',
          }}
        >
          <div
            className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gold/40 to-gold/10"
            style={{
              animation: 'pulseGold 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* Message */}
      {!showCheck ? (
        <p
          key={messageIdx}
          className="text-gold-light font-serif text-xl md:text-2xl text-center transition-opacity duration-500"
        >
          {messages[messageIdx]}
        </p>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#A8791F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" strokeDasharray="50" strokeDashoffset="50" style={{ animation: 'checkDraw 0.6s ease-out forwards' }} />
          </svg>
          <p className="text-gold font-serif text-2xl">Your Financial Kundali is Ready</p>
        </div>
      )}

      {/* Progress */}
      <div className="mt-10 w-full max-w-md">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-white/40 text-xs font-mono text-center mt-2">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  )
}
