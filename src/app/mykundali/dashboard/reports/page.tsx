'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/Button'

export default function ReportsPage() {
  const [format, setFormat] = useState('full')
  const [downloading, setDownloading] = useState(false)
  const [email, setEmail] = useState('rahul@example.com')
  const [sent, setSent] = useState(false)

  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => {
      setDownloading(false)
    }, 2000)
  }

  const handleSendEmail = () => {
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Reports & Downloads</h1>
      <p className="text-slate mt-1">Download your Financial Kundali report.</p>

      <div className="mt-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 bg-white rounded-3xl border border-slate-lighter/20 shadow-card"
        >
          {/* Preview */}
          <div className="mb-8 p-6 bg-cream rounded-2xl border border-slate-lighter/20">
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <span className="text-5xl block mb-3">✦</span>
                <p className="font-serif text-xl text-navy">Financial Kundali Report</p>
                <p className="text-sm text-slate mt-2">
                  Rahul Sharma · 7 July 2026 · Score: 72/90
                </p>
                <p className="text-xs text-slate-light mt-1">
                  Advisor: Priya Sharma, CFP
                </p>
              </div>
            </div>
          </div>

          {/* Format Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-charcoal mb-3">
              Report Format
            </label>
            <div className="flex gap-3">
              {[
                { value: 'full', label: 'Full Report' },
                { value: 'summary', label: 'Summary' },
                { value: 'actions', label: 'Action Plan Only' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFormat(opt.value)}
                  className={`flex-1 p-3 rounded-xl border-2 text-sm text-center transition-all ${
                    format === opt.value
                      ? 'border-gold bg-gold-light/20 text-charcoal'
                      : 'border-slate-lighter text-slate hover:border-slate-light'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Download */}
          <div className="flex gap-4 mb-6">
            <Button showArrow={false}
              onClick={handleDownload}
              loading={downloading}
              size="lg"
              className="flex-1"
            >
              {downloading ? 'Downloading...' : '↓ Download PDF'}
            </Button>
            <Button showArrow={false}
              variant="secondary"
              size="lg"
              className="flex-1"
            >
              🖨 Print
            </Button>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Send to Email
            </label>
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none transition-colors"
              />
              <Button showArrow={false} onClick={handleSendEmail} disabled={sent}>
                {sent ? '✓ Sent' : 'Send'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
