-- Creates the "calton" schema and its leads table.
-- Run this against the shared Supabase project (the same one already
-- hosting the marketing site's hero videos) via the SQL editor or the
-- Supabase CLI. Requires the SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY
-- env vars to be set for the app to read/write this table afterward.

create schema if not exists calton;

create table if not exists calton.leads (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('wizard', 'chatbot')),
  name text,
  company text not null,
  email text not null,
  event_type text,
  attendees integer,
  budget text,
  notes text,
  notified_at timestamptz,
  notify_error text,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on calton.leads (created_at desc);

-- The app writes via the service role key from server-only API routes,
-- so no anon-role RLS policy is needed. Enable RLS with no public
-- policies as a defense-in-depth default in case the anon key is ever
-- exposed to this schema.
alter table calton.leads enable row level security;
