## Why

A cross-cutting audit (technical/strategic analysis, security review, frontend design review, and WCAG 2.2 AA accessibility review) found that the site is not production-ready despite being functionally complete: submitted leads can silently vanish with no record of the failure, all four public API routes accept unbounded, unauthenticated traffic against a paid Anthropic key with no abuse controls, and the site fails WCAG 2.2 AA on 17 criteria including a Level A failure. These are launch blockers, not polish items — fixing them is cheaper now than after the first lost lead, cost overrun, or compliance complaint.

## What Changes

- Lead submissions (wizard + chatbot) are durably persisted before the user sees a success state; notification failures no longer fail silently.
- The chat-route's self-fetch to `/api/capture-lead` is replaced with a direct in-process call, removing the Host-header-driven SSRF/round-trip pattern.
- All four public API routes (`/api/chat`, `/api/generate-brief`, `/api/capture-lead`, `/api/send-brief`) gain request validation (shape, type, length caps) and per-IP rate limiting.
- The chatbot system prompt and the `[LEAD_READY:{...}]` extraction path are hardened against role-forgery and prompt injection; extracted lead data is validated against the user-authored conversation before it triggers a notification.
- Site-wide focus indicators, landmark structure, heading hierarchy, form label association, and keyboard operability are brought to WCAG 2.2 AA, including the specific `--brand`-as-focus-ring/text violations flagged by the design and accessibility reviews.
- The `/_global-error` production build failure is fixed so `pnpm build` (and therefore Vercel deploys) succeeds.
- Critical-path errors (lead capture, notification, chat) are logged instead of swallowed by empty `catch` blocks.

**BREAKING**: none — all changes are internal hardening; no public API contract or page URL changes.

## Capabilities

### New Capabilities
- `lead-delivery-reliability`: leads from the wizard and chatbot must be durably recorded and their notification failures must be observable, never silently dropped.
- `api-abuse-prevention`: public API routes must validate request shape/size and enforce rate limits before doing paid or side-effecting work.
- `chatbot-guardrails`: the chatbot must resist conversation-history forgery and prompt injection, and must not forward unvalidated extracted data as a trusted lead.
- `accessibility-compliance`: the site must meet WCAG 2.2 AA for focus visibility, landmarks, heading structure, form labeling, keyboard operability, and live-region announcements.

### Modified Capabilities
_None — `analytics` (existing spec) is unaffected by this change._

## Impact

- **Affected code**: `src/app/api/chat/route.ts`, `src/app/api/capture-lead/route.ts`, `src/app/api/generate-brief/route.ts`, `src/app/api/send-brief/route.ts`, `src/lib/chatbot-prompt.ts`, `src/components/sections/Wizard.tsx`, `src/components/ui/wizard/*.tsx`, `src/components/ui/button.tsx`, `src/components/sections/{Navbar,Contact,About,Manifiesto}.tsx`, `src/components/Footer.tsx`, `src/components/ui/connoisseur-stack-interactor.tsx`, `src/components/ui/chatbot/ChatWidget.tsx`, `src/components/ui/hero-section-calton.tsx`, `next.config.ts`, `src/app/global-error.tsx` (new).
- **New dependencies**: Zod for API boundary validation, `@supabase/supabase-js` against the Supabase project the site already uses for hero video assets (new `calton` schema, no new external service), and optionally an error-tracking service (e.g. Sentry) — see `design.md` for the finalized choices.
- **Out of scope for this change** (tracked separately, not spec-able application behavior): the font-licensing decision (Typodermic/Nymphont web licenses) and the Claude agent-system cleanup (stale v1 agents, `PROJECT.md` creation) identified in the same audit round — both are business/tooling decisions, not product requirements.
