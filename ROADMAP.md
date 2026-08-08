# ROADMAP — Calton

> Generado 2026-08-08 desde `audit.md` (Auditoría #1) y `swot.md` (FODA #1).
> **Los items no se mueven de columna automáticamente.** Los cambios de estado los aprueba el dueño
> del proyecto.

## 🚨 Bloqueante de pre-producción

> **R-04 — Licencias de tipografía.** Coolvetica (Typodermic) y Champagne & Limousines (Nymphont)
> están embebidas por `next/font/local` bajo licencias personal-use que **prohíben explícitamente el
> web embedding**. No hay solución técnica: o se compra la licencia web de Typodermic y se hace la
> donación a Nymphont, o se sustituyen las fuentes.
>
> **La decisión va esta semana, no en el lanzamiento.** Toda la identidad visual se apoya en esas dos
> familias; sustituirlas después implica rehacer el manual de marca, y eso tiene un plazo que corre.
>
> **Dueño: cliente (Victoria).** No es una tarea de ingeniería y no se destraba sola.

---

## Estado

| Columna | Items |
|---|---|
| 🔴 Bloqueado | 2 (esperan decisión o material del cliente) |
| 📋 Backlog | 14 |
| 🏗️ En curso | 0 |
| ✅ Hecho | 0 |

---

## Fase 1 — Listo para producción (semanas 1-3)

> **Ningún deploy a producción hasta que esta fase esté completa.** Es la recomendación central del
> FODA: lanzar con leads perdiéndose en silencio hace más daño que lanzar tres semanas más tarde.

| ID | Item | Issues | Esfuerzo | Estado |
|---|---|---|---|---|
| **R-01** | **Desbloquear el build** — agregar `src/app/global-error.tsx` explícito; `pnpm build` debe salir con exit 0 | BUG-01 | S | 📋 |
| **R-02** | **Pipeline de leads durable** — extraer `src/lib/leads.ts`, persistir antes de notificar, `await` con manejo de error en el submit del wizard, Sentry + alerta | ARCH-01, ARCH-02, ARCH-03, ARCH-04 | L | 📋 |
| **R-03** | **Blindar los endpoints de IA** — rate limit por IP, validación de `messages`, chequeo de Origin, tool use en vez de `[LEAD_READY]`, tope de gasto en la consola de Anthropic | SEC-01, SEC-02, SEC-03 | M | 📋 |
| **R-04** | **Resolver licencias de tipografía** | LEGAL-01 | S en código | 🔴 **Bloqueado — cliente** |
| **R-05** | **Recuperar Core Web Vitals** — sacar el preloader, `next/image` en victoria.png, `jspdf` a import dinámico, videos a Vercel Blob con `poster` y `preload="none"` | PERF-01, PERF-02, PERF-03, PERF-04 | M | 📋 |

**Criterio de salida de Fase 1:**
- `pnpm build` sale con exit 0 y Vercel despliega.
- Un lead completado sobrevive a que Resend esté caído.
- El endpoint 11 en un minuto devuelve 429.
- Lighthouse mobile ≥ 70 y LCP < 2,5 s medidos sobre el deploy de preview.
- Licencias de tipografía resueltas o fuentes sustituidas.

---

## Fase 2 — Listo para el mercado (semanas 4-8)

| ID | Item | Issues | Esfuerzo | Estado |
|---|---|---|---|---|
| **R-06** | **Privacidad y consentimiento** — página `/privacidad`, links legales en el footer, checkbox en el paso 5 del wizard, banner de cookies que gatee GA, GA ID a env var | LEGAL-02, SEC-04 | M | 📋 |
| **R-07** | **Fotos reales y prueba social** — reemplazar las 5 fotos de Unsplash por eventos propios, franja de logos de clientes, corregir el `alt` que afirma autoría falsa | CONT-01, CONT-02, CONT-04, PERF-05 | M | 🔴 **Bloqueado — material del cliente** |
| **R-08** | **Decidir Proceso/FAQ y limpiar código muerto** — remontar o borrar; eliminar 869 LOC sin importadores; actualizar CLAUDE.md en sus cinco puntos desalineados | CONT-03, USA-05, DEBT-01, DEBT-02 | S | 📋 |
| **R-09** | **Remediación WCAG 2.2 AA** — focus trap y ARIA en el overlay de nav, labels del wizard, `aria-live` en el chat, `prefers-reduced-motion`, tipografía de 7-8 px, skip link | A11Y-01…07 | L | 📋 |
| **R-10** | **Fundamentos de SEO técnico** — `metadataBase`, OG image, `robots.ts`, `sitemap.ts`, JSON-LD Organization + LocalBusiness + FAQPage | SEO-01, SEO-02, SEO-03 | M | 📋 |
| **R-11** | **Pulido de conversión del wizard** — arreglar la barra de progreso (hoy el paso 5 de 5 muestra 80 %), PDF instantáneo con la IA por email, chat responsive en mobile, escala de z-index | USA-01, USA-02, USA-03, USA-04 | M | 📋 |
| **R-12** | **Higiene de código** — 2 errores de lint (`any` en Navbar, resolubles con el `gsap.context()` que ya está en el archivo), destrackear `package-lock.json`, consolidar en una sola librería de animación | BUG-02, DEBT-03, DEBT-06, PERF-06 | M | 📋 |
| **R-13** | **Eventos de GA4 en el embudo** — instrumentar cada paso del wizard y las aperturas del chat para saber dónde abandona la gente | — | S | 📋 |

**Criterio de salida de Fase 2:** cero fotos de stock, sin issues críticos ni altos abiertos,
Lighthouse Accessibility ≥ 95, previews de compartido funcionando en WhatsApp y LinkedIn.

---

## Fase 3 — Crecimiento (mes 3+)

| ID | Item | Fundamento | Esfuerzo | Estado |
|---|---|---|---|---|
| **R-14** | **Landings por tipo de evento** — `/congresos-cientificos`, `/lanzamientos`, `/capacitaciones` reutilizando componentes existentes | SEO-04 · FODA O5 | M | 📋 |
| **R-15** | **Portfolio de casos** — 4-6 eventos con brief, desafío y resultado | FODA A6 | M | 📋 |
| **R-16** | **Dashboard interno de leads** — ruta protegida con tabla, filtros y export CSV | FODA O4 | M | 📋 |
| **R-17** | **Scoring automático de leads** — clasificación caliente/tibio/frío por presupuesto, plazo y tamaño, priorizada en el email | FODA F1 | S | 📋 |
| **R-18** | **CMS para copy y casos** — hoy cada corrección de texto necesita desarrollador, commit y deploy | FODA D11 | L | 📋 |
| **R-19** | **Versión en inglés** — el copy apunta a multinacionales que suelen evaluar en inglés | FODA O6 | M | 📋 |
| **R-20** | **Analizador de RFP** — el mejor fit de IA para el nicho de congresos científicos, que trabaja con pliegos | FODA O2 | L | 📋 |
| **R-21** | **Pulido para Awwwards** — solo con performance y a11y en verde; el jurado penaliza ambas | FODA O7 | L | 📋 |

---

## Quick wins — hacer ya

Menos de dos horas en total, y probablemente 30-40 puntos de Lighthouse mobile.

| Acción | Archivo | Tiempo |
|---|---|---|
| `victoria.png` (562 KB) a `next/image` en un contenedor de 40 px | `src/components/sections/About.tsx:107` | 10 min |
| Borrar el preloader (recupera ~3,5 s de LCP) | `src/components/ui/preloader.tsx` | 15 min |
| `jspdf` a import dinámico (saca ~110 KB gzip del bundle inicial) | `src/components/sections/Wizard.tsx:11` | 15 min |
| Arreglar la barra de progreso: `((step + 1) / STEPS) * 100` | `src/components/sections/Wizard.tsx:75` | 5 min |
| Corregir el `alt` que afirma autoría falsa sobre una foto de Unsplash | `src/components/ui/hero-section-calton.tsx:233` | 2 min |
| Quitar el chip "Google Analytics" de las credenciales de la fundadora | `src/components/sections/About.tsx:131` | 2 min |
| Año del footer dinámico en vez de "© 2026" hardcodeado | `src/components/Footer.tsx:15` | 2 min |

---

## Dependencias

```
R-01 (build)  ──►  todo lo demás. Nada se despliega sin esto.
R-02 (leads)  ──►  R-16 (dashboard), R-17 (scoring)
R-04 (fuentes) ─►  decisión del cliente; si es "sustituir", impacta todo el diseño
R-07 (fotos)  ──►  material del cliente; es el camino crítico más largo del proyecto
R-05 (perf)   ──►  R-21 (Awwwards)
R-09 (a11y)   ──►  R-21 (Awwwards)
R-08 (FAQ)    ──►  R-10 (JSON-LD FAQPage)
```

**Pedir hoy al cliente**, porque su tiempo de respuesta es lo que más tarda:
1. Decisión sobre licencias de tipografía (R-04).
2. Fotos de eventos reales (R-07).
3. Autorización para usar logos de clientes (R-07).
4. Texto de la política de privacidad, o presupuesto para redactarla (R-06).

---

## Historial

| Fecha | Evento |
|---|---|
| 2026-08-08 | Roadmap creado desde la Auditoría #1 y el FODA #1. 16 items, 2 bloqueados por el cliente. |
</content>
