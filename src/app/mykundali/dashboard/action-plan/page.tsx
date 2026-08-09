'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ProgressBar } from '@/components/mykundali/progress-bar'
import { createClient } from '@/lib/supabase/client'
import type { Json } from '@/lib/supabase/types'
import { useMykundaliAuth } from '@/components/mykundali/AuthContext'
import type { ActionItem } from '@/types'
import { ShieldCheck, TrendingUp, PiggyBank, HeartHandshake, FileCheck } from 'lucide-react'

const MASTER_CATEGORIES = [
  { id: 'All', label: 'All Actions', icon: null },
  { id: 'Protection', label: 'Protection & Safety Net', icon: ShieldCheck, color: 'text-error bg-error/10 border-error/20' },
  { id: 'Discipline', label: 'Income & Expense Discipline', icon: PiggyBank, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { id: 'Wealth', label: 'Wealth Creation & Investments', icon: TrendingUp, color: 'text-guru bg-guru/10 border-guru/20' },
  { id: 'Retirement', label: 'Retirement & Healthcare', icon: HeartHandshake, color: 'text-info bg-info/10 border-info/20' },
  { id: 'Legacy', label: 'Legacy & Succession', icon: FileCheck, color: 'text-rahu bg-rahu/10 border-rahu/20' },
]

function getMasterCategory(item: ActionItem): string {
  const cat = (item.category || '').toLowerCase()
  const title = (item.title || '').toLowerCase()
  const graha = (item.grahaId || '').toLowerCase()

  if (cat.includes('insurance') || cat.includes('emergency') || graha === 'mangal' || graha === 'chandra') {
    return 'Protection'
  }
  if (cat.includes('budget') || cat.includes('income') || cat.includes('discipline') || graha === 'surya' || graha === 'budh') {
    return 'Discipline'
  }
  if (cat.includes('wealth') || cat.includes('invest') || cat.includes('risk') || graha === 'guru' || graha === 'rahu') {
    return 'Wealth'
  }
  if (cat.includes('retire') || graha === 'shani') {
    return 'Retirement'
  }
  if (cat.includes('estate') || cat.includes('legacy') || cat.includes('lifestyle') || graha === 'ketu' || graha === 'shukra') {
    return 'Legacy'
  }
  return 'Protection'
}

function getScoreImprovementTip(item: ActionItem): string {
  const graha = (item.grahaId || '').toLowerCase()
  switch (graha) {
    case 'surya': return 'Boosting income stability and skill investments directly improves your Surya (Earning Power) score (+2 points).'
    case 'chandra': return 'Setting aside liquid emergency savings raises your Chandra (Financial Peace) score (+2 points).'
    case 'mangal': return 'Securing adequate life & health policies improves your Mangal (Protection) rating (+2 points).'
    case 'budh': return 'Maintaining expense tracking and keeping debt below 30% boosts your Budh (Discipline) score (+2 points).'
    case 'guru': return 'Starting goal-linked SIPs and diversifying your portfolio increases your Guru (Wealth) score (+2 points).'
    case 'shukra': return 'Budgeting for vacations and avoiding impulse purchases enhances your Shukra (Happiness) score (+2 points).'
    case 'shani': return 'Calculating your retirement corpus and investing regularly lifts your Shani (Retirement) score (+2 points).'
    case 'rahu': return 'Avoiding get-rich-quick schemes and getting professional risk advice strengthens your Rahu score (+2 points).'
    case 'ketu': return 'Drafting a Will and updating asset nominations elevates your Ketu (Legacy) score (+2 points).'
    default: return 'Completing this action item elevates your overall Financial Kundali score.'
  }
}

function formatCurrency(val: number): string {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`
  return `₹${val}`
}

export default function ActionPlanPage() {
  const supabase = useMemo(() => createClient(), [])
  const { userId } = useMykundaliAuth()
  const [activeTab, setActiveTab] = useState('All')
  const [actions, setActions] = useState<ActionItem[]>([])

  useEffect(() => {
    if (!userId) return
    ;(async () => {
      const { data } = await supabase
        .from('assessment_results')
        .select('action_plan')
        .eq('customer_id', userId)
        .maybeSingle()
      if (data) setActions((data.action_plan as unknown as ActionItem[]) ?? [])
    })()
  }, [userId, supabase])

  const filtered = activeTab === 'All'
    ? actions
    : actions.filter((a) => getMasterCategory(a) === activeTab)

  const completedCount = actions.filter((a) => a.status === 'completed').length
  const totalCount = actions.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const toggleStatus = (id: string) => {
    setActions((prev) => {
      const next = prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'completed' ? ('in-progress' as const) : ('completed' as const) }
          : a
      )
      if (userId) {
        supabase
          .from('assessment_results')
          .update({ action_plan: next as unknown as Json })
          .eq('customer_id', userId)
          .then()
      }
      return next
    })
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">90-Day Action Plan</h1>
      <p className="text-slate mt-1">Categorized roadmap to improve your Financial Kundali score step by step.</p>

      {/* Overall Progress Banner */}
      <div className="mt-6 p-6 bg-white rounded-2xl border border-slate-lighter/20 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-medium text-charcoal block">Overall Action Plan Progress</span>
            <span className="text-xs text-slate-light">Complete high-priority items first to see immediate score boosts.</span>
          </div>
          <span className="text-sm font-semibold text-navy">
            {completedCount} of {totalCount} Completed
          </span>
        </div>
        <ProgressBar value={progressPercent} size="md" showPercentage />
      </div>

      {/* Category Tabs */}
      <div className="mt-8 flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {MASTER_CATEGORIES.map((cat) => {
          const count = cat.id === 'All'
            ? actions.length
            : actions.filter((a) => getMasterCategory(a) === cat.id).length

          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap border-2 transition-all flex items-center gap-2 ${
                activeTab === cat.id
                  ? 'border-gold bg-gold-light/20 text-charcoal shadow-sm'
                  : 'border-slate-lighter bg-white text-slate hover:border-slate-light'
              }`}
            >
              {cat.icon && <cat.icon size={15} className="text-gold-dark" />}
              <span>{cat.label}</span>
              <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-lighter text-charcoal font-mono">
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Categorized Action List */}
      <div className="mt-6 space-y-4 mb-12">
        {filtered.map((action, i) => {
          const masterCat = getMasterCategory(action)
          const catMeta = MASTER_CATEGORIES.find((c) => c.id === masterCat)
          const tip = getScoreImprovementTip(action)
          const hasTarget = action.target !== undefined && action.current !== undefined
          const actionProgress = hasTarget ? Math.round((action.current! / action.target!) * 100) : 0

          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 bg-white rounded-2xl border border-slate-lighter/20 shadow-card hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleStatus(action.id)}
                  aria-label="Toggle completion status"
                  className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    action.status === 'completed'
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                      : 'border-slate-lighter hover:border-gold bg-white'
                  }`}
                >
                  {action.status === 'completed' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${catMeta?.color ?? 'text-slate bg-slate-lighter border-slate-lighter'}`}>
                      {catMeta?.label ?? action.category}
                    </span>

                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      action.priority === 'high' ? 'bg-red-50 text-red-700 border border-red-200' :
                      action.priority === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-slate-lighter text-slate'
                    }`}>
                      {action.priority} Priority
                    </span>

                    <span className={`text-xs font-medium ml-auto ${action.status === 'completed' ? 'text-emerald-600 font-semibold' : 'text-slate-light'}`}>
                      {action.status === 'completed' ? '✓ Completed' : action.status === 'in-progress' ? 'In Progress' : 'Pending'}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl text-navy font-semibold">{action.title}</h3>
                  <p className="text-sm text-slate mt-1.5 leading-relaxed">{action.description}</p>

                  {/* Score Boost Tip */}
                  <div className="mt-3 p-3 bg-gold-light/10 rounded-xl border border-gold/20 flex items-start gap-2 text-xs text-charcoal">
                    <span className="text-gold-dark font-bold text-sm">✦</span>
                    <div>
                      <span className="font-semibold text-gold-dark">Score Boost Guidance: </span>
                      <span>{tip}</span>
                    </div>
                  </div>

                  {hasTarget && (
                    <div className="mt-3 pt-3 border-t border-slate-lighter/30">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate font-medium">
                          Progress: {formatCurrency(action.current!)} of {formatCurrency(action.target!)}
                        </span>
                        <span className="font-mono text-xs text-charcoal font-semibold">{actionProgress}%</span>
                      </div>
                      <div className="bg-slate-lighter rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gold transition-all duration-700"
                          style={{ width: `${actionProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}

        {filtered.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-lighter/20">
            <p className="text-slate">No action items found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
