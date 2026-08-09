'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Download, Printer, Check, TrendingUp, PhoneCall } from 'lucide-react'
import Button from '@/components/Button'
import { createClient } from '@/lib/supabase/client'
import { useMykundaliAuth } from '@/components/mykundali/AuthContext'
import { GRAHAS } from '@/lib/kundali/grahas'
import { getScoreColor, getScoreStatus } from '@/types'
import type { ActionItem, GrahaId, FamilyProfile, Member, InvestmentEntry, InsuranceEntry } from '@/types'

const PRIORITY_LABELS = ['First', 'Second', 'Third']

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
  const [profile, setProfile] = useState<FamilyProfile | null>(null)
  const [grahaAnswers, setGrahaAnswers] = useState<Record<string, Record<string, string>> | undefined>(undefined)

  useEffect(() => {
    if (!userId) return
    ;(async () => {
      const [resultRes, profileRes] = await Promise.all([
        supabase.from('assessment_results').select('*').eq('customer_id', userId).maybeSingle(),
        supabase.from('family_profiles').select('*').eq('customer_id', userId).maybeSingle(),
      ])

      if (resultRes.data) {
        const data = resultRes.data
        if (data.graha_answers) {
          setGrahaAnswers(data.graha_answers as Record<string, Record<string, string>>)
        }
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

      if (profileRes.data) {
        const d = profileRes.data
        const pm = d.primary_member as any
        setProfile({
          primaryMember: {
            name: pm?.name ?? '',
            age: pm?.age ?? 35,
            relation: pm?.relation ?? 'self',
            occupation: pm?.occupation ?? '',
            income: pm?.income ?? 0,
          },
          spouse: (d.spouse as unknown as Member) ?? undefined,
          children: (d.children as unknown as Member[]) ?? [],
          monthlyExpenses: d.monthly_expenses ?? 0,
          totalAssets: d.total_assets ?? 0,
          totalLiabilities: d.total_liabilities ?? 0,
          riskProfile: d.risk_profile ?? 'moderate',
          goals: d.goals ?? [],
          existingInvestments: (d.existing_investments as unknown as InvestmentEntry[]) ?? [],
          existingInsurance: (d.existing_insurance as unknown as InsuranceEntry[]) ?? [],
          familyName: pm?.familyName ?? '',
          timeHorizon: pm?.timeHorizon ?? '',
          netWorthWorksheet: pm?.netWorthWorksheet ?? {
            assets: { bankFD: 0, mutualFunds: 0, shares: 0, property: 0, gold: 0, epfPpfNps: 0 },
            liabilities: { homeLoan: 0, personalLoan: 0, vehicleLoan: 0, creditCard: 0, otherLoans: 0 }
          },
        })
      }
    })()
  }, [userId, supabase])

  const handleDownload = async () => {
    if (!report) return
    setDownloading(true)
    try {
      const { downloadFullReportPdf } = await import('@/lib/kundali/pdf-generator')
      await downloadFullReportPdf({
        user,
        profile,
        report,
        grahaAnswers,
      })
    } catch (err) {
      console.error('Failed to generate PDF report:', err)
    } finally {
      setDownloading(false)
    }
  }

  const handlePrint = async () => {
    if (!report) return
    try {
      const { printFullReportHtml } = await import('@/lib/kundali/pdf-generator')
      printFullReportHtml({
        user,
        profile,
        report,
        grahaAnswers,
      })
    } catch (err) {
      console.error('Failed to print full report:', err)
    }
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
          <div className="mb-8 p-6 sm:p-8 bg-cream print:bg-white rounded-2xl border border-slate-lighter/20 print:border-navy/20">
            <div className="text-center pb-6 border-b border-slate-lighter/30 print:border-navy/20">
              <span className="text-4xl block mb-2">✦</span>
              <p className="font-serif text-2xl text-navy">Financial Kundali Report</p>
              <p className="text-sm text-slate mt-1">
                {user?.fullName ?? 'Your Report'}
                {report && ` · ${report.completedAt}`}
              </p>
              <p className="text-xs text-slate-light mt-1">Kutumb Advisory</p>
            </div>

            {!report ? (
              <p className="text-sm text-slate text-center py-10">Your report will appear here once your assessment is complete.</p>
            ) : (
              <>
                <div className="text-center py-8">
                  <p className="text-xs uppercase tracking-wide text-slate-light font-semibold">Overall Financial Kundali Score</p>
                  <p className="font-serif text-5xl text-navy mt-2">
                    {report.overallScore}<span className="text-2xl text-slate">/90</span>
                  </p>
                  <span
                    className="inline-block mt-3 px-4 py-1.5 rounded-full text-xs font-semibold border"
                    style={{ color: getScoreColor(getScoreStatus(report.overallScore, 90)), borderColor: 'currentColor' }}
                  >
                    {report.overallStatus}
                  </span>
                </div>
              </>
            )}
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
              onClick={handlePrint}
              disabled={!report}
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

          {/* Expert Advice & SIP Purchase Actions */}
          <div className="mt-8 pt-6 border-t border-slate-lighter/30 grid sm:grid-cols-2 gap-3 print:hidden">
            <a
              href="#"
              className="p-4 bg-navy text-white rounded-2xl flex items-center justify-center gap-3 font-medium hover:bg-navy/90 transition-all shadow-md"
            >
              <PhoneCall size={18} strokeWidth={2} />
              <span>Talk to Expert</span>
            </a>

            <a
              href="#"
              className="p-4 bg-gold text-navy font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-gold-dark hover:text-white transition-all shadow-md"
            >
              <TrendingUp size={18} strokeWidth={2} />
              <span>SIP Purchase</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
