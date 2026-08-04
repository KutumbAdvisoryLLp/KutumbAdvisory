'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Button from '@/components/Button'
import { ProgressBar } from '@/components/mykundali/progress-bar'
import { createClient } from '@/lib/supabase/client'
import type { Json } from '@/lib/supabase/types'
import { useMykundaliAuth } from '@/components/mykundali/AuthContext'
import type { FamilyProfile, Member, InvestmentEntry, InsuranceEntry } from '@/types'

const emptyMember: Member = { name: '', age: 30, relation: 'child', occupation: '', income: 0 }

const emptyInvestment: InvestmentEntry = { type: 'Mutual Fund', amount: 0 }
const emptyInsurance: InsuranceEntry = { type: 'Term Life', sumInsured: 0, premium: 0, paymentMode: 'Annual' }

const investmentTypes = ['Mutual Fund', 'Stocks', 'FD', 'PPF', 'Real Estate', 'Gold', 'Other']
const insuranceTypes = ['Term Life', 'Health', 'Critical Illness', 'Accident', 'Other']
const paymentModes: InsuranceEntry['paymentMode'][] = ['Monthly', 'Quarterly', 'Half-Yearly', 'Annual']

const goals = [
  'Buy a home', 'Children education', 'Marriage', 'Retirement',
  'Travel', 'Start a business', 'Wealth building', 'Tax optimization',
]

const riskOptions = [
  { value: 'conservative', label: 'Conservative', desc: 'Safety first' },
  { value: 'moderate', label: 'Moderate', desc: 'Balanced approach' },
  { value: 'aggressive', label: 'Aggressive', desc: 'Growth focused' },
] as const

