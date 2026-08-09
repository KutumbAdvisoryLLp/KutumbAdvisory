"use client";

import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Json } from "@/lib/supabase/types";
import { useToast } from "@/components/admin/ToastContext";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { AdminInput, AdminTextarea, AdminSelect } from "@/components/admin/FormControls";
import { CloseIcon } from "@/components/icons/admin";
import { GRAHA_IDS } from "@/types";
import { familyProfileQuestionCount } from "@/lib/kundali/assessment";
import type { CustomerListItem } from "@/app/admin/customers/page";
import type { FamilyProfile, Member, ActionItem, GrahaId, InvestmentEntry, InsuranceEntry } from "@/types";

const TOTAL_QUESTIONS = familyProfileQuestionCount();

const emptyMember: Member = { name: "", age: 0, relation: "spouse", occupation: "", income: 0 };
const emptyInvestment: InvestmentEntry = { type: "Mutual Fund", amount: 0 };
const emptyInsurance: InsuranceEntry = { type: "Term Life", sumInsured: 0, premium: 0, paymentMode: "Annual" };
const investmentTypes = ["Mutual Fund", "Stocks", "FD", "PPF", "Real Estate", "Gold", "Other"];
const insuranceTypes = ["Term Life", "Health", "Critical Illness", "Accident", "Other"];
const paymentModes: InsuranceEntry["paymentMode"][] = ["Monthly", "Quarterly", "Half-Yearly", "Annual"];

const rowInputClass =
  "w-full rounded-lg border border-navy/10 bg-white px-3 py-2 text-sm text-navy outline-none transition-all duration-300 focus:border-gold/30";

