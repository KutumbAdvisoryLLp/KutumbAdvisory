import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { GRAHAS } from "./grahas"
import { type GrahaId, type FamilyProfile } from "@/types"
import { COVER_IMAGE_BASE64, LAST_IMAGE_BASE64, PAGE_LOGO_BASE64 } from "./report-images"
import {
  PAGE_2_TEMPLATE,
  PAGE_3_TEMPLATE,
  PAGE_4_TEMPLATE,
  PAGE_5_TEMPLATE,
  PAGE_6_TEMPLATE,
  PAGE_7_TEMPLATE,
  PAGE_8_TEMPLATE,
  PAGE_9_TEMPLATE,
  PAGE_10_TEMPLATE,
  PAGE_11_TEMPLATE,
  PAGE_12_TEMPLATE,
  PAGE_13_TEMPLATE,
  PAGE_14_TEMPLATE,
  PAGE_15_TEMPLATE,
} from "./report-templates"

export interface ReportPdfData {
  user: {
    fullName?: string
    email?: string
  } | null
  profile: FamilyProfile | null
  report: {
    completedAt: string
    overallScore: number
    overallStatus: string
    grahaScores: Record<string, number>
    actionPlan: Array<{ id: string; grahaId: string; title: string; description: string; priority: string; category?: string }>
    advisorNotes?: string
  } | null
  grahaAnswers?: Record<string, Record<string, string>>
}