export default function FamilyProfilePage() {
  const supabase = useMemo(() => createClient(), [])
  const { userId } = useMykundaliAuth()
  const [step, setStep] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [profile, setProfile] = useState<FamilyProfile>({
    primaryMember: { name: '', age: 35, relation: 'self', occupation: '', income: 0 },
    spouse: undefined,
    children: [],
    monthlyExpenses: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    riskProfile: 'moderate',
    goals: [],
    existingInvestments: [],
    existingInsurance: [],
  })

  const totalSteps = 5
  const progress = ((step + 1) / totalSteps) * 100

  const update = <K extends keyof FamilyProfile>(key: K, value: FamilyProfile[K]) =>
    setProfile((prev) => ({ ...prev, [key]: value }))

  // Pre-fill from any previously-saved profile so refreshing mid-flow resumes.
  useEffect(() => {
    if (!userId) return
    ;(async () => {
      const { data } = await supabase
        .from('family_profiles')
        .select('*')
        .eq('customer_id', userId)
        .maybeSingle()

      if (data) {
        setProfile({
          primaryMember: data.primary_member as unknown as Member,
          spouse: (data.spouse as unknown as Member) ?? undefined,
          children: (data.children as unknown as Member[]) ?? [],
          monthlyExpenses: data.monthly_expenses ?? 0,
          totalAssets: data.total_assets ?? 0,
          totalLiabilities: data.total_liabilities ?? 0,
          riskProfile: data.risk_profile ?? 'moderate',
          goals: data.goals ?? [],
          existingInvestments: (data.existing_investments as unknown as InvestmentEntry[]) ?? [],
          existingInsurance: (data.existing_insurance as unknown as InsuranceEntry[]) ?? [],
        })
      }
      setLoaded(true)
    })()
  }, [userId, supabase])

  const saveProfile = useCallback(
    async (current: FamilyProfile) => {
      if (!userId) return
      await supabase.from('family_profiles').upsert({
        customer_id: userId,
        primary_member: current.primaryMember as unknown as Json,
        spouse: (current.spouse ?? null) as unknown as Json | null,
        children: current.children as unknown as Json,
        monthly_expenses: current.monthlyExpenses,
        total_assets: current.totalAssets,
        total_liabilities: current.totalLiabilities,
        risk_profile: current.riskProfile,
        goals: current.goals,
        existing_investments: current.existingInvestments as unknown as Json,
        existing_insurance: current.existingInsurance as unknown as Json,
      })
    },
    [userId, supabase]
  )

  // Persist on every step change (not every keystroke) once the initial
  // fetch has resolved, so refreshing mid-flow doesn't lose progress.
  useEffect(() => {
    if (!loaded) return
    saveProfile(profile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, loaded])

  const steps = [
    // Step 0: Primary Member
    <motion.div key="primary" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <h2 className="font-serif text-3xl text-navy">Primary Earning Member</h2>
      <p className="text-slate">Tell us about yourself to personalize your assessment.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Full Name</label>
          <input type="text" value={profile.primaryMember.name} onChange={(e) => update('primaryMember', { ...profile.primaryMember, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none transition-colors" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Age</label>
          <input type="number" value={profile.primaryMember.age || ''} onChange={(e) => update('primaryMember', { ...profile.primaryMember, age: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Occupation</label>
          <input type="text" value={profile.primaryMember.occupation || ''} onChange={(e) => update('primaryMember', { ...profile.primaryMember, occupation: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none transition-colors" placeholder="e.g. Software Engineer" />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Annual Income (₹)</label>
          <input type="number" value={profile.primaryMember.income || ''} onChange={(e) => update('primaryMember', { ...profile.primaryMember, income: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none transition-colors" placeholder="0" />
        </div>
      </div>
    </motion.div>,

    // Step 1: Spouse & Children
    <motion.div key="family" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <h2 className="font-serif text-3xl text-navy">Your Family</h2>
      <p className="text-slate">Add family members who depend on your finances.</p>
      <div className="p-5 bg-white rounded-2xl border border-slate-lighter/30">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={!!profile.spouse} onChange={(e) => setProfile(p => ({ ...p, spouse: e.target.checked ? { name: '', age: 30, relation: 'spouse', occupation: '', income: 0 } : undefined }))} className="w-5 h-5 accent-gold" />
          <span className="font-medium text-charcoal">Add Spouse</span>
        </label>
        <AnimatePresence>
          {profile.spouse && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 grid sm:grid-cols-2 gap-4 overflow-hidden">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Name</label>
                <input type="text" value={profile.spouse.name} onChange={(e) => update('spouse', { ...profile.spouse!, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Age</label>
                <input type="number" value={profile.spouse.age || ''} onChange={(e) => update('spouse', { ...profile.spouse!, age: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none transition-colors" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-5 bg-white rounded-2xl border border-slate-lighter/30">
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium text-charcoal">Children</span>
          <button onClick={() => setProfile(p => ({ ...p, children: [...p.children, { ...emptyMember, age: 5 }] }))} className="text-sm text-gold hover:text-gold-dark transition-colors">+ Add Child</button>
        </div>
        <AnimatePresence>
          {profile.children.map((child, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex gap-3 items-start mb-3">
              <input type="text" value={child.name} onChange={(e) => { const c = [...profile.children]; c[i] = { ...c[i], name: e.target.value }; update('children', c) }} className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none text-sm" placeholder="Name" />
              <input type="number" value={child.age || ''} onChange={(e) => { const c = [...profile.children]; c[i] = { ...c[i], age: Number(e.target.value) }; update('children', c) }} className="w-20 px-3 py-2.5 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none text-sm" placeholder="Age" />
              <button onClick={() => setProfile(p => ({ ...p, children: p.children.filter((_, j) => j !== i) }))} className="text-slate-light hover:text-error transition-colors p-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>,

    // Step 2: Financial Snapshot
    <motion.div key="finances" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <h2 className="font-serif text-3xl text-navy">Financial Snapshot</h2>
      <p className="text-slate">A quick overview of your family&apos;s finances.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { key: 'monthlyExpenses', label: 'Monthly Expenses (₹)', placeholder: 'e.g. 50000' },
          { key: 'totalAssets', label: 'Total Assets (₹)', placeholder: 'e.g. 5000000' },
          { key: 'totalLiabilities', label: 'Total Liabilities (₹)', placeholder: 'e.g. 1000000' },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-charcoal mb-1.5">{label}</label>
            <input type="number" value={(profile as any)[key] || ''} onChange={(e) => update(key as keyof FamilyProfile, Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none transition-colors" placeholder={placeholder} />
          </div>
        ))}
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-3">Risk Profile</label>
        <div className="flex gap-3">
          {riskOptions.map((r) => (
            <button key={r.value} onClick={() => update('riskProfile', r.value)} className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${profile.riskProfile === r.value ? 'border-gold bg-gold-light/20' : 'border-slate-lighter bg-white hover:border-slate-light'}`}>
              <span className={`block font-medium ${profile.riskProfile === r.value ? 'text-charcoal' : 'text-slate'}`}>{r.label}</span>
              <span className="text-xs text-slate-light mt-1">{r.desc}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-3">Financial Goals</label>
        <div className="flex flex-wrap gap-2">
          {goals.map((g) => {
            const selected = profile.goals.includes(g)
            return (
              <button key={g} onClick={() => update('goals', selected ? profile.goals.filter(x => x !== g) : [...profile.goals, g])} className={`px-4 py-2 rounded-full border-2 text-sm transition-all ${selected ? 'border-gold bg-gold-light/20 text-charcoal' : 'border-slate-lighter bg-white text-slate hover:border-slate-light'}`}>
                {g}
              </button>
            )
          })}
        </div>
      </div>
    </motion.div>,

    // Step 3: Investments & Insurance
    <motion.div key="coverage" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <h2 className="font-serif text-3xl text-navy">Existing Coverage</h2>
      <p className="text-slate">What you already have in place.</p>

      <div className="p-5 bg-white rounded-2xl border border-slate-lighter/30">
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium text-charcoal">Investments</span>
          <button onClick={() => setProfile(p => ({ ...p, existingInvestments: [...p.existingInvestments, { ...emptyInvestment }] }))} className="text-sm text-gold hover:text-gold-dark transition-colors">+ Add Investment</button>
        </div>
        <AnimatePresence>
          {profile.existingInvestments.map((inv, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-[1.3fr_1fr_1fr_auto] gap-3 items-start mb-3">
              <select value={inv.type} onChange={(e) => { const c = [...profile.existingInvestments]; c[i] = { ...c[i], type: e.target.value }; update('existingInvestments', c) }} className="px-3 py-2.5 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none text-sm">
                {investmentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="number" value={inv.amount || ''} onChange={(e) => { const c = [...profile.existingInvestments]; c[i] = { ...c[i], amount: Number(e.target.value) }; update('existingInvestments', c) }} className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none text-sm" placeholder="Amount invested" />
              <input type="number" value={inv.currentValue || ''} onChange={(e) => { const c = [...profile.existingInvestments]; c[i] = { ...c[i], currentValue: Number(e.target.value) }; update('existingInvestments', c) }} className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none text-sm" placeholder="Current value" />
              <button onClick={() => setProfile(p => ({ ...p, existingInvestments: p.existingInvestments.filter((_, j) => j !== i) }))} className="text-slate-light hover:text-error transition-colors p-1 mt-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {profile.existingInvestments.length === 0 && <p className="text-sm text-slate-light">No investments added yet.</p>}
      </div>

      <div className="p-5 bg-white rounded-2xl border border-slate-lighter/30">
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium text-charcoal">Insurance</span>
          <button onClick={() => setProfile(p => ({ ...p, existingInsurance: [...p.existingInsurance, { ...emptyInsurance }] }))} className="text-sm text-gold hover:text-gold-dark transition-colors">+ Add Insurance</button>
        </div>
        <AnimatePresence>
          {profile.existingInsurance.map((ins, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-3 items-start mb-3">
              <select value={ins.type} onChange={(e) => { const c = [...profile.existingInsurance]; c[i] = { ...c[i], type: e.target.value }; update('existingInsurance', c) }} className="px-3 py-2.5 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none text-sm">
                {insuranceTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="number" value={ins.sumInsured || ''} onChange={(e) => { const c = [...profile.existingInsurance]; c[i] = { ...c[i], sumInsured: Number(e.target.value) }; update('existingInsurance', c) }} className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none text-sm" placeholder="Sum insured" />
              <input type="number" value={ins.premium || ''} onChange={(e) => { const c = [...profile.existingInsurance]; c[i] = { ...c[i], premium: Number(e.target.value) }; update('existingInsurance', c) }} className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none text-sm" placeholder="Premium" />
              <select value={ins.paymentMode} onChange={(e) => { const c = [...profile.existingInsurance]; c[i] = { ...c[i], paymentMode: e.target.value as InsuranceEntry['paymentMode'] }; update('existingInsurance', c) }} className="px-3 py-2.5 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none text-sm">
                {paymentModes.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <button onClick={() => setProfile(p => ({ ...p, existingInsurance: p.existingInsurance.filter((_, j) => j !== i) }))} className="text-slate-light hover:text-error transition-colors p-1 mt-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {profile.existingInsurance.length === 0 && <p className="text-sm text-slate-light">No insurance policies added yet.</p>}
      </div>
    </motion.div>,

    // Step 4: Summary
    <motion.div key="summary" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <h2 className="font-serif text-3xl text-navy">All Set!</h2>
      <p className="text-slate">Review your family profile before starting the assessment.</p>
      <div className="p-6 bg-white rounded-2xl border border-slate-lighter/30 space-y-4">
        <div className="flex justify-between pb-3 border-b border-slate-lighter/20">
          <span className="text-slate">Primary Member</span>
          <span className="font-medium text-charcoal">{profile.primaryMember.name || 'Not provided'}</span>
        </div>
        {profile.spouse && (
          <div className="flex justify-between pb-3 border-b border-slate-lighter/20">
            <span className="text-slate">Spouse</span>
            <span className="font-medium text-charcoal">{profile.spouse.name}</span>
          </div>
        )}
        <div className="flex justify-between pb-3 border-b border-slate-lighter/20">
          <span className="text-slate">Children</span>
          <span className="font-medium text-charcoal">{profile.children.length}</span>
        </div>
        <div className="flex justify-between pb-3 border-b border-slate-lighter/20">
          <span className="text-slate">Monthly Expenses</span>
          <span className="font-medium text-charcoal">₹{profile.monthlyExpenses.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between pb-3 border-b border-slate-lighter/20">
          <span className="text-slate">Risk Profile</span>
          <span className="font-medium text-charcoal capitalize">{profile.riskProfile}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate">Net Worth</span>
          <span className="font-serif text-xl font-semibold text-gold-dark">
            ₹{(profile.totalAssets - profile.totalLiabilities).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </motion.div>,
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="mb-8">
          <Link href="/mykundali/assessment/landing" className="text-sm text-slate hover:text-charcoal transition-colors">
            ← Back
          </Link>
          <div className="mt-4">
            <ProgressBar value={progress} showPercentage={false} />
            <p className="text-xs text-slate-light mt-2">Step {step + 1} of {totalSteps}</p>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {steps[step]}
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-10 flex justify-between">
          <Button showArrow={false} variant="ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
            ← Previous
          </Button>
          {step < totalSteps - 1 ? (
            <Button showArrow={false} onClick={() => setStep(s => Math.min(totalSteps - 1, s + 1))}>
              Continue →
            </Button>
          ) : (
            <Link href="/mykundali/assessment/grahas" onClick={() => saveProfile(profile)}>
              <Button showArrow={false}>
                Start Assessment →
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
