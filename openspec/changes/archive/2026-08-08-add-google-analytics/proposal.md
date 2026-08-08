## Why

The Calton marketing site has no traffic/behavior tracking. The client needs Google Analytics (GA4, measurement ID `G-55BLPGG5BT`) installed to measure visits and conversions on the wizard, contact form, and chatbot.

## What Changes

- Add the GA4 `gtag.js` snippet (tag `G-55BLPGG5BT`) to the site so it loads on every page.
- Load the script via Next.js's `next/script` component (not a raw `<script>` tag) using an `afterInteractive` strategy, per Next.js 16 conventions, so it doesn't block initial render.

## Capabilities

### New Capabilities
- `analytics`: the site loads Google Analytics (gtag.js) globally and reports page views via the GA4 measurement ID.

### Modified Capabilities
(none)

## Impact

- `src/app/layout.tsx`: add the `next/script` tags for gtag.js inside `<head>`/root layout so it applies to the single route (`/`).
- No new dependencies (uses built-in `next/script`).
- No backend, database, or API impact.
