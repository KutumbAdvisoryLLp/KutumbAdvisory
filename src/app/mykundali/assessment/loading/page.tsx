'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Json } from '@/lib/supabase/types'
import { useMykundaliAuth } from '@/components/mykundali/AuthContext'
import { computeAssessmentResult, type GrahaAnswerMap } from '@/lib/kundali/assessment'
import type { FamilyProfile, GrahaId, Member, InvestmentEntry, InsuranceEntry } from '@/types'

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
  const supabase = useMemo(() => createClient(), [])
  const { userId } = useMykundaliAuth()
  const [progress, setProgress] = useState(0)
  const [messageIdx, setMessageIdx] = useState(0)
  const [saveError, setSaveError] = useState(false)
  const showCheck = progress >= 100
  const computeRef = useRef<Promise<boolean> | null>(null)

  // Compute + persist the assessment result in parallel with the loading
  // animation — the navigation effect below awaits this before redirecting.
  useEffect(() => {
    if (!userId) return
    computeRef.current = (async () => {
      const [profileRes, answersRes] = await Promise.all([
        supabase.from('family_profiles').select('*').eq('customer_id', userId).maybeSingle(),
        supabase.from('assessment_answers').select('graha_id, question_id, value').eq('customer_id', userId),
      ])

      const profileRow = profileRes.data
      const pm = profileRow?.primary_member as any
      const profile: FamilyProfile = {
        primaryMember: {
          name: pm?.name ?? '',
          age: pm?.age ?? 35,
          relation: pm?.relation ?? 'self',
          occupation: pm?.occupation ?? '',
          income: pm?.income ?? 0,
        },
        spouse: (profileRow?.spouse as unknown as Member) ?? undefined,
        children: (profileRow?.children as unknown as Member[]) ?? [],
        monthlyExpenses: profileRow?.monthly_expenses ?? 0,
        totalAssets: profileRow?.total_assets ?? 0,
        totalLiabilities: profileRow?.total_liabilities ?? 0,
        riskProfile: profileRow?.risk_profile ?? 'moderate',
        goals: profileRow?.goals ?? [],
        existingInvestments: (profileRow?.existing_investments as unknown as InvestmentEntry[]) ?? [],
        existingInsurance: (profileRow?.existing_insurance as unknown as InsuranceEntry[]) ?? [],
        familyName: pm?.familyName ?? '',
        timeHorizon: pm?.timeHorizon ?? '',
        netWorthWorksheet: pm?.netWorthWorksheet ?? {
          assets: { bankFD: 0, mutualFunds: 0, shares: 0, property: 0, gold: 0, epfPpfNps: 0 },
          liabilities: { homeLoan: 0, personalLoan: 0, vehicleLoan: 0, creditCard: 0, otherLoans: 0 }
        },
      }

      const answerMap: GrahaAnswerMap = {}
      for (const row of answersRes.data ?? []) {
        const grahaId = row.graha_id as GrahaId
        if (!answerMap[grahaId]) answerMap[grahaId] = {}
        answerMap[grahaId]![row.question_id] = row.value as never
      }

      const result = computeAssessmentResult(profile, answerMap)

      const { error } = await supabase.from('assessment_results').upsert(
        {
          customer_id: userId,
          overall_score: result.overallScore,
          overall_status: result.overallStatus,
          graha_scores: result.grahaScores,
          graha_details: result.grahaDetails as unknown as Json,
          recommendations: result.recommendations,
          advisor_notes: result.advisorNotes,
          action_plan: result.actionPlan as unknown as Json,
          strongest_graha: result.strongestGraha,
          weakest_graha: result.weakestGraha,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'customer_id' }
      )

      if (error) {
        console.error('Failed to save assessment_results:', error.message)
        setSaveError(true)
        return false
      }
      return true
    })()
  }, [userId, supabase])

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
    if (showCheck) {
      const timer = setTimeout(async () => {
        const saved = await computeRef.current
        if (saved) router.push('/mykundali/assessment/preview')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [showCheck, router])

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
      {saveError ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-gold font-serif text-2xl">
            We couldn&apos;t save your Financial Kundali
          </p>
          <p className="text-white/50 text-sm max-w-sm">
            Something went wrong while saving your results. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded-xl bg-gold px-6 py-3 text-sm font-medium text-navy transition-opacity hover:opacity-90"
          >
            Retry
          </button>
        </div>
      ) : !showCheck ? (
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
