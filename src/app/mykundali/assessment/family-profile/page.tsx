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

const emptyInsurance: InsuranceEntry = { type: 'Term Life', sumInsured: 0, premium: 0, paymentMode: 'Annual' }

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
    goalTimeHorizons: {},
    existingInvestments: [],
    existingInsurance: [],
    familyName: '',
    timeHorizon: '',
    netWorthWorksheet: {
      assets: { bankFD: 0, mutualFunds: 0, shares: 0, property: 0, gold: 0, epfPpfNps: 0, insuranceValue: 0 },
      liabilities: { homeLoan: 0, personalLoan: 0, vehicleLoan: 0, creditCard: 0, otherLoans: 0 }
    }
  })

  const [step0Errors, setStep0Errors] = useState<Record<string, string>>({})

  const totalSteps = 6
  const progress = ((step + 1) / totalSteps) * 100

  const update = <K extends keyof FamilyProfile>(key: K, value: FamilyProfile[K]) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
    setStep0Errors((prev) => {
      if (Object.keys(prev).length === 0) return prev
      const next = { ...prev }
      if (key === 'familyName') delete next.familyName
      return next
    })
  }

  const validateStep0 = (): boolean => {
    const errs: Record<string, string> = {}
    if (!profile.familyName?.trim()) {
      errs.familyName = 'Family Name is required'
    }
    if (!profile.primaryMember?.name?.trim()) {
      errs.name = 'Primary member name is required'
    }
    if (!profile.primaryMember?.age || profile.primaryMember.age <= 0) {
      errs.age = 'Please enter a valid age'
    }
    if (!profile.primaryMember?.occupation?.trim()) {
      errs.occupation = 'Job / Occupation is required'
    }
    if (!profile.primaryMember?.income || profile.primaryMember.income <= 0) {
      errs.income = 'Annual income / pay is required'
    }
    setStep0Errors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (step === 0) {
      if (!validateStep0()) return
    }
    setStep((s) => Math.min(totalSteps - 1, s + 1))
  }

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
        const pm = data.primary_member as any
        setProfile({
          primaryMember: {
            name: pm?.name ?? '',
            age: pm?.age ?? 35,
            relation: pm?.relation ?? 'self',
            occupation: pm?.occupation ?? '',
            income: pm?.income ?? 0,
          },
          spouse: (data.spouse as unknown as Member) ?? undefined,
          children: (data.children as unknown as Member[]) ?? [],
          monthlyExpenses: data.monthly_expenses ?? 0,
          totalAssets: data.total_assets ?? 0,
          totalLiabilities: data.total_liabilities ?? 0,
          riskProfile: data.risk_profile ?? 'moderate',
          goals: data.goals ?? [],
          goalTimeHorizons: pm?.goalTimeHorizons ?? {},
          existingInvestments: (data.existing_investments as unknown as InvestmentEntry[]) ?? [],
          existingInsurance: (data.existing_insurance as unknown as InsuranceEntry[]) ?? [],
          familyName: pm?.familyName ?? '',
          timeHorizon: pm?.timeHorizon ?? '',
          netWorthWorksheet: pm?.netWorthWorksheet ?? {
            assets: { bankFD: 0, mutualFunds: 0, shares: 0, property: 0, gold: 0, epfPpfNps: 0, insuranceValue: 0 },
            liabilities: { homeLoan: 0, personalLoan: 0, vehicleLoan: 0, creditCard: 0, otherLoans: 0 }
          },
        })
      }
      setLoaded(true)
    })()
  }, [userId, supabase])

  const saveProfile = useCallback(
    async (current: FamilyProfile) => {
      if (!userId) return
      const { error } = await supabase.from('family_profiles').upsert({
        customer_id: userId,
        primary_member: {
          ...current.primaryMember,
          familyName: current.familyName,
          timeHorizon: current.timeHorizon,
          goalTimeHorizons: current.goalTimeHorizons,
          netWorthWorksheet: current.netWorthWorksheet,
        } as unknown as Json,
        spouse: (current.spouse ?? null) as unknown as Json | null,
        children: current.children as unknown as Json,
        monthly_expenses: current.monthlyExpenses,
        total_assets: current.totalAssets,
        total_liabilities: current.totalLiabilities,
        risk_profile: current.riskProfile,
        goals: current.goals,
        existing_investments: current.existingInvestments as unknown as Json,
        existing_insurance: current.existingInsurance as unknown as Json,
      }, { onConflict: 'customer_id' })
      if (error) console.error('[family-profile] upsert error:', error)
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
    // Step 0: Primary Member & Family Name
    <motion.div key="primary" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <h2 className="font-serif text-3xl text-navy">Primary Earning Member</h2>
      <p className="text-slate">Tell us about yourself to personalize your assessment.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">
            Family Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={profile.familyName || ''}
            onChange={(e) => {
              update('familyName', e.target.value)
              if (step0Errors.familyName) setStep0Errors((prev) => ({ ...prev, familyName: '' }))
            }}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white focus:outline-none transition-colors ${
              step0Errors.familyName ? 'border-red-400 focus:border-red-500' : 'border-slate-lighter focus:border-gold'
            }`}
            placeholder="e.g. Sharma Family"
          />
          {step0Errors.familyName && <p className="mt-1 text-xs text-red-500">{step0Errors.familyName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">
            Primary Earning Member Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={profile.primaryMember.name}
            onChange={(e) => {
              update('primaryMember', { ...profile.primaryMember, name: e.target.value })
              if (step0Errors.name) setStep0Errors((prev) => ({ ...prev, name: '' }))
            }}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white focus:outline-none transition-colors ${
              step0Errors.name ? 'border-red-400 focus:border-red-500' : 'border-slate-lighter focus:border-gold'
            }`}
            placeholder="Your name"
          />
          {step0Errors.name && <p className="mt-1 text-xs text-red-500">{step0Errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={profile.primaryMember.age || ''}
            onChange={(e) => {
              update('primaryMember', { ...profile.primaryMember, age: Number(e.target.value) })
              if (step0Errors.age) setStep0Errors((prev) => ({ ...prev, age: '' }))
            }}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white focus:outline-none transition-colors ${
              step0Errors.age ? 'border-red-400 focus:border-red-500' : 'border-slate-lighter focus:border-gold'
            }`}
            placeholder="e.g. 35"
          />
          {step0Errors.age && <p className="mt-1 text-xs text-red-500">{step0Errors.age}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">
            Job / Occupation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={profile.primaryMember.occupation || ''}
            onChange={(e) => {
              update('primaryMember', { ...profile.primaryMember, occupation: e.target.value })
              if (step0Errors.occupation) setStep0Errors((prev) => ({ ...prev, occupation: '' }))
            }}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white focus:outline-none transition-colors ${
              step0Errors.occupation ? 'border-red-400 focus:border-red-500' : 'border-slate-lighter focus:border-gold'
            }`}
            placeholder="e.g. Software Engineer"
          />
          {step0Errors.occupation && <p className="mt-1 text-xs text-red-500">{step0Errors.occupation}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-charcoal mb-1.5">
            Annual Income / Pay (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={profile.primaryMember.income || ''}
            onChange={(e) => {
              update('primaryMember', { ...profile.primaryMember, income: Number(e.target.value) })
              if (step0Errors.income) setStep0Errors((prev) => ({ ...prev, income: '' }))
            }}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white focus:outline-none transition-colors ${
              step0Errors.income ? 'border-red-400 focus:border-red-500' : 'border-slate-lighter focus:border-gold'
            }`}
            placeholder="e.g. 1500000"
          />
          {step0Errors.income && <p className="mt-1 text-xs text-red-500">{step0Errors.income}</p>}
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
                <label className="block text-sm font-medium text-charcoal mb-1.5">Spouse Name</label>
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
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-charcoal">Children</span>
          <button onClick={() => setProfile(p => ({ ...p, children: [...p.children, { ...emptyMember, age: 5 }] }))} className="text-sm text-gold hover:text-gold-dark font-medium transition-colors">+ Add Child</button>
        </div>
        {profile.children.length > 0 && (
          <div className="flex gap-3 px-1 mb-2 text-xs font-semibold text-slate-light uppercase tracking-wider">
            <span className="flex-1">Child Name</span>
            <span className="w-24">Child Age</span>
            <span className="w-6"></span>
          </div>
        )}
        <AnimatePresence>
          {profile.children.map((child, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex gap-3 items-center mb-3">
              <input type="text" value={child.name} onChange={(e) => { const c = [...profile.children]; c[i] = { ...c[i], name: e.target.value }; update('children', c) }} className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none text-sm" placeholder="Child Name" />
              <input type="number" value={child.age || ''} onChange={(e) => { const c = [...profile.children]; c[i] = { ...c[i], age: Number(e.target.value) }; update('children', c) }} className="w-24 px-3 py-2.5 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none text-sm" placeholder="Age" />
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
      <p className="text-slate">Select your primary financial goals and time horizon.</p>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Financial Goals (Select multiple)</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              'Education',
              'Marriage',
              'Child Marriage',
              'Start Business',
              'Retire Early',
              'Buy Property / Home',
              'Emergency Cushion',
              'Wealth Creation',
              'International Travel',
              'Family Legacy Fund',
            ].map((goal) => {
              const isSelected = profile.goals.includes(goal)
              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      const nextHorizons = { ...profile.goalTimeHorizons }
                      delete nextHorizons[goal]
                      setProfile((p) => ({ ...p, goals: p.goals.filter((g) => g !== goal), goalTimeHorizons: nextHorizons }))
                    } else {
                      update('goals', [...profile.goals, goal])
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium border-2 transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-gold bg-gold-light/20 text-charcoal shadow-sm'
                      : 'border-slate-lighter bg-white text-slate hover:border-slate-light'
                  }`}
                >
                  <span>{isSelected ? '✓' : '+'}</span>
                  <span>{goal}</span>
                </button>
              )
            })}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              id="custom-goal-input"
              placeholder="Type custom goal and press Add..."
              className="flex-1 px-4 py-2.5 text-sm rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const val = (e.target as HTMLInputElement).value.trim()
                  if (val && !profile.goals.includes(val)) {
                    update('goals', [...profile.goals, val])
                    ;(e.target as HTMLInputElement).value = ''
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('custom-goal-input') as HTMLInputElement
                const val = el?.value.trim()
                if (val && !profile.goals.includes(val)) {
                  update('goals', [...profile.goals, val])
                  el.value = ''
                }
              }}
              className="px-4 py-2.5 text-sm font-medium bg-navy text-white rounded-xl hover:bg-navy/90"
            >
              Add Goal
            </button>
          </div>

          {profile.goals.length > 0 && (
            <div className="mt-3 space-y-2">
              <span className="text-xs font-semibold text-navy block">
                Time Horizon for each goal ({profile.goals.length}):
              </span>
              {profile.goals.map((g) => (
                <div key={g} className="flex items-center gap-2 bg-gold/5 border border-gold/15 rounded-xl px-3 py-2">
                  <span className="flex-1 text-sm font-medium text-charcoal">{g}</span>
                  <input
                    type="text"
                    value={profile.goalTimeHorizons?.[g] ?? ''}
                    onChange={(e) =>
                      update('goalTimeHorizons', { ...profile.goalTimeHorizons, [g]: e.target.value })
                    }
                    placeholder="e.g. 5 Years"
                    className="w-32 sm:w-40 px-3 py-1.5 text-sm rounded-lg border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const nextHorizons = { ...profile.goalTimeHorizons }
                      delete nextHorizons[g]
                      setProfile((p) => ({ ...p, goals: p.goals.filter((x) => x !== g), goalTimeHorizons: nextHorizons }))
                    }}
                    className="text-slate-light hover:text-error transition-colors p-1"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Monthly Expenses (₹)</label>
          <input type="number" value={profile.monthlyExpenses || ''} onChange={(e) => update('monthlyExpenses', Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none transition-colors" placeholder="e.g. 50000" />
        </div>
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
    </motion.div>,

    // Step 3: Net Worth Worksheet
    <motion.div key="networth" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <h2 className="font-serif text-3xl text-navy">Net Worth Worksheet</h2>
      <p className="text-slate">Calculate your net worth by detailing your assets and liabilities.</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Assets column */}
        <div className="p-5 bg-white rounded-2xl border border-slate-lighter/30 space-y-4">
          <h3 className="font-serif text-xl text-navy border-b pb-2">Assets</h3>
          {[
            { key: 'bankFD', label: 'Bank & FD' },
            { key: 'mutualFunds', label: 'Mutual Funds' },
            { key: 'shares', label: 'Shares' },
            { key: 'property', label: 'Property' },
            { key: 'gold', label: 'Gold' },
            { key: 'epfPpfNps', label: 'EPF / PPF / NPS' },
            { key: 'insuranceValue', label: 'Insurance Value' }
          ].map(({ key, label }) => {
            const worksheet = profile.netWorthWorksheet || {
              assets: { bankFD: 0, mutualFunds: 0, shares: 0, property: 0, gold: 0, epfPpfNps: 0, insuranceValue: 0 },
              liabilities: { homeLoan: 0, personalLoan: 0, vehicleLoan: 0, creditCard: 0, otherLoans: 0 }
            }
            const val = (worksheet.assets as any)[key] || 0
            return (
              <div key={key}>
                <label className="block text-xs font-medium text-slate-light mb-1">{label} (₹)</label>
                <input
                  type="number"
                  value={val || ''}
                  onChange={(e) => {
                    const nextVal = Number(e.target.value)
                    const nextAssets = { ...worksheet.assets, [key]: nextVal }
                    const totalAssets = Object.values(nextAssets).reduce((sum: number, v: any) => sum + (Number(v) || 0), 0) as number
                    setProfile(prev => ({
                      ...prev,
                      totalAssets,
                      netWorthWorksheet: {
                        assets: nextAssets as any,
                        liabilities: worksheet.liabilities
                      }
                    }))
                  }}
                  className="w-full px-3 py-2 text-sm rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none transition-colors"
                  placeholder="0"
                />
              </div>
            )
          })}
        </div>

        {/* Liabilities column */}
        <div className="p-5 bg-white rounded-2xl border border-slate-lighter/30 space-y-4">
          <h3 className="font-serif text-xl text-navy border-b pb-2">Liabilities</h3>
          {[
            { key: 'homeLoan', label: 'Home Loan' },
            { key: 'personalLoan', label: 'Personal Loan' },
            { key: 'vehicleLoan', label: 'Vehicle Loan' },
            { key: 'creditCard', label: 'Credit Card' },
            { key: 'otherLoans', label: 'Other Loans' }
          ].map(({ key, label }) => {
            const worksheet = profile.netWorthWorksheet || {
              assets: { bankFD: 0, mutualFunds: 0, shares: 0, property: 0, gold: 0, epfPpfNps: 0, insuranceValue: 0 },
              liabilities: { homeLoan: 0, personalLoan: 0, vehicleLoan: 0, creditCard: 0, otherLoans: 0 }
            }
            const val = (worksheet.liabilities as any)[key] || 0
            return (
              <div key={key}>
                <label className="block text-xs font-medium text-slate-light mb-1">{label} (₹)</label>
                <input
                  type="number"
                  value={val || ''}
                  onChange={(e) => {
                    const nextVal = Number(e.target.value)
                    const nextLiabilities = { ...worksheet.liabilities, [key]: nextVal }
                    const totalLiabilities = Object.values(nextLiabilities).reduce((sum: number, v: any) => sum + (Number(v) || 0), 0) as number
                    setProfile(prev => ({
                      ...prev,
                      totalLiabilities,
                      netWorthWorksheet: {
                        assets: worksheet.assets,
                        liabilities: nextLiabilities as any
                      }
                    }))
                  }}
                  className="w-full px-3 py-2 text-sm rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none transition-colors"
                  placeholder="0"
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Net worth summary box */}
      <div className="p-6 bg-navy text-white rounded-2xl border border-gold/10 space-y-3">
        <h4 className="font-serif text-lg text-gold">Net Worth Worksheet</h4>
        <div className="grid grid-cols-3 gap-4 text-center border-t border-white/10 pt-4">
          <div>
            <p className="text-xs text-white/50 uppercase">Total Assets</p>
            <p className="font-serif text-xl font-semibold text-white mt-1">₹{profile.totalAssets.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase">Total Liabilities</p>
            <p className="font-serif text-xl font-semibold text-white mt-1">₹{profile.totalLiabilities.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-xs text-gold/85 uppercase">Net Worth</p>
            <p className="font-serif text-xl font-semibold text-gold mt-1">₹{(profile.totalAssets - profile.totalLiabilities).toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
    </motion.div>,

    // Step 4: Existing Coverage
    <motion.div key="coverage" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <h2 className="font-serif text-3xl text-navy">Existing Coverage</h2>
      <p className="text-slate">Insurance you already have in place.</p>

      <div className="p-5 bg-white rounded-2xl border border-slate-lighter/30">
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium text-charcoal">Insurance</span>
          <button onClick={() => setProfile(p => ({ ...p, existingInsurance: [...p.existingInsurance, { ...emptyInsurance }] }))} className="text-sm text-gold hover:text-gold-dark transition-colors">+ Add Insurance</button>
        </div>
        <AnimatePresence>
          {profile.existingInsurance.map((ins, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-3 items-start mb-3 pb-4 border-b border-slate-lighter/30 sm:border-none sm:pb-0">
              <select value={ins.type} onChange={(e) => { const c = [...profile.existingInsurance]; c[i] = { ...c[i], type: e.target.value }; update('existingInsurance', c) }} className="px-3 py-2.5 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none text-sm">
                {insuranceTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="number" value={ins.sumInsured || ''} onChange={(e) => { const c = [...profile.existingInsurance]; c[i] = { ...c[i], sumInsured: Number(e.target.value) }; update('existingInsurance', c) }} className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none text-sm" placeholder="Sum insured" />
              <input type="number" value={ins.premium || ''} onChange={(e) => { const c = [...profile.existingInsurance]; c[i] = { ...c[i], premium: Number(e.target.value) }; update('existingInsurance', c) }} className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none text-sm" placeholder="Premium" />
              <select value={ins.paymentMode} onChange={(e) => { const c = [...profile.existingInsurance]; c[i] = { ...c[i], paymentMode: e.target.value as InsuranceEntry['paymentMode'] }; update('existingInsurance', c) }} className="px-3 py-2.5 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none text-sm">
                {paymentModes.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <button onClick={() => setProfile(p => ({ ...p, existingInsurance: p.existingInsurance.filter((_, j) => j !== i) }))} className="flex items-center gap-1.5 justify-self-end text-slate-light hover:text-error transition-colors p-1 sm:mt-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                <span className="text-xs sm:hidden">Remove</span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {profile.existingInsurance.length === 0 && <p className="text-sm text-slate-light">No insurance policies added yet.</p>}
      </div>
    </motion.div>,

    // Step 5: Summary
    <motion.div key="summary" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <h2 className="font-serif text-3xl text-navy">Family Data and Financial Snapshot</h2>
      <p className="text-slate">Review your details before starting the assessment.</p>
      
      <div className="p-6 bg-white rounded-2xl border border-slate-lighter/30 space-y-6 max-h-[60vh] overflow-y-auto">
        <div>
          <h3 className="font-serif text-xl text-navy border-b pb-2 mb-3">Family Information</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <span className="text-slate">Family Name</span>
            <span className="font-medium text-charcoal">{profile.familyName || '—'}</span>
            
            <span className="text-slate">Primary Earning Member</span>
            <span className="font-medium text-charcoal">{profile.primaryMember.name || '—'}</span>
            
            <span className="text-slate">Age</span>
            <span className="font-medium text-charcoal">{profile.primaryMember.age || '—'}</span>
            
            <span className="text-slate">Spouse Name</span>
            <span className="font-medium text-charcoal">{profile.spouse?.name || '—'}</span>
            
            <span className="text-slate">Children</span>
            <span className="font-medium text-charcoal">
              {profile.children.map(c => `${c.name} (${c.age} yrs)`).join(', ') || 'None'}
            </span>
            
            <span className="text-slate">Occupation</span>
            <span className="font-medium text-charcoal">{profile.primaryMember.occupation || '—'}</span>
            
            <span className="text-slate">Risk Profile</span>
            <span className="font-medium text-charcoal capitalize">{profile.riskProfile}</span>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-xl text-navy border-b pb-2 mb-3">Financial Information</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <span className="text-slate">Financial Goals</span>
            <span className="font-medium text-charcoal">
              {profile.goals.length
                ? profile.goals
                    .map((g) => (profile.goalTimeHorizons?.[g] ? `${g} (${profile.goalTimeHorizons[g]})` : g))
                    .join(', ')
                : '—'}
            </span>

            <span className="text-slate">Monthly Expenses</span>
            <span className="font-medium text-charcoal">₹{(profile.monthlyExpenses || 0).toLocaleString('en-IN')}</span>

            <span className="text-slate">Existing Insurance</span>
            <span className="font-medium text-charcoal">
              {profile.existingInsurance.map(i => `${i.type} (Sum: ₹${i.sumInsured.toLocaleString('en-IN')})`).join(', ') || 'None'}
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-xl text-navy border-b pb-2 mb-3">Net Worth Worksheet</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-serif text-md text-navy/80 mb-2">Assets</h4>
              <div className="grid grid-cols-2 gap-2 text-sm pl-4">
                <span className="text-slate">Bank & FD</span>
                <span className="font-medium text-charcoal">₹{(profile.netWorthWorksheet?.assets.bankFD || 0).toLocaleString('en-IN')}</span>
                
                <span className="text-slate">Mutual Funds</span>
                <span className="font-medium text-charcoal">₹{(profile.netWorthWorksheet?.assets.mutualFunds || 0).toLocaleString('en-IN')}</span>
                
                <span className="text-slate">Shares</span>
                <span className="font-medium text-charcoal">₹{(profile.netWorthWorksheet?.assets.shares || 0).toLocaleString('en-IN')}</span>
                
                <span className="text-slate">Property</span>
                <span className="font-medium text-charcoal">₹{(profile.netWorthWorksheet?.assets.property || 0).toLocaleString('en-IN')}</span>
                
                <span className="text-slate">Gold</span>
                <span className="font-medium text-charcoal">₹{(profile.netWorthWorksheet?.assets.gold || 0).toLocaleString('en-IN')}</span>
                
                <span className="text-slate">EPF / PPF / NPS</span>
                <span className="font-medium text-charcoal">₹{(profile.netWorthWorksheet?.assets.epfPpfNps || 0).toLocaleString('en-IN')}</span>

                <span className="text-slate">Insurance Value</span>
                <span className="font-medium text-charcoal">₹{(profile.netWorthWorksheet?.assets.insuranceValue || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div>
              <h4 className="font-serif text-md text-navy/80 mb-2">Liabilities</h4>
              <div className="grid grid-cols-2 gap-2 text-sm pl-4">
                <span className="text-slate">Home Loan</span>
                <span className="font-medium text-charcoal">₹{(profile.netWorthWorksheet?.liabilities.homeLoan || 0).toLocaleString('en-IN')}</span>
                
                <span className="text-slate">Personal Loan</span>
                <span className="font-medium text-charcoal">₹{(profile.netWorthWorksheet?.liabilities.personalLoan || 0).toLocaleString('en-IN')}</span>
                
                <span className="text-slate">Vehicle Loan</span>
                <span className="font-medium text-charcoal">₹{(profile.netWorthWorksheet?.liabilities.vehicleLoan || 0).toLocaleString('en-IN')}</span>
                
                <span className="text-slate">Credit Card</span>
                <span className="font-medium text-charcoal">₹{(profile.netWorthWorksheet?.liabilities.creditCard || 0).toLocaleString('en-IN')}</span>
                
                <span className="text-slate">Other Loans</span>
                <span className="font-medium text-charcoal">₹{(profile.netWorthWorksheet?.liabilities.otherLoans || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="border-t pt-3 grid grid-cols-2 text-sm">
              <span className="font-semibold text-navy">Net Worth (Assets — Liabilities)</span>
              <span className="font-serif font-bold text-gold-dark text-right">
                ₹{(profile.totalAssets - profile.totalLiabilities).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>,
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-12 sm:pb-16">
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
        {steps[step]}

        {/* Navigation */}
        <div className="mt-10 flex flex-col-reverse sm:flex-row gap-3 sm:gap-0 justify-between items-center">
          <Button showArrow={false} variant="ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="w-full sm:w-auto">
            ← Previous
          </Button>
          {step < totalSteps - 1 ? (
            <Button showArrow={false} onClick={handleNext} className="w-full sm:w-auto">
              Continue →
            </Button>
          ) : (
            <Link href="/mykundali/assessment/grahas" onClick={() => saveProfile(profile)} className="w-full sm:w-auto">
              <Button showArrow={false} className="w-full sm:w-auto">
                Start Assessment →
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
