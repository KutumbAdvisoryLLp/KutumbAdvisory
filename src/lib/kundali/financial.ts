export function roundTo(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

export function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCompact(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`
  return `₹${value}`
}

export function futureValue(principal: number, rate: number, periods: number): number {
  return principal * Math.pow(1 + rate, periods)
}

export function compoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  compoundingPerYear: number = 12
): number {
  const n = compoundingPerYear * years
  const r = annualRate / 100 / compoundingPerYear
  return principal * Math.pow(1 + r, n)
}

export function sipFutureValue(
  monthlyInvestment: number,
  annualReturn: number,
  years: number,
  stepUpPercent: number = 0
): number {
  const monthlyRate = annualReturn / 100 / 12

  if (stepUpPercent === 0) {
    const months = years * 12
    if (monthlyRate === 0) return monthlyInvestment * months
    return monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
  }

  // Step-up SIP: the monthly contribution rises by stepUpPercent every 12
  // months, so there's no closed form — simulate month by month instead.
  // Annuity-due: each month's contribution is invested first, then grows
  // for that same month (matches the plain-SIP closed form above when
  // stepUpPercent is 0).
  let balance = 0
  let currentMonthly = monthlyInvestment
  for (let year = 0; year < years; year++) {
    for (let m = 0; m < 12; m++) {
      balance = (balance + currentMonthly) * (1 + monthlyRate)
    }
    currentMonthly *= 1 + stepUpPercent / 100
  }
  return balance
}

export function sipTotalInvestment(
  monthlyInvestment: number,
  years: number,
  stepUpPercent: number = 0
): number {
  if (stepUpPercent === 0) return monthlyInvestment * years * 12

  let total = 0
  let currentMonthly = monthlyInvestment
  for (let year = 0; year < years; year++) {
    total += currentMonthly * 12
    currentMonthly *= 1 + stepUpPercent / 100
  }
  return total
}

export function lumpsumFutureValue(
  investment: number,
  annualReturn: number,
  years: number
): number {
  return compoundInterest(investment, annualReturn, years, 1)
}

export function emi(
  principal: number,
  annualRate: number,
  months: number
): number {
  const r = annualRate / 100 / 12
  if (r === 0) return principal / months
  return principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1)
}

export function totalPayment(emiAmount: number, months: number): number {
  return emiAmount * months
}

export function totalInterest(totalPaid: number, principal: number): number {
  return totalPaid - principal
}

export function retirementCorpus(
  currentAge: number,
  retirementAge: number,
  monthlyExpenses: number,
  inflationRate: number,
  returnAfterRetirement: number,
  lifeExpectancy: number
): number {
  const yearsToRetirement = retirementAge - currentAge
  const expenseAtRetire = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement)
  const monthlyExpenseAtRetire = expenseAtRetire
  const monthlyReturnAfterRetire = returnAfterRetirement / 100 / 12
  const retirementMonths = (lifeExpectancy - retirementAge) * 12
  if (monthlyReturnAfterRetire === 0) return monthlyExpenseAtRetire * retirementMonths
  return monthlyExpenseAtRetire * ((1 - Math.pow(1 + monthlyReturnAfterRetire, -retirementMonths)) / monthlyReturnAfterRetire)
}

export function inflationAdjustedValue(currentValue: number, inflationRate: number, years: number): number {
  return currentValue * Math.pow(1 + inflationRate / 100, years)
}

export function swpWithdrawal(
  corpus: number,
  monthlyWithdrawal: number,
  annualReturn: number
): { monthsLast: number; totalWithdrawn: number; remaining: number } {
  const monthlyRate = annualReturn / 100 / 12
  let balance = corpus
  let months = 0
  let total = 0
  while (balance > 0 && months < 600) {
    balance = balance * (1 + monthlyRate) - monthlyWithdrawal
    total += monthlyWithdrawal
    months++
    if (balance <= 0) break
  }
  return { monthsLast: months, totalWithdrawn: total, remaining: Math.max(0, balance) }
}

export function emergencyFundMonths(monthlyExpenses: number, savings: number): number {
  return savings / monthlyExpenses
}

export function emergencyFundTarget(monthlyExpenses: number, months: number = 6): number {
  return monthlyExpenses * months
}

export function netWorth(assets: number, liabilities: number): number {
  return assets - liabilities
}

export function humanLifeValue(
  annualIncome: number,
  workingYears: number,
  growthRate: number
): number {
  let total = 0
  for (let i = 0; i < workingYears; i++) {
    total += annualIncome * Math.pow(1 + growthRate / 100, i)
  }
  return total
}

export function lifeInsuranceNeeded(
  annualIncome: number,
  outstandingDebt: number,
  childrenEducationCost: number,
  yearsOfCover: number = 10
): number {
  return annualIncome * yearsOfCover + outstandingDebt + childrenEducationCost
}

export function homeLoanEligibility(
  monthlyIncome: number,
  existingEMIs: number,
  interestRate: number,
  tenureYears: number,
  nri: boolean = false
): number {
  const maxEmiRatio = nri ? 0.5 : 0.4
  const availableForEMI = monthlyIncome * maxEmiRatio - existingEMIs
  if (availableForEMI <= 0) return 0
  const r = interestRate / 100 / 12
  const months = tenureYears * 12
  const loanAmount = availableForEMI * (Math.pow(1 + r, months) - 1) / (r * Math.pow(1 + r, months))
  return loanAmount
}

export function loanAffordability(
  monthlyIncome: number,
  existingEMIs: number,
  maxEmiRatio: number = 0.4
): number {
  return monthlyIncome * maxEmiRatio - existingEMIs
}

export function loanPrepaymentSavings(
  outstandingPrincipal: number,
  annualRate: number,
  remainingMonths: number,
  prepaymentAmount: number,
  strategy: 'reduceTenure' | 'reduceEMI' = 'reduceTenure'
): { newTenure: number; newEMI: number; interestSaved: number } {
  const r = annualRate / 100 / 12
  const originalEMI = emi(outstandingPrincipal, annualRate, remainingMonths)
  const totalOriginal = originalEMI * remainingMonths
  const newPrincipal = outstandingPrincipal - prepaymentAmount

  if (newPrincipal <= 0) {
    return { newTenure: 0, newEMI: 0, interestSaved: totalOriginal - prepaymentAmount }
  }

  if (strategy === 'reduceTenure') {
    // Keep the EMI the same, solve for the new (shorter) tenure:
    // n = -ln(1 - r·P/EMI) / ln(1+r), the inverse of the EMI formula.
    const newTenure = r === 0
      ? newPrincipal / originalEMI
      : -Math.log(1 - (r * newPrincipal) / originalEMI) / Math.log(1 + r)
    const newTotal = originalEMI * newTenure
    return {
      newTenure: Math.max(0, Math.round(newTenure)),
      newEMI: originalEMI,
      interestSaved: totalOriginal - newTotal - prepaymentAmount,
    }
  }

  // reduceEMI: keep the original tenure, lower the monthly payment instead.
  const newEMI = emi(newPrincipal, annualRate, remainingMonths)
  const newTotal = newEMI * remainingMonths
  return {
    newTenure: remainingMonths,
    newEMI,
    interestSaved: totalOriginal - newTotal - prepaymentAmount,
  }
}

// Section 87A "marginal relief": just above the rebate threshold, tax
// payable is capped at (income − threshold) so a ₹1 raise can never cost
// more than ₹1 in extra tax — without this the rebate creates a cliff
// where crossing the threshold suddenly owes the full slab tax.
function applyRebateAndCess(tax: number, taxableIncome: number, threshold: number): number {
  if (taxableIncome <= threshold) return 0
  const relieved = Math.min(tax, taxableIncome - threshold)
  return relieved * 1.04
}

// Old regime slabs (FY 2024-25) + Section 87A rebate (nil tax up to ₹5L
// taxable income — the old regime's rebate has no marginal-relief taper,
// unlike the new regime's) + 4% cess.
export function incomeTaxOldRegime(taxableIncome: number): number {
  if (taxableIncome <= 500000) return 0
  let tax = 0
  if (taxableIncome > 1000000) {
    tax = 112500 + (taxableIncome - 1000000) * 0.3
  } else if (taxableIncome > 500000) {
    tax = 12500 + (taxableIncome - 500000) * 0.2
  } else if (taxableIncome > 250000) {
    tax = (taxableIncome - 250000) * 0.05
  }
  return tax * 1.04
}

// New regime slabs (FY 2024-25, post Budget 2024) + Section 87A rebate (nil
// tax up to ₹7L taxable income, with marginal relief just above) + 4% cess.
export function incomeTaxNewRegime(taxableIncome: number): number {
  let tax = 0
  if (taxableIncome > 1500000) {
    tax = 140000 + (taxableIncome - 1500000) * 0.3
  } else if (taxableIncome > 1200000) {
    tax = 80000 + (taxableIncome - 1200000) * 0.2
  } else if (taxableIncome > 1000000) {
    tax = 50000 + (taxableIncome - 1000000) * 0.15
  } else if (taxableIncome > 700000) {
    tax = 20000 + (taxableIncome - 700000) * 0.1
  } else if (taxableIncome > 300000) {
    tax = (taxableIncome - 300000) * 0.05
  }
  return applyRebateAndCess(tax, taxableIncome, 700000)
}

export function assetAllocation(
  totalCorpus: number,
  allocations: { name: string; percentage: number }[]
): { name: string; percentage: number; amount: number }[] {
  return allocations.map(a => ({
    ...a,
    amount: (a.percentage / 100) * totalCorpus,
  }))
}

export function goalPlanning(
  targetAmount: number,
  yearsToGoal: number,
  expectedReturn: number,
  stepUpPercent: number = 0
): { monthlyInvestment: number; lumpsumNeeded: number } {
  // Solve for the base monthly SIP by dividing the target by the future
  // value a ₹1/month step-up SIP would produce over the same period —
  // sipFutureValue is linear in the contribution amount, so this scales
  // correctly whether or not a step-up is in play.
  const unitFutureValue = sipFutureValue(1, expectedReturn, yearsToGoal, stepUpPercent)
  const monthlySIP = targetAmount / unitFutureValue
  const lumpsumNeeded = targetAmount / Math.pow(1 + expectedReturn / 100, yearsToGoal)
  return { monthlyInvestment: monthlySIP, lumpsumNeeded }
}

export function retirementGap(
  currentCorpus: number,
  monthlySIP: number,
  annualReturn: number,
  currentAge: number,
  retirementAge: number,
  monthlyExpenses: number,
  inflationRate: number,
  lifeExpectancy: number,
  returnAfterRetirement: number = annualReturn
): { gap: number; corpusAtRetire: number; needed: number } {
  const corpusAtRetire = sipFutureValue(monthlySIP, annualReturn, retirementAge - currentAge) +
    lumpsumFutureValue(currentCorpus, annualReturn, retirementAge - currentAge)
  const needed = retirementCorpus(currentAge, retirementAge, monthlyExpenses, inflationRate, returnAfterRetirement, lifeExpectancy)
  return { gap: needed - corpusAtRetire, corpusAtRetire, needed }
}

export function dtiRatio(totalDebt: number, annualIncome: number): number {
  return (totalDebt / annualIncome) * 100
}

export function emergencyFundScore(monthsOfExpenses: number): { score: number; status: string } {
  if (monthsOfExpenses >= 12) return { score: 10, status: 'excellent' }
  if (monthsOfExpenses >= 6) return { score: 8, status: 'good' }
  if (monthsOfExpenses >= 3) return { score: 5, status: 'fair' }
  return { score: 2, status: 'poor' }
}

export function insuranceAdequacyScore(
  hasLife: boolean,
  hasHealth: boolean,
  hasCritical: boolean,
  lifeAdequate: boolean
): { score: number; status: string } {
  let score = 0
  if (hasLife) score += 3
  if (lifeAdequate) score += 2
  if (hasHealth) score += 3
  if (hasCritical) score += 2
  return {
    score,
    status: score >= 8 ? 'excellent' : score >= 6 ? 'good' : score >= 4 ? 'fair' : 'poor',
  }
}

export function retirementReadinessScore(
  hasCorpus: boolean,
  hasPension: boolean,
  hasPlan: boolean,
  ageGroup: string,
  savingRate: number
): { score: number; status: string } {
  let score = 0
  if (hasCorpus) score += 3
  if (hasPension) score += 2
  if (hasPlan) score += 2
  if (ageGroup === 'under30' || ageGroup === '30to40') score += 2
  else if (ageGroup === '40to50') score += 1
  if (savingRate >= 20) score += 1
  return {
    score,
    status: score >= 8 ? 'excellent' : score >= 6 ? 'good' : score >= 4 ? 'fair' : 'poor',
  }
}

export function riskScore(
  equityExposure: string,
  investmentHorizon: string,
  debtLevel: string,
  emergencyFundMonthsVal: number
): { score: number; status: string; label: string } {
  let s = 5
  if (equityExposure === 'high') s += 2
  else if (equityExposure === 'moderate') s += 1
  else if (equityExposure === 'low') s -= 1
  if (investmentHorizon === 'long') s += 2
  else if (investmentHorizon === 'medium') s += 1
  else if (investmentHorizon === 'short') s -= 1
  if (debtLevel === 'low') s += 2
  else if (debtLevel === 'moderate') s += 0
  else if (debtLevel === 'high') s -= 2
  if (emergencyFundMonthsVal >= 6) s += 1
  else if (emergencyFundMonthsVal < 3) s -= 1
  const clamped = Math.max(1, Math.min(10, s))
  const label = clamped >= 8 ? 'Aggressive' : clamped >= 5 ? 'Moderate' : 'Conservative'
  return {
    score: clamped,
    status: clamped >= 8 ? 'excellent' : clamped >= 5 ? 'good' : 'fair',
    label,
  }
}

export function debtHealthScore(
  dti: number,
  hasEMIBurden: boolean,
  paysFull: boolean
): { score: number; status: string } {
  let score = 5
  if (dti < 20) score += 3
  else if (dti < 35) score += 1
  else if (dti > 50) score -= 2
  if (!hasEMIBurden) score += 2
  if (paysFull) score += 1
  const clamped = Math.max(1, Math.min(10, score))
  return {
    score: clamped,
    status: clamped >= 8 ? 'excellent' : clamped >= 5 ? 'good' : 'fair',
  }
}

export function goalReadinessScore(
  hasSpecificGoals: boolean,
  hasPlan: boolean,
  hasTimeline: boolean,
  hasBudget: boolean
): { score: number; status: string } {
  let score = 0
  if (hasSpecificGoals) score += 3
  if (hasPlan) score += 3
  if (hasTimeline) score += 2
  if (hasBudget) score += 2
  return {
    score,
    status: score >= 8 ? 'excellent' : score >= 6 ? 'good' : score >= 4 ? 'fair' : 'poor',
  }
}

export function legacyReadinessScore(
  hasWill: boolean,
  hasNominee: boolean,
  hasTrust: boolean,
  hasDiscussed: boolean
): { score: number; status: string } {
  let score = 0
  if (hasWill) score += 3
  if (hasNominee) score += 2
  if (hasTrust) score += 3
  if (hasDiscussed) score += 2
  return {
    score,
    status: score >= 8 ? 'excellent' : score >= 6 ? 'good' : score >= 4 ? 'fair' : 'poor',
  }
}

export function childEducationCost(
  currentCost: number,
  yearsToCollege: number,
  inflationRate: number,
  expectedReturn: number = 10
): { futureCost: number; monthlySIP: number } {
  const futureCost = currentCost * Math.pow(1 + inflationRate / 100, yearsToCollege)
  return {
    futureCost,
    monthlySIP: futureCost / sipFutureValue(1, expectedReturn, yearsToCollege),
  }
}

export function marriageCost(
  currentCost: number,
  yearsToMarriage: number,
  inflationRate: number,
  expectedReturn: number = 10
): { futureCost: number; monthlySIP: number } {
  const futureCost = currentCost * Math.pow(1 + inflationRate / 100, yearsToMarriage)
  return {
    futureCost,
    monthlySIP: futureCost / sipFutureValue(1, expectedReturn, yearsToMarriage),
  }
}

export function budgetHealthScore(
  savingsRate: number,
  tracksExpenses: boolean,
  hasBudget: boolean,
  creditBehavior: string
): { score: number; status: string } {
  let score = 3
  if (savingsRate >= 30) score += 3
  else if (savingsRate >= 20) score += 2
  else if (savingsRate >= 10) score += 1
  if (tracksExpenses) score += 2
  if (hasBudget) score += 2
  if (creditBehavior === 'full') score += 1
  else if (creditBehavior === 'minimum') score -= 1
  const clamped = Math.max(1, Math.min(10, score))
  return {
    score: clamped,
    status: clamped >= 8 ? 'excellent' : clamped >= 5 ? 'good' : 'fair',
  }
}
