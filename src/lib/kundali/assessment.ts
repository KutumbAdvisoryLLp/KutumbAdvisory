import { GRAHAS } from "./grahas";
import { calculators as toolkitCalculators } from "./toolkit";
import { getScoreStatus } from "@/types";
import type {
  GrahaId,
  FamilyProfile,
  Answer,
  AssessmentResult,
  GrahaDetail,
  Calculator,
  Resource,
} from "@/types";

// Orchestration layer: turns Answer[] into AssessmentResult using a binary
// (Yes/No) scoring model. Each question scores 10 (healthy) or 0 (weak).

export type GrahaAnswerMap = Partial<Record<GrahaId, Record<string, Answer["value"]>>>;

const RECOMMENDED_CALCULATOR_IDS: Record<GrahaId, string[]> = {
  surya: ["future-value", "goal-planner"],
  chandra: ["emergency-fund"],
  mangal: ["life-insurance", "health-insurance"],
  budh: ["net-worth"],
  guru: ["sip", "lumpsum"],
  shukra: ["net-worth"],
  shani: ["retirement-corpus", "retirement-gap"],
  rahu: ["emi", "loan-prepayment"],
  ketu: ["net-worth"],
};

function calculatorsFor(grahaId: GrahaId): Calculator[] {
  const ids = RECOMMENDED_CALCULATOR_IDS[grahaId] ?? [];
  return ids
    .map((id) => toolkitCalculators.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => !!c)
    .map((c) => ({ name: c.title, description: c.description, grahaId }));
}

// ────── Curated recommendation maps ──────
// Each map is keyed by question ID; the value is the actionable recommendation
// shown when the user's answer indicates weakness.

const RECOMMENDATIONS: Record<string, string> = {
  // Surya — Income & Earning Power
  s1: "Build a second income stream through freelancing, rental income, or a side business.",
  s2: "Explore ways to grow your income — negotiate raises, upskill, or seek higher-value opportunities.",
  s3: "Create a contingency plan: build 6-month expenses in an emergency fund and consider income protection insurance.",
  s4: "Reduce single-source dependency by diversifying your income — even a small side income adds resilience.",
  s5: "Invest in yourself — courses, certifications, or new skills that increase your future earning potential.",

  // Chandra — Emergency & Financial Peace
  c1: "Start building an emergency fund today — even ₹5,000/month in a liquid fund is a great first step.",
  c2: "Aim to save at least 6 months of household expenses in a readily accessible account.",
  c3: "Strengthen your safety net — target 12 months of expenses for true financial peace.",
  c4: "Always keep 1–3 months of expenses in savings/liquid funds for immediate access.",
  c5: "Break the emergency-loan cycle — prioritise building a dedicated crisis fund before new investments.",

  // Mangal — Protection & Insurance
  m1: "Get adequate life insurance — pure term plans offer the best cover at lowest cost (target 10× annual income).",
  m2: "Ensure your family has comprehensive health insurance with at least ₹10 lakh sum insured.",
  m3: "Add a personal accident cover — it's affordable and covers disability, a risk health insurance doesn't.",
  m4: "Consider a critical illness rider or standalone policy — treatment costs can be devastating without one.",
  m5: "Review all insurance policies annually to keep pace with inflation, life changes, and family needs.",

  // Budh — Financial Discipline
  b1: "Start a simple monthly budget — even a basic income-vs-expenses tracker creates awareness.",
  b2: "Track household expenses weekly using an app or spreadsheet to identify leaks.",
  b3: "Reduce debt to below 30% of income — list all loans and create a payoff plan starting with the highest-interest one.",
  b4: "Adopt the 'pay yourself first' rule — automate savings before spending.",
  b5: "Pause before major purchases — create a 48-hour cooling-off rule for any spending above ₹10,000.",

  // Guru — Wealth Creation
  g1: "Link every investment to a specific financial goal (e.g., child's education, retirement).",
  g2: "Start a monthly SIP — even ₹5,000/month in a diversified equity fund compounds powerfully over time.",
  g3: "Diversify across equity, debt, gold, and real estate — don't put all eggs in one basket.",
  g4: "Review your portfolio returns vs. inflation — switch to growth-oriented assets if falling behind.",
  g5: "Create a written long-term wealth strategy with clear milestones for 5, 10, and 20 years.",

  // Shukra — Lifestyle & Happiness
  sk1: "Take small steps to reduce financial stress — automate bills, build a buffer fund, and simplify finances.",
  sk2: "Budget for vacations as a line item — guilt-free spending on experiences boosts family well-being.",
  sk3: "Review lifestyle inflation — ensure your lifestyle costs grow slower than your income.",
  sk4: "Implement a 'wait-before-you-buy' rule to curb impulse and status-driven spending.",
  sk5: "Create a Family Happiness Fund — a dedicated monthly savings pot for experiences and celebrations.",

  // Shani — Retirement & Dignity
  sn1: "Calculate your retirement corpus using the 25× annual expenses rule — know your number.",
  sn2: "Start investing consistently for retirement — NPS, PPF, and equity SIPs are excellent vehicles.",
  sn3: "Identify the gap between what you'll need and what you currently have — this is your retirement gap.",
  sn4: "Project your retirement income from all sources — pension, investments, rental — and compare with expenses.",
  sn5: "Plan for post-retirement healthcare — a super top-up health plan or dedicated health corpus is essential.",

  // Rahu — Financial Risk
  r1: "Steer clear of get-rich-quick schemes — if returns sound too good to be true, they are.",
  r2: "Never invest in something you don't understand — take time to learn before committing money.",
  r3: "Separate emotions from money decisions — create a written investment policy to follow during volatility.",
  r4: "Engage a qualified financial advisor for a professional review of your finances at least once a year.",
  r5: "Get a risk profiling assessment done and realign your portfolio to match your actual risk tolerance.",
  r6: "Learn about inflation — inflation erodes purchasing power, so your investments must outpace it.",
  r7: "Understand market risk — knowing the volatility and risk level of your investments protects your wealth.",

  // Ketu — Legacy & Succession
  k1: "Draft and register your Will immediately — it's the most important legacy document.",
  k2: "Update nominations on every bank account, insurance policy, mutual fund, and demat account.",
  k3: "Create a master document listing all assets, accounts, and access details — share it with your family.",
  k4: "Document a clear succession plan for business assets, property, and investments.",
  k5: "Hold a family financial meeting to discuss legacy intentions — clarity now prevents conflict later.",
};

