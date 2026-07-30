'use client'

import Link from 'next/link'
import { GRAHAS, GRAHA_COLORS, GRAHA_EMOJIS } from '@/lib/kundali/grahas'

const scores: Record<string, number> = {
  surya: 8, chandra: 6, mangal: 7, budh: 5, guru: 6,
  shukra: 7, shani: 5, rahu: 4, ketu: 6,
}

export default function GrahasListPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Nine Graha</h1>
      <p className="text-slate mt-1">Detailed breakdown of each financial pillar.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {GRAHAS.map((g) => (
          <Link
            key={g.id}
            href={`/mykundali/dashboard/grahas/${g.id}`}
            className="p-6 bg-white rounded-2xl border border-slate-lighter/20 shadow-card hover:shadow-card-hover transition-all group"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl">{GRAHA_EMOJIS[g.id]}</span>
              <div>
                <h3 className="font-serif text-xl text-charcoal group-hover:text-gold-dark transition-colors">
                  {g.name}
                </h3>
                <p className="text-xs text-slate">{g.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 bg-slate-lighter rounded-full h-2">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(scores[g.id] / 10) * 100}%`,
                    backgroundColor: GRAHA_COLORS[g.id],
                  }}
                />
              </div>
              <span className="font-serif text-2xl font-semibold" style={{ color: GRAHA_COLORS[g.id] }}>
                {scores[g.id]}
              </span>
              <span className="text-xs text-slate-light">/10</span>
            </div>

            <p className="text-sm text-slate leading-relaxed line-clamp-2">
              {g.emotion}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
