# Event Brief Wizard — Design Spec

**Date:** 2026-05-10
**Status:** Approved

## Context

Calton needs a lead capture tool that feels native to the site. A multi-step wizard collects event details, generates a downloadable PDF brief, and sends the data to the Calton team via email. This replaces a plain contact form with a guided, high-value interaction that qualifies leads before human follow-up.

---

## Placement

New homepage section inserted between `<Process />` and `<Contact />` in `src/app/page.tsx`.

Section id: `#brief` (for scroll anchor, following existing pattern).

---

## Steps

| # | Label | Input type | Options / constraints |
|---|-------|------------|-----------------------|
| 1 | Tipo de evento | Grid de opciones | Team Building, Lanzamiento, Conferencia, Otro |
| 2 | Cantidad de asistentes | Number input + slider | Min 1, max 500 |
| 3 | Fecha del evento | `<input type="date">` | Min: today |
| 4 | Presupuesto estimado (ARS) | Grid de opciones | Hasta $500k / $500k–$2M / $2M–$5M / $5M+ |
| 5 | Datos de contacto | Empresa (text) + Email + Notas (textarea) | Email validated, rest optional except empresa + email |

---

## UI Design

- **Section background:** `bg-[var(--sage-light)]`
- **Card:** white, `rounded-2xl shadow-md`, `max-w-xl mx-auto`
- **Text:** `text-[var(--black)]` throughout — no low-contrast colors
- **Fonts:** headings `font-[var(--font-playfair)]`, body `font-[var(--font-inter)]`
- **Progress bar:** thin bar at top of card, fills in `bg-[var(--sage)]`, shows `Paso X de 5`
- **Step transitions:** Framer Motion `AnimatePresence` with slide + fade between steps
- **Selected option state:** `border-[var(--sage)] bg-[var(--sage-light)]`
- **CTA buttons:** existing `Button` component from `src/components/ui/button.tsx`

---

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── send-brief/
│   │       └── route.ts           ← POST handler, sends email via Resend
│   └── page.tsx                   ← add <Wizard /> between Process and Contact
├── components/
│   ├── sections/
│   │   └── Wizard.tsx             ← section wrapper, manages wizard state
│   └── ui/
│       └── wizard/
│           ├── WizardStep1EventType.tsx
│           ├── WizardStep2Attendees.tsx
│           ├── WizardStep3Date.tsx
│           ├── WizardStep4Budget.tsx
│           ├── WizardStep5Contact.tsx
│           └── WizardSuccess.tsx
└── lib/
    └── generateBrief.ts           ← jsPDF brief generator
```

---

## State Shape

```ts
type WizardData = {
  eventType: 'team-building' | 'lanzamiento' | 'conferencia' | 'otro';
  attendees: number;
  date: string; // ISO date string
  budget: 'hasta-500k' | '500k-2m' | '2m-5m' | '5m+';
  company: string;
  email: string;
  notes: string;
};
```

State lives in `Wizard.tsx` via `useState<Partial<WizardData>>`. Each step receives `data` and `onNext(partial)` props.

---

## PDF (client-side, jsPDF)

Generated in `src/lib/generateBrief.ts`. Called on step 5 submit before the API call.

**Structure:**
1. **Header** — Calton logo (base64 embedded) + "Event Brief" title + generation date
2. **Resumen del evento** — 2-column table with all 6 fields (including company and notes)
3. **Servicios recomendados** — static mapping by event type:
   - Team Building → Dinámicas grupales, Catering, Espacios al aire libre
   - Lanzamiento → Escenografía, A/V, Producción de contenido
   - Conferencia → Sala equipada, Moderación, Transmisión en vivo
   - Otro → Consultoría personalizada
4. **Próximos pasos** — "El equipo de Calton se contactará a la brevedad. Escribinos a hola@calton.com.ar"

**Filename:** `brief-calton-YYYY-MM-DD.pdf`

---

## API Route — `/api/send-brief`

```
POST /api/send-brief
Body: WizardData (JSON)
```

Uses Resend SDK. Sends HTML email:
- `from`: `RESEND_FROM` env var (`no-reply@calton.com.ar`)
- `to`: `RESEND_TO` env var (`hola@calton.com.ar`)
- `subject`: `Nuevo brief — [company] — [eventType]`
- `html`: table with all WizardData fields

Returns `200` on success, `500` on failure. The client shows `WizardSuccess` regardless of API result (PDF already downloaded — email failure is non-blocking for UX).

---

## Environment Variables

```
RESEND_API_KEY=<secret>
RESEND_FROM=no-reply@calton.com.ar
RESEND_TO=hola@calton.com.ar
```

Add to `.env.local` (already gitignored by Next.js default).

---

## New Dependencies

| Package | Purpose |
|---------|---------|
| `jspdf` | Client-side PDF generation |
| `resend` | Email sending from API route |

---

## Verification

1. `pnpm dev` — site loads, new Wizard section visible between Proceso and Contacto
2. Complete all 5 steps — PDF downloads automatically
3. Check `hola@calton.com.ar` inbox — email received with correct data
4. Test on mobile — wizard card is responsive, inputs usable on touch
5. Step navigation: Back button works on steps 2–5, progress bar updates correctly
6. Invalid email on step 5 shows inline error, submit blocked
