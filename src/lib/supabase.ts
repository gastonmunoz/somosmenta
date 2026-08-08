import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Server-only client (service role key). Never import this from a Client
// Component — the service role key bypasses RLS and must not reach the browser.
//
// Built lazily so that importing this module (e.g. during `next build`'s
// page-data collection) doesn't throw just because env vars aren't set in
// the current environment — the error only surfaces if a route actually
// tries to use it without being configured.
let client: SupabaseClient | undefined;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Supabase is not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  // Cast: the "calton" schema has no generated types, so we fall back to
  // the default (untyped) client shape rather than fighting Supabase's
  // schema-name generic variance for a schema we don't have codegen for.
  client = createClient(url, key, { db: { schema: 'calton' } }) as unknown as SupabaseClient;
  return client;
}