const REMARKS_DICT: Record<string, { yes: string; no: string }> = {
  s1: { yes: "Diversified income stream enhances financial stability.", no: "Create a secondary income stream to reduce single-source dependency." },
  s2: { yes: "Consistent growth shows strong earning momentum.", no: "Focus on career advancement or upskilling to increase income." },
  s3: { yes: "Income contingency plan protects family during unexpected disruptions.", no: "Build an emergency buffer and income replacement strategy." },
  s4: { yes: "Single income dependency is high risk — build passive income.", no: "Good — multiple income channels exist." },
  s5: { yes: "Investing in skills increases future earning capacity.", no: "Allocate budget for professional upskilling annually." },

  c1: { yes: "Emergency fund provides critical financial peace.", no: "Immediately set aside 3–6 months of expenses in liquid funds." },
  c2: { yes: "6-month runway ensures strong crisis resilience.", no: "Build liquid savings to cover at least 6 months of household expenses." },
  c3: { yes: "12-month runway provides exceptional peace of mind.", no: "Aim to extend emergency reserves to 12 months for high security." },
  c4: { yes: "Maintaining liquid savings protects against market sell-offs.", no: "Avoid locking all funds in illiquid real estate or locked products." },
  c5: { yes: "Past emergency loans indicate insufficient liquid reserves.", no: "Great — emergency reserves prevented high-interest debt." },

  m1: { yes: "Adequate life cover shields family from income loss.", no: "Get a pure term insurance cover equal to 10–15x annual income." },
  m2: { yes: "Comprehensive health cover guards against medical inflation.", no: "Secure a family floater health plan of at least ₹10–25 Lakhs." },
  m3: { yes: "Personal accident cover protects against disability income loss.", no: "Add a personal accident policy with permanent disability benefit." },
  m4: { yes: "Critical illness cover protects wealth during major health events.", no: "Add a critical illness rider to safeguard long-term investments." },
  m5: { yes: "Annual insurance reviews ensure coverage matches life stage changes.", no: "Review insurance policies annually to keep cover aligned with debt/dependents." },

  b1: { yes: "Monthly budgeting enforces financial discipline.", no: "Adopt the 50/30/20 budget framework for monthly cash flows." },
  b2: { yes: "Expense tracking prevents leaks in personal finances.", no: "Use a digital tracker to log monthly household expenses." },
  b3: { yes: "Low debt burden keeps financial stress minimal.", no: "Prioritise paying off high-cost debt (credit cards, personal loans)." },
  b4: { yes: "Save-first approach automates wealth accumulation.", no: "Automate investments on payday before spending on lifestyle." },
  b5: { yes: "Careful review of major purchases prevents impulse debt.", no: "Implement a 48-hour cooling period before major non-essential buys." },

  g1: { yes: "Goal-linked investing gives clarity and purpose.", no: "Tag all investments to specific financial milestones." },
  g2: { yes: "SIP investing leverages market compounding effectively.", no: "Start automated monthly SIPs in equity mutual funds." },
  g3: { yes: "Diversified portfolio manages market volatility well.", no: "Rebalance portfolio across equity, debt, and gold." },
  g4: { yes: "Beating inflation builds real purchasing power.", no: "Increase equity exposure to beat long-term inflation." },
  g5: { yes: "Long-term strategy provides a clear path to prosperity.", no: "Create a written 10-year wealth strategy with a financial advisor." },

  sk1: { yes: "Financial peace allows enjoying life stress-free.", no: "Align spending with values to reduce financial anxiety." },
  sk2: { yes: "Planned vacations keep family joy within budget.", no: "Create a dedicated annual vacation sinking fund." },
  sk3: { yes: "Controlled lifestyle costs maximize investment surplus.", no: "Avoid lifestyle inflation when income increases." },
  sk4: { yes: "Avoiding status spending protects long-term wealth.", no: "Focus on value rather than status-driven purchases." },
  sk5: { yes: "Family Happiness Fund fosters shared joy and alignment.", no: "Allocate a small monthly budget for family experiences." },

  sn1: { yes: "Retirement corpus is calculated — you know your target number.", no: "Calculate target retirement corpus factoring in inflation." },
  sn2: { yes: "Regular retirement investing puts you on track for a dignified sunset.", no: "Start dedicated monthly retirement investments (NPS / Equity)." },
  sn3: { yes: "Retirement gap identified — awareness is the first step to closing it.", no: "Assess current gap to maintain post-retirement lifestyle." },
  sn4: { yes: "Projected retirement income is sufficient — excellent forward planning.", no: "Step up retirement contributions by 10% annually." },
  sn5: { yes: "Healthcare costs planned for retirement reduces future financial stress.", no: "Set up a dedicated senior citizen medical corpus." },

  r1: { yes: "Avoiding get-rich-quick schemes shows mature financial judgement.", no: "Never invest in unregulated or quick-return promises." },
  r2: { yes: "Understanding every investment made is a key risk management strength.", no: "Avoid buying financial products you cannot clearly explain." },
  r3: { yes: "Avoiding emotional financial decisions leads to better long-term outcomes.", no: "Follow an asset allocation rule instead of emotional trading." },
  r4: { yes: "Regular professional guidance keeps finances optimised and on track.", no: "Consult a SEBI-registered fee-only advisor." },
  r5: { yes: "Portfolio aligned to risk profile means risk is managed intentionally.", no: "Reassess risk tolerance before making high-risk investments." },
  r6: { yes: "Awareness of inflation ensures your portfolio aims for real growth.", no: "Understand that inflation erodes purchasing power by 6-7% yearly." },
  r7: { yes: "Understanding market risk helps maintain a balanced, resilient portfolio.", no: "Learn how market volatility behaves over 5-7 year horizons." },

  k1: { yes: "A valid, updated Will ensures wishes are honoured and family is protected.", no: "Draft a registered Will to protect legal heirs." },
  k2: { yes: "Updated nominations across all assets prevents legal complications.", no: "Verify bank, mutual fund, and insurance nominations immediately." },
  k3: { yes: "Family awareness of asset details ensures smooth succession.", no: "Maintain a secure document with all account & policy details." },
  k4: { yes: "A clear succession plan provides certainty for the next generation.", no: "Document succession plan for business and personal assets." },
  k5: { yes: "Legacy discussions held with family build trust and alignment.", no: "Discuss financial succession and values with family members." }
}

function calculateRadarPoints(scores: Record<string, number>): string {
  const grahaOrder: GrahaId[] = ["surya", "ketu", "rahu", "shani", "shukra", "guru", "budh", "mangal", "chandra"]
  const center = { x: 175, y: 145 }
  const maxR = 100

  const points = grahaOrder.map((id, index) => {
    const score = Math.max(0, Math.min(10, scores[id] ?? 5))
    const angleDeg = index * 40 - 90
    const angleRad = (angleDeg * Math.PI) / 180
    const r = (score / 10) * maxR
    const x = Math.round((center.x + r * Math.cos(angleRad)) * 10) / 10
    const y = Math.round((center.y + r * Math.sin(angleRad)) * 10) / 10
    return `${x},${y}`
  })

  return points.join(" ")
}

