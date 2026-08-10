'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

interface GrahaData {
  name: string
  pillar: string
  description: string
}

const grahas: GrahaData[] = [
  { name: 'Surya', pillar: 'Income & Earning Power', description: 'The strength of your family\'s earning capacity.' },
  { name: 'Chandra', pillar: 'Emergency Fund & Peace', description: 'Your financial stability and preparedness for the unexpected.' },
  { name: 'Mangal', pillar: 'Protection & Insurance', description: 'Safeguarding your family against life\'s uncertainties.' },
  { name: 'Budh', pillar: 'Financial Discipline', description: 'The habits and systems behind your financial decisions.' },
  { name: 'Guru', pillar: 'Wealth Creation', description: 'Long-term investments and financial growth for your family.' },
  { name: 'Shukra', pillar: 'Lifestyle & Happiness', description: 'Balancing present happiness with future prosperity.' },
  { name: 'Shani', pillar: 'Retirement & Dignity', description: 'Ensuring a dignified and independent retirement.' },
  { name: 'Rahu', pillar: 'Financial Risk', description: 'Managing debt, leverage and financial exposure.' },
  { name: 'Ketu', pillar: 'Legacy & Succession', description: 'Estate planning and wealth transfer across generations.' },
]

const CX = 500
const CY = 500
const SEGMENT_ANGLE = 40
const INNER_R = 105
const OUTER_R = 370
const PARTICLE_R = 280
const DEG_TO_RAD = Math.PI / 180
const CYCLE_MS = 4500
const SEG_COUNT = 9

function degToRad(d: number) { return d * DEG_TO_RAD }

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = degToRad(deg - 90)
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function wedgePath(i: number, innerR: number, outerR: number): string {
  const startDeg = -90 + i * SEGMENT_ANGLE
  const endDeg = startDeg + SEGMENT_ANGLE
  const sIn = polar(CX, CY, innerR, startDeg)
  const eIn = polar(CX, CY, innerR, endDeg)
  const sOut = polar(CX, CY, outerR, startDeg)
  const eOut = polar(CX, CY, outerR, endDeg)
  return [
    `M ${sIn.x} ${sIn.y}`,
    `L ${sOut.x} ${sOut.y}`,
    `A ${outerR} ${outerR} 0 0 1 ${eOut.x} ${eOut.y}`,
    `L ${eIn.x} ${eIn.y}`,
    `A ${innerR} ${innerR} 0 0 0 ${sIn.x} ${sIn.y}`,
    'Z',
  ].join(' ')
}

function buildSegmentIcons() {
  const icons: Record<string, string> = {
    Surya: `<g fill="none" stroke="#A8791F" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="10" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="16" x2="12" y2="18"/>
      <line x1="4" y1="10" x2="6" y2="10"/><line x1="18" y1="10" x2="20" y2="10"/>
      <line x1="6.3" y1="4.3" x2="7.8" y2="5.8"/><line x1="16.2" y1="14.2" x2="17.7" y2="15.7"/>
      <line x1="17.7" y1="4.3" x2="16.2" y2="5.8"/><line x1="7.8" y1="14.2" x2="6.3" y2="15.7"/>
    </g>`,
    Chandra: `<g fill="none" stroke="#A8791F" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 4C10 4 5 9 5 15C5 21 10 26 16 26C12 24 9 20 9 15C9 10 12 6 16 4Z"/>
    </g>`,
    Mangal: `<g fill="none" stroke="#A8791F" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 18L12 8L18 18"/><line x1="12" y1="8" x2="12" y2="24"/><line x1="8" y1="14" x2="16" y2="14"/>
    </g>`,
    Budh: `<g fill="none" stroke="#A8791F" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <line x1="6" y1="8" x2="18" y2="8"/><line x1="6" y1="14" x2="14" y2="14"/><line x1="6" y1="20" x2="18" y2="20"/>
      <path d="M16 6L20 10L16 14"/><line x1="20" y1="8" x2="20" y2="22"/>
    </g>`,
    Guru: `<g fill="none" stroke="#A8791F" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 4L4 20H20Z"/><line x1="12" y1="10" x2="12" y2="16"/><line x1="9" y1="13" x2="15" y2="13"/>
    </g>`,
    Shukra: `<g fill="none" stroke="#A8791F" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22C12 22 5 16 5 12C5 9 8 7 10 7C11.5 7 12 8 12 9C12 8 12.5 7 14 7C16 7 19 9 19 12C19 16 12 22 12 22Z"/>
    </g>`,
    Shani: `<g fill="none" stroke="#A8791F" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="8" r="3"/><path d="M6 22C6 17 8 14 12 14C16 14 18 17 18 22"/>
      <line x1="16" y1="2" x2="22" y2="8"/><line x1="22" y1="2" x2="16" y2="8"/>
    </g>`,
    Rahu: `<g fill="none" stroke="#A8791F" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 10L12 4L18 10"/><line x1="12" y1="4" x2="12" y2="22"/><line x1="8" y1="16" x2="16" y2="16"/>
      <circle cx="12" cy="20" r="2" fill="#A8791F" opacity="0.3"/>
    </g>`,
    Ketu: `<g fill="none" stroke="#A8791F" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="16" cy="8" r="2"/><line x1="14" y1="10" x2="8" y2="16"/><circle cx="8" cy="16" r="2"/>
      <line x1="10" y1="10" x2="16" y2="16"/><circle cx="16" cy="16" r="2"/><line x1="16" y1="10" x2="16" y2="14"/>
    </g>`,
  }
  return icons
}

