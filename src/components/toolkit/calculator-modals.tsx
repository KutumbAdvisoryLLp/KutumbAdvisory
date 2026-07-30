'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { CrossSell } from './cross-sell'
import { ToolIcon } from './tool-icons'
import * as fin from '@/lib/kundali/financial'
import type { CalculatorDef } from '@/lib/kundali/toolkit'

interface CalculatorModalProps {
  calc: CalculatorDef
  onClose: () => void
  onStartAssessment?: () => void
}

export function CalculatorModal({ calc, onClose, onStartAssessment }: CalculatorModalProps) {
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
          className="bg-white rounded-3xl shadow-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-5 border-b border-slate-lighter/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                <ToolIcon id={calc.id} className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl text-navy">{calc.title}</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-lighter/20 transition-colors">
              <X size={16} className="text-slate" />
            </button>
          </div>

          <div className="p-6">
            <CalculatorContent calcId={calc.id} calcTitle={calc.title} onStartAssessment={onStartAssessment} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function CalculatorContent({ calcId, calcTitle, onStartAssessment }: { calcId: string; calcTitle: string; onStartAssessment?: () => void }) {
  const [result, setResult] = useState<Record<string, string | number> | null>(null)
  const [showCrossSell, setShowCrossSell] = useState(false)

  const handleResult = useCallback((r: Record<string, string | number>) => {
    setResult(r)
    setShowCrossSell(true)
  }, [])

  const handleReset = () => {
    setResult(null)
    setShowCrossSell(false)
  }

  return (
    <div>
      {calcId === 'sip' && <SIPForm onResult={handleResult} />}
      {calcId === 'lumpsum' && <LumpsumForm onResult={handleResult} />}
      {calcId === 'emi' && <EMIForm onResult={handleResult} />}
      {calcId === 'retirement-corpus' && <RetirementCorpusForm onResult={handleResult} />}
      {calcId === 'retirement-gap' && <RetirementGapForm onResult={handleResult} />}
      {calcId === 'swp' && <SWPForm onResult={handleResult} />}
      {calcId === 'inflation' && <InflationForm onResult={handleResult} />}
      {calcId === 'goal-planner' && <GoalPlannerForm onResult={handleResult} />}
      {calcId === 'future-value' && <FutureValueForm onResult={handleResult} />}
      {calcId === 'emergency-fund' && <EmergencyFundForm onResult={handleResult} />}
      {calcId === 'net-worth' && <NetWorthForm onResult={handleResult} />}
      {calcId === 'hlv' && <HLVForm onResult={handleResult} />}
      {calcId === 'life-insurance' && <LifeInsuranceForm onResult={handleResult} />}
      {calcId === 'health-insurance' && <HealthInsuranceForm onResult={handleResult} />}
      {calcId === 'home-loan-eligibility' && <HomeLoanEligibilityForm onResult={handleResult} />}
      {calcId === 'home-loan-affordability' && <HomeLoanAffordabilityForm onResult={handleResult} />}
      {calcId === 'loan-comparison' && <LoanComparisonForm onResult={handleResult} />}
      {calcId === 'loan-prepayment' && <LoanPrepaymentForm onResult={handleResult} />}
      {calcId === 'income-tax' && <IncomeTaxForm onResult={handleResult} />}
      {calcId === 'asset-allocation' && <AssetAllocationForm onResult={handleResult} />}
      {calcId === 'portfolio-diversification' && <PortfolioDiversificationForm onResult={handleResult} />}
      {calcId === 'child-education' && <ChildEducationForm onResult={handleResult} />}
      {calcId === 'marriage-planner' && <MarriagePlannerForm onResult={handleResult} />}

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-navy rounded-2xl border border-gold/10"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
            <h3 className="font-serif text-xl text-gold">Results</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(result).map(([key, val], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors"
              >
                <span className="text-white/50 text-sm capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-white font-serif text-lg font-semibold tracking-tight">
                  {typeof val === 'number' ? fin.formatINR(val) : val}
                </span>
              </motion.div>
            ))}
          </div>
          <button
            onClick={handleReset}
            className="mt-5 text-xs text-white/30 hover:text-gold-light transition-colors font-mono uppercase tracking-wider"
          >
            ← Reset & Recalculate
          </button>
        </motion.div>
      )}

      {showCrossSell && <CrossSell toolName={calcTitle} onStartAssessment={onStartAssessment} />}
    </div>
  )
}

