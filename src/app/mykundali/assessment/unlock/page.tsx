'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { createClient } from '@/lib/supabase/client'
import {
  PieChart,
  LayoutGrid,
  Lightbulb,
  AlertTriangle,
  RefreshCw,
  FileText,
  ClipboardList,
  Download,
  TrendingUp,
  Star,
} from 'lucide-react'
import Button from '@/components/Button'
import { FINANCIAL_KUNDALI_PRICE_INR } from '@/lib/payment'
import { useMykundaliAuth } from '@/components/mykundali/AuthContext'

const features = [
  { icon: PieChart, title: 'Complete Financial Kundali', desc: 'Full detailed report' },
  { icon: LayoutGrid, title: '9 Graha Breakdown', desc: 'Each pillar analyzed' },
  { icon: Lightbulb, title: 'Personalized Recommendations', desc: 'Actionable insights' },
  { icon: AlertTriangle, title: 'Financial Doshas', desc: 'Risk identification' },
  { icon: RefreshCw, title: 'Financial Wheel', desc: 'Complete visualization' },
  { icon: FileText, title: 'Advisor Notes', desc: 'Expert guidance' },
  { icon: ClipboardList, title: '90-Day Action Plan', desc: 'Step-by-step roadmap' },
  { icon: Download, title: 'PDF Download', desc: 'Print-ready report' },
  { icon: TrendingUp, title: 'Future Tracking', desc: 'Monitor progress' },
  { icon: Star, title: 'Priority Support', desc: 'Dedicated help' },
]

interface RazorpaySuccessResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

interface RazorpayInstance {
  open: () => void
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  order_id: string
  name: string
  description: string
  prefill: { name?: string; email?: string }
  theme: { color: string }
  handler: (response: RazorpaySuccessResponse) => void
  modal?: { ondismiss?: () => void }
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

export default function UnlockPage() {
  const router = useRouter()
  const { user, userId } = useMykundaliAuth()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  // Auto-redirect if user has already unlocked/paid
  useEffect(() => {
    if (!userId) return
    ;(async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('payments')
        .select('id')
        .eq('customer_id', userId)
        .eq('status', 'paid')
        .maybeSingle()

      if (data) {
        window.location.href = '/mykundali/dashboard'
      }
    })()
  }, [userId])

  const handlePayment = async () => {
    setError('')
    setProcessing(true)

    try {
      const orderRes = await fetch('/api/mykundali/payment/create-order', { method: 'POST' })
      const orderBody = await orderRes.json()
      if (!orderRes.ok) {
        if (orderBody.error?.includes('already unlocked')) {
          window.location.href = '/mykundali/dashboard'
          return
        }
        window.location.href = '/mykundali/payment-failed'
        return
      }

      // next/script's onLoad doesn't reliably re-fire when the script was
      // already loaded by an earlier mount of this page (e.g. after
      // navigating away and back), which left a "gateway is loading" error
      // showing even though window.Razorpay was actually available. Check
      // the real global directly, with a short poll as a fallback for a
      // genuinely slow load.
      if (!window.Razorpay) {
        const found = await new Promise<boolean>((resolve) => {
          const start = Date.now()
          const check = () => {
            if (window.Razorpay) return resolve(true)
            if (Date.now() - start > 4000) return resolve(false)
            setTimeout(check, 150)
          }
          check()
        })
        if (!found) {
          setError('Payment gateway is loading — please try again in a moment.')
          setProcessing(false)
          return
        }
      }

      const razorpay = new window.Razorpay({
        key: orderBody.keyId,
        amount: orderBody.amount,
        currency: 'INR',
        order_id: orderBody.orderId,
        name: 'Kutumb Advisory',
        description: 'Financial Kundali — Full Access',
        prefill: { name: user?.fullName, email: user?.email },
        theme: { color: '#A8791F' },
        handler: async (response) => {
          try {
            const verifyRes = await fetch('/api/mykundali/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            })
            if (!verifyRes.ok) {
              window.location.href = '/mykundali/payment-failed'
              return
            }
            window.location.href = '/mykundali/dashboard'
          } catch {
            window.location.href = '/mykundali/payment-failed'
          }
        },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      })

      razorpay.open()
    } catch {
      window.location.href = '/mykundali/payment-failed'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-12 sm:pb-16">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="text-sm text-slate hover:text-charcoal transition-colors mb-6 sm:mb-8"
        >
          ← Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10"
        >
          <span className="text-4xl sm:text-5xl mb-3 sm:mb-4 block">✦</span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-navy mb-3">
            Unlock Your Complete Financial Kundali
          </h1>
          <p className="text-base sm:text-lg text-slate max-w-lg mx-auto">
            Get the full picture. Every insight. Every recommendation.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 sm:mb-10"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="p-3.5 sm:p-4 bg-white rounded-xl border border-slate-lighter/20 flex items-center gap-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-light/15 text-gold-dark">
                <f.icon size={17} strokeWidth={1.75} />
              </span>
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
          className="p-6 sm:p-8 bg-navy rounded-3xl text-center shadow-modal"
        >
          <p className="text-gold-light/60 text-xs sm:text-sm uppercase tracking-widest mb-2">
            One-time payment
          </p>
          <p className="font-serif text-4xl sm:text-5xl md:text-6xl text-gold mb-2">
            ₹{FINANCIAL_KUNDALI_PRICE_INR}
          </p>
          <p className="text-white/50 text-xs sm:text-sm mb-6 sm:mb-8">Lifetime access · No recurring fees</p>

          <Button showArrow={false} variant="gold" size="lg" loading={processing} onClick={handlePayment} className="w-full">
            {processing ? 'Processing...' : 'Unlock My Financial Kundali →'}
          </Button>

          {error && (
            <p className="mt-4 text-sm text-red-400">{error}</p>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40">
            <span>✦ 100% Secure Payment</span>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 sm:gap-3 text-xs text-white/30 flex-wrap">
            <span>Razorpay</span>
            <span>·</span>
            <span>UPI</span>
            <span>·</span>
            <span>Cards</span>
            <span>·</span>
            <span>Net Banking</span>
          </div>
        </motion.div>


      </div>
    </div>
  )
}
