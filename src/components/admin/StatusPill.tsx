import type { LeadStatus } from "@/lib/admin-mock-data";

const statusStyles: Record<LeadStatus, string> = {
  new: "bg-gold/10 text-gold-dark",
  contacted: "bg-blue-50 text-blue-600",
  scheduled: "bg-emerald-50 text-emerald-600",
  closed: "bg-stone/10 text-stone/60",
};

export default function StatusPill({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${statusStyles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
      {status}
    </span>
  );
}
