'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { ScoreRing } from '@/components/mykundali/score-ring'
import { getGreeting } from '@/lib/utils'
import { GRAHAS, GRAHA_COLORS, GRAHA_EMOJIS } from '@/lib/kundali/grahas'
import { createClient } from '@/lib/supabase/client'
import { useMykundaliAuth } from '@/components/mykundali/AuthContext'
import type { ActionItem, GrahaId } from '@/types'

const overallMax = 90

const statusLabels: Record<string, string> = {
  excellent: 'Strong (81–90)',
  good: 'Mild Dosha (63–80)',
  fair: 'Moderate (36–62)',
  poor: 'Severe Dosha (0–35)',
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const { userId, user } = useMykundaliAuth()

  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [overallScore, setOverallScore] = useState(0)
  const [overallStatus, setOverallStatus] = useState('fair')
  const [advisorNotes, setAdvisorNotes] = useState('')
  const [actionPlan, setActionPlan] = useState<ActionItem[]>([])

  useEffect(() => {
    if (!userId) return
    ;(async () => {
      const { data } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('customer_id', userId)
        .maybeSingle()

      if (!data) {
        router.replace('/mykundali/assessment/landing')
        return
      }

      setScores(data.graha_scores as unknown as Record<string, number>)
      setOverallScore(data.overall_score)
      setOverallStatus(data.overall_status)
      setAdvisorNotes(data.advisor_notes ?? '')
      setActionPlan((data.action_plan as unknown as ActionItem[]) ?? [])
      setLoading(false)
    })()
  }, [userId, supabase, router])

  const overallPercent = overallMax ? overallScore / overallMax : 0
  const overallStars = Math.max(1, Math.round(overallPercent * 5))
  const displayName = user?.fullName?.split(' ')[0] || 'there'

  if (loading) return null

  return (
    <div>
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-serif text-3xl md:text-4xl text-navy">
          {getGreeting()}, {displayName}
        </h1>
        <p className="text-slate mt-1">Here&apos;s your Financial Kundali overview.</p>
      </motion.div>

      {/* Score + Status */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white rounded-2xl shadow-card flex flex-col items-center justify-center border border-slate-lighter/20"
        >
          <ScoreRing score={overallScore} maxScore={overallMax} size="lg" className="relative" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white rounded-2xl shadow-card flex flex-col justify-center border border-slate-lighter/20"
        >
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={20}
                className={i < overallStars ? 'text-gold fill-gold' : 'text-slate-lighter'}
              />
            ))}
          </div>
          <span className="text-xs uppercase tracking-wider text-slate-light font-semibold">
            Kundali Rating Band
          </span>
          <p className="font-serif text-2xl text-navy mt-1">
            {statusLabels[overallStatus] || 'Financial Health Assessment'}
          </p>
          <p className="text-sm text-slate mt-2 leading-relaxed">{advisorNotes}</p>
        </motion.div>
      </div>

      {/* Nine Graha Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-10"
      >
        <h2 className="font-serif text-2xl text-navy mb-4">Nine Graha</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {GRAHAS.map((g) => (
            <Link
              key={g.id}
              href={`/mykundali/dashboard/grahas/${g.id}`}
              className="p-4 bg-white rounded-xl border border-slate-lighter/20 shadow-card hover:shadow-card-hover transition-all text-center group"
            >
              <div
                className="text-2xl mb-2 group-hover:scale-110 transition-transform"
              >
                {GRAHA_EMOJIS[g.id]}
              </div>
              <p className="text-xs font-medium text-charcoal truncate">{g.name}</p>
              <div className="mt-2 flex justify-center gap-0.5">
                {Array.from({ length: 10 }).map((_, j) => (
                  <div
                    key={j}
                    className={`w-1.5 h-1.5 rounded-full ${
                      j < (scores[g.id] ?? 0) ? 'bg-gold' : 'bg-slate-lighter'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-mono text-slate mt-1">
                {scores[g.id] ?? 0}/10
              </p>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Financial Wheel + Advisor Notes */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 bg-white rounded-2xl border border-slate-lighter/20 shadow-card"
        >
          <h3 className="font-serif text-xl text-navy mb-4">Financial Wheel</h3>
          <div className="grid grid-cols-3 gap-4">
            {GRAHAS.slice(0, 9).map((g) => (
              <div key={g.id} className="flex flex-col items-center gap-1">
                <span className="text-lg">{GRAHA_EMOJIS[g.id]}</span>
                <div
                  className="w-2 h-8 rounded-full bg-slate-lighter overflow-hidden"
                >
                  <div
                    className="w-full rounded-full transition-all duration-1000"
                    style={{
                      height: `${((scores[g.id] ?? 0) / 10) * 100}%`,
                      backgroundColor: GRAHA_COLORS[g.id],
                      marginTop: 'auto',
                    }}
                  />
                </div>
                <span className="text-xs font-mono text-slate">{scores[g.id] ?? 0}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white rounded-2xl border border-slate-lighter/20 shadow-card"
        >
          <h3 className="font-serif text-xl text-navy mb-4">Advisor Notes</h3>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gold-light/30 flex items-center justify-center flex-shrink-0">
              <span className="text-gold-dark font-serif font-semibold">KA</span>
            </div>
            <div>
              <p className="font-medium text-charcoal">Kutumb Advisory</p>
              <p className="text-sm text-slate mt-2 leading-relaxed">
                {advisorNotes || 'Complete your assessment to receive personalized notes.'}
              </p>
              <Link
                href="/mykundali/dashboard/grahas"
                className="text-sm text-gold hover:text-gold-dark mt-3 inline-block transition-colors"
              >
                See all notes →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Priorities */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-10"
      >
        <h2 className="font-serif text-2xl text-navy mb-4">Top Priorities</h2>
        <div className="space-y-3">
          {actionPlan.slice(0, 3).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-5 bg-white rounded-xl border border-slate-lighter/20 shadow-card flex items-center gap-4"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: GRAHA_COLORS[p.grahaId as GrahaId] }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-charcoal">{p.title}</p>
                <p className="text-sm text-slate line-clamp-1">
                  {p.description}
                </p>
              </div>
              <Link
                href="/mykundali/dashboard/action-plan"
                className="text-sm text-gold hover:text-gold-dark transition-colors flex-shrink-0"
              >
                View →
              </Link>
            </motion.div>
          ))}
          {actionPlan.length === 0 && (
            <p className="text-sm text-slate-light">No priorities yet.</p>
          )}
        </div>
      </motion.div>

      {/* Actions to Take */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-10 mb-10"
      >
        <h2 className="font-serif text-2xl text-navy mb-4">Actions to Take</h2>
        <div className="p-6 bg-white rounded-2xl border border-slate-lighter/20 shadow-card">
          <div className="space-y-4">
            {actionPlan.slice(3, 6).map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: GRAHA_COLORS[item.grahaId as GrahaId] }}
                />
                <span className="text-sm text-charcoal">{item.title}</span>
              </div>
            ))}
            {actionPlan.slice(3, 6).length === 0 && (
              <p className="text-sm text-slate-light">No further actions yet — great work.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
