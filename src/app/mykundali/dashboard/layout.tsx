'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Sun,
  ListChecks,
  BookOpen,
  FileText,
  RefreshCw,
  LogOut,
  Home,
  Menu,
  X,
  PhoneCall,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { useMykundaliAuth } from '@/components/mykundali/AuthContext'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

const KUTUMB_LOGO_URL =
  'https://res.cloudinary.com/dtzqrfg6q/image/upload/v1780312133/tree_qw9bji.png'

const navItems = [
  { href: '/mykundali/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/mykundali/dashboard/grahas', label: 'Grahas', icon: Sun },
  { href: '/mykundali/dashboard/action-plan', label: 'Action Plan', icon: ListChecks },
  { href: '/mykundali/dashboard/resources', label: 'Resources', icon: BookOpen },
  { href: '/mykundali/dashboard/reports', label: 'Reports', icon: FileText },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showRetakeConfirm, setShowRetakeConfirm] = useState(false)
  const { isLoggedIn, hydrated, user, logout } = useMykundaliAuth()

  const confirmRetake = async () => {
    setShowRetakeConfirm(false)
    await fetch('/api/mykundali/assessment/retake', { method: 'POST' })
    router.push('/mykundali/assessment/landing')
  }

  useEffect(() => {
    if (hydrated && !isLoggedIn) {
      router.replace('/mykundali/login')
    }
  }, [hydrated, isLoggedIn, router])

  const handleLogout = () => {
    logout()
    router.push('/mykundali/login')
  }

  if (!hydrated || !isLoggedIn) {
    return null
  }

  const isActive = (href: string) =>
    href === '/mykundali/dashboard' ? pathname === href : pathname.startsWith(href)

  const displayName = user?.fullName || 'there'

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-navy p-6 fixed h-screen print:hidden">
        <Link href="/" className="flex items-center gap-3 mb-1 group">
          <Image
            src={KUTUMB_LOGO_URL}
            alt="Kutumb Advisory"
            width={38}
            height={38}
            style={{ width: 'auto', height: 'auto' }}
            className="h-[38px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-serif text-xl tracking-wide text-white transition-colors duration-300 group-hover:text-gold">
            Kutumb
          </span>
        </Link>
        <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-gold/70 mb-8">
          My Financial Kundali
        </p>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all',
                  active
                    ? 'bg-gold/10 text-gold shadow-[inset_0_0_0_1px_rgba(168,121,31,0.2)]'
                    : 'text-white/75 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon size={17} strokeWidth={1.75} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-6 pt-6 border-t border-white/10">
          <button
            onClick={() => setShowRetakeConfirm(true)}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm text-gold/80 border border-gold/20 hover:bg-gold/10 hover:text-gold transition-all text-left"
          >
            <RefreshCw size={16} strokeWidth={1.75} />
            <span>Retake Assessment</span>
          </button>
        </div>

        <div className="flex-1" />

        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 px-1 pb-3">
            <div className="w-9 h-9 rounded-full bg-gold-light/20 flex items-center justify-center text-gold font-serif font-semibold text-sm flex-shrink-0">
              {getInitials(displayName)}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white truncate">{displayName}</p>
              <p className="text-xs text-white/55 truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/75 hover:text-white hover:bg-white/5 transition-all w-full text-left"
          >
            <LogOut size={16} strokeWidth={1.75} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 md:ml-64 print:ml-0 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-navy/8 px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-navy/70 hover:bg-navy/5"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-stone/60 hover:text-navy transition-colors"
            >
              <Home size={15} strokeWidth={1.75} />
              <span className="hidden sm:inline">Back to Kutumb</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <a
                href="tel:+919831610210"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gold/15 hover:bg-gold/25 text-gold-dark border border-gold/30 text-xs font-semibold transition-all duration-300 shadow-sm"
              >
                <PhoneCall size={14} strokeWidth={2} />
                <span>Talk to Expert</span>
              </a>
              <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col items-center bg-navy text-white text-xs py-2 px-3.5 rounded-xl shadow-xl border border-gold/30 z-50 whitespace-nowrap pointer-events-none">
                <span className="font-semibold text-gold text-[10px] uppercase tracking-wider">Call Advisor</span>
                <span className="font-mono text-xs text-white font-bold mt-0.5">+91 98316 10210</span>
              </div>
            </div>
            <span className="hidden sm:inline text-sm text-navy/70">
              Hi, {displayName}
            </span>
            <div className="w-8 h-8 rounded-full bg-gold-light/25 flex items-center justify-center text-gold-dark font-serif font-semibold text-xs">
              {getInitials(displayName)}
            </div>
          </div>
        </header>

        {/* Mobile Nav Overlay */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-navy/97 backdrop-blur-xl pt-6">
            <div className="flex items-center justify-between px-6 mb-8">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src={KUTUMB_LOGO_URL}
                  alt="Kutumb Advisory"
                  width={32}
                  height={32}
                  style={{ width: 'auto', height: 'auto' }}
                  className="h-8 w-auto object-contain"
                />
                <span className="font-serif text-lg text-white">Kutumb</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/10"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1 px-6">
              {navItems.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-4 rounded-xl text-base transition-all',
                      active ? 'bg-gold/10 text-gold' : 'text-white/75 hover:text-white'
                    )}
                  >
                    <Icon size={18} strokeWidth={1.75} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <button
                onClick={() => {
                  setMobileOpen(false)
                  setShowRetakeConfirm(true)
                }}
                className="flex items-center gap-3 px-4 py-4 mt-2 rounded-xl text-base text-gold/80 border border-gold/20 text-left"
              >
                <RefreshCw size={18} strokeWidth={1.75} />
                <span>Retake Assessment</span>
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false)
                  handleLogout()
                }}
                className="flex items-center gap-3 px-4 py-4 mt-2 rounded-xl text-base text-white/75 hover:text-white transition-all text-left"
              >
                <LogOut size={18} strokeWidth={1.75} />
                <span>Log out</span>
              </button>
            </nav>
          </div>
        )}

        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
        </main>
      </div>

      <ConfirmDialog
        open={showRetakeConfirm}
        title="Retake your Financial Kundali?"
        description="Retaking the assessment resets your current results. You'll need to complete payment of ₹999 again to unlock your new Financial Kundali."
        confirmLabel="Retake & Pay Again"
        cancelLabel="Cancel"
        danger={false}
        onConfirm={confirmRetake}
        onCancel={() => setShowRetakeConfirm(false)}
      />
    </div>
  )
}