const segmentIcons = buildSegmentIcons()

interface TooltipState {
  name: string
  pillar: string
  description: string
  x: number
  y: number
}

export function FinancialKundaliHero() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [currentSeg, setCurrentSeg] = useState(0)
  const [particleProgress, setParticleProgress] = useState(0)
  const [hoveredSeg, setHoveredSeg] = useState<number | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [centerPulse, setCenterPulse] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const segRef = useRef(0)
  const progressRef = useRef(0)
  const lastSegRef = useRef(-1)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const startTime = performance.now()
    let raf: number
    const tick = (now: number) => {
      const elapsed = (now - startTime) % CYCLE_MS
      const totalProgress = elapsed / CYCLE_MS
      const rawSeg = totalProgress * SEG_COUNT
      const segIndex = Math.floor(rawSeg) % SEG_COUNT
      const withinSeg = rawSeg - Math.floor(rawSeg)

      progressRef.current = totalProgress
      setParticleProgress(totalProgress)

      if (segIndex !== lastSegRef.current) {
        setCurrentSeg(segIndex)
        setCenterPulse(true)
        setTimeout(() => setCenterPulse(false), 600)
        lastSegRef.current = segIndex
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reducedMotion])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const scrollRotate = useTransform(scrollYProgress, [0, 1], [0, -6])
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 20])
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3])
  const springRotate = useSpring(scrollRotate, { stiffness: 50, damping: 25 })
  const springY = useSpring(scrollY, { stiffness: 50, damping: 25 })

  const handleSegEnter = useCallback((i: number) => {
    setHoveredSeg(i)
    const angle = -90 + i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2
    const pos = polar(CX, CY, OUTER_R + 50, angle)
    setTooltip({ ...grahas[i], x: pos.x, y: pos.y })
  }, [])

  const handleSegLeave = useCallback(() => {
    setHoveredSeg(null)
    setTooltip(null)
  }, [])

  const particleAngle = particleProgress * 360
  const segWidth = (deg: number) => Math.abs(polar(CX, CY, OUTER_R, deg).x - polar(CX, CY, OUTER_R, deg + SEGMENT_ANGLE / 2).x)

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      <motion.div
        style={{ rotate: springRotate, y: springY, opacity: scrollOpacity }}
        className="relative select-none"
      >
        <svg
          viewBox="0 0 1000 1000"
          className="w-[280px] h-[280px] sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] xl:w-[500px] xl:h-[500px] max-w-[90vw] max-h-[90vw]"
          aria-label="Financial Kundali — Nine interconnected pillars of family wealth"
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feComposite in="SourceGraphic" in2="b" operator="over" />
            </filter>
            <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="10" result="b" />
              <feComponentTransfer in="b" result="g"><feFuncA type="linear" slope="1.2" /></feComponentTransfer>
              <feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="ambient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A8791F" stopOpacity="0.07" />
              <stop offset="40%" stopColor="#A8791F" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#A8791F" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="segGlow" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#A8791F" stopOpacity="0.15" />
              <stop offset="60%" stopColor="#A8791F" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#A8791F" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A8791F" stopOpacity="0.2" />
              <stop offset="70%" stopColor="#A8791F" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#A8791F" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="metallic" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.06" />
              <stop offset="50%" stopColor="#A8791F" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#201B62" stopOpacity="0.04" />
            </radialGradient>
            <clipPath id="wheelClip">
              <circle cx={CX} cy={CY} r={OUTER_R + 2} />
            </clipPath>
          </defs>

          {/* Ambient background */}
          <circle cx={CX} cy={CY} r={OUTER_R + 60} fill="url(#ambient)" />

          {/* Floating background particles */}
          {!reducedMotion && Array.from({ length: 10 }).map((_, i) => {
            const angle = i * 37 + 7
            const dist = 120 + (i % 4) * 50
            const p = polar(CX, CY, dist, angle)
            return (
              <motion.circle
                key={`fp-${i}`}
                cx={p.x} cy={p.y} r={1.2}
                fill="#A8791F"
                initial={{ opacity: 0.08 }}
                animate={{ opacity: [0.06, 0.2, 0.06], y: [0, -8, 0] }}
                transition={{ duration: 5 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
              />
            )
          })}

          <g clipPath="url(#wheelClip)">
            {/* Outer bevel — thick navy rim */}
            <circle cx={CX} cy={CY} r={OUTER_R + 3} fill="none" stroke="#201B62" strokeWidth="4" opacity={0.5} />
            <circle cx={CX} cy={CY} r={OUTER_R} fill="none" stroke="#A8791F" strokeWidth="0.8" opacity={0.3} />

            {/* Coin edge — milled notches around rim */}
            {Array.from({ length: 120 }).map((_, i) => {
              const a = i * 3
              const o = polar(CX, CY, OUTER_R + 2, a)
              const iPt = polar(CX, CY, OUTER_R - 2, a)
              return (
                <line key={`milled-${i}`} x1={iPt.x} y1={iPt.y} x2={o.x} y2={o.y}
                  stroke="#201B62" strokeWidth="0.6" opacity={0.12} />
              )
            })}

            {/* 9 Segments (wedges) */}
            {grahas.map((_, i) => {
              const isIlluminated = currentSeg === i && !reducedMotion
              const isHovered = hoveredSeg === i
              const baseFill = i % 2 === 0 ? '#FFFFFF' : '#FAF7F2'
              const path = wedgePath(i, INNER_R, OUTER_R)

              return (
                <g key={`seg-${i}`}>
                  {/* Base wedge */}
                  <motion.path
                    d={path}
                    fill={isIlluminated ? 'url(#segGlow)' : baseFill}
                    opacity={isIlluminated ? 1 : 0.7}
                    animate={isHovered ? { scale: 1.02, originX: CX, originY: CY } : { scale: 1, originX: CX, originY: CY }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    onMouseEnter={() => handleSegEnter(i)}
                    onMouseLeave={handleSegLeave}
                    style={{ cursor: 'pointer' }}
                  />

                  {/* Illumination overlay */}
                  {isIlluminated && (
                    <motion.path
                      d={path}
                      fill="url(#segGlow)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.6, 0.3] }}
                      transition={{ duration: 1.2, ease: 'easeInOut' }}
                    />
                  )}

                  {/* Hover gold border */}
                  {isHovered && (
                    <path d={path} fill="none" stroke="#A8791F" strokeWidth="1.5" opacity={0.3} />
                  )}
                </g>
              )
            })}

            {/* Metallic sheen overlay */}
            <circle cx={CX} cy={CY} r={OUTER_R} fill="url(#metallic)" />

            {/* Radial dividers — engraved grooves between segments */}
            {Array.from({ length: SEG_COUNT }).map((_, i) => {
              const angle = -90 + i * SEGMENT_ANGLE
              const outer = polar(CX, CY, OUTER_R, angle)
              const inner = polar(CX, CY, INNER_R, angle)
              return (
                <g key={`divider-${i}`}>
                  <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                    stroke="#A8791F" strokeWidth="0.7" opacity={0.35} />
                  <line x1={inner.x - 1} y1={inner.y} x2={outer.x - 1} y2={outer.y}
                    stroke="#201B62" strokeWidth="0.4" opacity={0.08} />
                </g>
              )
            })}

            {/* Engraved concentric rings */}
            <circle cx={CX} cy={CY} r={330} fill="none" stroke="#201B62" strokeWidth="0.4" opacity={0.12} />
            <circle cx={CX} cy={CY} r={310} fill="none" stroke="#A8791F" strokeWidth="0.3" opacity={0.1} strokeDasharray="2 6" />
            <circle cx={CX} cy={CY} r={230} fill="none" stroke="#201B62" strokeWidth="0.4" opacity={0.12} />
            <circle cx={CX} cy={CY} r={170} fill="none" stroke="#A8791F" strokeWidth="0.3" opacity={0.08} strokeDasharray="1 4" />

            {/* Watch-style tick marks at r=340 */}
            {Array.from({ length: 72 }).map((_, i) => {
              const angle = i * 5
              const isMajor = i % 6 === 0
              const outer = polar(CX, CY, 348, angle)
              const inner = polar(CX, CY, isMajor ? 338 : 342, angle)
              return (
                <line key={`tick-${i}`} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                  stroke={isMajor ? '#A8791F' : '#201B62'}
                  strokeWidth={isMajor ? 1 : 0.4}
                  opacity={isMajor ? 0.3 : 0.08} />
              )
            })}

            {/* Segment content — icon, name, pillar */}
            {grahas.map((g, i) => {
              const angle = -90 + i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2
              const isActive = currentSeg === i && !reducedMotion
              const isHov = hoveredSeg === i
              const textColor = isActive || isHov ? '#A8791F' : '#201B62'
              const pillarColor = isActive || isHov ? '#A8791F' : '#6B7280'

              // Icon at r=295
              const iconPos = polar(CX, CY, 295, angle)
              // Name at r=250
              const namePos = polar(CX, CY, 248, angle)
              // Pillar text at r=205 and r=193 (two lines)
              const pillarPos1 = polar(CX, CY, 212, angle)
              const pillarPos2 = polar(CX, CY, 200, angle)
              const pillarWords = g.pillar.split(' ')
              const line1 = pillarWords.slice(0, Math.ceil(pillarWords.length / 2)).join(' ')
              const line2 = pillarWords.slice(Math.ceil(pillarWords.length / 2)).join(' ')

              return (
                <g key={`content-${i}`} pointerEvents="none">
                  {/* Icon circle */}
                  <circle cx={iconPos.x} cy={iconPos.y} r={14}
                    fill={isActive || isHov ? '#A8791F' : '#201B62'}
                    opacity={isActive || isHov ? 0.1 : 0.04} />
                  <g dangerouslySetInnerHTML={{
                    __html: `<g transform="translate(${iconPos.x - 12},${iconPos.y - 12})">${segmentIcons[g.name]}</g>`,
                  }} />

                  {/* Graha name */}
                  <text x={namePos.x} y={namePos.y} textAnchor="middle" dominantBaseline="middle"
                    fill={textColor} fontSize="12" fontFamily="Cormorant Garamond, Georgia, serif"
                    fontWeight={600} letterSpacing="0.04em" opacity={isActive || isHov ? 1 : 0.6}>
                    {g.name}
                  </text>

                  {/* Pillar text — line 1 */}
                  <text x={pillarPos1.x} y={pillarPos1.y} textAnchor="middle" dominantBaseline="middle"
                    fill={pillarColor} fontSize="8" fontFamily="Inter, sans-serif"
                    fontWeight={400} letterSpacing="0.02em" opacity={isActive || isHov ? 0.9 : 0.5}>
                    {line1}
                  </text>

                  {/* Pillar text — line 2 */}
                  {line2 && (
                    <text x={pillarPos2.x} y={pillarPos2.y} textAnchor="middle" dominantBaseline="middle"
                      fill={pillarColor} fontSize="8" fontFamily="Inter, sans-serif"
                      fontWeight={400} letterSpacing="0.02em" opacity={isActive || isHov ? 0.9 : 0.5}>
                      {line2}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Traveling gold particle */}
            {!reducedMotion && (() => {
              const angle = -90 + particleProgress * 360
              const pos = polar(CX, CY, PARTICLE_R, angle)
              return (
                <g>
                  <circle cx={pos.x} cy={pos.y} r={14} fill="url(#centerGlow)" opacity={0.5} />
                  <circle cx={pos.x} cy={pos.y} r={3} fill="#A8791F" filter="url(#particleGlow)" />
                  {[1, 2, 3].map((j) => {
                    const trailAngle = angle - j * 4
                    const tp = polar(CX, CY, PARTICLE_R, trailAngle)
                    return <circle key={`tr-${j}`} cx={tp.x} cy={tp.y} r={2 - j * 0.4}
                      fill="#A8791F" opacity={0.15 - j * 0.04} />
                  })}
                </g>
              )
            })()}

            {/* Center Emblem — Luxury Seal */}
            <g>
              {/* Outer seal ring */}
              <circle cx={CX} cy={CY} r={95} fill="none" stroke="#201B62" strokeWidth="1.2" opacity={0.3} />
              <circle cx={CX} cy={CY} r={91} fill="none" stroke="#A8791F" strokeWidth="0.5" opacity={0.15} />

              {/* Notched seal edge */}
              {Array.from({ length: 36 }).map((_, i) => {
                const a = i * 10
                const o = polar(CX, CY, 97, a)
                const inner = polar(CX, CY, 93, a)
                return <line key={`seal-notch-${i}`} x1={inner.x} y1={inner.y} x2={o.x} y2={o.y}
                  stroke="#201B62" strokeWidth="0.5" opacity={0.15} />
              })}

              {/* Engraved motto ring */}
              <circle cx={CX} cy={CY} r={80} fill="none" stroke="#A8791F" strokeWidth="0.3" opacity={0.12} strokeDasharray="2 5" />

              {/* Breathing glow */}
              <motion.circle cx={CX} cy={CY} r={60} fill="url(#centerGlow)"
                animate={reducedMotion ? {} : {
                  r: [58, 63, 58],
                  opacity: [0.3, 0.5, 0.3],
                  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                }}
              />

              {/* Center pulse on segment transition */}
              {centerPulse && (
                <motion.circle cx={CX} cy={CY} r={60} fill="#A8791F"
                  initial={{ opacity: 0.2, scale: 0.8 }}
                  animate={{ opacity: 0, scale: 1.3 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              )}

              {/* Compass rose — 8-point star */}
              <g opacity={0.35}>
                {/* Cardinal points (N,S,E,W) */}
                <line x1={CX} y1={CY - 55} x2={CX} y2={CY + 55} stroke="#A8791F" strokeWidth="0.6" />
                <line x1={CX - 55} y1={CY} x2={CX + 55} y2={CY} stroke="#A8791F" strokeWidth="0.6" />
                {/* Intercardinal */}
                <line x1={CX - 39} y1={CY - 39} x2={CX + 39} y2={CY + 39} stroke="#A8791F" strokeWidth="0.3" opacity={0.5} />
                <line x1={CX + 39} y1={CY - 39} x2={CX - 39} y2={CY + 39} stroke="#A8791F" strokeWidth="0.3" opacity={0.5} />
                {/* North indicator arrow */}
                <polygon points={`${CX},${CY - 55} ${CX - 5},${CY - 42} ${CX + 5},${CY - 42}`} fill="#A8791F" opacity={0.6} />
              </g>

              {/* Inner concentric rings */}
              <circle cx={CX} cy={CY} r={42} fill="none" stroke="#201B62" strokeWidth="0.4" opacity={0.15} />
              <circle cx={CX} cy={CY} r={38} fill="none" stroke="#201B62" strokeWidth="0.4" opacity={0.1} />

              {/* "K" monogram at center */}
              <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="middle"
                fill="#A8791F" fontSize="22" fontFamily="Cormorant Garamond, Georgia, serif"
                fontWeight={700} letterSpacing="-0.02em" opacity={0.7}>
                K
              </text>

              {/* Center dot */}
              <circle cx={CX} cy={CY} r={2} fill="#A8791F" opacity={0.8} />
            </g>
          </g>
        </svg>

        {/* HTML tooltip (positioned outside SVG for proper text rendering) */}
        {tooltip && (() => {
          const outerSize = 500
          const scale = 1
          const tx = ((tooltip.x - outerSize) / outerSize) * 100
          const ty = ((tooltip.y - outerSize) / outerSize) * 100
          const isTop = tooltip.y < 200
          return (
            <motion.div
              initial={{ opacity: 0, y: isTop ? 4 : -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute pointer-events-none z-10"
              style={{
                left: `${50 + tx}%`,
                top: `${isTop ? 80 : 25}%`,
                transform: 'translate(-50%, 0)',
              }}
            >
              <div className="bg-white/90 backdrop-blur-md rounded-xl border border-gold/20 shadow-card px-3.5 py-2.5 text-center whitespace-nowrap">
                <p className="font-serif text-[13px] font-semibold text-navy">{tooltip.name}</p>
                <p className="text-[11px] text-gold mt-0.5 font-medium">{tooltip.pillar}</p>
                <p className="text-[10px] text-slate mt-1 leading-tight max-w-[180px] whitespace-normal">{tooltip.description}</p>
              </div>
            </motion.div>
          )
        })()}
      </motion.div>
    </div>
  )
}
