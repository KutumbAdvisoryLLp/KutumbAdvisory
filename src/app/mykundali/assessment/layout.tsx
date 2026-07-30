import RequireAuth from "@/components/mykundali/RequireAuth";

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
