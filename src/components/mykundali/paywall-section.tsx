'use client'

import { motion } from 'framer-motion'
import Button from '@/components/Button'
import { useRouter } from 'next/navigation'

const features = [
  'Complete Financial Kundali Report',
  '9 Graha Scores with Detailed Breakdown',
  'Personalized Recommendations',
  'Financial Dosha Identification',
  'Financial Wheel Visualization',
  'Advisor Notes for Each Graha',
  '90-Day Action Plan',
  'PDF Download – Print-Ready Report',
  'Future Progress Tracking',
  'Priority Support',
]

export function PaywallSection() {
  const router = useRouter()

  return (
    <section className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-lighter/30 bg-white/95 backdrop-blur-xl">
      <div className="max-w-3xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            <p className="font-serif text-xl text-navy">
              ✦ Unlock Your Complete Financial Kundali
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-serif text-2xl text-gold-dark font-semibold">₹999</span>
              <span className="text-xs text-slate-light">One-time · Lifetime access</span>
            </div>
          </div>
          <Button showArrow={false}
            variant="gold"
            size="lg"
            onClick={() => router.push('/mykundali/assessment/unlock')}
            className="flex-shrink-0"
          >
            Unlock Now →
          </Button>
        </div>
      </div>
    </section>
  )
}
