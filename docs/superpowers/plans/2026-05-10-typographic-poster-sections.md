# Typographic Poster Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform About, Services, Process, and a new Manifiesto section into editorial typographic poster sections (NY Times meets Brutalism) with alternating backgrounds: sage-light → negro → sage-light → blanco.

**Architecture:** Each section is rewritten as a self-contained component using existing Framer Motion and design tokens. No new dependencies. Services and About swap page order. A new Manifiesto section is inserted between Services and Process. The old VerticalTabs carousel is replaced by an accordion.

**Tech Stack:** Next.js 16, React, Framer Motion, Tailwind v4, CSS custom properties (`var(--sage)`, `var(--sage-light)`, `var(--black)`, `var(--gray-text)`, `var(--font-playfair)`, `var(--font-inter)`)

---

## File Map

| File | Action |
|---|---|
| `src/components/sections/About.tsx` | Rewrite |
| `src/components/sections/Services.tsx` | Rewrite (inline — no longer delegates to grid) |
| `src/components/ui/editorial-services-grid.tsx` | Delete |
| `src/components/sections/Manifiesto.tsx` | Create |
| `src/components/sections/Process.tsx` | Rewrite (inline accordion — no longer re-exports VerticalTabs) |
| `src/components/ui/vertical-tabs.tsx` | Leave in place (unused, no errors) |
| `src/app/page.tsx` | Add Manifiesto import, reorder sections |

---

## Task 1: Rewrite About.tsx — Sage-light Poster

**Files:**
- Modify: `src/components/sections/About.tsx`

- [ ] **Step 1: Replace About.tsx with the poster version**

```tsx
"use client"

import { motion } from "framer-motion"

const ease = [0.23, 1, 0.32, 1] as const

const HEADLINE = ["SOMOS", "LOS QUE", "hacen que", "SUCEDA."]

const STATS = [
  { value: "200+", label: "Eventos" },
  { value: "15k", label: "Asistentes" },
  { value: "8", label: "Años", accent: true },
]

export default function About() {
  return (
    <section
      id="nosotros"
      className="bg-[var(--sage-light)] px-8 md:px-12 xl:px-20 py-20 md:py-28"
      style={{ borderBottom: "3px solid var(--black)" }}
    >
      <motion.p
        className="uppercase text-[var(--sage)] mb-10"
        style={{ fontSize: "8px", letterSpacing: "4px" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Quiénes somos
      </motion.p>

      <div className="overflow-hidden mb-10">
        {HEADLINE.map((line, i) => (
          <motion.span
            key={line}
            className="block leading-[0.88]"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(3rem, 7vw, 7.5rem)",
              fontWeight: i === 2 ? 400 : 900,
              fontStyle: i === 2 ? "italic" : "normal",
              letterSpacing: i === 2 ? "-1px" : "-2px",
              color: i === 2 ? "var(--sage)" : "var(--black)",
            }}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: i * 0.08, ease }}
          >
            {line}
          </motion.span>
        ))}
      </div>

      <motion.div
        className="h-px bg-[#1A1A1A]/10 mb-8"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.25, ease }}
      />

      <motion.div
        className="flex gap-10 md:gap-16"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3, ease }}
      >
        {STATS.map((s) => (
          <div key={s.value}>
            <p
              className="leading-none"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                fontWeight: 900,
                color: s.accent ? "var(--sage)" : "var(--black)",
              }}
            >
              {s.value}
            </p>
            <p
              className="uppercase mt-2"
              style={{ fontSize: "7px", letterSpacing: "2px", color: "var(--gray-text)" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Verify in browser**

Run `pnpm dev` if not already running. Open http://localhost:3000 and scroll to `#nosotros`. Check:
- Sage-light background with 3px black bottom border
- 4-line headline staggered in on scroll
- Line 3 "hacen que" is italic sage
- Stats row: 200+, 15k, 8 (in sage)

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/About.tsx
git commit -m "feat: rewrite About as sage-light typographic poster"
```

---

## Task 2: Rewrite Services.tsx — Negro List with Thumbnails

**Files:**
- Modify: `src/components/sections/Services.tsx`
- Delete: `src/components/ui/editorial-services-grid.tsx`

- [ ] **Step 1: Replace Services.tsx**

```tsx
"use client"

import { motion } from "framer-motion"

const ease = [0.23, 1, 0.32, 1] as const

