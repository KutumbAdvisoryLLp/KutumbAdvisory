'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Download } from 'lucide-react'
import { CrossSell } from './cross-sell'
import { ToolIcon } from './tool-icons'
import { ProgressBar } from '@/components/mykundali/progress-bar'
import type { ChecklistDef } from '@/lib/kundali/toolkit'

interface ChecklistModalProps {
  checklist: ChecklistDef
  onClose: () => void
  onStartAssessment?: () => void
}

export function ChecklistModal({ checklist, onClose, onStartAssessment }: ChecklistModalProps) {
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [showCrossSell, setShowCrossSell] = useState(false)

  const allDone = completed.size === checklist.items.length

  useEffect(() => {
    if (allDone) {
      const timer = setTimeout(() => setShowCrossSell(true), 500)
      return () => clearTimeout(timer)
    }
  }, [allDone])

  const toggle = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const progress = Math.round((completed.size / checklist.items.length) * 100)

  const handleDownload = () => {
    const text = `${checklist.title}\n${'='.repeat(checklist.title.length)}\n\nCompleted: ${completed.size}/${checklist.items.length}\n\n${checklist.items.map(i => `[${completed.has(i.id) ? '✓' : ' '}] ${i.label}`).join('\n')}`
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${checklist.title.toLowerCase().replace(/\s+/g, '-')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-modal max-w-xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-5 border-b border-slate-lighter/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-guru/20 to-guru/5 flex items-center justify-center">
                <ToolIcon id={checklist.id} className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-navy">{checklist.title}</h2>
                <p className="text-xs text-slate">{checklist.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={handleDownload} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-lighter/20 transition-colors" title="Download">
                <Download size={15} className="text-slate" />
              </button>
              <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-lighter/20 transition-colors">
                <X size={16} className="text-slate" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <ProgressBar value={progress} label={`${completed.size} of ${checklist.items.length} completed`} />
            </div>

            <div className="space-y-2">
              {checklist.items.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => toggle(item.id)}
                  className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    completed.has(item.id)
                      ? 'border-success/30 bg-success/5'
                      : 'border-slate-lighter/30 bg-white hover:border-navy-mid/20'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    completed.has(item.id)
                      ? 'bg-success border-success'
                      : 'border-slate-lighter'
                  }`}>
                    {completed.has(item.id) && <Check size={14} className="text-white" />}
                  </div>
                  <span className={`text-sm flex-1 ${completed.has(item.id) ? 'text-slate-light line-through' : 'text-charcoal'}`}>
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {allDone && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-navy rounded-2xl text-center"
              >
                <p className="text-gold font-serif text-lg">All Complete! 🎉</p>
                <p className="text-white/50 text-sm mt-1">Great progress on your financial journey.</p>
              </motion.div>
            )}

            {showCrossSell && <CrossSell toolName={checklist.title} onStartAssessment={onStartAssessment} />}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
