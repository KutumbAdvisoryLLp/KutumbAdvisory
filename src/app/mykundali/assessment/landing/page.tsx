'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Button from '@/components/Button'
import { FinancialKundaliHero } from '@/components/mykundali/financial-kundali-hero'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

const features = [
  { title: 'Your Financial Health Score', subtitle: 'Out of 90' },
  { title: '9-Pillar Graha Breakdown', subtitle: 'Detailed insights' },
  { title: 'Personalized Recommendations', subtitle: 'Actionable steps' },
  { title: 'Financial Wheel', subtitle: 'Complete visualization' },
]

const grahaIcons = [
  { icon: '☀', name: 'Surya', color: '#E89F3C' },
  { icon: '☾', name: 'Chandra', color: '#8AB4D6' },
  { icon: '♂', name: 'Mangal', color: '#D45D5D' },
  { icon: '☿', name: 'Budh', color: '#4CAF7D' },
  { icon: '♃', name: 'Guru', color: '#7B61FF' },
  { icon: '♀', name: 'Shukra', color: '#E87A9A' },
  { icon: '♄', name: 'Shani', color: '#4A5568' },
  { icon: '☊', name: 'Rahu', color: '#8B5CF6' },
  { icon: '☋', name: 'Ketu', color: '#D97706' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-36 lg:pt-44 pb-24 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeUp}
            >
              <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-gold mb-6">
                Financial Kundali™
              </span>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-navy leading-[1.1] tracking-tight text-balance">
                Understand Your Family&apos;s Complete Financial Health
              </h1>
              <p className="mt-6 text-lg md:text-xl text-slate leading-relaxed max-w-lg">
                Financial Kundali is a 15-minute assessment that evaluates 9
                pillars of your family&apos;s financial wellbeing. Based on
                ancient wisdom. Built for modern families.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/mykundali/assessment/family-profile">
                  <Button showArrow={false} variant="primary" size="lg" className="w-full sm:w-auto">
                    Start Your Assessment →
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-slate-light">
                15 minutes · 9 pillars · Free preview
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={3}
              variants={fadeUp}
              className="hidden md:flex items-center justify-center"
            >
              <FinancialKundaliHero />
            </motion.div>
          </div>
        </div>
      </section>

      {/* What You'll Discover — Navy Section */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl text-gold text-center mb-12"
          >
            What You&apos;ll Discover
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center mb-4">
                  <span className="text-gold text-lg">✦</span>
                </div>
                <h3 className="font-serif text-xl text-white mb-1">
                  {f.title}
                </h3>
                <p className="text-sm text-white/50">{f.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nine Grahas */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl text-navy text-center mb-4"
          >
            The Nine Financial Grahas
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg text-slate text-center max-w-2xl mx-auto mb-12"
          >
            Each Graha represents one pillar of your family&apos;s financial
            wellbeing. Together, they form your complete Financial Kundali.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {grahaIcons.map((g, i) => (
              <motion.div
                key={g.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-5 bg-white rounded-2xl border border-slate-lighter/20 shadow-card hover:shadow-card-hover transition-all cursor-default"
                style={{ borderLeftColor: g.color, borderLeftWidth: 3 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{g.icon}</span>
                  <div>
                    <h3 className="font-serif text-lg text-charcoal">
                      {g.name}
                    </h3>
                    <p className="text-xs text-slate-light mt-0.5">
                      {g.color === '#E89F3C'
                        ? 'Income & Earning Power'
                        : g.color === '#8AB4D6'
                        ? 'Emergency Fund & Peace'
                        : g.color === '#D45D5D'
                        ? 'Protection & Insurance'
                        : g.color === '#4CAF7D'
                        ? 'Financial Discipline'
                        : g.color === '#7B61FF'
                        ? 'Wealth Creation'
                        : g.color === '#E87A9A'
                        ? 'Lifestyle & Happiness'
                        : g.color === '#4A5568'
                        ? 'Retirement & Dignity'
                        : g.color === '#8B5CF6'
                        ? 'Financial Risk'
                        : 'Legacy & Succession'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl text-navy text-center mb-4"
          >
            Trusted by Families Like Yours
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg text-slate text-center max-w-2xl mx-auto mb-12"
          >
            Hear from families who have transformed their financial clarity with Financial Kundali.
          </motion.p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: 'Financial Kundali gave us a language to talk about money as a family. The 9-graha framework made everything click.',
                name: 'Rajesh & Priya Sharma',
                role: 'Mumbai, 2 children',
              },
              {
                quote: 'I thought we were doing fine until Shani (Retirement) showed us the gap. Now we have a clear plan and peace of mind.',
                name: 'Anita Mehta',
                role: 'Pune, single professional',
              },
              {
                quote: 'The toolkit alone is worth it — we used the education planner and saved 3 lakh in potential costs.',
                name: 'Vikram Desai',
                role: 'Bangalore, 1 child',
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-white rounded-2xl border border-slate-lighter/20 shadow-card"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-gold text-sm">★</span>
                  ))}
                </div>
                <p className="text-charcoal/80 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-serif text-navy font-semibold">{t.name}</p>
                  <p className="text-sm text-slate-light">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Start Assessment CTA */}
      <section id="start-assessment" className="py-20 md:py-28 bg-navy relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-gold mb-4">
              Financial Kundali™
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
              Understand Your Family&apos;s Complete Financial Health
            </h2>
            <p className="text-white/50 text-base mt-4 leading-relaxed">
              Take the 15-minute assessment that evaluates all 9 pillars of your
              financial wellbeing and receive a complete personalized wealth blueprint.
            </p>
            <div className="mt-8">
              <Link href="/mykundali/assessment/family-profile">
                <Button showArrow={false} variant="gold" size="lg">
                  Begin Your Financial Kundali →
                </Button>
              </Link>
            </div>
            <p className="text-white/30 text-sm mt-4">
              15 minutes · 9 pillars · Free preview
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer removed — handled by global layout */}
    </div>
  )
}
