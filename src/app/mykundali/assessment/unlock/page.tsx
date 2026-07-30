'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'

const features = [
  { icon: '📊', title: 'Complete Financial Kundali', desc: 'Full detailed report' },
  { icon: '☀', title: '9 Graha Breakdown', desc: 'Each pillar analyzed' },
  { icon: '💡', title: 'Personalized Recommendations', desc: 'Actionable insights' },
  { icon: '⚠', title: 'Financial Doshas', desc: 'Risk identification' },
  { icon: '🔄', title: 'Financial Wheel', desc: 'Complete visualization' },
  { icon: '📝', title: 'Advisor Notes', desc: 'Expert guidance' },
  { icon: '📋', title: '90-Day Action Plan', desc: 'Step-by-step roadmap' },
  { icon: '📥', title: 'PDF Download', desc: 'Print-ready report' },
  { icon: '📈', title: 'Future Tracking', desc: 'Monitor progress' },
  { icon: '⭐', title: 'Priority Support', desc: 'Dedicated help' },
]

export default function UnlockPage() {
  const router = useRouter()
  const [processing, setProcessing] = useState(false)

  const handlePayment = () => {
    setProcessing(true)
    // Simulate payment
    setTimeout(() => {
      setProcessing(false)
      router.push('/mykundali/dashboard')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-16">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="text-sm text-slate hover:text-charcoal transition-colors mb-8"
        >
          ← Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="text-5xl mb-4 block">✦</span>
          <h1 className="font-serif text-4xl md:text-5xl text-navy mb-3">
            Unlock Your Complete Financial Kundali
          </h1>
          <p className="text-lg text-slate max-w-lg mx-auto">
            Get the full picture. Every insight. Every recommendation.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-10"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="p-4 bg-white rounded-xl border border-slate-lighter/20 flex items-center gap-3"
            >
              <span className="text-xl">{f.icon}</span>
              <div>
                <p className="text-sm font-medium text-charcoal">{f.title}</p>
                <p className="text-xs text-slate-light">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="p-8 bg-navy rounded-3xl text-center shadow-modal"
        >
          <p className="text-gold-light/60 text-sm uppercase tracking-widest mb-2">
            One-time payment
          </p>
          <p className="font-serif text-5xl md:text-6xl text-gold mb-2">
            ₹999
          </p>
          <p className="text-white/50 text-sm mb-8">Lifetime access · No recurring fees</p>

          <Button showArrow={false} variant="gold" size="lg" loading={processing} onClick={handlePayment} className="w-full">
            {processing ? 'Processing...' : 'Unlock My Financial Kundali →'}
          </Button>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-white/40">
            <span>✦ 7-Day Money-Back Guarantee</span>
            <span>✦ 100% Secure Payment</span>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-white/30">
            <span>Razorpay</span>
            <span>·</span>
            <span>UPI</span>
            <span>·</span>
            <span>Cards</span>
            <span>·</span>
            <span>Net Banking</span>
          </div>
        </motion.div>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 p-5 bg-white rounded-2xl border border-slate-lighter/20 text-center"
        >
          <p className="text-sm text-slate">
            Not satisfied? We&apos;ll refund every rupee within 7 days.
            <br />
            No questions asked. Your Financial Kundali is our commitment.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
