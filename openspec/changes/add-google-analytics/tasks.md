## 1. Install GA4 tag

- [x] 1.1 In `src/app/layout.tsx`, import `Script` from `next/script`
- [x] 1.2 Add the gtag.js loader script (`https://www.googletagmanager.com/gtag/js?id=G-55BLPGG5BT`) with `strategy="afterInteractive"`
- [x] 1.3 Add the inline `dataLayer`/`gtag` init script (`gtag('js', new Date())`, `gtag('config', 'G-55BLPGG5BT')`) with `strategy="afterInteractive"`

## 2. Verify

- [x] 2.1 Run `pnpm dev`, load the site, and confirm in DevTools Network tab that `gtag/js?id=G-55BLPGG5BT` loads
- [x] 2.2 Confirm `window.dataLayer` is populated and no console errors are introduced
