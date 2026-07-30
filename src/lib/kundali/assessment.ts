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

// No existing function maps raw graha answers to scores — financial.ts only
// has generic finance formulas + a handful of helpers that take already
// derived booleans/ratios, not raw radio answers. This is the orchestration
// layer that turns Answer[] into an AssessmentResult, reusing the score/
// status vocabulary already defined in src/types/index.ts.

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

function optionScore(value: Answer["value"] | undefined, options: string[] | undefined): number {
  if (value === undefined || !options || options.length <= 1) return 5;
  const idx = typeof value === "string" ? options.indexOf(value) : -1;
  if (idx === -1) return 5;
  // First option is always the healthiest answer in this question bank —
  // idx 0 -> 10, last option -> 0.
  return Math.round((1 - idx / (options.length - 1)) * 10);
}

function scoreGraha(grahaId: GrahaId, answers: Record<string, Answer["value"]> | undefined): number {
  const graha = GRAHAS.find((g) => g.id === grahaId);
  if (!graha) return 0;
  const perQuestion = graha.questions.map((q) => optionScore(answers?.[q.id], q.options));
  const avg = perQuestion.reduce((sum, s) => sum + s, 0) / perQuestion.length;
  return Math.round(avg * 10) / 10;
}

function buildGrahaDetail(grahaId: GrahaId, answers: Record<string, Answer["value"]> | undefined): GrahaDetail {
  const graha = GRAHAS.find((g) => g.id === grahaId)!;
  const score = scoreGraha(grahaId, answers);
  const status = getScoreStatus(score);

  const perQuestionScores = graha.questions.map((q) => ({
    question: q,
    score: optionScore(answers?.[q.id], q.options),
    answer: answers?.[q.id],
  }));

  const weakest = [...perQuestionScores].sort((a, b) => a.score - b.score).slice(0, 2);
  const strongest = [...perQuestionScores].sort((a, b) => b.score - a.score).slice(0, 1);

  const observations: string[] = strongest
    .filter((s) => s.answer !== undefined)
    .map((s) => `${s.question.text} — ${s.answer}`);

  const suggestions: string[] = weakest
    .filter((s) => s.answer !== undefined && s.score < 8)
    .map((s) => `Revisit: ${s.question.text.replace(/\?$/, "")}.`);

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
    suggestions: suggestions.length ? suggestions : ["You're in good shape here — keep it up."],
    advisorNote: `Your ${graha.name} (${graha.subtitle}) score is ${score}/10 — ${status}. ${graha.emotion}`,
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
  const overallScore = Math.round(entries.reduce((sum, [, s]) => sum + s, 0) * 10) / 10;
  const overallStatus = getScoreStatus(overallScore / 9);

  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const strongestGraha = sorted[0]?.[0] ?? "surya";
  const weakestGraha = sorted[sorted.length - 1]?.[0] ?? "surya";

  const recommendations = sorted
    .slice(-3)
    .reverse()
    .map(([id]) => grahaDetails[id].suggestions[0])
    .filter((s): s is string => !!s);

  const actionPlan = sorted.slice(-3).reverse().map(([id], i) => ({
    id: `${id}-action`,
    grahaId: id,
    title: grahaDetails[id].suggestions[0] ?? `Improve ${id}`,
    description: grahaDetails[id].advisorNote,
    status: "not-started" as const,
    priority: (i === 0 ? "high" : i === 1 ? "medium" : "low") as "high" | "medium" | "low",
    category: GRAHAS.find((g) => g.id === id)?.subtitle ?? id,
  }));

  return {
    overallScore,
    overallStatus,
    grahaScores,
    grahaDetails,
    recommendations,
    advisorNotes: `Overall financial health score: ${overallScore}/90 (${profile.riskProfile} risk profile). Strongest area: ${strongestGraha}. Focus area: ${weakestGraha}.`,
    actionPlan,
    pdfReport: "",
    strongestGraha,
    weakestGraha,
  };
}

export function familyProfileQuestionCount(): number {
  return GRAHAS.reduce((sum, g) => sum + g.questions.length, 0);
}
