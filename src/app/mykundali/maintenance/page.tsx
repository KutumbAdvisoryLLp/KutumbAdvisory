'use client'

import { motion } from 'framer-motion'
import { Wrench } from 'lucide-react'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex justify-center mb-6"
        >
          <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center">
            <Wrench size={36} className="text-gold-dark" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h1 className="font-serif text-3xl sm:text-4xl text-navy mb-3">
            We&apos;ll be right back
          </h1>
          <p className="text-slate text-base sm:text-lg leading-relaxed max-w-md mx-auto">
            My Kundali is undergoing scheduled maintenance. We&apos;re making some improvements
            and will be back online shortly.
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-sm text-slate/60"
        >
          Need help in the meantime? Write to us at{' '}
          <a href="mailto:hello@kutumbadvisory.com" className="text-gold-dark underline underline-offset-2">
            hello@kutumbadvisory.com
          </a>
        </motion.p>
      </div>
    </div>
  )
}
