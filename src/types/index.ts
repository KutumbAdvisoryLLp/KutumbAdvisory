export const GRAHA_IDS = [
  'surya', 'chandra', 'mangal', 'budh', 'guru',
  'shukra', 'shani', 'rahu', 'ketu'
] as const

export type GrahaId = typeof GRAHA_IDS[number]

export interface Member {
  name: string
  age: number
  relation: 'self' | 'spouse' | 'child'
  occupation?: string
  income?: number
}

export interface InvestmentEntry {
  type: string
  amount: number
  currentValue?: number
}

export interface InsuranceEntry {
  type: string
  sumInsured: number
  premium: number
  paymentMode: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Annual'
}

export interface FamilyProfile {
  primaryMember: Member
  spouse?: Member
  children: Member[]
  monthlyExpenses: number
  totalAssets: number
  totalLiabilities: number
  riskProfile: 'conservative' | 'moderate' | 'aggressive'
  goals: string[]
  existingInvestments: InvestmentEntry[]
  existingInsurance: InsuranceEntry[]
}

export interface Answer {
  grahaId: GrahaId
  questionId: string
  value: string | number | string[]
  timestamp: number
}

export interface GrahaDetail {
  id: GrahaId
  score: number
  status: 'excellent' | 'good' | 'fair' | 'poor'
  observations: string[]
  suggestions: string[]
  advisorNote: string
  resources: Resource[]
  calculators: Calculator[]
  progress: ProgressItem[]
}

export interface Resource {
  title: string
  url: string
  type: 'article' | 'video' | 'tool'
}

export interface ProgressItem {
  label: string
  value: number
}

export interface Calculator {
  name: string
  description: string
  grahaId: GrahaId
}

export interface ActionItem {
  id: string
  grahaId: GrahaId
  title: string
  description: string
  target?: number
  current?: number
  unit?: string
  status: 'pending' | 'in-progress' | 'completed' | 'not-started'
  priority: 'high' | 'medium' | 'low'
  category: string
}

export interface AssessmentResult {
  overallScore: number
  overallStatus: 'excellent' | 'good' | 'fair' | 'poor'
  grahaScores: Record<GrahaId, number>
  grahaDetails: Record<GrahaId, GrahaDetail>
  recommendations: string[]
  advisorNotes: string
  actionPlan: ActionItem[]
  strongestGraha: GrahaId
  weakestGraha: GrahaId
}

export interface Question {
  id: string
  type: 'radio' | 'slider' | 'multi' | 'input' | 'currency'
  text: string
  options?: string[]
  min?: number
  max?: number
  // Set when `options` is listed worst-to-best instead of the default
  // best-to-worst — scoring treats the last option as healthiest.
  reverseScore?: boolean
}

export interface GrahaConfig {
  id: GrahaId
  name: string
  subtitle: string
  emotion: string
  icon: string
  color: string
  questions: Question[]
}

export type ScoreStatus = 'excellent' | 'good' | 'fair' | 'poor'

export function getScoreStatus(score: number): ScoreStatus {
  if (score >= 8) return 'excellent'
  if (score >= 6) return 'good'
  if (score >= 4) return 'fair'
  return 'poor'
}

export function getScoreColor(status: ScoreStatus): string {
  switch (status) {
    case 'excellent': return '#A8791F'
    case 'good':      return '#2D9B6E'
    case 'fair':      return '#D4A84B'
    case 'poor':      return '#C0392B'
  }
}

export function getScoreStars(score: number): number {
  if (score >= 8) return 5
  if (score >= 6) return 4
  if (score >= 4) return 3
  if (score >= 2) return 2
  return 1
}