// Positive observations shown when the user answered strongly.
const POSITIVE_OBSERVATIONS: Record<string, string> = {
  s1: "Multiple income streams provide excellent financial resilience.",
  s2: "Consistent income growth shows strong earning momentum.",
  s3: "Having a contingency plan for income loss is a sign of mature financial planning.",
  s4: "Income is well-diversified, reducing single-point-of-failure risk.",
  s5: "Recent skill development investment shows commitment to future earning power.",

  c1: "Emergency fund is in place — great foundation for financial peace.",
  c2: "Family can survive 6 months without income — strong safety net.",
  c3: "12-month survival capability is exceptional financial resilience.",
  c4: "Maintaining liquid savings shows excellent financial discipline.",
  c5: "No emergency loans taken — the family handles crises from its own reserves.",

  m1: "Adequate life insurance is in force — family is well protected.",
  m2: "Comprehensive family health coverage is a critical strength.",
  m3: "Personal accident cover adds an important layer of protection.",
  m4: "Critical illness protection guards against catastrophic healthcare costs.",
  m5: "Annual coverage review ensures insurance keeps pace with life changes.",

  b1: "Monthly budgeting shows strong financial discipline.",
  b2: "Regular expense tracking enables informed financial decisions.",
  b3: "Debt is well under control — excellent financial health indicator.",
  b4: "Following a save-first approach is the hallmark of wealth builders.",
  b5: "Careful review of major decisions prevents costly financial mistakes.",

  g1: "Goal-linked investments give purpose and direction to wealth creation.",
  g2: "Systematic investing (SIP) harnesses the power of compounding.",
  g3: "Portfolio diversification reduces risk and smooths returns.",
  g4: "Investments beating inflation means real wealth is growing.",
  g5: "A long-term wealth strategy provides a clear roadmap to prosperity.",

  sk1: "Living without constant financial stress enables better life decisions.",
  sk2: "Budgeted vacations ensure the family enjoys life guilt-free.",
  sk3: "Lifestyle expenses under control means more money working for the future.",
  sk4: "Avoiding impulse spending preserves capital for meaningful goals.",
  sk5: "A Family Happiness Fund is a wonderful commitment to family well-being.",

  sn1: "Retirement corpus is calculated — you know your target number.",
  sn2: "Regular retirement investing puts you on track for a dignified sunset.",
  sn3: "Retirement gap identified — awareness is the first step to closing it.",
  sn4: "Projected retirement income is sufficient — excellent forward planning.",
  sn5: "Healthcare costs planned for retirement reduces future financial stress.",

  r1: "Avoiding get-rich-quick schemes shows mature financial judgement.",
  r2: "Understanding every investment made is a key risk management strength.",
  r3: "Avoiding emotional financial decisions leads to better long-term outcomes.",
  r4: "Regular professional guidance keeps finances optimised and on track.",
  r5: "Portfolio aligned to risk profile means risk is managed intentionally.",
  r6: "Awareness of inflation ensures your portfolio aims for real growth.",
  r7: "Understanding market risk helps maintain a balanced, resilient portfolio.",

  k1: "A valid, updated Will ensures wishes are honoured and family is protected.",
  k2: "Updated nominations across all assets prevents legal complications.",
  k3: "Family awareness of asset details ensures smooth succession.",
  k4: "A clear succession plan provides certainty for the next generation.",
  k5: "Legacy discussions held with family build trust and alignment.",
};

