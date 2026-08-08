import { getSupabase } from './supabase';

// Fixed-window rate limiter backed by calton.rate_limits + calton.check_rate_limit()
// (see supabase/migrations/0002_calton_rate_limits.sql) — no external cache needed
// for this volume. Limits are generous on purpose; tune from calton.rate_limits
// once real traffic patterns are visible (see design.md - Risks / Trade-offs).
const LIMITS = {
  chat: { limit: 20, windowSeconds: 60 },
  'generate-brief': { limit: 10, windowSeconds: 60 },
  'capture-lead': { limit: 5, windowSeconds: 60 },
  'send-brief': { limit: 5, windowSeconds: 60 },
} as const;

export type RateLimitedRoute = keyof typeof LIMITS;

export async function checkRateLimit(ip: string, route: RateLimitedRoute): Promise<boolean> {
  const { limit, windowSeconds } = LIMITS[route];
  const key = `${route}:${ip}`;

  try {
    const { data, error } = await getSupabase().rpc('check_rate_limit', {
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });

    if (error) {
      console.error('[rate-limit] check failed, allowing request:', error);
      return true; // fail open — an outage here shouldn't take down the site
    }
    return data as boolean;
  } catch (err) {
    console.error('[rate-limit] unexpected error, allowing request:', err);
    return true;
  }
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? '0.0.0.0';
}
