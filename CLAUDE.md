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

Sections render in order: `Navbar → Hero → Services → About → Process → Contact → Footer`. All are single-purpose components with no shared state between them.

### Component split

- `src/components/sections/` — page sections (Navbar, Hero, Services, About, Process, Contact). Each maps to a page `id` anchor used for scroll navigation.
- `src/components/ui/` — reusable primitives and complex UI pieces:
  - `button.tsx` — shadcn Button with CVA variants
  - `hero-section-calton.tsx` — Framer Motion animated hero with image collage
  - `link-hover.tsx` — GSAP-powered fullscreen nav menu (image-hover effect). Loaded `ssr: false` via `next/dynamic` because GSAP's `registerPlugin` conflicts with SSR.
  - `sticky-scroll-cards-section.tsx` — Services sticky scroll
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)

### Navbar overlay

The hamburger opens a `fixed inset-0` overlay (Framer Motion `AnimatePresence`). `ImageHover` (from `link-hover.tsx`) renders inside it with GSAP hover-image animations. `document.body.overflow` is locked while open. The overlay is visible on all screen sizes; the desktop horizontal nav is permanently hidden.

### Styling

Tailwind v4 (`@import "tailwindcss"` in `globals.css`). Design tokens are CSS custom properties on `:root` exposed as Tailwind colors via `@theme inline`:

| Token | Value |
|---|---|
| `--black` | `#1A1A1A` |
| `--sage` | `#5D8A6B` (primary accent) |
| `--sage-light` | `#EAF0EC` |
| `--gray-text` | `#888888` |

Always use these tokens (`var(--sage)`, `text-sage`, etc.) instead of raw hex. Fonts: `--font-playfair` (headings/logo, Playfair Display) and `--font-inter` (body).

### Key dependencies

| Package | Use |
|---|---|
| `framer-motion` | Hero animations, navbar overlay entrance/exit |
| `gsap` + `@gsap/react` | Link-hover image animation in nav menu |
| `lucide-react` | All icons |
| `clsx` + `tailwind-merge` | Class merging via `cn()` |

### Scroll anchors

All sections use `id` attributes (`#hero`, `#servicios`, `#nosotros`, `#proceso`, `#contacto`). `scroll-margin-top: 72px` is set globally for fixed navbar offset.
