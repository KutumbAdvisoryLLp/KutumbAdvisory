'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { AlertCircle, Mail, ArrowLeft, RotateCcw } from 'lucide-react'
import Button from '@/components/Button'

export default function PaymentFailedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex justify-center mb-6"
        >
          <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle size={40} className="text-red-400" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h1 className="font-serif text-3xl sm:text-4xl text-navy mb-3">
            Oops! Something went wrong
          </h1>
          <p className="text-slate text-base sm:text-lg leading-relaxed max-w-md mx-auto">
            Looks like there was a hiccup with your payment. No worries — we&apos;re here to sort this out for you.
          </p>
        </motion.div>

        {/* Help Box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 sm:p-8 bg-navy rounded-3xl text-left"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
              <Mail size={16} className="text-gold" />
            </div>
            <p className="font-medium text-white text-sm sm:text-base">
              Mail us and we&apos;ll resolve it fast
            </p>
          </div>

          <p className="text-white/60 text-sm leading-relaxed mb-5">
            Please send us an email at{' '}
            <a
              href="mailto:hello@kutumbadvisory.com"
              className="text-gold underline underline-offset-2 hover:text-gold-light transition-colors"
            >
              hello@kutumbadvisory.com
            </a>{' '}
            with the following details:
          </p>

          <ul className="space-y-2.5 text-sm text-white/70 mb-6">
            <li className="flex items-start gap-2.5">
              <span className="text-gold mt-0.5">✦</span>
              <span>A screenshot of the payment page or error message</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-gold mt-0.5">✦</span>
              <span>Your registered email address</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-gold mt-0.5">✦</span>
              <span>Your full name</span>
            </li>
          </ul>

          <a
            href="mailto:hello@kutumbadvisory.com?subject=Payment Issue - Financial Kundali&body=Hi Kutumb Team,%0A%0AI encountered an issue during payment for the Financial Kundali.%0A%0AName: %0ARegistered Email: %0A%0APlease find the payment screenshot attached.%0A%0AThank you."
            className="block w-full py-3.5 bg-gold text-navy text-sm font-semibold rounded-xl text-center hover:bg-gold-light transition-colors"
          >
            ✉ Mail Us Now
          </a>
        </motion.div>

        {/* Response Promise */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 text-xs text-slate/60"
        >
          We typically respond within 24 hours and will resolve your access promptly.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <button
            onClick={() => router.push('/mykundali/assessment/unlock')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-lighter/30 text-slate text-sm hover:bg-cream/30 transition-colors"
          >
            <RotateCcw size={14} />
            Try Payment Again
          </button>
          <button
            onClick={() => router.push('/mykundali/assessment/preview')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-lighter/30 text-slate text-sm hover:bg-cream/30 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Preview
          </button>
        </motion.div>
      </div>
    </div>
  )
}
