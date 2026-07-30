'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Download, Printer, Check } from 'lucide-react'
import Button from '@/components/Button'
import { createClient } from '@/lib/supabase/client'
import { useMykundaliAuth } from '@/components/mykundali/AuthContext'
import { GRAHAS } from '@/lib/kundali/grahas'
import type { ActionItem, GrahaId } from '@/types'

type ReportFormat = 'full' | 'summary' | 'actions'

interface ReportData {
  overallScore: number
  overallStatus: string
  completedAt: string
  grahaScores: Partial<Record<GrahaId, number>>
  recommendations: string[]
  advisorNotes: string
  actionPlan: ActionItem[]
}

function grahaName(id: string) {
  return GRAHAS.find((g) => g.id === id)?.name ?? id
}

export default function ReportsPage() {
  const supabase = useMemo(() => createClient(), [])
  const { userId, user } = useMykundaliAuth()
  const [format, setFormat] = useState<ReportFormat>('full')
  const [downloading, setDownloading] = useState(false)
  const [email, setEmail] = useState('')
  const [syncedUserEmail, setSyncedUserEmail] = useState<string | undefined>(undefined)
  if (user?.email && user.email !== syncedUserEmail) {
    setSyncedUserEmail(user.email)
    setEmail(user.email)
  }
  const [sent, setSent] = useState(false)
  const [report, setReport] = useState<ReportData | null>(null)

  useEffect(() => {
    if (!userId) return
    ;(async () => {
      const { data } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('customer_id', userId)
        .maybeSingle()
      if (data) {
        setReport({
          overallScore: data.overall_score,
          overallStatus: data.overall_status,
          completedAt: new Date(data.completed_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          grahaScores: (data.graha_scores as unknown as Partial<Record<GrahaId, number>>) ?? {},
          recommendations: data.recommendations ?? [],
          advisorNotes: data.advisor_notes ?? '',
          actionPlan: (data.action_plan as unknown as ActionItem[]) ?? [],
        })
      }
    })()
  }, [userId, supabase])

  const handleDownload = async () => {
    if (!report) return
    setDownloading(true)

    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    const marginX = 20
    let y = 26

    const heading = (text: string, size = 20) => {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(size)
      doc.setTextColor(32, 27, 98)
      doc.text(text, marginX, y)
      y += size * 0.6
    }
    const body = (text: string, size = 11) => {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(size)
      doc.setTextColor(60, 60, 60)
      const lines = doc.splitTextToSize(text, 170)
      for (const line of lines) {
        if (y > 280) {
          doc.addPage()
          y = 26
        }
        doc.text(line, marginX, y)
        y += size * 0.55
      }
    }
    const section = (title: string) => {
      y += 6
      if (y > 270) {
        doc.addPage()
        y = 26
      }
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(168, 121, 31)
      doc.text(title, marginX, y)
      y += 8
    }

    heading('Financial Kundali Report')
    y += 2
    body(`${user?.fullName ?? 'Kutumb Client'}  ·  Completed ${report.completedAt}`)
    body(`Overall Score: ${report.overallScore}/90  ·  Status: ${report.overallStatus}`)

    if (format !== 'actions') {
      section('9 Graha Breakdown')
      for (const [id, score] of Object.entries(report.grahaScores)) {
        body(`${grahaName(id)}: ${score}/10`)
      }
    }

    if (format !== 'actions') {
      section('Recommendations')
      for (const rec of report.recommendations) {
        body(`•  ${rec}`)
      }
    }

    if (format === 'full') {
      section('Advisor Notes')
      body(report.advisorNotes)
    }

    if (format !== 'summary') {
      section('90-Day Action Plan')
      for (const item of report.actionPlan) {
        body(`${item.title} (${item.priority} priority) — ${item.description}`)
      }
    }

    doc.save(`Financial-Kundali-Report-${(user?.fullName ?? 'report').replace(/\s+/g, '-')}.pdf`)
    setDownloading(false)
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
                  {user?.fullName ?? 'Your Report'}
                  {report && ` · ${report.completedAt} · Score: ${report.overallScore}/90`}
                </p>
                <p className="text-xs text-slate-light mt-1">
                  Kutumb Advisory
                </p>
              </div>
            </div>
          </div>

          {/* Format Selection */}
          <div className="mb-6 print:hidden">
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
                  onClick={() => setFormat(opt.value as ReportFormat)}
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
          <div className="flex gap-4 mb-6 print:hidden">
            <Button
              showArrow={false}
              onClick={handleDownload}
              loading={downloading}
              disabled={!report}
              size="lg"
              className="flex-1 gap-2"
            >
              <Download size={16} strokeWidth={1.75} />
              {downloading ? 'Preparing...' : 'Download PDF'}
            </Button>
            <Button
              showArrow={false}
              variant="secondary"
              size="lg"
              onClick={() => window.print()}
              className="flex-1 gap-2"
            >
              <Printer size={16} strokeWidth={1.75} />
              Print
            </Button>
          </div>

          {/* Email */}
          <div className="print:hidden">
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
              <Button showArrow={false} onClick={handleSendEmail} disabled={sent} className="gap-2">
                {sent ? (
                  <>
                    <Check size={16} strokeWidth={2} /> Sent
                  </>
                ) : (
                  'Send'
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
