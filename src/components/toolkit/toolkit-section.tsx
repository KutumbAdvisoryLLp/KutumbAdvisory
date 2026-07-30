'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ToolCard } from './tool-card'
import { CalculatorModal } from './calculator-modals'
import { ChecklistModal } from './checklist-modal'
import { AssessmentModal } from './assessment-modal'
import { ToolIcon } from './tool-icons'
import { calculators, checklists, assessments, calculatorGroups } from '@/lib/kundali/toolkit'
import type { CalculatorDef, ChecklistDef, AssessmentDef } from '@/lib/kundali/toolkit'

const groupDescriptions: Record<string, string> = {
  'build-wealth': 'Plan your journey to financial growth with investment calculators that project returns, compound growth, and goal achievement.',
  'protect-wealth': 'Ensure your family\'s financial security by calculating the right insurance coverage and emergency fund requirements.',
  'borrow-smart': 'Make informed borrowing decisions by comparing loans, checking eligibility, and optimizing prepayment strategies.',
  'retirement': 'Calculate the corpus you need for a dignified retirement and plan your withdrawal strategy with confidence.',
  'family-wealth': 'Plan for life\'s important milestones — from your child\'s education to their wedding and your family\'s net worth.',
  'tax-portfolio': 'Optimize your tax liability and build a well-diversified investment portfolio aligned with your goals.',
}

const groupCopy: Record<string, { subtitle: string; icon: string }> = {
  'build-wealth': { subtitle: 'Growth & Accumulation', icon: 'sip' },
  'protect-wealth': { subtitle: 'Security & Risk', icon: 'emergency-fund' },
  'borrow-smart': { subtitle: 'Loans & Credit', icon: 'emi' },
  'retirement': { subtitle: 'Future Planning', icon: 'retirement-corpus' },
  'family-wealth': { subtitle: 'Family Goals', icon: 'net-worth' },
  'tax-portfolio': { subtitle: 'Optimization', icon: 'income-tax' },
}

