export function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatNumber(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr+`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L+`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K+`;
  return num.toString();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
  return `₹${amount}`
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function calculateProgress(completed: number, total: number): number {
  return Math.round((completed / total) * 100)
}

export function calculateScore(answers: Record<string, string | number>): number {
  const vals = Object.values(answers)
  let total = 0
  for (const val of vals) {
    if (typeof val === 'string') {
      if (val === 'Very stable' || val === 'Very confident' || val === 'Excellent' || val === 'Always' || val === 'Never' || val === 'Yes') total += 10
      else if (val === 'Moderately stable' || val === 'Confident' || val === 'Good' || val === 'Most months' || val === 'Rarely' || val === 'Mostly') total += 8
      else if (val === 'Somewhat' || val === 'Neutral' || val === 'Fair' || val === 'Sometimes') total += 6
      else if (val === 'Variable' || val === 'Concerned' || val === 'Poor' || val === 'Rarely') total += 4
      else total += 2
    } else {
      total += val
    }
  }
  const maxPossible = vals.length * 10
  return Math.round((total / maxPossible) * 10)
}