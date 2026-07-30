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
import type { FamilyProfile, Member, ActionItem, GrahaId } from "@/types";

const TOTAL_QUESTIONS = familyProfileQuestionCount();

const emptyMember: Member = { name: "", age: 0, relation: "spouse", occupation: "", income: 0 };

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
        setProfile({
          primaryMember: d.primary_member as unknown as Member,
          spouse: (d.spouse as unknown as Member) ?? undefined,
          children: (d.children as unknown as Member[]) ?? [],
          monthlyExpenses: d.monthly_expenses ?? 0,
          totalAssets: d.total_assets ?? 0,
          totalLiabilities: d.total_liabilities ?? 0,
          riskProfile: d.risk_profile ?? "moderate",
          goals: d.goals ?? [],
          existingInvestments: d.existing_investments ?? [],
          existingInsurance: d.existing_insurance ?? [],
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
      primary_member: profile.primaryMember as unknown as Json,
      spouse: (profile.spouse ?? null) as unknown as Json | null,
      children: profile.children as unknown as Json,
      monthly_expenses: profile.monthlyExpenses,
      total_assets: profile.totalAssets,
      total_liabilities: profile.totalLiabilities,
      risk_profile: profile.riskProfile,
      goals: profile.goals,
      existing_investments: profile.existingInvestments,
      existing_insurance: profile.existingInsurance,
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
                  <div className="grid gap-4 sm:grid-cols-3">
                    <AdminInput
                      label="Monthly Expenses (₹)"
                      name="monthlyExpenses"
                      type="number"
                      value={String(profile.monthlyExpenses)}
                      onChange={(e) =>
                        setProfile({ ...profile, monthlyExpenses: Number(e.target.value) })
                      }
                    />
                    <AdminInput
                      label="Total Assets (₹)"
                      name="totalAssets"
                      type="number"
                      value={String(profile.totalAssets)}
                      onChange={(e) =>
                        setProfile({ ...profile, totalAssets: Number(e.target.value) })
                      }
                    />
                    <AdminInput
                      label="Total Liabilities (₹)"
                      name="totalLiabilities"
                      type="number"
                      value={String(profile.totalLiabilities)}
                      onChange={(e) =>
                        setProfile({ ...profile, totalLiabilities: Number(e.target.value) })
                      }
                    />
                  </div>
                  <AdminSelect
                    label="Risk Profile"
                    name="riskProfile"
                    value={profile.riskProfile}
                    options={["conservative", "moderate", "aggressive"]}
                    onChange={(e) =>
                      setProfile({ ...profile, riskProfile: e.target.value as FamilyProfile["riskProfile"] })
                    }
                  />
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
                  <AdminTextarea
                    label="Existing Investments (comma separated)"
                    name="existingInvestments"
                    value={profile.existingInvestments.join(", ")}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        existingInvestments: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    rows={2}
                  />
                  <AdminTextarea
                    label="Existing Insurance (comma separated)"
                    name="existingInsurance"
                    value={profile.existingInsurance.join(", ")}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        existingInsurance: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    rows={2}
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