export function FinancialToolkitSection() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'calculators' | 'checklists' | 'assessments'>('calculators')
  const [selectedCalc, setSelectedCalc] = useState<CalculatorDef | null>(null)
  const [selectedChecklist, setSelectedChecklist] = useState<ChecklistDef | null>(null)
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentDef | null>(null)

  const handleStartAssessment = () => {
    const el = document.getElementById('start-assessment')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push('/mykundali')
    }
  }

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header — Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-xl mx-auto mb-16"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-gold mb-5">
            Free Tools
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-navy leading-[1.1]">
            Financial Toolkit
          </h2>
          <p className="text-slate text-[15px] mt-3 leading-relaxed">
            Start with our free financial planning tools before exploring your
            complete Financial Kundali.
          </p>
        </motion.div>

        {/* Tab Navigation — Centered */}
        <div className="flex justify-center gap-2 mb-16">
          <button
            onClick={() => setActiveTab('calculators')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm whitespace-nowrap border transition-all ${
              activeTab === 'calculators'
                ? 'border-gold/30 bg-white text-navy shadow-sm'
                : 'border-slate-lighter/20 text-slate hover:border-gold/15 bg-white/60'
            }`}
          >
            <span className="font-medium">Calculators</span>
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
              activeTab === 'calculators' ? 'bg-gold/10 text-gold' : 'bg-slate-lighter/20 text-slate'
            }`}>
              {calculators.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('checklists')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm whitespace-nowrap border transition-all ${
              activeTab === 'checklists'
                ? 'border-gold/30 bg-white text-navy shadow-sm'
                : 'border-slate-lighter/20 text-slate hover:border-gold/15 bg-white/60'
            }`}
          >
            <span className="font-medium">Checklists</span>
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
              activeTab === 'checklists' ? 'bg-gold/10 text-gold' : 'bg-slate-lighter/20 text-slate'
            }`}>
              {checklists.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm whitespace-nowrap border transition-all ${
              activeTab === 'assessments'
                ? 'border-gold/30 bg-white text-navy shadow-sm'
                : 'border-slate-lighter/20 text-slate hover:border-gold/15 bg-white/60'
            }`}
          >
            <span className="font-medium">Assessments</span>
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
              activeTab === 'assessments' ? 'bg-gold/10 text-gold' : 'bg-slate-lighter/20 text-slate'
            }`}>
              {assessments.length}
            </span>
          </button>
        </div>

        {/* Calculators — Grouped by Category */}
        <AnimatePresence mode="wait">
          {activeTab === 'calculators' && (
            <motion.div
              key="calculators"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-20"
            >
              {calculatorGroups.map((group, gi) => {
                const featured = group.calculators[0]
                const rest = group.calculators.slice(1)
                const copy = groupCopy[group.id]

                return (
                  <div key={group.id} className="bg-cream/60 rounded-[2rem] px-8 py-12 md:px-12 md:py-16 border border-slate-lighter/8">
                    {/* Group Header — Centered */}
                    <div className="text-center mb-10">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/15 to-gold/5 flex items-center justify-center mx-auto mb-4">
                        <ToolIcon id={copy.icon} className="w-9 h-9" />
                      </div>
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <h3 className="font-serif text-3xl md:text-4xl text-navy">{group.title}</h3>
                        <span className="text-xs text-slate-light font-mono px-2 py-0.5 bg-white/50 rounded-full">
                          {group.calculators.length}
                        </span>
                      </div>
                      <p className="text-[15px] text-slate/80 max-w-lg mx-auto">{groupDescriptions[group.id]}</p>
                    </div>

                    {/* Featured Card — Centered */}
                    {featured && (
                      <div className="mx-auto mb-10" style={{ maxWidth: '560px' }}>
                        <ToolCard
                          icon={featured.id}
                          title={featured.title}
                          description={featured.description}
                          time={featured.time}
                          category={featured.category}
                          variant="calculator"
                          featured={true}
                          onClick={() => setSelectedCalc(featured)}
                        />
                      </div>
                    )}

                    {/* Rest of calculators — square app tiles, max 3 per row */}
                    {rest.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-4 mx-auto max-w-5xl">
                        {rest.map((calc, i) => (
                          <motion.div
                            key={calc.id}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.03 }}
                            className="w-[calc(50%-8px)] md:w-[calc(50%-8px)] lg:w-[calc(33.33%-11px)] max-w-sm"
                          >
                            <ToolCard
                              icon={calc.id}
                              title={calc.title}
                              description={calc.description}
                              time={calc.time}
                              category={calc.category}
                              variant="calculator"
                              onClick={() => setSelectedCalc(calc)}
                            />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </motion.div>
          )}

          {/* Checklists Tab */}
          {activeTab === 'checklists' && (
            <motion.div
              key="checklists"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="bg-cream/60 rounded-[2rem] px-8 py-12 md:px-12 md:py-16 border border-slate-lighter/8">
                <div className="text-center mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/15 to-gold/5 flex items-center justify-center mx-auto mb-4">
                    <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9 text-gold">
                      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="opacity-20" />
                      <path d="M16 24L22 30L32 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-3xl md:text-4xl text-navy mb-2">Financial Checklists</h3>
                  <p className="text-[15px] text-slate/80 max-w-lg mx-auto">Step-by-step checklists to keep your financial life organized and on track.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mx-auto max-w-5xl">
                  {checklists.map((cl, i) => (
                    <motion.div
                      key={cl.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03 }}
                      className="w-[calc(50%-8px)] md:w-[calc(50%-8px)] lg:w-[calc(33.33%-11px)] max-w-sm"
                    >
                      <ToolCard
                        icon={cl.id}
                        title={cl.title}
                        description={cl.description}
                        time={cl.time}
                        variant="checklist"
                        onClick={() => setSelectedChecklist(cl)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Assessments Tab */}
          {activeTab === 'assessments' && (
            <motion.div
              key="assessments"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="bg-cream/60 rounded-[2rem] px-8 py-12 md:px-12 md:py-16 border border-slate-lighter/8">
                <div className="text-center mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/15 to-gold/5 flex items-center justify-center mx-auto mb-4">
                    <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9 text-gold">
                      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="opacity-20" />
                      <rect x="16" y="14" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M20 20H28M20 24H28M20 28H25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-3xl md:text-4xl text-navy mb-2">Financial Assessments</h3>
                  <p className="text-[15px] text-slate/80 max-w-lg mx-auto">Quick self-assessments to evaluate your financial health across different areas.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mx-auto max-w-5xl">
                  {assessments.map((a, i) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03 }}
                      className="w-[calc(50%-8px)] md:w-[calc(50%-8px)] lg:w-[calc(33.33%-11px)] max-w-sm"
                    >
                      <ToolCard
                        icon={a.id}
                        title={a.title}
                        description={a.description}
                        time={a.time}
                        variant="assessment"
                        onClick={() => setSelectedAssessment(a)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      {selectedCalc && (
        <CalculatorModal
          calc={selectedCalc}
          onClose={() => setSelectedCalc(null)}
          onStartAssessment={handleStartAssessment}
        />
      )}
      {selectedChecklist && (
        <ChecklistModal
          checklist={selectedChecklist}
          onClose={() => setSelectedChecklist(null)}
          onStartAssessment={handleStartAssessment}
        />
      )}
      {selectedAssessment && (
        <AssessmentModal
          assessment={selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
          onStartAssessment={handleStartAssessment}
        />
      )}
    </section>
  )
}
