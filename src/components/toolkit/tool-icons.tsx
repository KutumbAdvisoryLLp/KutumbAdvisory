'use client'

export interface ToolIconProps {
  id: string
  className?: string
}

export function ToolIcon({ id, className = 'w-8 h-8' }: ToolIconProps) {
  const IconComponent = iconMap[id] || iconMap['sip']
  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 48 48" fill="none" className={className}>
        <IconComponent />
      </svg>
    </div>
  )
}

function GrowthIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <path d="M14 30L22 20L28 24L36 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold" />
      <path d="M30 16H36V22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-gold/70" />
    </>
  )
}

function CoinIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="1.2" className="text-gold" />
      <path d="M24 20V28M20 24H28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gold" />
    </>
  )
}

function FutureIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <path d="M16 24C16 19.6 19.6 16 24 16C28.4 16 32 19.6 32 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gold" />
      <path d="M24 20V24L27 27" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gold" />
      <path d="M28 28L32 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gold/40" />
    </>
  )
}

function TargetIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <circle cx="24" cy="24" r="11" stroke="currentColor" strokeWidth="1.5" className="text-gold" />
      <circle cx="24" cy="24" r="4" fill="currentColor" className="text-gold" />
    </>
  )
}

function InflationIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <path d="M14 30L20 22L26 26L34 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gold" />
      <path d="M20 26V22H24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold/60" />
      <path d="M28 20H34V26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold/60" />
    </>
  )
}

function ShieldIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <path d="M16 18L24 14L32 18V26C32 30 24 34 24 34C24 34 16 30 16 26V18Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="text-gold" />
      <path d="M21 24L23 26L27 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gold" />
    </>
  )
}

function PersonIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <circle cx="24" cy="18" r="5" stroke="currentColor" strokeWidth="1.5" className="text-gold" />
      <path d="M14 36C14 30 18 27 24 27C30 27 34 30 34 36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold" />
    </>
  )
}

function UmbrellaIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <path d="M12 24C12 17 17 12 24 12C31 12 36 17 36 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gold" />
      <path d="M24 24V34M24 34C22 34 20 32 20 30M24 34C26 34 28 32 28 30" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-gold" />
    </>
  )
}

function HeartIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <path d="M24 34C24 34 14 27 14 21C14 18 16 16 19 16C21 16 23 17.5 24 19C25 17.5 27 16 29 16C32 16 34 18 34 21C34 27 24 34 24 34Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="text-gold" />
    </>
  )
}

function BankIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <path d="M14 28L24 18L34 28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gold" />
      <path d="M16 28V32H32V28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold" />
      <path d="M20 28V24H28V28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold/60" />
    </>
  )
}

function HouseIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <path d="M16 26L24 18L32 26V34H16V26Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="text-gold" />
      <path d="M22 34V28H26V34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold" />
    </>
  )
}

function HouseRupeeIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <path d="M16 26L24 18L32 26V34H16V26Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="text-gold" />
      <circle cx="24" cy="30" r="2" fill="currentColor" className="text-gold" />
    </>
  )
}

function BalanceIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <path d="M12 32H36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gold" />
      <path d="M24 28V34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-gold" />
      <path d="M16 20C16 16 19 14 24 14C29 14 32 16 32 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gold" />
      <path d="M20 22L24 18L28 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold/60" />
    </>
  )
}

function ArrowDownIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <path d="M16 20L24 28L32 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gold" />
      <path d="M24 14V26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gold/60" />
    </>
  )
}

function SunIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <circle cx="24" cy="24" r="5" stroke="currentColor" strokeWidth="1.5" className="text-gold" />
      <path d="M24 14V16M24 32V34M16 24H14M34 24H32M18.4 18.4L17 17M31 31L29.6 29.6M29.6 18.4L31 17M17 31L18.4 29.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gold/60" />
    </>
  )
}

function GapIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <path d="M14 30L20 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-gold/40" />
      <path d="M34 30L28 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-gold/40" />
      <path d="M20 18L28 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-gold/60" />
      <path d="M18 24L30 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-gold" />
    </>
  )
}

function WithdrawIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <path d="M16 18H32L30 26H18L16 18Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="text-gold" />
      <path d="M20 26V30H28V26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold" />
      <path d="M14 32H34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gold/60" />
    </>
  )
}

function ScaleIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <path d="M14 30L24 18L34 30" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gold" />
      <path d="M24 18V34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gold/60" />
      <path d="M18 30H30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gold/60" />
    </>
  )
}

function GraduationIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <path d="M24 14L12 20L24 26L36 20L24 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="text-gold" />
      <path d="M14 22V28C14 28 18 32 24 32C30 32 34 28 34 28V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold" />
    </>
  )
}

function RingIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <circle cx="24" cy="24" r="5" stroke="currentColor" strokeWidth="1.8" className="text-gold" />
      <path d="M16 32C16 28 19 26 24 26C29 26 32 28 32 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gold/60" />
      <path d="M20 20L24 16L28 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold/60" />
    </>
  )
}

function DocumentIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <path d="M18 14H26L32 20V34H18V14Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="text-gold" />
      <path d="M26 14V20H32" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="text-gold/60" />
      <path d="M20 24H28M20 28H28M20 32H25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gold" />
    </>
  )
}

function PieIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <circle cx="24" cy="24" r="9" stroke="currentColor" strokeWidth="1.5" className="text-gold" />
      <path d="M24 15V24L31 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gold" />
      <path d="M19 27L24 24L29 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold/60" />
    </>
  )
}

function GridIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <rect x="16" y="16" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" className="text-gold" />
      <rect x="26" y="16" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" className="text-gold" />
      <rect x="16" y="26" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" className="text-gold" />
      <rect x="26" y="26" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" className="text-gold/40" />
    </>
  )
}

function CheckIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <path d="M16 24L22 30L32 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold" />
    </>
  )
}

function SearchIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <circle cx="22" cy="22" r="6" stroke="currentColor" strokeWidth="1.5" className="text-gold" />
      <path d="M26 26L32 32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-gold" />
    </>
  )
}

function BriefcaseIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <rect x="14" y="20" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" className="text-gold" />
      <path d="M18 20V18C18 16 20 14 24 14C28 14 30 16 30 18V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold" />
    </>
  )
}

function FamilyIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" className="text-gold" />
      <circle cx="30" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" className="text-gold" />
      <path d="M12 34C12 28 15 25 18 25C21 25 24 28 24 34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold" />
      <path d="M24 34C24 28 27 25 30 25C33 25 36 28 36 34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold" />
    </>
  )
}

function LockIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <rect x="18" y="22" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" className="text-gold" />
      <path d="M20 22V18C20 15 22 14 24 14C26 14 28 15 28 18V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold" />
      <circle cx="24" cy="27" r="1.5" fill="currentColor" className="text-gold" />
    </>
  )
}

function CreditCardIcon() {
  return (
    <>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" className="text-gold/20" />
      <rect x="12" y="20" width="24" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" className="text-gold" />
      <path d="M12 24H36" stroke="currentColor" strokeWidth="1.5" className="text-gold/60" />
      <path d="M16 28H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gold" />
    </>
  )
}

const iconMap: Record<string, React.ComponentType> = {
  'sip': GrowthIcon,
  'lumpsum': CoinIcon,
  'future-value': FutureIcon,
  'goal-planner': TargetIcon,
  'inflation': InflationIcon,
  'emergency-fund': ShieldIcon,
  'hlv': PersonIcon,
  'life-insurance': UmbrellaIcon,
  'health-insurance': HeartIcon,
  'emi': BankIcon,
  'home-loan-eligibility': HouseIcon,
  'home-loan-affordability': HouseRupeeIcon,
  'loan-comparison': BalanceIcon,
  'loan-prepayment': ArrowDownIcon,
  'retirement-corpus': SunIcon,
  'retirement-gap': GapIcon,
  'swp': WithdrawIcon,
  'net-worth': ScaleIcon,
  'child-education': GraduationIcon,
  'marriage-planner': RingIcon,
  'income-tax': DocumentIcon,
  'asset-allocation': PieIcon,
  'portfolio-diversification': GridIcon,
  /* Checklist icons */
  'estate-planning': DocumentIcon,
  'financial-documents': DocumentIcon,
  'insurance-review': SearchIcon,
  'annual-financial-health': CheckIcon,
  'retirement-readiness': SunIcon,
  'investment-portfolio': BriefcaseIcon,
  'family-financial-records': FamilyIcon,
  /* Assessment icons */
  'emergency-fund-readiness': ShieldIcon,
  'insurance-adequacy': LockIcon,
  'investment-risk': GridIcon,
  'debt-health': CreditCardIcon,
  'goal-readiness': TargetIcon,
  'legacy-planning': ScaleIcon,
  'budget-health': DocumentIcon,
}
