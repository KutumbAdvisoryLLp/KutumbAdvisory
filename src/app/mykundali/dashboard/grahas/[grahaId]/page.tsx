'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { GRAHAS, GRAHA_COLORS, GRAHA_EMOJIS } from '@/lib/kundali/grahas'
import { getScoreStatus, getScoreColor } from '@/types'
import { ScoreRing } from '@/components/mykundali/score-ring'

const scores: Record<string, number> = {
  surya: 8, chandra: 6, mangal: 7, budh: 5, guru: 6,
  shukra: 7, shani: 5, rahu: 4, ketu: 6,
}

const mockDetail = {
  observations: [
    'Single income stream — entire family relies on one source',
    'No passive income generating assets',
    'Stable employment with growth potential',
  ],
  suggestions: [
    'Build 2+ diversified income streams',
    'Explore passive income opportunities',
    'Invest in upskilling for career advancement',
    'Review salary negotiation position',
  ],
  advisorNote:
    'Your income stability is commendable. However, relying on a single income stream is risky for a family. Let\'s explore ways to diversify through side businesses, investments, or freelance opportunities.',
  advisor: 'Priya Sharma, CFP',
  calculators: [
    { name: 'Income Growth Calculator', desc: 'Project your earning potential' },
    { name: 'Human Capital Calculator', desc: 'Calculate your lifetime earning power' },
  ],
  resources: [
    '7 Ways to Diversify Your Income in 2025',
    'The Power of Passive Income',
    'How to Negotiate Your Salary',
  ],
  progress: [
    { label: 'Income Streams', value: 40 },
    { label: 'Passive Income', value: 20 },
    { label: 'Career Growth Plan', value: 10 },
  ],
}

export default function GrahaDetailPage() {
  const params = useParams()
  const grahaId = params.grahaId as string
  const graha = GRAHAS.find((g) => g.id === grahaId)

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

  const score = scores[grahaId] || 0
  const status = getScoreStatus(score)
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
            {mockDetail.observations.map((obs, i) => (
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
            {mockDetail.suggestions.map((sug, i) => (
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
            <span className="text-gold-dark font-serif font-semibold">PS</span>
          </div>
          <div>
            <p className="text-sm text-slate leading-relaxed">
              &ldquo;{mockDetail.advisorNote}&rdquo;
            </p>
            <p className="text-xs text-slate-light mt-3">
              — {mockDetail.advisor}, Senior Wealth Architect
            </p>
          </div>
        </div>
      </motion.div>

      {/* Calculators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <h2 className="font-serif text-xl text-navy mb-4">Recommended Calculators</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {mockDetail.calculators.map((calc) => (
            <button
              key={calc.name}
              className="p-5 bg-white rounded-xl border border-slate-lighter/20 shadow-card hover:shadow-card-hover transition-all text-left group"
            >
              <p className="font-medium text-charcoal group-hover:text-gold-dark transition-colors">
                {calc.name}
              </p>
              <p className="text-sm text-slate mt-1">{calc.desc}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Resources */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <h2 className="font-serif text-xl text-navy mb-4">Related Resources</h2>
        <div className="space-y-2">
          {mockDetail.resources.map((res, i) => (
            <div
              key={i}
              className="p-4 bg-white rounded-xl border border-slate-lighter/20 shadow-card flex items-center gap-3"
            >
              <span className="text-slate-light">📄</span>
              <span className="text-sm text-charcoal">{res}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Progress Tracking */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 mb-10"
      >
        <h2 className="font-serif text-xl text-navy mb-4">Progress Tracking</h2>
        <div className="p-6 bg-white rounded-2xl border border-slate-lighter/20 shadow-card space-y-4">
          {mockDetail.progress.map((p) => (
            <div key={p.label}>
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
