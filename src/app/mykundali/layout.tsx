import { MykundaliAuthProvider } from "@/components/mykundali/AuthContext";

export default function MykundaliLayout({ children }: { children: React.ReactNode }) {
  return <MykundaliAuthProvider>{children}</MykundaliAuthProvider>;
}
