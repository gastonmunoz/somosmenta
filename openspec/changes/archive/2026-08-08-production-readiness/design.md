## Context

Calton is a single-page Next.js 16.2.6 app on Vercel with no database and four public API routes (`chat`, `capture-lead`, `generate-brief`, `send-brief`) that call Anthropic and Resend directly from the request handler. Today, a lead's only record is the email Resend sends; `Wizard.tsx` fires the lead-capture request without awaiting it or checking its result. `/api/chat` also posts back to its own `/api/capture-lead` over HTTP using `request.nextUrl.origin`. None of the four routes validate input shape/size or rate-limit callers. Separately, the rendered page fails WCAG 2.2 AA on focus visibility, landmark structure, heading structure, and several custom interactive controls. See `proposal.md` - Why for the audit that surfaced these.

Volume is low (a marketing site's lead-gen wizard and chatbot, not a high-traffic app), so the design favors the smallest infrastructure that removes the failure modes, not a general-purpose platform.

## Goals / Non-Goals

**Goals:**
- Make lead loss structurally impossible: persistence happens before/alongside notification, and failures are visible.
- Close the four public routes' abuse surface (cost and spam) with validation + rate limiting that works without user accounts.
- Harden the chatbot against role-forgery/injection without changing its conversational UX.
- Bring the rendered page to WCAG 2.2 AA using the existing design-token system, not a redesign.
- Fix the `/_global-error` build failure so `pnpm build` succeeds (a hard prerequisite for any of the above to ever reach production).

**Non-Goals:**
- No lead-management dashboard/CRM UI — persistence and observability only, per `lead-delivery-reliability`. A dashboard is future work (see `analysis.md` §1.5).
- No migration off Vercel, Resend, or Anthropic — the audit found the stack choices sound; the gaps are hardening, not architecture replacement.
- No visual redesign — accessibility fixes reuse existing brand tokens (`--brand-mid`, `--charcoal`, `--brand-dark`) already defined in `globals.css`.
- Font licensing and the Claude agent-system cleanup are explicitly out of scope (see proposal.md - Impact).

## Decisions

### 1. Durable lead store: a `calton` schema on the existing shared Supabase project
**Decision**: Add a `calton.leads` table on the same Supabase project the site already uses for hero video assets (`cdtktxwgtptsazbtehxa`), isolated in its own schema, written to directly from the existing API routes via the service role key.
**Alternatives considered**:
- *Neon Postgres via Vercel Marketplace* — the original plan when no live database was available; dropped once the client confirmed reusing the existing Supabase project instead of provisioning a second Postgres instance.
- *Google Sheets via service account* — zero schema/migration overhead and Victoria could filter it herself, but writes are slower and harder to make transactional with the notification step; rejected in favor of SQL now that a dashboard is a likely near-term follow-up (`analysis.md` §1.5, §7.2).
- *Vercel KV/Blob* — Vercel KV is discontinued (see platform knowledge update); Blob is unstructured and a poor fit for queryable lead records.
**Rationale**: no new infrastructure or credentials — the project is already provisioned and already in this app's dependency graph; a dedicated schema keeps `calton.*` isolated from the dozens of unrelated client schemas living in the same project (see Risks — this is a shared multi-tenant instance, not one dedicated to Calton).

### 2. Write-then-notify, in a single shared module
**Decision**: Extract a `src/lib/leads.ts` with one function, `recordLead(lead)`, that (a) inserts into Postgres, (b) on success, calls Resend, (c) if Resend fails, logs the error but still returns success to the caller since the lead is safe. All four routes that produce a lead call this instead of talking to Resend directly.
**Alternatives considered**: keep notification and persistence as separate fire-and-forget calls from each route — rejected, because it's the exact duplication (`esc()`, `isValidEmail`, allowlists already duplicated across `capture-lead` and `send-brief` per the audit) that let the current bug ship twice.
**Rationale**: one code path means one place to get the ordering right, and it directly resolves the `chat/route.ts` self-fetch (the chat route calls `recordLead()` in-process instead of `fetch()`-ing itself).

### 3. Validation: Zod schemas colocated with each route
**Decision**: Define a Zod schema per route (`messages` array with length/char caps for `/api/chat`, field-length caps for the two lead routes, allowlist enums for `eventType`/`budget` already partially done). Parse with `.safeParse()` at the top of each handler; return 400 on failure before any external call.
**Alternatives considered**: a shared generic body-size middleware only — insufficient on its own, since the forged-`assistant`-role and non-string-`content` issues need per-field shape checks, not just byte-count limits.
**Rationale**: Zod is already a common choice in this stack tier and keeps validation next to the route it protects, avoiding the drift that produced the duplicated helpers.

### 4. Rate limiting: plain Postgres (`calton.rate_limits` + `check_rate_limit()`), no Redis
**Decision**: A `checkRateLimit(ip, routeKey)` helper calls a `SECURITY DEFINER` Postgres function (`calton.check_rate_limit`) that does an atomic upsert-and-compare against a one-row-per-`route:ip` table, in the same Supabase project already used for leads. IP taken from `request.headers.get('x-forwarded-for')` (Vercel-populated). On a DB error the check fails open (allows the request) rather than taking the site down over a rate-limit outage.
**Alternatives considered**: Upstash Redis (`@upstash/ratelimit`) — the original plan, but it's a second external service and a second set of credentials for something Postgres already does in one atomic statement at this volume; dropped once a live database was available. Vercel Firewall/WAF rules — viable and lower-code, but coarser-grained (path-level, not easily parameterized per-route) and harder to unit test.
**Rationale**: one fewer external dependency and one fewer credential pair to manage; the fixed-window table is trivial to inspect (`select * from calton.rate_limits`) when tuning limits, and `security definer` lets the function run with the privileges to upsert regardless of the caller's role.

### 5. Chatbot guardrails: prompt hardening + post-hoc validation, not a rewrite to tool use
**Decision**: Two independent layers. (a) Add an explicit instruction-hierarchy section to `SYSTEM_PROMPT` telling the model to ignore role/instruction-override attempts regardless of which message role they arrive in. (b) After extracting a `[LEAD_READY:{...}]` payload, check that each extracted field (email, name, etc.) actually appears in the concatenation of `user`-role turns before calling `recordLead()`; if not, drop the notification and log it.
**Alternatives considered**: migrate to Anthropic tool use for lead capture (structured output instead of a regex sentinel) — this is the more robust long-term fix and is already tracked as idea 2.3 in `analysis.md` §2, but it changes the chat route's control flow materially; treated as a follow-up change, not bundled here, since prompt hardening + validation closes the acute injection risk without that scope.
**Rationale**: matches the size of the actual threat (a forgeable sentinel) without pulling in a larger refactor that has its own design questions (streaming, tool schemas) better handled separately.

### 6. Accessibility fixes: token and markup corrections, no new UI library
**Decision**: (a) Move `<Navbar>`/`<Footer>`/`<Preloader>` outside `<main>` in `page.tsx` to restore landmark roles. (b) Change the shared `Button`'s `focus-visible:ring-brand` and the three Wizard inputs' `focus:border-[var(--brand)]` to `--brand-mid`. (c) Convert About/Manifiesto headline containers to real `<h2>` elements. (d) Add `id`/`htmlFor` pairs on Wizard labels; add `aria-label`s on the stepper buttons and chat input. (e) Convert the Services item `<li>`s to keyboard-operable controls (`tabIndex`, `onKeyDown`, `aria-pressed`/`role="button"`). (f) Add an `aria-live="polite"` region to the chat message list. (g) Add a pause control to the hero videos.
**Alternatives considered**: adopt a headless a11y component library (e.g. Radix) for the Wizard/Services controls — rejected as disproportionate; the existing components need markup/attribute fixes, not a rebuild.
**Rationale**: every fix here is additive to existing markup and reuses tokens already defined in `globals.css`, keeping this a hardening change rather than a redesign, consistent with the Non-Goals above.

### 7. Build fix: add `src/app/global-error.tsx`
**Decision**: Add the missing root `global-error.tsx` boundary that Next.js 16.2.6 expects, per the framework's own docs under `node_modules/next/dist/docs/`.
**Rationale**: this unblocks `pnpm build`, which every other change in this proposal depends on reaching production at all.

### 8. Observability: Sentry on the four route handlers' catch blocks
**Decision**: Replace the bare `catch {}`/`catch { return NextResponse.json(...) }` blocks in all four routes with a `console.error` at minimum, and wire Sentry (free tier) if budget allows, so a spike in rejected/failed requests is visible without checking Resend's inbox manually.
**Alternatives considered**: rely on Vercel's built-in function logs only — acceptable as an interim step (console.error is captured there automatically) but has no alerting; Sentry is the incremental upgrade once the basic logging lands.

## Risks / Trade-offs

- **[Risk]** Adding a Postgres dependency introduces a new failure mode (DB unavailable) where there was none before. → **Mitigation**: `recordLead()` treats a DB failure as the request failing (per `lead-delivery-reliability` - Accurate success feedback); this is a deliberate trade — a visible failure is strictly better than the current silent one.
- **[Risk]** The Supabase project is shared across many unrelated client apps (confirmed via `list_tables`/`list_migrations` — CRM, gym, trading-bot, and other schemas live in the same project), and its `public` schema has 42 tables with RLS disabled. → **Mitigation**: `calton.leads` and `calton.rate_limits` live in their own schema with RLS enabled and no anon-role policies, so they're not part of that exposure; this change does not touch the `public` schema or any other client's tables. The RLS gap on those other tables is a separate, pre-existing issue outside Calton's scope — flag it to whoever owns that project, don't fix it here.
- **[Risk]** Rate limits tuned too aggressively could block legitimate bursts (e.g. a client testing the wizard repeatedly). → **Mitigation**: start with generous limits (20 req/min/IP on chat, 5 req/min/IP on the lead routes) and adjust by querying `calton.rate_limits` directly rather than guessing tightly up front.
- **[Risk]** The rate limiter fails open on a Supabase outage, so abuse protection briefly disappears exactly when the DB (and therefore lead capture) is already degraded. → **Mitigation**: acceptable trade — the alternative (failing closed) would take down the whole site over a rate-limiter dependency; logged via `console.error` so it's visible, not silent.
- **[Risk]** Prompt-based injection resistance is probabilistic, not a hard guarantee. → **Mitigation**: the post-hoc field-validation layer (Decision 5b) is the actual safety net; prompt hardening reduces attack frequency but the validation check is what prevents a fabricated lead from reaching Resend even if the prompt defense is bypassed.
- **[Trade-off]** Extracting `src/lib/leads.ts` and shared validation touches all four route files in one change rather than shipping them independently. → Accepted, since the routes share the exact duplicated logic the audit flagged (`esc()`, `isValidEmail`, allowlists); fixing one without the others would leave the duplication in place.
- **[Found during verification]** The Resend Node SDK never throws on API errors — `emails.send()` always resolves `{data, error}`, even on an invalid key. `recordLead()`'s original `try/catch` only caught thrown exceptions, so a broken Resend key silently reported `notified: true`. → Fixed by checking the `error` field explicitly and throwing it into the existing catch path; caught live while verifying `lead-delivery-reliability`'s notification-failure scenario (task 3.7) against the real Resend account with a deliberately invalid key.
- **[Found during verification]** A schema existing in Postgres is not sufficient for `supabase-js` to query it — PostgREST also requires the schema to be in the project's exposed-schemas allowlist, or every request 500s with `PGRST106`. → Resolved via `ALTER ROLE authenticator SET pgrst.db_schemas = '..., calton'` plus `service_role` grants (`supabase/migrations/0003_calton_expose_schema.sql`); this is undocumented in Decision 1 originally and worth remembering for any future schema added to this shared project.

## Migration Plan

1. Add `global-error.tsx` and confirm `pnpm build` passes — unblocks everything else being deployable. **Blocked**: this surfaced an unresolved upstream Next.js 16 bug (see Section 1 of `tasks.md`); the remaining steps don't depend on it.
2. Add the `calton` schema, `leads` and `rate_limits` tables, and `check_rate_limit()` function to the existing Supabase project; add env vars.
3. Add `src/lib/leads.ts`, `src/lib/validation.ts` (Zod schemas), `src/lib/rate-limit.ts`; migrate `capture-lead` and `send-brief` to use them.
4. Update `chat/route.ts` to call `recordLead()` in-process instead of self-fetching, and add validation + rate limiting to `chat` and `generate-brief`.
5. Harden `chatbot-prompt.ts` and add the post-extraction field-validation check.
6. Ship the accessibility fixes (Decision 6) — independent of 1-5, can land in parallel.
7. Add error logging to all four routes; wire Sentry if adopted.
8. Rollback strategy: each step is independently revertible (feature-flag not needed at this scale) — if the Postgres write path misbehaves in production, `recordLead()` can temporarily fall back to notify-only while preserving the accurate-success-feedback requirement (surface the persistence failure rather than hiding it).

## Open Questions

None outstanding — the store choice (Decision 1) and rate-limit approach (Decision 4) were both resolved by the client during implementation: reuse the existing Supabase project rather than provision Neon or Upstash.
