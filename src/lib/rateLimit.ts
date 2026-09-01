import { createAdminClient } from "./supabase/admin-client";

// Rows older than this are pruned opportunistically on every check for the
// same key, so the table stays bounded without needing a separate cron job.
const STALE_ROW_RETENTION_MS = 24 * 60 * 60 * 1000;

export interface RateLimitResult {
  allowed: boolean;
  hitId?: string;
}

// DB-backed instead of in-memory — this runs on Vercel's serverless
// functions, where an in-memory counter would reset per cold start / be
// inconsistent across concurrent instances and give no real protection.
//
// Insert-then-count (rather than count-then-insert) narrows the race window
// for concurrent requests: two simultaneous calls can still both insert
// before either counts, but each one independently re-checks and removes
// its own hit if the count came out over the limit, self-correcting rather
// than silently allowing an unbounded burst.
//
// The returned hitId lets the caller release (delete) this specific hit if
// the operation it was gating turns out to fail for a reason that isn't the
// caller's fault (e.g. the email provider errors) — see releaseRateLimitHit.
export async function checkRateLimit(
  key: string,
  maxHits: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const admin = createAdminClient();

  // Fire-and-forget cleanup of this key's old rows — cheap, scoped only to
  // this key, never touches anything else.
  admin
    .from("rate_limit_hits")
    .delete()
    .eq("key", key)
    .lt("created_at", new Date(Date.now() - STALE_ROW_RETENTION_MS).toISOString())
    .then();

  const { data: inserted } = await admin.from("rate_limit_hits").insert({ key }).select("id").single();

  const since = new Date(Date.now() - windowSeconds * 1000).toISOString();
  const { count } = await admin
    .from("rate_limit_hits")
    .select("id", { count: "exact", head: true })
    .eq("key", key)
    .gte("created_at", since);

  if ((count ?? 0) > maxHits) {
    if (inserted) {
      await admin.from("rate_limit_hits").delete().eq("id", inserted.id);
    }
    return { allowed: false };
  }

  return { allowed: true, hitId: inserted?.id };
}

// Call this when the operation a rate-limit hit was gating turned out to
// fail for a reason that isn't the caller's fault (e.g. the email provider
// errored) — refunds their slot instead of punishing them for our failure.
export async function releaseRateLimitHit(hitId: string | undefined): Promise<void> {
  if (!hitId) return;
  const admin = createAdminClient();
  await admin.from("rate_limit_hits").delete().eq("id", hitId);
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
