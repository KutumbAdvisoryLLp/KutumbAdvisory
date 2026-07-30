'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { ScoreRing } from '@/components/mykundali/score-ring'
import { LockedContent } from '@/components/mykundali/locked-content'
import { PaywallSection } from '@/components/mykundali/paywall-section'
import { GRAHA_IDS } from '@/types'
import { GRAHA_COLORS, GRAHA_EMOJIS } from '@/lib/kundali/grahas'

const scores: Record<string, number> = {
  surya: 8, chandra: 6, mangal: 7, budh: 5, guru: 6,
  shukra: 7, shani: 5, rahu: 4, ketu: 6,
}
const overallScore = 54
const strongest = 'Mangal'
const weakest = 'Rahu'

const lockedGrahas = ['guru', 'shukra', 'shani', 'rahu', 'ketu']

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-white pb-40">
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        {/* Back */}
        <button className="text-sm text-slate hover:text-charcoal transition-colors mb-8">
          ← Back
        </button>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-gold mb-4">
            Financial Kundali™
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-navy">
            Your Financial Kundali
          </h1>
        </motion.div>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="relative">
            <ScoreRing score={overallScore} maxScore={90} size="xl" />
          </div>
          <div className="mt-4 text-center">
            <div className="text-2xl text-gold-dark">★★★★☆</div>
            <p className="text-slate mt-1">Fair · Room for improvement</p>
          </div>
        </motion.div>

        {/* Strongest / Weakest */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4 mb-12"
        >
          <div className="p-5 bg-white rounded-2xl border border-slate-lighter/20 shadow-card">
            <p className="text-xs text-slate-light uppercase tracking-wider mb-1">Strongest</p>
            <p className="font-serif text-xl text-success">{strongest}</p>
            <p className="text-sm text-slate">Score: {scores.mangal}/10</p>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-lighter/20 shadow-card">
            <p className="text-xs text-slate-light uppercase tracking-wider mb-1">Weakest</p>
            <p className="font-serif text-xl text-error">{weakest}</p>
            <p className="text-sm text-slate">Score: {scores.rahu}/10</p>
          </div>
        </motion.div>

        {/* Radar Chart (visible) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-12 p-6 bg-white rounded-2xl border border-slate-lighter/20 shadow-card"
        >
          <h3 className="font-serif text-xl text-navy mb-4">Financial Health Overview</h3>
          <div className="flex items-center justify-center h-64">
            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              {GRAHA_IDS.map((id) => (
                <div key={id} className="flex flex-col items-center gap-1 p-2">
                  <span className="text-xl">{GRAHA_EMOJIS[id]}</span>
                  <div className="w-full bg-slate-lighter rounded-full h-1.5">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(scores[id] / 10) * 100}%`,
                        backgroundColor: GRAHA_COLORS[id],
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-slate">{scores[id]}/10</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Graha Scores Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <h3 className="font-serif text-xl text-navy mb-4">Graha Scores</h3>
          <div className="space-y-2">
            {GRAHA_IDS.slice(0, 4).map((id) => (
              <div key={id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-lighter/20">
                <span className="text-xl">{GRAHA_EMOJIS[id]}</span>
                <span className="flex-1 font-medium capitalize text-charcoal">{id}</span>
                <div className="flex gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${i < scores[id] ? 'bg-gold' : 'bg-slate-lighter'}`}
                    />
                  ))}
                </div>
                <span className="font-mono text-sm text-slate">{scores[id]}/10</span>
              </div>
            ))}
          </div>
          <LockedContent blur={6} className="mt-2">
            <div className="space-y-2">
              {lockedGrahas.map((id) => (
                <div key={id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-lighter/20">
                  <span className="text-xl">{GRAHA_EMOJIS[id]}</span>
                  <span className="flex-1 font-medium capitalize text-charcoal">{id}</span>
                  <span className="font-mono text-sm text-slate">?/10</span>
                </div>
              ))}
            </div>
          </LockedContent>
        </motion.div>

        {/* Recommendations Preview */}
        <div className="mb-12">
          <h3 className="font-serif text-xl text-navy mb-4">Recommendations</h3>
          <div className="p-5 bg-white rounded-2xl border border-slate-lighter/20 shadow-card mb-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-success shrink-0" size={20} strokeWidth={1.75} />
              <div>
                <p className="font-medium text-charcoal">Emergency Fund</p>
                <p className="text-sm text-slate mt-1">
                  Build 6 months of expenses as your financial safety net.
                </p>
              </div>
            </div>
          </div>
          <LockedContent blur={6}>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5 bg-white rounded-2xl border border-slate-lighter/20 shadow-card">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-stone/40 shrink-0" size={20} strokeWidth={1.75} />
                    <div>
                      <p className="font-medium text-charcoal">Recommendation {i}</p>
                      <p className="text-sm text-slate mt-1">
                        Detailed recommendation content goes here.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </LockedContent>
        </div>

        {/* Advisor Notes Locked */}
        <div className="mb-12">
          <h3 className="font-serif text-xl text-navy mb-4">Advisor Notes</h3>
          <LockedContent blur={8}>
            <div className="p-6 bg-white rounded-2xl border border-slate-lighter/20 shadow-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold-light/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-gold-dark font-serif font-semibold">KS</span>
                </div>
                <div>
                  <p className="font-medium text-charcoal">Note from your advisor</p>
                  <p className="text-sm text-slate mt-2 leading-relaxed">
                    Personalized advisor notes based on your Financial Kundali results.
                    Includes specific observations and recommendations for each Graha.
                  </p>
                  <p className="text-xs text-slate-light mt-3">
                    — Kutumb Advisory Team
                  </p>
                </div>
              </div>
            </div>
          </LockedContent>
        </div>

        {/* Financial Wheel Locked */}
        <div className="mb-12">
          <h3 className="font-serif text-xl text-navy mb-4">Financial Wheel</h3>
          <LockedContent blur={8}>
            <div className="p-6 bg-white rounded-2xl border border-slate-lighter/20 shadow-card h-64 flex items-center justify-center">
              <span className="text-slate-light font-serif text-lg">Interactive Financial Wheel</span>
            </div>
          </LockedContent>
        </div>
      </div>

      {/* Paywall */}
      <PaywallSection />
    </div>
  )
}
