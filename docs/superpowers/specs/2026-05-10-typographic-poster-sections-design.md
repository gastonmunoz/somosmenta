# Typographic Poster Sections — Design Spec

**Date:** 2026-05-10
**Status:** Approved

## Overview

Transform four existing sections (About, Services, Manifiesto NEW, Process) into editorial typographic poster sections inspired by "NY Times meets Brutalism." Text is the primary graphic element. Backgrounds alternate following a Sage-light → Negro → Sage-light → Blanco rhythm, with 3px rule lines as hard separators between sections.

No new fonts or dependencies. Playfair Display + Inter already loaded. Framer Motion already installed for animations.

---

## Page Order (new)

Current order: Hero → Wizard → Services → About → Process → FAQ → Contact → Footer

New order: Hero → Wizard → **About → Services → Manifiesto → Process** → FAQ → Contact → Footer

About and Services swap positions so the narrative flows: who we are → what we do → why it matters → how we work.

---

## Section Specs

### 1. About — Sage-light Poster

**Background:** `var(--sage-light)` (#EAF0EC)
**Bottom border:** 3px solid `var(--black)`
**ID:** `#nosotros` (unchanged)

**Layout:**
- Section label: uppercase, 8px, letter-spacing 4px, `var(--sage)` — "Quiénes somos"
- Headline: Playfair Display, ~72–96px (clamp), weight 900, line-height 0.88, letter-spacing -2px, black
  - "SOMOS / LOS QUE / *hacen que* / SUCEDA." — italic + sage on line 3
- Stats row (bottom of section, above border): three stats side by side
  - Number: Arial/Inter, 32px, weight 900
  - Label: 7px, letter-spacing 2px, uppercase, `var(--gray-text)`
  - Values: 200+ Eventos · 15k Asistentes · 8 Años (last one in sage)
- Stats separated from headline by 1px horizontal rule at 10% opacity

**Animation:** Headline lines stagger in from y:60 → 0, opacity 0→1. Stats counter-up on enter.

**Replaces:** Current `About.tsx` component entirely.

---

### 2. Services — Negro Poster

**Background:** `#1A1A1A` (var(--black))
**Bottom border:** 3px solid `var(--sage)`
**ID:** `#servicios` (unchanged)

**Layout:**
- Section label: uppercase, 8px, letter-spacing 4px, `var(--sage)` — "Servicios"
- Vertical list of 4 rows, each row is a grid `1fr 80px`:
  - Top rule: 1px solid #2a2a2a (first row 1px, last row bottom 2px solid sage)
  - Left: service name Playfair Display 900, ~28px, white, letter-spacing -1px, line-height 0.9
  - Left below name: category label 6px, letter-spacing 2px, uppercase, #555 (Inter)
  - Right: image thumbnail 80×52px, border-radius 1px, object-fit cover — existing event photos
  - Fourth row: name in `var(--sage)` instead of white
- Services: PRODUCCIÓN / CREATIVIDAD / LOGÍSTICA / TECH & AV

**Animation:** Rows stagger in from y:20→0, opacity 0→1, 0.08s delay per row.

**Replaces:** Current `EditorialServicesGrid` component. Images from existing tiles are reused as thumbnails.

---

### 3. Manifiesto — Sage-light Poster (NEW)

**Background:** `var(--sage-light)`
**Bottom border:** 3px solid `var(--black)`
**ID:** `#manifiesto`

**Layout:**
- Section label: uppercase, 8px, letter-spacing 4px, `var(--sage)` — "Manifiesto"
- Headline: Playfair Display, ~80–120px (clamp), weight 900, letter-spacing -3px, line-height 0.82, black
  - "CADA / EVENTO / *importa.*" — last line italic weight 400 in sage
- Body copy below: Inter 11px, color #888, line-height 1.7, max-width 380px
  - "No producimos eventos. Creamos momentos que las marcas y las personas recuerdan para siempre."

**Animation:** Headline enters from y:80, letters almost "fall into place." Body fades in after headline completes.

**New component:** `src/components/sections/Manifiesto.tsx`
**Page.tsx:** Add `<Manifiesto />` between Services and Process.

---

### 4. Process — Blanco Accordion Poster

**Background:** `#FFFFFF`
**Top rule:** (no top border — white follows sage-light Manifiesto, separator implicit)
**Bottom border:** none (leads into FAQ which has its own background)
**ID:** `#proceso` (unchanged)

**Layout:**
- Section label: uppercase, 8px, letter-spacing 4px, `var(--sage)` — "Proceso"
- 4 accordion rows (01–04):
  - Top border: 2px solid black on first, 1px solid #eee on 2–3, bottom of last: 2px solid `var(--sage)`
  - Ghost number: absolute-positioned right, Playfair/Arial 900, ~80px, color #f0f0f0, z-index 0
  - Collapsed state: step name Playfair 900 ~24px black + micro-label 7px sage uppercase. Full row clickable.
  - Expanded state: step name stays + below it, 2-column grid:
    - Left: description text (Inter 11px, #888, line-height 1.6)
    - Right: image (existing step image, aspect-ratio 4/3, object-fit cover, border-radius 2px)
  - Expanded row has sage left-border (3px, full height of expanded area)
  - Only one row expanded at a time (accordion behavior, not tabs)

**Steps content (from existing VerticalTabs):**
- 01 BRIEFING & ESTRATEGIA
- 02 DISEÑO CREATIVO
- 03 PRODUCCIÓN & EJECUCIÓN
- 04 POST-EVENTO & ANÁLISIS

**Animation:** Expand/collapse via Framer Motion `AnimatePresence` + height animation. Ghost number opacity animates 0.05→0.15 on hover.

**Replaces:** Current `VerticalTabs` component (`src/components/ui/vertical-tabs.tsx`). Images from VerticalTabs are reused.

---

## Shared Typographic Rules

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Section label | Inter | 8px, ls 4px | 400 | var(--sage) |
| Display headline | Playfair Display | clamp(48px, 7vw, 96px) | 900 | var(--black) or #fff |
| Italic accent | Playfair Display | same | 400 italic | var(--sage) |
| Body copy | Inter | 11px | 300 | #888888 |
| Ghost number | Inter/Arial | 80–120px | 900 | #f0f0f0 or #222 |
| Stat number | Inter | 32px | 900 | var(--black) |
| Micro label | Inter | 7–8px, ls 2–3px | 400 | var(--gray-text) or var(--sage) |

---

## Section Borders (rhythm separators)

| Between | Border |
|---|---|
| About bottom | 3px solid var(--black) |
| Services bottom | 3px solid var(--sage) |
| Manifiesto bottom | 3px solid var(--black) |
| Process: first row top | 2px solid var(--black) |
| Process: last row bottom | 2px solid var(--sage) |

---

## Files to Create / Modify

| File | Action |
|---|---|
| `src/components/sections/About.tsx` | Rewrite entirely |
| `src/components/sections/Services.tsx` | Rewrite (currently delegates to EditorialServicesGrid) |
| `src/components/ui/editorial-services-grid.tsx` | Delete (replaced by new Services) |
| `src/components/sections/Manifiesto.tsx` | Create new |
| `src/components/ui/vertical-tabs.tsx` | Replace with new accordion component |
| `src/app/page.tsx` | Reorder sections + add Manifiesto import |

---

## Verification

1. `pnpm dev` — no TypeScript errors
2. Browser: scroll through the 4 sections, confirm background rhythm: sage → black → sage → white
3. Confirm 3px rule separators visible between sections
4. Process: click each accordion row — expands with image + text, others collapse
5. Only one accordion row open at a time
6. Mobile: headlines readable (clamp handles scaling), accordion works on touch
7. Scroll anchors still work: `#nosotros`, `#servicios`, `#proceso` nav links
