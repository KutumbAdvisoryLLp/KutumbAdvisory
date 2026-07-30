'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
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
  const { user } = useMykundaliAuth()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [scriptLoaded, setScriptLoaded] = useState(false)

  const handlePayment = async () => {
    setError('')
    setProcessing(true)

    try {
      const orderRes = await fetch('/api/mykundali/payment/create-order', { method: 'POST' })
      const orderBody = await orderRes.json()
      if (!orderRes.ok) {
        setError(orderBody.error ?? 'Could not start payment')
        setProcessing(false)
        return
      }

      if (!scriptLoaded || !window.Razorpay) {
        setError('Payment is still loading — please try again in a moment.')
        setProcessing(false)
        return
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
          const verifyRes = await fetch('/api/mykundali/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          })
          if (!verifyRes.ok) {
            const verifyBody = await verifyRes.json()
            setError(verifyBody.error ?? 'Payment verification failed')
            setProcessing(false)
            return
          }
          router.push('/mykundali/dashboard')
        },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      })

      razorpay.open()
    } catch {
      setError('Something went wrong starting payment. Please try again.')
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
      />
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

          {error && (
            <p className="mt-4 text-sm text-red-400">{error}</p>
          )}

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
