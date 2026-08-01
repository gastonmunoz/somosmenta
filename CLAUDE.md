# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## This is NOT the Next.js you know

This project runs **Next.js 16.2.6** — a version with breaking changes from what training data may reflect. Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.

## Commands

```bash
pnpm dev        # start dev server (Turbopack, port 3000)
pnpm build      # production build
pnpm lint       # ESLint
```

> `pnpm build` currently fails on `/_global-error` prerendering due to a Next.js 16.2.6 SSR bug — this is pre-existing and unrelated to application code. The dev server works correctly.

## Architecture

Single-page marketing site for Calton (corporate event agency). One route (`/`), no backend, no database, no auth.

### Page composition (`src/app/page.tsx`)

Sections render in order: `Preloader → Navbar → Hero → Wizard → Services → About → Process → FAQ → Contact → Footer → ChatWidget`. All are single-purpose components with no shared state between them.

### Component split

- `src/components/sections/` — page sections (Navbar, Hero, Services, About, Process, FAQ, Contact). Each maps to a page `id` anchor used for scroll navigation.
- `src/components/ui/` — reusable primitives and complex UI pieces:
  - `button.tsx` — shadcn Button with CVA variants
  - `hero-section-calton.tsx` — Framer Motion animated hero with image collage
  - `link-hover.tsx` — GSAP-powered fullscreen nav menu (image-hover effect). Loaded `ssr: false` via `next/dynamic` because GSAP's `registerPlugin` conflicts with SSR.
  - `sticky-scroll-cards-section.tsx` — Services sticky scroll
  - `preloader.tsx` — loading animation shown before page renders
  - `editorial-services-grid.tsx` — editorial grid layout for services display
  - `wizard/` — 5-step Event Brief wizard components (EventType, Attendees, Date, Budget, Contact) + WizardSuccess
  - `chatbot/ChatWidget.tsx` — floating chat widget (FAB, bottom-right). Conversational interface powered by Claude Haiku. Captures 5 lead fields (name, company, email, event type, attendees) naturally during conversation; sends to `/api/capture-lead` when complete. Parses Calendly URLs as clickable links.
- `src/app/api/chat/route.ts` — calls Claude Haiku, processes responses, extracts lead data from conversation
- `src/app/api/capture-lead/route.ts` — saves captured leads
- `src/lib/chatbot-prompt.ts` — chatbot system prompt: personality, FAQ answers, lead qualification strategy, guardrails
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `src/lib/wizard-types.ts` — `WizardData` type, event/budget label maps, recommended services per event type
- `src/lib/generateBrief.ts` — generates a PDF brief from `WizardData` (client-side, no API)

### Navbar overlay

The hamburger opens a `fixed inset-0` overlay (Framer Motion `AnimatePresence`). `ImageHover` (from `link-hover.tsx`) renders inside it with GSAP hover-image animations. `document.body.overflow` is locked while open. The overlay is visible on all screen sizes; the desktop horizontal nav is permanently hidden.

### Styling

Tailwind v4 (`@import "tailwindcss"` in `globals.css`). Design tokens are CSS custom properties on `:root` exposed as Tailwind colors via `@theme inline`, matching the Calton brand manual (`manual-de-marca/`):

| Token | Value | Role |
|---|---|---|
| `--brand-dark` | `#284019` | dark surfaces (Contact, Footer, Preloader, dark Services card) |
| `--brand-mid` | `#3F592A` | accent **text** on white/light backgrounds — the only accent green that clears AA (8.6:1 on white) |
| `--brand` | `#849F54` | decorative fills, dividers, chips, progress bars — **never text**, it's ~2.9:1 on white |
| `--charcoal` | `#414042` | base text color |
| `--brand-tint` | `#F1F4EA` | light background washes |
| `--brand-soft` | `#DFE7CE` | borders / soft surfaces |
| `--gray-text` | `#6E6E6C` | secondary text (5.2:1) |

Rule of thumb: if it's text or an icon, use `--charcoal` or `--brand-mid` — never bare `--brand`. On a dark surface (`--brand-dark`), small text goes white (`text-white/60` etc.), not a green token — brand-mid and brand-dark are too close in luminance to each other to pair as text/background.

Fonts: `--font-display` (Coolvetica Regular, headings/logo) and `--font-body` (Champagne & Limousines, body). Both are self-hosted via `next/font/local` from `src/fonts/*.woff2` (converted from the `.otf`/`.ttf` originals in `fonts/`, which are kept for reference). Coolvetica ships one weight only (400) and Champagne only 400/700 — never set `font-weight` above what's registered in `layout.tsx`, or the browser synthesizes a faux-bold that looks off.

**Licensing note:** the font files in `fonts/` are personal-use licenses (Typodermic for Coolvetica, Nymphont for Champagne & Limousines) that explicitly disallow web embedding as-is. `next/font/local` embeds via `@font-face`. Get Typodermic's web license and make the Nymphont donation before this goes to production.

### Key dependencies

| Package | Use |
|---|---|
| `framer-motion` | Hero animations, navbar overlay entrance/exit |
| `gsap` + `@gsap/react` | Link-hover image animation in nav menu |
| `lucide-react` | All icons |
| `clsx` + `tailwind-merge` | Class merging via `cn()` |

### Scroll anchors

All sections use `id` attributes (`#hero`, `#servicios`, `#nosotros`, `#proceso`, `#faq`, `#contacto`). `scroll-margin-top: 72px` is set globally for fixed navbar offset.
