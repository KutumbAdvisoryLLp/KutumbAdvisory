import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

const dummyClient = new Proxy({}, {
  get(target, prop) {
    if (prop === "auth") {
      return {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
      };
    }
    const chain = () => new Proxy({}, {
      get(t, p) {
        if (p === "then") {
          return (resolve: any) => resolve({ data: [], error: null, count: 0 });
        }
        return chain;
      }
    });
    return chain;
  }
}) as any;

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return dummyClient;
  }

  return createBrowserClient<Database>(url, anonKey);
}