export function buildReportHtmlPages(data: ReportPdfData): string[] {
  const { user, profile, report, grahaAnswers } = data

  const enteredName = profile?.primaryMember?.name || profile?.familyName
  const isEmailLike = user?.fullName && (user.fullName.includes('@') || (user?.email && user.fullName === user.email.split('@')[0]))
  const clientName = enteredName || (!isEmailLike ? user?.fullName : undefined) || user?.fullName || "Valued Client"

  const dateStr = report?.completedAt || new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  const overallScore = report?.overallScore ?? 0

  const worksheet = profile?.netWorthWorksheet || {
    assets: { bankFD: 0, mutualFunds: 0, shares: 0, property: 0, gold: 0, epfPpfNps: 0 },
    liabilities: { homeLoan: 0, personalLoan: 0, vehicleLoan: 0, creditCard: 0, otherLoans: 0 }
  }

  const assets = worksheet.assets || {}
  const liabilities = worksheet.liabilities || {}

  const totalAssets = (assets.bankFD || 0) + (assets.mutualFunds || 0) + (assets.shares || 0) + (assets.property || 0) + (assets.gold || 0) + (assets.epfPpfNps || 0)
  const totalLiabilities = (liabilities.homeLoan || 0) + (liabilities.personalLoan || 0) + (liabilities.vehicleLoan || 0) + (liabilities.creditCard || 0) + (liabilities.otherLoans || 0)
  const netWorth = totalAssets - totalLiabilities

  const insuranceStr = (profile?.existingInsurance ?? []).map(i => `${i.type} (₹${(i.sumInsured || (i as any).coverAmount || 0).toLocaleString("en-IN")})`).join(", ") || "None"
  const investmentsStr = (profile?.existingInvestments ?? []).map(i => `${i.type} (₹${(i.currentValue || i.amount || (i as any).value || 0).toLocaleString("en-IN")})`).join(", ") || "None"
  const childrenStr = (profile?.children ?? []).length > 0 ? profile!.children!.map(c => `${c.name || "Child"} (${c.age || "—"} yrs)`).join(", ") : "No children"

  const pages: string[] = []

  // Page 1: Cover
  pages.push(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>* { margin: 0; padding: 0; box-sizing: border-box; } body { background: #ffffff; } .page { width: 210mm; height: 297mm; overflow: hidden; } .cover-img { width: 100%; height: 100%; object-fit: cover; display: block; }</style></head><body><main class="page"><img src="${COVER_IMAGE_BASE64}" alt="Cover" class="cover-img" /></main></body></html>`)

  // Page 2: Title & Client Information
  let p2 = PAGE_2_TEMPLATE
    .replace('src="assets/kutumb_logo.png"', `src="${PAGE_LOGO_BASE64}"`)
    .replace('src="/report/pagelogo_transparent.png"', `src="${PAGE_LOGO_BASE64}"`)
    .replace('<span class="field-val client-name-val"></span>', `<span class="field-val client-name-val">${clientName}</span>`)
    .replace('<span class="field-val assessment-date-val"></span>', `<span class="field-val assessment-date-val">${dateStr}</span>`)
    .replace('<span class="field-val advisor-name-val">Kutumb Wealth Advisor</span>', `<span class="field-val advisor-name-val">Kutumb Wealth Advisor</span>`)
  pages.push(p2)

  // Page 3: About Booklet
  pages.push(PAGE_3_TEMPLATE)

  // Page 4: Family Profile & Net Worth
  let p4 = PAGE_4_TEMPLATE
    .replace('<span class="fval family-name-val">—</span>', `<span class="fval family-name-val">${profile?.familyName || "—"}</span>`)
    .replace('<span class="fval primary-member-val">—</span>', `<span class="fval primary-member-val">${profile?.primaryMember?.name || "—"}</span>`)
    .replace('<span class="fval age-val">—</span>', `<span class="fval age-val">${profile?.primaryMember?.age || "—"}</span>`)
    .replace('<span class="fval spouse-val">—</span>', `<span class="fval spouse-val">${profile?.spouse?.name || "—"}</span>`)
    .replace('<span class="fval children-val">—</span>', `<span class="fval children-val">${childrenStr}</span>`)
    .replace('<span class="fval occupation-val">—</span>', `<span class="fval occupation-val">${profile?.primaryMember?.occupation || "—"}</span>`)
    .replace('<span class="fval risk-profile-val">—</span>', `<span class="fval risk-profile-val" style="text-transform:uppercase;">${profile?.riskProfile || "—"}</span>`)
    .replace('<span class="fval goal1-val">—</span>', `<span class="fval goal1-val">${profile?.goals?.[0] || "—"}</span>`)
    .replace('<span class="fval goal2-val">—</span>', `<span class="fval goal2-val">${profile?.goals?.[1] || "—"}</span>`)
    .replace('<span class="fval goal3-val">—</span>', `<span class="fval goal3-val">${profile?.goals?.[2] || "—"}</span>`)
    .replace('<span class="fval time-horizon-val">—</span>', `<span class="fval time-horizon-val">${profile?.timeHorizon || "—"}</span>`)
    .replace('<span class="fval monthly-expenses-val">—</span>', `<span class="fval monthly-expenses-val">₹${(profile?.monthlyExpenses || 0).toLocaleString("en-IN")}</span>`)
    .replace('<span class="fval insurance-val">—</span>', `<span class="fval insurance-val">${insuranceStr}</span>`)
    .replace('<span class="fval investments-val">—</span>', `<span class="fval investments-val">${investmentsStr}</span>`)
    .replace('<span class="nval bank-fd-val">₹0</span>', `<span class="nval bank-fd-val">₹${(assets.bankFD || 0).toLocaleString("en-IN")}</span>`)
    .replace('<span class="nval mutual-funds-val">₹0</span>', `<span class="nval mutual-funds-val">₹${(assets.mutualFunds || 0).toLocaleString("en-IN")}</span>`)
    .replace('<span class="nval shares-val">₹0</span>', `<span class="nval shares-val">₹${(assets.shares || 0).toLocaleString("en-IN")}</span>`)
    .replace('<span class="nval property-val">₹0</span>', `<span class="nval property-val">₹${(assets.property || 0).toLocaleString("en-IN")}</span>`)
    .replace('<span class="nval gold-val">₹0</span>', `<span class="nval gold-val">₹${(assets.gold || 0).toLocaleString("en-IN")}</span>`)
    .replace('<span class="nval epf-val">₹0</span>', `<span class="nval epf-val">₹${(assets.epfPpfNps || 0).toLocaleString("en-IN")}</span>`)
    .replace('<span class="ntotal-assets-val" style="font-weight:700; color:#172A4A;">₹0</span>', `<span class="ntotal-assets-val" style="font-weight:700; color:#172A4A;">₹${totalAssets.toLocaleString("en-IN")}</span>`)
    .replace('<span class="nval home-loan-val">₹0</span>', `<span class="nval home-loan-val">₹${(liabilities.homeLoan || 0).toLocaleString("en-IN")}</span>`)
    .replace('<span class="nval personal-loan-val">₹0</span>', `<span class="nval personal-loan-val">₹${(liabilities.personalLoan || 0).toLocaleString("en-IN")}</span>`)
    .replace('<span class="nval vehicle-loan-val">₹0</span>', `<span class="nval vehicle-loan-val">₹${(liabilities.vehicleLoan || 0).toLocaleString("en-IN")}</span>`)
    .replace('<span class="nval credit-card-val">₹0</span>', `<span class="nval credit-card-val">₹${(liabilities.creditCard || 0).toLocaleString("en-IN")}</span>`)
    .replace('<span class="nval other-loans-val">₹0</span>', `<span class="nval other-loans-val">₹${(liabilities.otherLoans || 0).toLocaleString("en-IN")}</span>`)
    .replace('<span class="ntotal-liabilities-val" style="font-weight:700; color:#172A4A;">₹0</span>', `<span class="ntotal-liabilities-val" style="font-weight:700; color:#172A4A;">₹${totalLiabilities.toLocaleString("en-IN")}</span>`)
    .replace('<span class="networth-val">₹0</span>', `<span class="networth-val">₹${netWorth.toLocaleString("en-IN")}</span>`)

  pages.push(p4)

  // Pages 5 to 13: Questionnaires
  const grahaTemplates: Record<GrahaId, string> = {
    surya: PAGE_5_TEMPLATE,
    chandra: PAGE_6_TEMPLATE,
    mangal: PAGE_7_TEMPLATE,
    budh: PAGE_8_TEMPLATE,
    guru: PAGE_9_TEMPLATE,
    shukra: PAGE_10_TEMPLATE,
    shani: PAGE_11_TEMPLATE,
    rahu: PAGE_12_TEMPLATE,
    ketu: PAGE_13_TEMPLATE,
  }

  const grahaQuestionKeys: Record<GrahaId, string[]> = {
    surya: ["s1", "s2", "s3", "s4", "s5"],
    chandra: ["c1", "c2", "c3", "c4", "c5"],
    mangal: ["m1", "m2", "m3", "m4", "m5"],
    budh: ["b1", "b2", "b3", "b4", "b5"],
    guru: ["g1", "g2", "g3", "g4", "g5"],
    shukra: ["sk1", "sk2", "sk3", "sk4", "sk5"],
    shani: ["sn1", "sn2", "sn3", "sn4", "sn5"],
    rahu: ["r1", "r2", "r3", "r4", "r5"],
    ketu: ["k1", "k2", "k3", "k4", "k5"],
  }

  const grahaOrder: GrahaId[] = ["surya", "chandra", "mangal", "budh", "guru", "shukra", "shani", "rahu", "ketu"]

  for (const gid of grahaOrder) {
    let tpl = grahaTemplates[gid]
    const qKeys = grahaQuestionKeys[gid]
    const gAns = grahaAnswers?.[gid] ?? {}
    const score = report?.grahaScores?.[gid] ?? 6

    let doshaText = "None"
    let doshaColor = "#2E7D32"
    if (score <= 3) {
      doshaText = "Severe Dosha"
      doshaColor = "#C62828"
    } else if (score <= 5) {
      doshaText = "Moderate Dosha"
      doshaColor = "#EF6C00"
    } else if (score <= 7) {
      doshaText = "Mild Dosha"
      doshaColor = "#F57F17"
    }

    for (const qk of qKeys) {
      const ans = gAns[qk] ?? (score >= 6 ? "Yes" : "No")
      const remarkObj = REMARKS_DICT[qk] ?? { yes: "Well managed.", no: "Action recommended." }
      const remark = ans === "Yes" ? remarkObj.yes : remarkObj.no

      tpl = tpl.replace(
        `<td class="col-yesno"></td>`,
        `<td class="col-yesno" style="text-align:center; font-weight:700; color:${ans === "Yes" ? "#2E7D32" : "#C62828"}; font-size:13px;">${ans}</td>`
      )
      tpl = tpl.replace(
        `<td class="col-remarks"></td>`,
        `<td class="col-remarks" style="font-size:11.5px; line-height:1.4; padding:8px 12px; color:#333333;">${remark}</td>`
      )
    }

    tpl = tpl
      .replace('<span class="score-val"></span>', `<span class="score-val" style="font-weight:700; color:#172A4A; font-size:15px;">${score} / 10</span>`)
      .replace('<span class="dosha-val">None</span>', `<span class="dosha-val" style="color:${doshaColor}; font-weight:700;">${doshaText}</span>`)
      .replace(
        '<div class="observation-text"></div>',
        `<div class="observation-text" style="font-size:11.5px; color:#333333; line-height:1.45;">${
          score >= 8
            ? "Strong pillar. Maintain current discipline and continue routine reviews."
            : score >= 5
            ? "Moderate foundation with key areas requiring advisor intervention over the next 90 days."
            : "Critical financial dosha identified. Immediate corrective action required to prevent risk."
        }</div>`
      )

    pages.push(tpl)
  }

  // Page 14: Scorecard & Radar Wheel
  let p14 = PAGE_14_TEMPLATE
  for (const gid of grahaOrder) {
    const score = report?.grahaScores?.[gid] ?? 6
    let doshaLabel = "None"
    let doshaColor = "#2E7D32"
    if (score <= 3) { doshaLabel = "Severe"; doshaColor = "#C62828" }
    else if (score <= 5) { doshaLabel = "Moderate"; doshaColor = "#EF6C00" }
    else if (score <= 7) { doshaLabel = "Mild"; doshaColor = "#F57F17" }

    p14 = p14.replace(
      `<div class="g-score"><span class="dash"></span>/ 10</div>`,
      `<div class="g-score">${score} / 10</div>`
    )
    p14 = p14.replace(
      `<div class="g-dosha">None</div>`,
      `<div class="g-dosha" style="color:${doshaColor}; font-weight:600;">${doshaLabel}</div>`
    )
  }

  p14 = p14.replace(
    `<span class="total-score"><span class="dash"></span>/ 90</span>`,
    `<span class="total-score" style="font-size:16px; font-weight:700; color:#D7A52E;">${overallScore} / 90</span>`
  )

  const radarPoints = calculateRadarPoints(report?.grahaScores ?? {})
  p14 = p14.replace(
    `<g></g>`,
    `<g><polygon points="${radarPoints}" fill="rgba(215, 165, 46, 0.45)" stroke="#D7A52E" stroke-width="2.5" /></g>`
  )

  const sortedGrahas = [...grahaOrder].sort((a, b) => (report?.grahaScores?.[a] ?? 6) - (report?.grahaScores?.[b] ?? 6))
  const remedyGrahas = sortedGrahas.slice(0, 5)

  for (let idx = 0; idx < remedyGrahas.length; idx++) {
    const gid = remedyGrahas[idx]
    const gObj = GRAHAS.find((g) => g.id === gid)
    const score = report?.grahaScores?.[gid] ?? 6

    p14 = p14.replace(
      `<tr><td class="col-num">${idx + 1}</td><td></td><td></td><td></td></tr>`,
      `<tr><td class="col-num">${idx + 1}</td><td style="font-weight:700; color:#172A4A;">${gObj?.name || gid} (${score}/10)</td><td style="font-size:11px;">${gObj?.subtitle || "Weakness in " + gid}</td><td style="font-size:11px;">Consult advisor to resolve ${gObj?.name || gid} dosha</td></tr>`
    )
  }
  pages.push(p14)

  // Page 15: Advisor Observations & Recommendations
  let p15 = PAGE_15_TEMPLATE
    .replace('<span class="sign-val sign-date-val"></span>', `<span class="sign-val sign-date-val">${dateStr}</span>`)
    .replace('<span class="sign-val sign-client-val"></span>', `<span class="sign-val sign-client-val">${clientName}</span>`)

  pages.push(p15)

  // Page 16: Back Cover
  pages.push(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>* { margin: 0; padding: 0; box-sizing: border-box; } body { background: #ffffff; } .page { width: 210mm; height: 297mm; overflow: hidden; } .last-img { width: 100%; height: 100%; object-fit: cover; display: block; }</style></head><body><main class="page"><img src="${LAST_IMAGE_BASE64}" alt="Back Cover" class="last-img" /></main></body></html>`)

  return pages
}

export async function downloadFullReportPdf(data: ReportPdfData, fileName = "Kutumb_Financial_Kundali_Report.pdf"): Promise<void> {
  const pagesHtml = buildReportHtmlPages(data)

  const iframe = document.createElement("iframe")
  iframe.style.position = "fixed"
  iframe.style.top = "0"
  iframe.style.left = "0"
  iframe.style.width = "794px"
  iframe.style.height = "1123px"
  iframe.style.opacity = "0"
  iframe.style.pointerEvents = "none"
  iframe.style.zIndex = "-99999"
  iframe.style.border = "none"
  document.body.appendChild(iframe)

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  try {
    for (let i = 0; i < pagesHtml.length; i++) {
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (!doc) continue

      doc.open()
      doc.write(pagesHtml[i])
      doc.close()

      // Wait for images to load
      const imgs = Array.from(doc.querySelectorAll("img"))
      await Promise.all(
        imgs.map((img) => {
          if (img.complete) return Promise.resolve()
          return new Promise((resolve) => {
            img.onload = resolve
            img.onerror = resolve
          })
        })
      )

      // Wait for fonts to load in iframe
      if ((doc as any).fonts && (doc as any).fonts.ready) {
        try {
          await (doc as any).fonts.ready
        } catch (_) {}
      }

      await new Promise((res) => setTimeout(res, 150))

      const targetEl = doc.body || doc.documentElement
      const canvas = await html2canvas(targetEl, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123,
        backgroundColor: "#ffffff",
        logging: false,
      })

      const imgData = canvas.toDataURL("image/jpeg", 0.95)
      if (i > 0) {
        pdf.addPage("a4", "portrait")
      }

      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST")
    }

    pdf.save(fileName)
  } finally {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe)
    }
  }
}

export function printFullReportHtml(data: ReportPdfData): void {
  const pagesHtml = buildReportHtmlPages(data)
  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  const combinedHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Financial Kundali Report — Kutumb Advisory</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          @media print {
            body { margin: 0; padding: 0; background: #ffffff; }
            .page-break { page-break-after: always; break-after: page; }
          }
          body { margin: 0; padding: 0; background: #eeeeee; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          .report-wrapper { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 20px 0; }
          @media print { .report-wrapper { padding: 0; gap: 0; } }
        </style>
      </head>
      <body>
        <div class="report-wrapper">
          ${pagesHtml.map((page, idx) => `<div class="${idx < pagesHtml.length - 1 ? "page-break" : ""}">${page}</div>`).join("")}
        </div>
        <script>
          window.onload = () => {
            setTimeout(() => {
              window.print();
            }, 500);
          };
        </script>
      </body>
    </html>
  `

  printWindow.document.write(combinedHtml)
  printWindow.document.close()
}
