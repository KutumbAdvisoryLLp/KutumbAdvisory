'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ProgressBar } from '@/components/mykundali/progress-bar'
import type { ActionItem } from '@/types'

const allActions: ActionItem[] = [
  { id: 'em1', grahaId: 'chandra', category: 'Emergency', title: 'Emergency Fund', description: 'Build 6 months of expenses as safety net', target: 600000, current: 240000, unit: '₹', status: 'in-progress', priority: 'high' },
  { id: 'in1', grahaId: 'mangal', category: 'Insurance', title: 'Term Life Insurance', description: 'Secure family with adequate term cover', target: 10000000, current: 2000000, unit: '₹', status: 'in-progress', priority: 'high' },
  { id: 'in2', grahaId: 'mangal', category: 'Insurance', title: 'Health Insurance for Family', description: 'Get comprehensive health cover for all members', target: undefined, current: undefined, unit: '', status: 'pending', priority: 'high' },
  { id: 're1', grahaId: 'shani', category: 'Retirement', title: 'Retirement Corpus', description: 'Build retirement fund for dignified life', target: 30000000, current: 7500000, unit: '₹', status: 'in-progress', priority: 'medium' },
  { id: 'es1', grahaId: 'ketu', category: 'Estate', title: 'Create a Will', description: 'Ensure your assets are distributed as per your wishes', target: undefined, current: undefined, unit: '', status: 'not-started', priority: 'medium' },
  { id: 'in3', grahaId: 'guru', category: 'Investing', title: 'Start Monthly SIP', description: 'Build wealth through disciplined investing', target: 50000, current: 15000, unit: '₹', status: 'in-progress', priority: 'medium' },
  { id: 'em2', grahaId: 'budh', category: 'Emergency', title: 'Reduce Monthly Expenses by 10%', description: 'Optimize spending to increase savings rate', target: undefined, current: undefined, unit: '', status: 'pending', priority: 'low' },
  { id: 'es2', grahaId: 'ketu', category: 'Estate', title: 'Estate Planning Discussion', description: 'Have a family discussion about wealth transfer', target: undefined, current: undefined, unit: '', status: 'not-started', priority: 'low' },
]

const categories = ['All', 'Emergency', 'Insurance', 'Investing', 'Retirement', 'Estate']

function formatCurrency(val: number): string {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`
  return `₹${val}`
}

export default function ActionPlanPage() {
  const [filter, setFilter] = useState('All')
  const [actions, setActions] = useState(allActions)

  const filtered = filter === 'All' ? actions : actions.filter((a) => a.category === filter)
  const completed = actions.filter((a) => a.status === 'completed').length
  const total = actions.length
  const progress = Math.round((completed / total) * 100)

  const toggleStatus = (id: string) => {
    setActions((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'completed' ? 'in-progress' as const : 'completed' as const }
          : a
      )
    )
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Action Plan</h1>
      <p className="text-slate mt-1">Track your financial goals and progress.</p>

      {/* Overall Progress */}
      <div className="mt-6 p-6 bg-white rounded-2xl border border-slate-lighter/20 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-charcoal">Overall Progress</span>
          <span className="text-sm text-slate">
            {completed} of {total} completed
          </span>
        </div>
        <ProgressBar value={progress} size="md" showPercentage />
      </div>

      {/* Filters */}
      <div className="mt-6 flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border-2 transition-all ${
              filter === cat
                ? 'border-gold bg-gold-light/20 text-charcoal'
                : 'border-slate-lighter text-slate hover:border-slate-light'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Action Items */}
      <div className="mt-6 space-y-3 mb-10">
        {filtered.map((action, i) => {
          const hasTarget = action.target !== undefined && action.current !== undefined
          const actionProgress = hasTarget ? Math.round((action.current! / action.target!) * 100) : 0

          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 bg-white rounded-xl border border-slate-lighter/20 shadow-card"
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleStatus(action.id)}
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    action.status === 'completed'
                      ? 'bg-success border-success'
                      : 'border-slate-lighter hover:border-gold'
                  }`}
                >
                  {action.status === 'completed' && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                        action.category === 'Emergency' ? 'bg-warning/10 text-warning'
                        : action.category === 'Insurance' ? 'bg-error/10 text-error'
                        : action.category === 'Retirement' ? 'bg-info/10 text-info'
                        : action.category === 'Estate' ? 'bg-rahu/10 text-rahu'
                        : 'bg-guru/10 text-guru'
                      }`}
                    >
                      {action.category}
                    </span>
                    <span
                      className={`text-xs capitalize ${
                        action.status === 'completed' ? 'text-success'
                        : action.status === 'in-progress' ? 'text-warning'
                        : 'text-slate-light'
                      }`}
                    >
                      {action.status === 'in-progress' ? 'In Progress'
                        : action.status === 'not-started' ? 'Not Started'
                        : action.status}
                    </span>
                  </div>

                  <p className="font-medium text-charcoal">{action.title}</p>

                  {hasTarget && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate">
                          {formatCurrency(action.current!)} / {formatCurrency(action.target!)}
                        </span>
                        <span className="font-mono text-xs text-slate">{actionProgress}%</span>
                      </div>
                      <div className="mt-1 bg-slate-lighter rounded-full h-1.5 overflow-hidden">
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
          <div className="p-10 text-center">
            <p className="text-slate-light">No items in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