// ────── Part B: 10-Mark Financial Foundation Calculator ──────

export function computeFoundationScore(profile: FamilyProfile) {
  const goalsCount = (profile.goals ?? []).filter((g) => g && g.trim()).length;
  const goalsScore = goalsCount >= 2 ? 2 : goalsCount === 1 ? 1 : 0;

  const hasGoalHorizon = Object.values(profile.goalTimeHorizons ?? {}).some((h) => h && h.trim());
  const timeHorizonScore = hasGoalHorizon || (profile.timeHorizon && profile.timeHorizon.trim()) ? 1 : 0;
  const expensesScore = (profile.monthlyExpenses ?? 0) > 0 ? 1 : 0;

  const insCount = (profile.existingInsurance ?? []).length;
  const insuranceScore = insCount > 0 ? 1 : 0;

  const worksheetAssets = profile.netWorthWorksheet?.assets;
  const investmentAssetsValue =
    (worksheetAssets?.mutualFunds ?? 0) + (worksheetAssets?.shares ?? 0) + (worksheetAssets?.gold ?? 0) + (worksheetAssets?.epfPpfNps ?? 0);
  const investmentsScore = investmentAssetsValue > 0 || (profile.existingInvestments ?? []).length > 0 ? 1 : 0;

  const assets = profile.totalAssets ?? 0;
  const assetsScore = assets >= 100000 ? 2 : assets > 0 ? 1 : 0;

  const liabilities = profile.totalLiabilities ?? 0;
  let liabilitiesScore = 2;
  if (assets === 0 && liabilities > 0) {
    liabilitiesScore = 0;
  } else if (assets > 0 && liabilities / assets > 0.6) {
    liabilitiesScore = 0;
  } else if (liabilities > 0 && assets > 0 && liabilities / assets > 0.3) {
    liabilitiesScore = 1;
  }

  const foundationScore =
    goalsScore +
    timeHorizonScore +
    expensesScore +
    insuranceScore +
    investmentsScore +
    assetsScore +
    liabilitiesScore;

  return {
    score: Math.min(10, foundationScore),
    breakdown: {
      goals: goalsScore,
      timeHorizon: timeHorizonScore,
      monthlyExpenses: expensesScore,
      insurance: insuranceScore,
      investments: investmentsScore,
      assets: assetsScore,
      liabilities: liabilitiesScore,
    },
  };
}

// ────── Binary scoring ──────

function optionScore(
  value: Answer["value"] | undefined,
  options: string[] | undefined,
  reverseScore?: boolean
): number {
  if (value === undefined) return 5; // neutral for unanswered
  // Yes/No/Don't Know binary-style scoring — "Don't Know" is always neutral,
  // it isn't a weakness, the person just hasn't checked yet.
  if (value === "Don't Know") return 5;
  if (options && (options.length === 2 || options.length === 3) && options.includes("Yes") && options.includes("No")) {
    const isYes = value === "Yes";
    return reverseScore ? (isYes ? 0 : 10) : (isYes ? 10 : 0);
  }
  // Legacy multi-option scoring (kept for backward compatibility)
  if (!options || options.length <= 1) return 5;
  const idx = typeof value === "string" ? options.indexOf(value) : -1;
  if (idx === -1) return 5;
  const healthyIdx = reverseScore ? options.length - 1 - idx : idx;
  return Math.round((1 - healthyIdx / (options.length - 1)) * 10);
}

function scoreGraha(grahaId: GrahaId, answers: Record<string, Answer["value"]> | undefined): number {
  const graha = GRAHAS.find((g) => g.id === grahaId);
  if (!graha) return 0;
  const perQuestion = graha.questions.map((q) => optionScore(answers?.[q.id], q.options, q.reverseScore));
  const avg = perQuestion.reduce((sum, s) => sum + s, 0) / perQuestion.length;
  return Math.round(avg * 10) / 10;
}

