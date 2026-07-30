'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { GRAHAS, GRAHA_COLORS, GRAHA_EMOJIS } from '@/lib/kundali/grahas'
import { getScoreColor } from '@/types'
import { ScoreRing } from '@/components/mykundali/score-ring'
import { createClient } from '@/lib/supabase/client'
import { useMykundaliAuth } from '@/components/mykundali/AuthContext'
import type { GrahaDetail, GrahaId } from '@/types'

export default function GrahaDetailPage() {
  const params = useParams()
  const grahaId = params.grahaId as string
  const graha = GRAHAS.find((g) => g.id === grahaId)

  const supabase = useMemo(() => createClient(), [])
  const { userId } = useMykundaliAuth()
  const [detail, setDetail] = useState<GrahaDetail | null>(null)

  useEffect(() => {
    if (!userId || !graha) return
    ;(async () => {
      const { data } = await supabase
        .from('assessment_results')
        .select('graha_details')
        .eq('customer_id', userId)
        .maybeSingle()
      if (data) {
        const allDetails = data.graha_details as unknown as Record<GrahaId, GrahaDetail>
        setDetail(allDetails[grahaId as GrahaId] ?? null)
      }
    })()
  }, [userId, grahaId, graha, supabase])

  if (!graha) {
    return (
      <div className="text-center py-20">
        <p className="text-slate">Graha not found.</p>
        <Link href="/mykundali/dashboard/grahas" className="text-gold mt-4 inline-block">
          ← Back to Grahas
        </Link>
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="text-center py-20">
        <p className="text-slate">Loading your {graha.name} insights…</p>
      </div>
    )
  }

  const score = detail.score
  const status = detail.status
  const color = getScoreColor(status)

  return (
    <div>
      <Link
        href="/mykundali/dashboard/grahas"
        className="text-sm text-slate hover:text-charcoal transition-colors"
      >
        ← All Grahas
      </Link>

      {/* Score Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 p-8 bg-white rounded-3xl border border-slate-lighter/20 shadow-card"
        style={{ borderLeftColor: GRAHA_COLORS[grahaId], borderLeftWidth: 4 }}
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ScoreRing score={score} maxScore={10} size="lg" />
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{GRAHA_EMOJIS[grahaId]}</span>
              <h1 className="font-serif text-3xl md:text-4xl text-navy">
                {graha.name}
              </h1>
            </div>
            <p className="text-slate mb-2">{graha.subtitle}</p>
            <div className="flex items-center gap-2">
              <div className="text-lg" style={{ color }}>
                {'★'.repeat(Math.ceil(score / 2))}{'☆'.repeat(5 - Math.ceil(score / 2))}
              </div>
              <span className="text-sm capitalize font-medium" style={{ color }}>
                {status}
              </span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-base text-slate italic border-l-2 border-gold pl-4">
          &ldquo;{graha.emotion}&rdquo;
        </p>
      </motion.div>

      {/* Observations + Suggestions */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white rounded-2xl border border-slate-lighter/20 shadow-card"
        >
          <h2 className="font-serif text-xl text-navy mb-4">Observations</h2>
          <ul className="space-y-3">
            {detail.observations.map((obs, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate">
                <span className="text-gold-dark mt-0.5">•</span>
                {obs}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white rounded-2xl border border-slate-lighter/20 shadow-card"
        >
          <h2 className="font-serif text-xl text-navy mb-4">Suggestions</h2>
          <ul className="space-y-3">
            {detail.suggestions.map((sug, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate">
                <span className="text-success mt-0.5">→</span>
                {sug}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Advisor Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-6 bg-white rounded-2xl border border-slate-lighter/20 shadow-card"
        style={{ borderLeftColor: '#C9A84C', borderLeftWidth: 3 }}
      >
        <h2 className="font-serif text-xl text-navy mb-4">Advisor Notes</h2>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gold-light/30 flex items-center justify-center flex-shrink-0">
            <span className="text-gold-dark font-serif font-semibold">KA</span>
          </div>
          <div>
            <p className="text-sm text-slate leading-relaxed">
              &ldquo;{detail.advisorNote}&rdquo;
            </p>
            <p className="text-xs text-slate-light mt-3">
              — Kutumb Advisory
            </p>
          </div>
        </div>
      </motion.div>

      {/* Calculators */}
      {detail.calculators.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="font-serif text-xl text-navy mb-4">Recommended Calculators</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {detail.calculators.map((calc) => (
              <Link
                key={calc.name}
                href="/toolkit"
                className="p-5 bg-white rounded-xl border border-slate-lighter/20 shadow-card hover:shadow-card-hover transition-all text-left group block"
              >
                <p className="font-medium text-charcoal group-hover:text-gold-dark transition-colors">
                  {calc.name}
                </p>
                <p className="text-sm text-slate mt-1">{calc.description}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Progress Tracking */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 mb-10"
      >
        <h2 className="font-serif text-xl text-navy mb-4">Progress Tracking</h2>
        <div className="p-6 bg-white rounded-2xl border border-slate-lighter/20 shadow-card space-y-4">
          {detail.progress.map((p, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-charcoal">{p.label}</span>
                <span className="font-mono text-xs text-slate">{p.value}%</span>
              </div>
              <div className="bg-slate-lighter rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gold transition-all duration-1000"
                  style={{ width: `${p.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