const SERVICES = [
  {
    num: "01",
    title: "Eventos corporativos",
    category: "CONFERENCIAS · CONVENCIONES",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&auto=format&fit=crop&q=80",
  },
  {
    num: "02",
    title: "Lanzamientos de marca",
    category: "ACTIVACIONES · BRAND EXPERIENCE",
    img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=200&auto=format&fit=crop&q=80",
  },
  {
    num: "03",
    title: "Team Building",
    category: "CENAS · EXPERIENCIAS",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80",
  },
  {
    num: "04",
    title: "Gestión de prensa",
    category: "MEDIOS · COBERTURA",
    img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&auto=format&fit=crop&q=80",
    accent: true,
  },
]

export default function Services() {
  return (
    <section
      id="servicios"
      className="bg-[var(--black)] px-8 md:px-12 xl:px-20 py-20 md:py-28"
      style={{ borderBottom: "3px solid var(--sage)" }}
    >
      <motion.p
        className="uppercase text-[var(--sage)] mb-12"
        style={{ fontSize: "8px", letterSpacing: "4px" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Lo que hacemos
      </motion.p>

      <div className="flex flex-col">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.num}
            className="grid items-center gap-6 py-5"
            style={{
              gridTemplateColumns: "1fr 80px",
              borderTop: "1px solid #2a2a2a",
              ...(i === SERVICES.length - 1
                ? { borderBottom: "none" }
                : {}),
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08, ease }}
          >
            <div>
              <p
                className="leading-[0.9] mb-1.5"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)",
                  fontWeight: 900,
                  letterSpacing: "-1px",
                  color: s.accent ? "var(--sage)" : "#ffffff",
                }}
              >
                {s.title}
              </p>
              <p style={{ fontSize: "6px", letterSpacing: "2px", color: "#555555" }}>
                {s.category}
              </p>
            </div>
            <img
              src={s.img}
              alt={s.title}
              className="w-20 h-[52px] object-cover flex-shrink-0"
              style={{ borderRadius: "1px" }}
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Delete editorial-services-grid.tsx**

```bash
rm src/components/ui/editorial-services-grid.tsx
```

- [ ] **Step 3: Verify in browser**

Scroll to `#servicios`. Check:
- Black background, sage bottom border (3px)
- 4 rows with service name + thumbnail
- Last row (Gestión de prensa) name in sage
- Thumbnails 80×52px on the right of each row

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Services.tsx
git rm src/components/ui/editorial-services-grid.tsx
git commit -m "feat: rewrite Services as negro editorial list with thumbnails"
```

---

## Task 3: Create Manifiesto.tsx — Sage-light Poster

**Files:**
- Create: `src/components/sections/Manifiesto.tsx`

- [ ] **Step 1: Create Manifiesto.tsx**

```tsx
"use client"

import { motion } from "framer-motion"

const ease = [0.23, 1, 0.32, 1] as const

const HEADLINE = ["CADA", "EVENTO", "importa."]

export default function Manifiesto() {
  return (
    <section
      id="manifiesto"
      className="bg-[var(--sage-light)] px-8 md:px-12 xl:px-20 py-20 md:py-28"
      style={{ borderBottom: "3px solid var(--black)" }}
    >
      <motion.p
        className="uppercase text-[var(--sage)] mb-10"
        style={{ fontSize: "8px", letterSpacing: "4px" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Manifiesto
      </motion.p>

      <div className="overflow-hidden mb-10">
        {HEADLINE.map((line, i) => (
          <motion.span
            key={line}
            className="block leading-[0.82]"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(4rem, 9vw, 10rem)",
              fontWeight: i === 2 ? 400 : 900,
              fontStyle: i === 2 ? "italic" : "normal",
              letterSpacing: i === 2 ? "-1px" : "-3px",
              color: i === 2 ? "var(--sage)" : "var(--black)",
            }}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1, ease }}
          >
            {line}
          </motion.span>
        ))}
      </div>

      <motion.p
        className="font-light leading-[1.7]"
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "11px",
          color: "#888888",
          maxWidth: "380px",
        }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.35, ease }}
      >
        No producimos eventos. Creamos momentos que las marcas y las personas recuerdan para siempre.
      </motion.p>
    </section>
  )
}
```

- [ ] **Step 2: Verify file created**

File should exist at `src/components/sections/Manifiesto.tsx`. Don't add to page.tsx yet — that's Task 5.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Manifiesto.tsx
git commit -m "feat: add Manifiesto typographic poster section"
```

---

## Task 4: Rewrite Process.tsx — White Accordion

**Files:**
- Modify: `src/components/sections/Process.tsx`

- [ ] **Step 1: Replace Process.tsx with accordion**

```tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const ease = [0.23, 1, 0.32, 1] as const

const STEPS = [
  {
    id: "01",
    title: "Escuchamos",
    description:
      "Entendemos tu empresa, tu cultura y los objetivos del evento antes de proponer cualquier cosa.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800",
  },
  {
    id: "02",
    title: "Diseñamos",
    description:
      "Creamos la propuesta a medida: concepto, presupuesto, proveedores y cronograma.",
    image:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800",
  },
  {
    id: "03",
    title: "Conectamos",
    description:
      "Gestionamos cada proveedor para que vos no tengas que hablar con nadie más.",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800",
  },
  {
    id: "04",
    title: "Ejecutamos",
    description:
      "Estamos presentes el día del evento, de principio a fin, para que todo salga perfecto.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800",
  },
]

export default function Process() {
  const [open, setOpen] = useState<number>(0)

  return (
    <section
      id="proceso"
      className="bg-white px-8 md:px-12 xl:px-20 py-20 md:py-28"
    >
      <motion.p
        className="uppercase text-[var(--sage)] mb-12"
        style={{ fontSize: "8px", letterSpacing: "4px" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Cómo trabajamos
      </motion.p>

      <div>
        {STEPS.map((step, i) => {
          const isOpen = open === i
          const isLast = i === STEPS.length - 1

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease }}
            >
              <button
                onClick={() => setOpen(i)}
                className="w-full text-left py-5 relative"
                style={{
                  borderTop:
                    i === 0
                      ? "2px solid var(--black)"
                      : "1px solid #eeeeee",
                }}
              >
                <span
                  className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "clamp(3rem, 6vw, 5rem)",
                    fontWeight: 900,
                    color: "#f0f0f0",
                    lineHeight: 1,
                  }}
                >
                  {step.id}
                </span>

                <div className="relative z-10 flex flex-col gap-1 pr-20">
                  <span
                    className="uppercase"
                    style={{
                      fontSize: "7px",
                      letterSpacing: "2px",
                      color: "var(--sage)",
                    }}
                  >
                    Etapa {step.id}
                  </span>
                  <span
                    className="leading-none"
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                      fontWeight: 900,
                      letterSpacing: "-0.5px",
                      color: isOpen ? "var(--black)" : "#cccccc",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {step.title}
                  </span>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                    style={{ borderLeft: "3px solid var(--sage)" }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-5 pb-8 pt-3">
                      <p
                        className="font-light leading-[1.7]"
                        style={{ fontSize: "11px", color: "#888888" }}
                      >
                        {step.description}
                      </p>
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full object-cover"
                        style={{ aspectRatio: "4/3", borderRadius: "2px" }}
                        loading="lazy"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {isLast && (
                <div style={{ borderBottom: "2px solid var(--sage)" }} />
              )}
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify in browser**

Scroll to `#proceso`. Check:
- White background
- 4 rows with ghost numbers (01–04) on the right
- Click each row — expands with description + image, previous closes
- Step 1 open by default (state initializes at 0)
- Sage left border on expanded row
- Last row has sage bottom border

- [ ] **Step 3: Verify mobile**

Resize browser to < 768px. Check:
- Expanded row stacks: description on top, image below (grid-cols-1 on mobile)
- Ghost numbers don't overflow the row buttons

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Process.tsx
git commit -m "feat: replace Process vertical tabs with typographic accordion"
```

---

## Task 5: Update page.tsx — Reorder + Add Manifiesto

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace page.tsx**

```tsx
import Preloader from "@/components/ui/preloader";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Wizard from "@/components/sections/Wizard";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Manifiesto from "@/components/sections/Manifiesto";
import Process from "@/components/sections/Process";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ui/chatbot/ChatWidget";

export default function Home() {
  return (
    <main>
      <Preloader />
      <Navbar />
      <Hero />
      <Wizard />
      <About />
      <Services />
      <Manifiesto />
      <Process />
      <FAQ />
      <Contact />
      <Footer />
      <ChatWidget />
    </main>
  );
}
```

- [ ] **Step 2: Full scroll verification**

Scroll through the full page from top to bottom. Verify the background rhythm:

| Section | Background | Separator |
|---|---|---|
| About | sage-light (#EAF0EC) | 3px black bottom |
| Services | black (#1A1A1A) | 3px sage bottom |
| Manifiesto | sage-light (#EAF0EC) | 3px black bottom |
| Process | white (#FFFFFF) | sage bottom border on last row |

- [ ] **Step 3: Verify nav scroll anchors still work**

Click Navbar links for "Nosotros", "Servicios", "Proceso" — each should scroll to the correct section with 72px offset.

- [ ] **Step 4: Verify no TypeScript errors**

```bash
pnpm build
```

Expected: build completes (ignore the known `/_global-error` SSR prerender error — pre-existing, unrelated).

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: reorder page sections and add Manifiesto to flow"
```