/* ─── SIP ─── */
function SIPForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [m, setM] = useState(10000)
  const [r, setR] = useState(12)
  const [y, setY] = useState(10)
  return (
    <div className="space-y-5">
      <Field label="Monthly Investment (₹)" val={m} set={setM} min={500} max={500000} step={500} prefix="₹" />
      <Field label="Expected Return (% p.a.)" val={r} set={setR} min={1} max={30} step={0.5} suffix="%" />
      <Field label="Investment Period (years)" val={y} set={setY} min={1} max={40} step={1} suffix="yrs" />
      <button onClick={() => onResult({
        'Total Investment': fin.sipTotalInvestment(m, y),
        'Estimated Returns': fin.sipFutureValue(m, r, y) - fin.sipTotalInvestment(m, y),
        'Total Value': fin.sipFutureValue(m, r, y),
      })} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

/* ─── Lumpsum ─── */
function LumpsumForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [p, setP] = useState(500000)
  const [rt, setRt] = useState(12)
  const [y, setY] = useState(10)
  return (
    <div className="space-y-5">
      <Field label="Investment Amount (₹)" val={p} set={setP} min={1000} max={100000000} step={10000} prefix="₹" />
      <Field label="Expected Return (% p.a.)" val={rt} set={setRt} min={1} max={30} step={0.5} suffix="%" />
      <Field label="Investment Period (years)" val={y} set={setY} min={1} max={40} step={1} suffix="yrs" />
      <button onClick={() => onResult({
        'Total Investment': p,
        'Estimated Returns': fin.lumpsumFutureValue(p, rt, y) - p,
        'Total Value': fin.lumpsumFutureValue(p, rt, y),
      })} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

/* ─── EMI ─── */
function EMIForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [p, setP] = useState(5000000)
  const [rt, setRt] = useState(9)
  const [m, setM] = useState(60)
  return (
    <div className="space-y-5">
      <Field label="Loan Amount (₹)" val={p} set={setP} min={10000} max={100000000} step={50000} prefix="₹" />
      <Field label="Interest Rate (% p.a.)" val={rt} set={setRt} min={1} max={30} step={0.25} suffix="%" />
      <Field label="Tenure (months)" val={m} set={setM} min={1} max={360} step={1} suffix="mo" />
      <button onClick={() => {
        const e = fin.emi(p, rt, m)
        const tp = fin.totalPayment(e, m)
        onResult({
          'Monthly EMI': e,
          'Total Payment': tp,
          'Total Interest': fin.totalInterest(tp, p),
          'Principal Amount': p,
        })
      }} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

/* ─── Retirement Corpus ─── */
function RetirementCorpusForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [age, setAge] = useState(35)
  const [ra, setRa] = useState(60)
  const [exp, setExp] = useState(50000)
  const [inf, setInf] = useState(6)
  const [ret, setRet] = useState(7)
  const [le, setLe] = useState(85)
  return (
    <div className="space-y-5">
      <Field label="Current Age" val={age} set={setAge} min={18} max={80} step={1} suffix="yrs" />
      <Field label="Retirement Age" val={ra} set={setRa} min={40} max={80} step={1} suffix="yrs" />
      <Field label="Monthly Expenses (₹)" val={exp} set={setExp} min={5000} max={5000000} step={5000} prefix="₹" />
      <Field label="Expected Inflation (%)" val={inf} set={setInf} min={1} max={15} step={0.5} suffix="%" />
      <Field label="Return After Retirement (%)" val={ret} set={setRet} min={1} max={20} step={0.5} suffix="%" />
      <Field label="Life Expectancy" val={le} set={setLe} min={60} max={100} step={1} suffix="yrs" />
      <button onClick={() => onResult({
        'Corpus Needed at Retirement': fin.retirementCorpus(age, ra, exp, inf, ret, le),
        'Monthly Expense at Retirement': fin.inflationAdjustedValue(exp, inf, ra - age),
      })} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

/* ─── Retirement Gap ─── */
function RetirementGapForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [age, setAge] = useState(35)
  const [ra, setRa] = useState(60)
  const [corpus, setCorpus] = useState(1000000)
  const [sip, setSip] = useState(10000)
  const [ret, setRet] = useState(12)
  const [exp, setExp] = useState(50000)
  const [inf, setInf] = useState(6)
  const [le, setLe] = useState(85)
  return (
    <div className="space-y-5">
      <Field label="Current Age" val={age} set={setAge} min={18} max={80} step={1} suffix="yrs" />
      <Field label="Retirement Age" val={ra} set={setRa} min={40} max={80} step={1} suffix="yrs" />
      <Field label="Current Retirement Corpus (₹)" val={corpus} set={setCorpus} min={0} max={100000000} step={50000} prefix="₹" />
      <Field label="Monthly SIP for Retirement (₹)" val={sip} set={setSip} min={0} max={500000} step={1000} prefix="₹" />
      <Field label="Expected Return (% p.a.)" val={ret} set={setRet} min={1} max={30} step={0.5} suffix="%" />
      <Field label="Monthly Expenses (₹)" val={exp} set={setExp} min={5000} max={5000000} step={5000} prefix="₹" />
      <Field label="Inflation Rate (%)" val={inf} set={setInf} min={1} max={15} step={0.5} suffix="%" />
      <Field label="Life Expectancy" val={le} set={setLe} min={60} max={100} step={1} suffix="yrs" />
      <button onClick={() => {
        const g = fin.retirementGap(corpus, sip, ret, age, ra, exp, inf, le)
        onResult({
          'Corpus at Retirement': g.corpusAtRetire,
          'Corpus Needed': g.needed,
          'Gap (Shortfall)': g.gap > 0 ? g.gap : 0,
          'Status': g.gap <= 0 ? 'On Track ✓' : 'Shortfall',
        })
      }} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

/* ─── SWP ─── */
function SWPForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [corpus, setCorpus] = useState(5000000)
  const [w, setW] = useState(30000)
  const [ret, setRet] = useState(8)
  return (
    <div className="space-y-5">
      <Field label="Corpus (₹)" val={corpus} set={setCorpus} min={100000} max={100000000} step={50000} prefix="₹" />
      <Field label="Monthly Withdrawal (₹)" val={w} set={setW} min={1000} max={500000} step={1000} prefix="₹" />
      <Field label="Expected Return (% p.a.)" val={ret} set={setRet} min={1} max={20} step={0.5} suffix="%" />
      <button onClick={() => {
        const s = fin.swpWithdrawal(corpus, w, ret)
        onResult({
          'Corpus Lasts': `${Math.floor(s.monthsLast / 12)} yrs ${s.monthsLast % 12} mo`,
          'Total Withdrawn': s.totalWithdrawn,
          'Remaining Corpus': s.remaining,
          'Months': s.monthsLast,
        })
      }} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

/* ─── Inflation ─── */
function InflationForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [val, setVal] = useState(100000)
  const [inf, setInf] = useState(6)
  const [y, setY] = useState(10)
  return (
    <div className="space-y-5">
      <Field label="Current Value (₹)" val={val} set={setVal} min={1000} max={100000000} step={5000} prefix="₹" />
      <Field label="Inflation Rate (%)" val={inf} set={setInf} min={1} max={20} step={0.5} suffix="%" />
      <Field label="Years" val={y} set={setY} min={1} max={50} step={1} suffix="yrs" />
      <button onClick={() => onResult({
        'Future Value Needed': fin.inflationAdjustedValue(val, inf, y),
        'Purchasing Power Loss': fin.inflationAdjustedValue(val, inf, y) - val,
      })} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

/* ─── Goal Planner ─── */
function GoalPlannerForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [target, setTarget] = useState(5000000)
  const [y, setY] = useState(10)
  const [ret, setRet] = useState(12)
  return (
    <div className="space-y-5">
      <Field label="Target Amount (₹)" val={target} set={setTarget} min={10000} max={100000000} step={50000} prefix="₹" />
      <Field label="Time to Goal (years)" val={y} set={setY} min={1} max={40} step={1} suffix="yrs" />
      <Field label="Expected Return (% p.a.)" val={ret} set={setRet} min={1} max={30} step={0.5} suffix="%" />
      <button onClick={() => {
        const g = fin.goalPlanning(target, y, ret)
        onResult({
          'Monthly SIP Required': g.monthlyInvestment,
          'Lumpsum Required Today': g.lumpsumNeeded,
        })
      }} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

/* ─── Future Value ─── */
function FutureValueForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [p, setP] = useState(100000)
  const [rt, setRt] = useState(10)
  const [y, setY] = useState(10)
  return (
    <div className="space-y-5">
      <Field label="Principal (₹)" val={p} set={setP} min={1000} max={100000000} step={5000} prefix="₹" />
      <Field label="Annual Return (%)" val={rt} set={setRt} min={1} max={30} step={0.5} suffix="%" />
      <Field label="Years" val={y} set={setY} min={1} max={50} step={1} suffix="yrs" />
      <button onClick={() => onResult({
        'Future Value': fin.futureValue(p, rt / 100, y),
        'Total Returns': fin.futureValue(p, rt / 100, y) - p,
      })} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

/* ─── Emergency Fund ─── */
function EmergencyFundForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [exp, setExp] = useState(50000)
  const [sav, setSav] = useState(150000)
  return (
    <div className="space-y-5">
      <Field label="Monthly Expenses (₹)" val={exp} set={setExp} min={5000} max={5000000} step={5000} prefix="₹" />
      <Field label="Total Savings (₹)" val={sav} set={setSav} min={0} max={10000000} step={10000} prefix="₹" />
      <button onClick={() => {
        const months = fin.emergencyFundMonths(exp, sav)
        const target = fin.emergencyFundTarget(exp)
        onResult({
          'Current Emergency Fund': months.toFixed(1) + ' months',
          'Recommended (6 months)': target,
          'Additional Savings Needed': Math.max(0, target - sav),
        })
      }} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

/* ─── Net Worth ─── */
function NetWorthForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [assets, setAssets] = useState(5000000)
  const [liab, setLiab] = useState(1000000)
  return (
    <div className="space-y-5">
      <Field label="Total Assets (₹)" val={assets} set={setAssets} min={0} max={1000000000} step={50000} prefix="₹" />
      <Field label="Total Liabilities (₹)" val={liab} set={setLiab} min={0} max={100000000} step={10000} prefix="₹" />
      <button onClick={() => onResult({
        'Net Worth': fin.netWorth(assets, liab),
        'Total Assets': assets,
        'Total Liabilities': liab,
      })} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

/* ─── HLV ─── */
function HLVForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [inc, setInc] = useState(1200000)
  const [y, setY] = useState(25)
  const [gr, setGr] = useState(10)
  return (
    <div className="space-y-5">
      <Field label="Annual Income (₹)" val={inc} set={setInc} min={100000} max={50000000} step={50000} prefix="₹" />
      <Field label="Working Years Left" val={y} set={setY} min={1} max={45} step={1} suffix="yrs" />
      <Field label="Annual Growth Rate (%)" val={gr} set={setGr} min={0} max={30} step={0.5} suffix="%" />
      <button onClick={() => onResult({
        'Human Life Value': fin.humanLifeValue(inc, y, gr),
      })} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

/* ─── Life Insurance ─── */
function LifeInsuranceForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [inc, setInc] = useState(1200000)
  const [debt, setDebt] = useState(500000)
  const [edu, setEdu] = useState(2000000)
  const [y, setY] = useState(10)
  return (
    <div className="space-y-5">
      <Field label="Annual Income (₹)" val={inc} set={setInc} min={100000} max={50000000} step={50000} prefix="₹" />
      <Field label="Outstanding Debt (₹)" val={debt} set={setDebt} min={0} max={10000000} step={50000} prefix="₹" />
      <Field label="Children Education Cost (₹)" val={edu} set={setEdu} min={0} max={10000000} step={50000} prefix="₹" />
      <Field label="Years of Cover" val={y} set={setY} min={5} max={30} step={1} suffix="yrs" />
      <button onClick={() => onResult({
        'Life Insurance Cover Needed': fin.lifeInsuranceNeeded(inc, debt, edu, y),
      })} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

/* ─── Health Insurance ─── */
function HealthInsuranceForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [members, setMembers] = useState(4)
  const [age, setAge] = useState(35)
  const [city, setCity] = useState('metro')
  const baseCover = city === 'metro' ? 10000000 : 5000000
  const ageFactor = age > 50 ? 1.5 : age > 40 ? 1.2 : 1
  const recommended = Math.round(baseCover * ageFactor * (members / 3))
  return (
    <div className="space-y-5">
      <Field label="Family Members" val={members} set={setMembers} min={1} max={10} step={1} suffix="members" />
      <Field label="Your Age" val={age} set={setAge} min={18} max={80} step={1} suffix="yrs" />
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">City Type</label>
        <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none transition-colors">
          <option value="metro">Metro City</option>
          <option value="non-metro">Non-Metro City</option>
        </select>
      </div>
      <button onClick={() => onResult({
        'Recommended Health Cover': recommended,
        'Base Cover Considered': baseCover,
      })} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

/* ─── Home Loan Eligibility ─── */
function HomeLoanEligibilityForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [inc, setInc] = useState(100000)
  const [emi, setEmi] = useState(0)
  const [rt, setRt] = useState(9)
  const [ten, setTen] = useState(20)
  return (
    <div className="space-y-5">
      <Field label="Monthly Income (₹)" val={inc} set={setInc} min={10000} max={5000000} step={10000} prefix="₹" />
      <Field label="Existing EMIs (₹)" val={emi} set={setEmi} min={0} max={500000} step={1000} prefix="₹" />
      <Field label="Interest Rate (%)" val={rt} set={setRt} min={1} max={20} step={0.25} suffix="%" />
      <Field label="Tenure (years)" val={ten} set={setTen} min={5} max={30} step={1} suffix="yrs" />
      <button onClick={() => onResult({
        'Loan Eligibility': fin.homeLoanEligibility(inc, emi, rt, ten),
        'Affordable EMI': fin.loanAffordability(inc, emi),
      })} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

/* ─── Home Loan Affordability ─── */
function HomeLoanAffordabilityForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [inc, setInc] = useState(100000)
  const [emi, setEmi] = useState(0)
  return (
    <div className="space-y-5">
      <Field label="Monthly Income (₹)" val={inc} set={setInc} min={10000} max={5000000} step={10000} prefix="₹" />
      <Field label="Existing EMIs (₹)" val={emi} set={setEmi} min={0} max={500000} step={1000} prefix="₹" />
      <button onClick={() => onResult({
        'Maximum Affordable EMI': fin.loanAffordability(inc, emi),
      })} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

/* ─── Loan Comparison ─── */
function LoanComparisonForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [p, setP] = useState(5000000)
  const [r1, setR1] = useState(9)
  const [t1, setT1] = useState(60)
  const [r2, setR2] = useState(8.5)
  const [t2, setT2] = useState(60)
  const emi1 = fin.emi(p, r1, t1)
  const emi2 = fin.emi(p, r2, t2)
  return (
    <div className="space-y-5">
      <Field label="Loan Amount (₹)" val={p} set={setP} min={10000} max={100000000} step={50000} prefix="₹" />
      <div className="grid grid-cols-2 gap-4">
        <div><Field label="Option 1 Rate (%)" val={r1} set={setR1} min={1} max={20} step={0.25} suffix="%" /></div>
        <div><Field label="Option 2 Rate (%)" val={r2} set={setR2} min={1} max={20} step={0.25} suffix="%" /></div>
        <div><Field label="Option 1 Tenure (mo)" val={t1} set={setT1} min={1} max={360} step={1} suffix="mo" /></div>
        <div><Field label="Option 2 Tenure (mo)" val={t2} set={setT2} min={1} max={360} step={1} suffix="mo" /></div>
      </div>
      <button onClick={() => {
        const tp1 = fin.totalPayment(emi1, t1)
        const tp2 = fin.totalPayment(emi2, t2)
        onResult({
          'Option 1 EMI': emi1,
          'Option 1 Total Payment': tp1,
          'Option 1 Total Interest': fin.totalInterest(tp1, p),
          'Option 2 EMI': emi2,
          'Option 2 Total Payment': tp2,
          'Option 2 Total Interest': fin.totalInterest(tp2, p),
          'Interest Saved': Math.max(0, tp1 - tp2),
        })
      }} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Compare
      </button>
    </div>
  )
}

/* ─── Loan Prepayment ─── */
function LoanPrepaymentForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [p, setP] = useState(3000000)
  const [rt, setRt] = useState(9)
  const [rem, setRem] = useState(48)
  const [pre, setPre] = useState(500000)
  return (
    <div className="space-y-5">
      <Field label="Outstanding Principal (₹)" val={p} set={setP} min={10000} max={100000000} step={50000} prefix="₹" />
      <Field label="Interest Rate (%)" val={rt} set={setRt} min={1} max={20} step={0.25} suffix="%" />
      <Field label="Remaining Months" val={rem} set={setRem} min={1} max={360} step={1} suffix="mo" />
      <Field label="Prepayment Amount (₹)" val={pre} set={setPre} min={5000} max={50000000} step={10000} prefix="₹" />
      <button onClick={() => {
        const s = fin.loanPrepaymentSavings(p, rt, rem, pre)
        onResult({
          'Interest Saved': s.interestSaved,
          'New Tenure': `${s.newTenure} months`,
        })
      }} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

/* ─── Income Tax ─── */
function IncomeTaxForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [inc, setInc] = useState(1500000)
  return (
    <div className="space-y-5">
      <Field label="Annual Income (₹)" val={inc} set={setInc} min={100000} max={100000000} step={50000} prefix="₹" />
      <button onClick={() => onResult({
        'Tax Under Old Regime': fin.incomeTaxOldRegime(inc),
        'Tax Under New Regime': fin.incomeTaxNewRegime(inc),
        'Recommended Regime': fin.incomeTaxNewRegime(inc) < fin.incomeTaxOldRegime(inc) ? 'New Regime' : 'Old Regime',
      })} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

/* ─── Asset Allocation ─── */
function AssetAllocationForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [corpus, setCorpus] = useState(5000000)
  const [alloc, setAlloc] = useState([
    { name: 'Equity', pct: 50 },
    { name: 'Debt', pct: 30 },
    { name: 'Gold', pct: 10 },
    { name: 'Cash', pct: 10 },
  ])
  return (
    <div className="space-y-5">
      <Field label="Total Corpus (₹)" val={corpus} set={setCorpus} min={100000} max={100000000} step={50000} prefix="₹" />
      {alloc.map((a, i) => (
        <div key={a.name}>
          <label className="block text-sm font-medium text-charcoal mb-1.5">{a.name} (%)</label>
          <input type="number" value={a.pct} onChange={(e) => {
            const n = [...alloc]
            n[i] = { ...n[i], pct: Number(e.target.value) }
            setAlloc(n)
          }} min={0} max={100} className="w-full px-4 py-3 rounded-xl border-2 border-slate-lighter bg-white focus:border-gold focus:outline-none transition-colors" />
        </div>
      ))}
      <button onClick={() => {
        const result = fin.assetAllocation(corpus, alloc.map(a => ({ name: a.name, percentage: a.pct })))
        const record: Record<string, string | number> = {}
        result.forEach(r => { record[r.name] = r.amount })
        onResult(record)
      }} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

/* ─── Portfolio Diversification ─── */
function PortfolioDiversificationForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [equityPct, setEquityPct] = useState(50)
  const [debtPct, setDebtPct] = useState(30)
  const [goldPct, setGoldPct] = useState(10)
  const [cashPct, setCashPct] = useState(10)
  return (
    <div className="space-y-5">
      <Field label="Equity (%)" val={equityPct} set={setEquityPct} min={0} max={100} step={5} suffix="%" />
      <Field label="Debt (%)" val={debtPct} set={setDebtPct} min={0} max={100} step={5} suffix="%" />
      <Field label="Gold (%)" val={goldPct} set={setGoldPct} min={0} max={100} step={5} suffix="%" />
      <Field label="Cash (%)" val={cashPct} set={setCashPct} min={0} max={100} step={5} suffix="%" />
      <button onClick={() => {
        const total = equityPct + debtPct + goldPct + cashPct
        const maxPct = Math.max(equityPct, debtPct, goldPct, cashPct)
        const score = maxPct > 70 ? 3 : maxPct > 50 ? 5 : maxPct > 30 ? 7 : 9
        onResult({
          'Total Allocation': `${total}%`,
          'Diversification Score': `${score}/10`,
          'Status': score >= 7 ? 'Well Diversified' : score >= 5 ? 'Moderately Diversified' : 'Concentrated',
          'Recommendation': maxPct > 60 ? 'Consider reducing largest allocation to reduce risk' : 'Good diversification',
        })
      }} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

function ChildEducationForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [currentCost, setCurrentCost] = useState(500000)
  const [yearsToCollege, setYearsToCollege] = useState(15)
  const [inflationRate, setInflationRate] = useState(8)
  return (
    <div className="space-y-4">
      <p className="text-white/60 text-sm leading-relaxed">
        Plan for your child's higher education by estimating future costs and required monthly savings.
      </p>
      <Field label="Current Cost of Education (₹)" val={currentCost} set={setCurrentCost} min={100000} max={5000000} step={50000} prefix="₹" />
      <Field label="Years to College" val={yearsToCollege} set={setYearsToCollege} min={1} max={25} step={1} suffix="yrs" />
      <Field label="Education Inflation Rate (%)" val={inflationRate} set={setInflationRate} min={1} max={20} step={0.5} suffix="%" />
      <button onClick={() => {
        const result = fin.childEducationCost(currentCost, yearsToCollege, inflationRate)
        onResult({
          'Future Cost': result.futureCost,
          'Monthly SIP Needed': result.monthlySIP,
        })
      }} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

function MarriagePlannerForm({ onResult }: { onResult: (r: Record<string, string | number>) => void }) {
  const [currentCost, setCurrentCost] = useState(2500000)
  const [yearsToMarriage, setYearsToMarriage] = useState(10)
  const [inflationRate, setInflationRate] = useState(8)
  return (
    <div className="space-y-4">
      <p className="text-white/60 text-sm leading-relaxed">
        Estimate the future cost of a wedding and the monthly savings needed to reach your goal.
      </p>
      <Field label="Current Cost of Wedding (₹)" val={currentCost} set={setCurrentCost} min={500000} max={50000000} step={100000} prefix="₹" />
      <Field label="Years to Wedding" val={yearsToMarriage} set={setYearsToMarriage} min={1} max={30} step={1} suffix="yrs" />
      <Field label="Wedding Inflation Rate (%)" val={inflationRate} set={setInflationRate} min={1} max={20} step={0.5} suffix="%" />
      <button onClick={() => {
        const result = fin.marriageCost(currentCost, yearsToMarriage, inflationRate)
        onResult({
          'Future Cost': result.futureCost,
          'Monthly SIP Needed': result.monthlySIP,
        })
      }} className="w-full py-3 bg-gold text-navy rounded-xl font-medium hover:bg-gold-dark transition-colors">
        Calculate
      </button>
    </div>
  )
}

/* Field component */
function Field({
  label, val, set, min, max, step, prefix, suffix
}: {
  label: string
  val: number
  set: (v: number) => void
  min: number
  max: number
  step: number
  prefix?: string
  suffix?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-charcoal/70 mb-1.5 tracking-wide">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate text-sm font-medium">{prefix}</span>}
        <input
          type="number"
          value={val}
          onChange={(e) => set(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className={`w-full px-4 py-3 rounded-xl border border-slate-lighter/40 bg-white text-charcoal focus:border-gold/60 focus:ring-1 focus:ring-gold/20 focus:outline-none transition-all text-sm ${prefix ? 'pl-9' : ''} ${suffix ? 'pr-9' : ''}`}
        />
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate text-sm font-medium">{suffix}</span>}
      </div>
    </div>
  )
}