function buildGrahaDetail(grahaId: GrahaId, answers: Record<string, Answer["value"]> | undefined): GrahaDetail {
  const graha = GRAHAS.find((g) => g.id === grahaId)!;
  const score = scoreGraha(grahaId, answers);
  const status = getScoreStatus(score, 10);

  const perQuestionScores = graha.questions.map((q) => ({
    question: q,
    score: optionScore(answers?.[q.id], q.options, q.reverseScore),
    answer: answers?.[q.id],
  }));

  // Observations: strong areas (score = 10)
  const observations: string[] = perQuestionScores
    .filter((s) => s.answer !== undefined && s.score >= 10)
    .map((s) => POSITIVE_OBSERVATIONS[s.question.id] ?? `${s.question.text} — ${s.answer}`)
    .slice(0, 3);

  // Suggestions: weak areas (score = 0) — use curated recommendations
  const suggestions: string[] = perQuestionScores
    .filter((s) => s.answer !== undefined && s.score === 0)
    .map((s) => RECOMMENDATIONS[s.question.id] ?? `Revisit: ${s.question.text.replace(/\?$/, "")}.`)
    .slice(0, 3);

  const resources: Resource[] = [];

  const progress = perQuestionScores.map((s) => ({
    label: s.question.text,
    value: Math.round((s.score / 10) * 100),
  }));

  return {
    id: grahaId,
    score,
    status,
    observations: observations.length ? observations : ["Not enough answers yet to generate observations."],
    suggestions: suggestions.length ? suggestions : ["You're in great shape here — keep it up!"],
    advisorNote: `Your ${graha.name} (${graha.subtitle}) score is ${score}/10 — ${status}. ${graha.emotion}.`,
    resources,
    calculators: calculatorsFor(grahaId),
    progress,
  };
}

export function computeAssessmentResult(
  profile: FamilyProfile,
  answers: GrahaAnswerMap
): AssessmentResult {
  const grahaScores = {} as Record<GrahaId, number>;
  const grahaDetails = {} as Record<GrahaId, GrahaDetail>;

  for (const graha of GRAHAS) {
    const grahaAnswers = answers[graha.id];
    grahaScores[graha.id] = scoreGraha(graha.id, grahaAnswers);
    grahaDetails[graha.id] = buildGrahaDetail(graha.id, grahaAnswers);
  }

  const entries = Object.entries(grahaScores) as [GrahaId, number][];
  const grahaTotal = Math.min(90, Math.round(entries.reduce((sum, [, s]) => sum + s, 0) * 10) / 10);
  const foundation = computeFoundationScore(profile);
  const overallScore = grahaTotal;
  const overallStatus = getScoreStatus(overallScore, 90);

  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const strongestGraha = sorted[0]?.[0] ?? "surya";
  const weakestGraha = sorted[sorted.length - 1]?.[0] ?? "surya";

  const recommendations = sorted
    .slice(-3)
    .reverse()
    .map(([id]) => grahaDetails[id].suggestions[0])
    .filter((s): s is string => !!s);

  // Weakest 6 grahas, weakest first — dashboard splits this into "Top
  // Priorities" (first 3) and "Actions to Take" (next 3).
  const actionPlan = sorted.slice(-6).reverse().map(([id], i) => ({
    id: `${id}-action`,
    grahaId: id,
    title: grahaDetails[id].suggestions[0] ?? `Improve ${id}`,
    description: grahaDetails[id].advisorNote,
    status: "not-started" as const,
    priority: (i === 0 ? "high" : i <= 2 ? "medium" : "low") as "high" | "medium" | "low",
    category: GRAHAS.find((g) => g.id === id)?.subtitle ?? id,
  }));

  return {
    overallScore,
    overallStatus,
    grahaTotal,
    foundationScore: foundation.score,
    foundationBreakdown: foundation.breakdown,
    grahaScores,
    grahaDetails,
    recommendations,
    advisorNotes: `Overall Financial Kundali Score: ${overallScore}/90. Risk Profile: ${profile.riskProfile}. Strongest area: ${strongestGraha}. Focus area: ${weakestGraha}.`,
    actionPlan,
    strongestGraha,
    weakestGraha,
  };
}

export function familyProfileQuestionCount(): number {
  return GRAHAS.reduce((sum, g) => sum + g.questions.length, 0);
}