function InvestmentRows({
  entries,
  onChange,
}: {
  entries: InvestmentEntry[];
  onChange: (entries: InvestmentEntry[]) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-stone/40">Existing Investments</p>
        <button
          type="button"
          onClick={() => onChange([...entries, { ...emptyInvestment }])}
          className="text-xs text-gold hover:text-gold/70"
        >
          + Add Investment
        </button>
      </div>
      <div className="space-y-2">
        {entries.map((inv, i) => (
          <div key={i} className="grid grid-cols-[1.3fr_1fr_1fr_auto] gap-2">
            <select
              value={inv.type}
              onChange={(e) => {
                const c = [...entries];
                c[i] = { ...c[i], type: e.target.value };
                onChange(c);
              }}
              className={rowInputClass}
            >
              {investmentTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <input
              type="number"
              value={inv.amount || ""}
              placeholder="Amount"
              onChange={(e) => {
                const c = [...entries];
                c[i] = { ...c[i], amount: Number(e.target.value) };
                onChange(c);
              }}
              className={rowInputClass}
            />
            <input
              type="number"
              value={inv.currentValue || ""}
              placeholder="Current value"
              onChange={(e) => {
                const c = [...entries];
                c[i] = { ...c[i], currentValue: Number(e.target.value) };
                onChange(c);
              }}
              className={rowInputClass}
            />
            <button type="button" onClick={() => onChange(entries.filter((_, j) => j !== i))} className="text-stone/40 hover:text-error">
              <CloseIcon size={14} />
            </button>
          </div>
        ))}
        {entries.length === 0 && <p className="text-sm text-stone/40">No investments on file.</p>}
      </div>
    </div>
  );
}

function InsuranceRows({
  entries,
  onChange,
}: {
  entries: InsuranceEntry[];
  onChange: (entries: InsuranceEntry[]) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-stone/40">Existing Insurance</p>
        <button
          type="button"
          onClick={() => onChange([...entries, { ...emptyInsurance }])}
          className="text-xs text-gold hover:text-gold/70"
        >
          + Add Insurance
        </button>
      </div>
      <div className="space-y-2">
        {entries.map((ins, i) => (
          <div key={i} className="grid grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-2">
            <select
              value={ins.type}
              onChange={(e) => {
                const c = [...entries];
                c[i] = { ...c[i], type: e.target.value };
                onChange(c);
              }}
              className={rowInputClass}
            >
              {insuranceTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <input
              type="number"
              value={ins.sumInsured || ""}
              placeholder="Sum insured"
              onChange={(e) => {
                const c = [...entries];
                c[i] = { ...c[i], sumInsured: Number(e.target.value) };
                onChange(c);
              }}
              className={rowInputClass}
            />
            <input
              type="number"
              value={ins.premium || ""}
              placeholder="Premium"
              onChange={(e) => {
                const c = [...entries];
                c[i] = { ...c[i], premium: Number(e.target.value) };
                onChange(c);
              }}
              className={rowInputClass}
            />
            <select
              value={ins.paymentMode}
              onChange={(e) => {
                const c = [...entries];
                c[i] = { ...c[i], paymentMode: e.target.value as InsuranceEntry["paymentMode"] };
                onChange(c);
              }}
              className={rowInputClass}
            >
              {paymentModes.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <button type="button" onClick={() => onChange(entries.filter((_, j) => j !== i))} className="text-stone/40 hover:text-error">
              <CloseIcon size={14} />
            </button>
          </div>
        ))}
        {entries.length === 0 && <p className="text-sm text-stone/40">No insurance on file.</p>}
      </div>
    </div>
  );
}

function MemberFields({
  label,
  member,
  onChange,
}: {
  label: string;
  member: Member;
  onChange: (m: Member) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <AdminInput
        label={`${label} Name`}
        name={`${label}-name`}
        value={member.name}
        onChange={(e) => onChange({ ...member, name: e.target.value })}
      />
      <AdminInput
        label={`${label} Age`}
        name={`${label}-age`}
        type="number"
        value={String(member.age)}
        onChange={(e) => onChange({ ...member, age: Number(e.target.value) })}
      />
      <AdminInput
        label={`${label} Occupation`}
        name={`${label}-occupation`}
        value={member.occupation ?? ""}
        onChange={(e) => onChange({ ...member, occupation: e.target.value })}
      />
      <AdminInput
        label={`${label} Annual Income`}
        name={`${label}-income`}
        type="number"
        value={String(member.income ?? 0)}
        onChange={(e) => onChange({ ...member, income: Number(e.target.value) })}
      />
    </div>
  );
}

export default function CustomerDetailModal({
  customer,
  onClose,
}: {
  customer: CustomerListItem | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {customer && <ModalContent key={customer.id} customer={customer} onClose={onClose} />}
    </AnimatePresence>
  );
}

function ModalContent({
  customer,
  onClose,
}: {
  customer: CustomerListItem;
  onClose: () => void;
}) {
  const supabase = useMemo(() => createClient(), []);
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<FamilyProfile | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);

  const [overallScore, setOverallScore] = useState(0);
  const [overallStatus, setOverallStatus] = useState<"excellent" | "good" | "fair" | "poor">("fair");
  const [grahaScores, setGrahaScores] = useState<Record<GrahaId, number>>({} as Record<GrahaId, number>);
  const [recommendations, setRecommendations] = useState("");
  const [advisorNotes, setAdvisorNotes] = useState("");
  const [actionPlan, setActionPlan] = useState<ActionItem[]>([]);
  const [hasResult, setHasResult] = useState(false);
  const [confirmSaveResult, setConfirmSaveResult] = useState(false);

  useEffect(() => {
    (async () => {
      const [profileRes, resultRes, answersRes] = await Promise.all([
        supabase.from("family_profiles").select("*").eq("customer_id", customer.id).maybeSingle(),
        supabase.from("assessment_results").select("*").eq("customer_id", customer.id).maybeSingle(),
        supabase
          .from("assessment_answers")
          .select("question_id", { count: "exact", head: true })
          .eq("customer_id", customer.id),
      ]);

      if (profileRes.data) {
        const d = profileRes.data;
        const pm = d.primary_member as any;
        setProfile({
          primaryMember: {
            name: pm?.name ?? '',
            age: pm?.age ?? 0,
            relation: pm?.relation ?? 'self',
            occupation: pm?.occupation ?? '',
            income: pm?.income ?? 0,
          },
          spouse: (d.spouse as unknown as Member) ?? undefined,
          children: (d.children as unknown as Member[]) ?? [],
          monthlyExpenses: d.monthly_expenses ?? 0,
          totalAssets: d.total_assets ?? 0,
          totalLiabilities: d.total_liabilities ?? 0,
          riskProfile: d.risk_profile ?? "moderate",
          goals: d.goals ?? [],
          existingInvestments: (d.existing_investments as unknown as InvestmentEntry[]) ?? [],
          existingInsurance: (d.existing_insurance as unknown as InsuranceEntry[]) ?? [],
          familyName: pm?.familyName ?? '',
          timeHorizon: pm?.timeHorizon ?? '',
          netWorthWorksheet: pm?.netWorthWorksheet ?? {
            assets: { bankFD: 0, mutualFunds: 0, shares: 0, property: 0, gold: 0, epfPpfNps: 0 },
            liabilities: { homeLoan: 0, personalLoan: 0, vehicleLoan: 0, creditCard: 0, otherLoans: 0 }
          },
        });
      }

      if (resultRes.data) {
        const r = resultRes.data;
        setHasResult(true);
        setOverallScore(r.overall_score);
        setOverallStatus(r.overall_status);
        setGrahaScores(r.graha_scores as unknown as Record<GrahaId, number>);
        setRecommendations((r.recommendations ?? []).join("\n"));
        setAdvisorNotes(r.advisor_notes ?? "");
        setActionPlan((r.action_plan as unknown as ActionItem[]) ?? []);
      }

      setAnsweredCount(answersRes.count ?? 0);
      setLoading(false);
    })();
  }, [customer.id, supabase]);

  const saveProfile = async () => {
    if (!profile) return;
    const { error } = await supabase.from("family_profiles").upsert({
      customer_id: customer.id,
      primary_member: {
        ...profile.primaryMember,
        familyName: profile.familyName,
        timeHorizon: profile.timeHorizon,
        netWorthWorksheet: profile.netWorthWorksheet,
      } as unknown as Json,
      spouse: (profile.spouse ?? null) as unknown as Json | null,
      children: profile.children as unknown as Json,
      monthly_expenses: profile.monthlyExpenses,
      total_assets: profile.totalAssets,
      total_liabilities: profile.totalLiabilities,
      risk_profile: profile.riskProfile,
      goals: profile.goals,
      existing_investments: profile.existingInvestments as unknown as Json,
      existing_insurance: profile.existingInsurance as unknown as Json,
    });
    showToast(error ? "Could not save family profile" : "Family profile saved");
  };

  const saveResult = async () => {
    setConfirmSaveResult(false);
    const { error } = await supabase
      .from("assessment_results")
      .update({
        overall_score: overallScore,
        overall_status: overallStatus,
        graha_scores: grahaScores,
        recommendations: recommendations.split("\n").map((s) => s.trim()).filter(Boolean),
        advisor_notes: advisorNotes,
        action_plan: actionPlan as unknown as Json,
      })
      .eq("customer_id", customer.id);
    showToast(error ? "Could not save assessment result" : "Assessment result saved");
  };

  const updateActionItem = (id: string, patch: Partial<ActionItem>) => {
    setActionPlan((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
    >
      <motion.div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(32,27,98,0.2)] sm:p-10"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-lg bg-ivory"
        >
          <CloseIcon size={16} className="text-navy" />
        </button>

        <div className="pr-10">
          <h3 className="font-serif text-2xl text-navy">{customer.fullName}</h3>
          <p className="mt-1 text-sm text-stone/50">
            {customer.email} &middot; {customer.phone || "—"}
          </p>
        </div>

        {loading ? (
          <p className="mt-10 text-sm text-stone/50">Loading…</p>
        ) : (
          <div className="mt-8 space-y-8">
            {/* Family Profile */}
            <section>
              <h4 className="font-serif text-xl text-navy">Family Profile</h4>
              {!profile ? (
                <p className="mt-3 text-sm text-stone/50">
                  This customer hasn&apos;t started their family profile yet.
                </p>
              ) : (
                <div className="mt-4 space-y-5 rounded-xl border border-navy/8 p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <AdminInput
                      label="Family Name"
                      name="familyName"
                      value={profile.familyName ?? ""}
                      onChange={(e) =>
                        setProfile({ ...profile, familyName: e.target.value })
                      }
                    />
                    <AdminInput
                      label="Time Horizon"
                      name="timeHorizon"
                      value={profile.timeHorizon ?? ""}
                      onChange={(e) =>
                        setProfile({ ...profile, timeHorizon: e.target.value })
                      }
                    />
                  </div>
                  <MemberFields
                    label="Primary Member"
                    member={profile.primaryMember}
                    onChange={(m) => setProfile({ ...profile, primaryMember: m })}
                  />
                  <MemberFields
                    label="Spouse"
                    member={profile.spouse ?? emptyMember}
                    onChange={(m) => setProfile({ ...profile, spouse: m })}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <AdminInput
                      label="Monthly Expenses (₹)"
                      name="monthlyExpenses"
                      type="number"
                      value={String(profile.monthlyExpenses)}
                      onChange={(e) =>
                        setProfile({ ...profile, monthlyExpenses: Number(e.target.value) })
                      }
                    />
                    <AdminSelect
                      label="Risk Profile"
                      name="riskProfile"
                      value={profile.riskProfile}
                      options={["conservative", "moderate", "aggressive"]}
                      onChange={(e) =>
                        setProfile({ ...profile, riskProfile: e.target.value as FamilyProfile["riskProfile"] })
                      }
                    />
                  </div>

                  {/* Net Worth Worksheet section in Admin Panel */}
                  <div className="rounded-lg border border-navy/10 p-4 space-y-4">
                    <h5 className="font-serif text-md text-navy font-semibold">Net Worth Worksheet</h5>
                    
                    <div className="grid gap-6 sm:grid-cols-2">
                      {/* Assets */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-stone/40">Assets</p>
                        {[
                          { key: 'bankFD', label: 'Bank & FD' },
                          { key: 'mutualFunds', label: 'Mutual Funds' },
                          { key: 'shares', label: 'Shares' },
                          { key: 'property', label: 'Property' },
                          { key: 'gold', label: 'Gold' },
                          { key: 'epfPpfNps', label: 'EPF / PPF / NPS' }
                        ].map(({ key, label }) => {
                          const worksheet = profile.netWorthWorksheet || {
                            assets: { bankFD: 0, mutualFunds: 0, shares: 0, property: 0, gold: 0, epfPpfNps: 0 },
                            liabilities: { homeLoan: 0, personalLoan: 0, vehicleLoan: 0, creditCard: 0, otherLoans: 0 }
                          }
                          const val = (worksheet.assets as any)[key] || 0
                          return (
                            <div key={key} className="flex items-center justify-between gap-3 text-sm">
                              <span className="text-stone">{label}</span>
                              <input
                                type="number"
                                value={val || ""}
                                onChange={(e) => {
                                  const nextVal = Number(e.target.value)
                                  const nextAssets = { ...worksheet.assets, [key]: nextVal }
                                  const totalAssets = Object.values(nextAssets).reduce((sum: number, v: any) => sum + (Number(v) || 0), 0) as number
                                  setProfile({
                                    ...profile,
                                    totalAssets,
                                    netWorthWorksheet: {
                                      assets: nextAssets as any,
                                      liabilities: worksheet.liabilities
                                    }
                                  })
                                }}
                                className="w-40 rounded-lg border border-navy/10 bg-white px-2 py-1 text-sm text-navy outline-none"
                              />
                            </div>
                          )
                        })}
                        <div className="pt-2 border-t flex justify-between font-semibold text-sm">
                          <span>Total Assets</span>
                          <span>₹{profile.totalAssets.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Liabilities */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-stone/40">Liabilities</p>
                        {[
                          { key: 'homeLoan', label: 'Home Loan' },
                          { key: 'personalLoan', label: 'Personal Loan' },
                          { key: 'vehicleLoan', label: 'Vehicle Loan' },
                          { key: 'creditCard', label: 'Credit Card' },
                          { key: 'otherLoans', label: 'Other Loans' }
                        ].map(({ key, label }) => {
                          const worksheet = profile.netWorthWorksheet || {
                            assets: { bankFD: 0, mutualFunds: 0, shares: 0, property: 0, gold: 0, epfPpfNps: 0 },
                            liabilities: { homeLoan: 0, personalLoan: 0, vehicleLoan: 0, creditCard: 0, otherLoans: 0 }
                          }
                          const val = (worksheet.liabilities as any)[key] || 0
                          return (
                            <div key={key} className="flex items-center justify-between gap-3 text-sm">
                              <span className="text-stone">{label}</span>
                              <input
                                type="number"
                                value={val || ""}
                                onChange={(e) => {
                                  const nextVal = Number(e.target.value)
                                  const nextLiabilities = { ...worksheet.liabilities, [key]: nextVal }
                                  const totalLiabilities = Object.values(nextLiabilities).reduce((sum: number, v: any) => sum + (Number(v) || 0), 0) as number
                                  setProfile({
                                    ...profile,
                                    totalLiabilities,
                                    netWorthWorksheet: {
                                      assets: worksheet.assets,
                                      liabilities: nextLiabilities as any
                                    }
                                  })
                                }}
                                className="w-40 rounded-lg border border-navy/10 bg-white px-2 py-1 text-sm text-navy outline-none"
                              />
                            </div>
                          )
                        })}
                        <div className="pt-2 border-t flex justify-between font-semibold text-sm">
                          <span>Total Liabilities</span>
                          <span>₹{profile.totalLiabilities.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t flex justify-between font-bold text-navy text-sm bg-stone/5 p-2 rounded-lg">
                      <span>Net Worth (Assets — Liabilities)</span>
                      <span>₹{(profile.totalAssets - profile.totalLiabilities).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <AdminTextarea
                    label="Goals (comma separated)"
                    name="goals"
                    value={profile.goals.join(", ")}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        goals: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    rows={2}
                  />
                  <InvestmentRows
                    entries={profile.existingInvestments}
                    onChange={(existingInvestments) => setProfile({ ...profile, existingInvestments })}
                  />
                  <InsuranceRows
                    entries={profile.existingInsurance}
                    onChange={(existingInsurance) => setProfile({ ...profile, existingInsurance })}
                  />
                  <button
                    type="button"
                    onClick={saveProfile}
                    className="rounded-xl bg-navy px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-navy/90"
                  >
                    Save Family Profile
                  </button>
                </div>
              )}
            </section>

            {/* Assessment */}
            <section>
              <h4 className="font-serif text-xl text-navy">Financial Kundali Assessment</h4>
              {!hasResult ? (
                <p className="mt-3 text-sm text-stone/50">
                  Assessment in progress — {answeredCount} of {TOTAL_QUESTIONS} questions answered.
                </p>
              ) : (
                <div className="mt-4 space-y-5 rounded-xl border border-navy/8 p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <AdminInput
                      label="Overall Score (/90)"
                      name="overallScore"
                      type="number"
                      value={String(overallScore)}
                      onChange={(e) => setOverallScore(Number(e.target.value))}
                    />
                    <AdminSelect
                      label="Overall Status"
                      name="overallStatus"
                      value={overallStatus}
                      options={["excellent", "good", "fair", "poor"]}
                      onChange={(e) =>
                        setOverallStatus(e.target.value as typeof overallStatus)
                      }
                    />
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-stone/40">
                      Graha Scores (/10)
                    </p>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                      {GRAHA_IDS.map((id) => (
                        <AdminInput
                          key={id}
                          label={id}
                          name={id}
                          type="number"
                          value={String(grahaScores[id] ?? 0)}
                          onChange={(e) =>
                            setGrahaScores((prev) => ({ ...prev, [id]: Number(e.target.value) }))
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <AdminTextarea
                    label="Recommendations (one per line)"
                    name="recommendations"
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    rows={3}
                  />
                  <AdminTextarea
                    label="Advisor Notes"
                    name="advisorNotes"
                    value={advisorNotes}
                    onChange={(e) => setAdvisorNotes(e.target.value)}
                    rows={3}
                  />

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-stone/40">
                      Action Plan
                    </p>
                    <div className="space-y-3">
                      {actionPlan.map((item) => (
                        <div key={item.id} className="rounded-lg border border-navy/8 p-3">
                          <AdminInput
                            label="Title"
                            name={`${item.id}-title`}
                            value={item.title}
                            onChange={(e) => updateActionItem(item.id, { title: e.target.value })}
                          />
                          <div className="mt-3">
                            <AdminSelect
                              label="Status"
                              name={`${item.id}-status`}
                              value={item.status}
                              options={["not-started", "in-progress", "completed"]}
                              onChange={(e) =>
                                updateActionItem(item.id, {
                                  status: e.target.value as ActionItem["status"],
                                })
                              }
                            />
                          </div>
                        </div>
                      ))}
                      {actionPlan.length === 0 && (
                        <p className="text-sm text-stone/50">No action items yet.</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setConfirmSaveResult(true)}
                    className="rounded-xl bg-navy px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-navy/90"
                  >
                    Save Assessment Result
                  </button>
                </div>
              )}
            </section>
          </div>
        )}

        <ConfirmDialog
          open={confirmSaveResult}
          title="Save changes to this assessment result?"
          description="You're editing a client's computed financial scores and action plan directly. This will overwrite what's currently stored for them."
          confirmLabel="Save Changes"
          danger
          onConfirm={saveResult}
          onCancel={() => setConfirmSaveResult(false)}
        />
      </motion.div>
    </motion.div>
  );
}
