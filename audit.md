# Auditoría Técnica — Calton

> Auditoría #1 — 2026-08-08
> Alcance: `C:\code\rebranding-projects\calton` (rama `master`, commit `561245c`)
> Modo: read-only. Ningún archivo fuente fue modificado.
> Verificación ejecutada: `pnpm build`, `pnpm lint`, lectura completa de `src/**`.

---

## 1. Resumen ejecutivo

El sitio es un one-pager de marketing bien resuelto a nivel visual y de marca, con dos
diferenciadores reales sobre el promedio de la categoría: un **wizard de brief de 5 pasos con
generación de PDF** y un **chatbot con Claude Haiku que califica leads**. Ese es el activo.

El problema es que **hoy el proyecto no es desplegable y no retiene ni un solo lead de forma
confiable**. Son dos hallazgos independientes y ambos son bloqueantes:

1. `pnpm build` termina con **exit code 1**. Vercel corre `next build` en cada deploy: si el build
   falla, no hay deploy. Lo que CLAUDE.md describe como "pre-existente y no relacionado con el
   código de aplicación" es, operativamente, **el bloqueante #1 de producción**.
2. Los leads capturados (wizard y chatbot) **no se persisten en ningún lado**. Se envían por email
   vía Resend y se descartan. Peor: el envío del wizard es *fire-and-forget* con el error tragado
   (`.catch(() => {})`), así que un fallo de Resend produce una pantalla de éxito para el usuario y
   cero rastro para la agencia.

A eso se suma una superficie de abuso económico: `/api/chat` y `/api/generate-brief` son proxies
**públicos y sin rate limit** hacia la API de Anthropic, y el marcador `[LEAD_READY:{...}]` que
dispara el email es inyectable desde la conversación.

Y persiste el bloqueante legal ya conocido: **las tipografías Coolvetica y Champagne & Limousines
están embebidas por `next/font/local` bajo licencias personal-use que prohíben explícitamente el
web embedding.** No es opinable y no se resuelve con código.

**Killer risk en una línea:** el sitio no puede desplegarse, y si se lo despliega igual, pierde
leads en silencio mientras factura tokens de Anthropic a cualquiera que abra el chat.

### Scoring por dimensión

| Dimensión | Score /10 | Lectura |
|---|---|---|
| Deployability / build health | **2** | `next build` falla. Sin deploy no hay nada. |
| Arquitectura de datos / leads | **2** | Cero persistencia, envío fire-and-forget, cero observabilidad. |
| Seguridad / abuso | **3** | 3 endpoints públicos sin rate limit, 2 de ellos con costo por request. |
| Performance / Core Web Vitals | **3** | Preloader forzado de ~3,5 s + 2 videos autoplay de terceros + PNG de 562 KB. |
| Accesibilidad (WCAG 2.2 AA) | **4** | Sin focus trap, labels sin asociar, `outline:none`, texto de 7-8 px. |
| Contenido / credibilidad | **4** | Toda la imagería es stock de Unsplash; un alt afirma que es obra de Calton. |
| SEO técnico | **3** | Sin `metadataBase`, sin OG image, sin sitemap, sin robots, sin JSON-LD. |
| Legal / compliance | **2** | Fuentes sin licencia web + GA y captura de PII sin política de privacidad. |
| Calidad de código / deuda | **5** | ~723 LOC de componentes muertos, 2 errores de lint, CLAUDE.md desactualizado. |
| Diseño visual / marca | **8** | Sólido. Tokens coherentes, tipografía y paleta bien aplicadas. |

**Promedio ponderado: 3,6 / 10.** El diseño está listo; la ingeniería de producto no.

---

## 2. Top 5 hallazgos críticos

| # | ID | Hallazgo | Impacto |
|---|---|---|---|
| 1 | BUG-01 | `pnpm build` falla en el prerender de `/_global-error` → **deploy imposible en Vercel** | Bloqueante absoluto |
| 2 | ARCH-01 | Los leads no se persisten; el envío del wizard es fire-and-forget con error tragado | Pérdida directa de ingresos |
| 3 | SEC-01 | `/api/chat` y `/api/generate-brief`: proxies LLM públicos, sin rate limit ni verificación de origen | Costo ilimitado en la cuenta de Anthropic |
| 4 | LEGAL-01 | Coolvetica y Champagne & Limousines embebidas bajo licencia personal-use | Exposición legal en el lanzamiento |
| 5 | PERF-01 | Preloader de ~3,5 s hardcodeado, en cada visita, sin skip | LCP arruinado + abandono |

---

## 3. Hallazgos por dimensión

### 3.1 Build & Deployability

**BUG-01 — El build de producción falla (CRÍTICO).**
Salida real de `pnpm build`:

```
Error occurred prerendering page "/_global-error".
TypeError: Cannot read properties of null (reading 'useContext')
Export encountered an error on /_global-error/page: /_global-error, exiting the build.
⨯ Next.js build worker exited with code: 1
```

El repo no tiene `src/app/global-error.tsx`, así que Next 16.2.6 genera el suyo y ese default rompe
al prerenderizarse. La consecuencia práctica que CLAUDE.md no menciona: **Vercel ejecuta `next build`
en cada deploy, y un exit 1 aborta el deploy.** El proyecto ya está linkeado a Vercel
(`.vercel/project.json`, proyecto `calton`), o sea que esto se va a manifestar en el primer push a
producción, no en un futuro abstracto.

Camino de resolución habitual: agregar un `src/app/global-error.tsx` explícito como client component
mínimo, lo que reemplaza el default problemático. Es una prueba de 10 minutos y hay que hacerla
antes que cualquier otra cosa de esta lista.

También aparecen en el build ~9 warnings de React `Each child in a list should have a unique "key"
prop` originados en el árbol de `<head>`/`<meta>` — ruido del framework, no del código de la app,
pero conviene reverificar una vez resuelto BUG-01.

**BUG-02 — `pnpm lint` falla con 2 errores.**
`src/components/sections/Navbar.tsx:77` y `:88` — `@typescript-eslint/no-explicit-any` sobre el
patrón `(item as any)._gsapCleanup`. Si alguna vez se agrega lint al pipeline de CI, esto también
bloquea. Además 8 warnings, 5 de ellos `@next/next/no-img-element`.

### 3.2 Arquitectura de datos y captura de leads

**ARCH-01 — No existe persistencia de leads (CRÍTICO).**
`src/app/api/capture-lead/route.ts` y `src/app/api/send-brief/route.ts` hacen exactamente una cosa:
`resend.emails.send(...)`. No hay base de datos, no hay CRM, no hay append a un sheet, no hay
blob storage. El email es el único registro y va a `process.env.RESEND_TO`.

Esto significa, hoy:
- Si Resend devuelve error, rate-limitea o el dominio no está verificado → **el lead desaparece**.
- No hay forma de saber cuántos leads se generaron, ni deduplicar, ni medir conversión.
- No hay backup. Si alguien borra el email, el lead no existe.

**ARCH-02 — El envío del wizard es fire-and-forget y traga el error (CRÍTICO).**
`src/components/sections/Wizard.tsx:52-56`:

```js
fetch('/api/send-brief', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(final),
}).catch(() => {});
```

Sin `await`. El resultado ni se mira. Inmediatamente después se llama `generateBrief(...)` y
`setDone(true)`, o sea que **el usuario ve la pantalla de éxito y descarga su PDF pase lo que pase
del lado del servidor**. Si el fetch no llega a salir porque el usuario cierra la pestaña, o si
Resend falla, nadie se entera: ni el usuario ni la agencia.

Esta es la ruta principal de conversión del sitio. Es donde más caro sale un fallo silencioso.

**ARCH-03 — El chat llama a su propio endpoint por HTTP.**
`src/app/api/chat/route.ts:34-39` hace `fetch(\`${origin}/api/capture-lead\`)` — una función serverless
invocando a otra función serverless del mismo deployment por la red pública. Suma latencia, suma un
cold start, suma un punto de fallo, y **obliga a que `/api/capture-lead` sea públicamente accesible**
(que es lo que habilita SEC-02). La lógica de envío debería vivir en `src/lib/` e invocarse
directamente desde ambas rutas.

**ARCH-04 — Cero observabilidad.**
Todos los `catch` del proyecto son ciegos: `catch {}`, `catch { /* silently fail */ }`,
`.catch(() => {})`. No hay Sentry, no hay logging estructurado, no hay alerta. Cuando el pipeline de
leads se rompa —y con esta arquitectura se va a romper— no va a haber ninguna señal hasta que el
cliente pregunte por qué hace tres semanas no entra nada.

**ARCH-05 — `next.config.ts` está vacío.**
Sin `images.remotePatterns` (por lo que `next/image` no puede optimizar las imágenes externas ni
aunque se quisiera), sin headers de seguridad (CSP, HSTS, X-Frame-Options), sin
`experimental.optimizePackageImports`. Es el archivo de scaffold sin tocar.

### 3.3 Seguridad y abuso

**SEC-01 — Proxies LLM públicos sin rate limit (CRÍTICO).**
`POST /api/chat` y `POST /api/generate-brief` aceptan cualquier request de cualquier origen y cada
uno dispara una llamada facturable a Anthropic. No hay rate limit, no hay verificación de origen o
referer, no hay captcha, no hay token de sesión, no hay tope de gasto.

En `/api/chat` el problema se amplifica: el body es `{ messages: Message[] }` y **el array completo
se reenvía a Anthropic sin validar largo ni cantidad**. Un atacante puede mandar un historial de
200 KB por request. Con `max_tokens: 1024` y Haiku, un script simple genera una factura considerable
en horas. El `SYSTEM_PROMPT` tampoco restringe el dominio de conversación, así que el endpoint sirve
como chatbot de propósito general gratis, a costa de Calton.

**SEC-02 — `/api/capture-lead` es un formulario de spam público.**
Como ARCH-03 lo obliga a ser público, cualquiera puede hacer POST con JSON válido y disparar un
email al buzón de la agencia. Las validaciones (`isValidEmail`, campos no vacíos) filtran basura
accidental, no un atacante.

**SEC-03 — Inyección de prompt sobre el marcador de lead.**
`src/app/api/chat/route.ts:7` define `LEAD_READY_RE = /\[LEAD_READY:(\{[\s\S]*?\})\]/` y el server
confía en cualquier match dentro de la respuesta del modelo para disparar un email. El texto del
marcador está descrito en el system prompt, pero un usuario puede pedirle al modelo que reproduzca
esa cadena literal con datos arbitrarios. Haiku va a obedecer buena parte de las veces. Resultado:
emails de "lead" con contenido controlado por el atacante, en volumen.

Mitigación parcial existente: `esc()` en `capture-lead` escapa `& < > "`, así que no hay inyección
de HTML en el email. **No escapa saltos de línea**, y `company` va sin sanitizar al `subject:` —
con la API JSON de Resend el riesgo de header injection es bajo, pero el patrón es incorrecto.

**SEC-04 — Google Analytics sin gate de consentimiento y con ID hardcodeado.**
`src/app/layout.tsx:50` embebe `G-55BLPGG5BT` directamente en el código, cargado
`afterInteractive` sin ningún banner ni opt-out. Debería venir de una env var y respetar consentimiento.

**Punto positivo:** las claves de API se leen todas de `process.env`, `.env*` está correctamente en
`.gitignore` y no encontré ningún secreto hardcodeado. Eso está bien resuelto.

### 3.4 Performance y Core Web Vitals

No pude medir números reales de bundle porque **BUG-01 impide que el build llegue a imprimir las
estadísticas de ruta**. Lo que sigue es análisis estático; hay que remedirlo apenas el build pase.

**PERF-01 — Preloader de ~3,5 segundos, forzado, en cada visita (CRÍTICO).**
`src/components/ui/preloader.tsx`: `DURATION = 2200` ms de contador falso, `setTimeout(..., 380)`,
más una animación de salida de `0.9` s. Total ≈ **3.480 ms de pantalla bloqueada** — con
`document.body.style.overflow = "hidden"` — antes de que el usuario vea el hero.

El contador no mide nada: es un `requestAnimationFrame` con easing sobre un reloj. No está atado a
carga real. No hay `sessionStorage` para saltearlo en visitas repetidas. No respeta
`prefers-reduced-motion`. Y con `z-[99999]` tapa absolutamente todo.

Consecuencia directa: el LCP no puede ser mejor que ~3,5 s en ninguna conexión, ni siquiera en fibra.
El umbral "good" de Core Web Vitals es **2,5 s**. Ninguna optimización posterior de imágenes o
bundle puede compensar esto mientras el preloader esté.

**PERF-02 — Dos videos autoplay servidos desde un bucket público de Supabase.**
`src/components/ui/hero-section-calton.tsx:6-7`:

```
https://cdtktxwgtptsazbtehxa.supabase.co/storage/v1/object/public/calton/videos/conference_video.mp4
https://cdtktxwgtptsazbtehxa.supabase.co/storage/v1/object/public/calton/videos/conference_2.mp4
```

Ambos con `autoPlay loop muted playsInline` y **`preload="auto"`**, above the fold, sin atributo
`poster`. Problemas apilados:
- `preload="auto"` le pide al browser que baje el video completo de inmediato, compitiendo por ancho
  de banda con todo lo crítico. En 4G esto es catastrófico.
- Sin `poster`, el espacio queda vacío hasta que llega el primer frame → LCP tardío.
- El origen es un **proyecto de Supabase de terceros** sobre el que Calton no tiene control. Si ese
  proyecto se pausa por inactividad, se queda sin egress del plan free, o el dueño lo borra, el hero
  del sitio de producción queda roto. Es una dependencia no gobernada en la ruta crítica.
- Sin fallback ni respeto por `prefers-reduced-motion`.

**PERF-03 — 562 KB de PNG para un avatar de 40 px.**
`public/images/victoria.png` pesa **562.495 bytes** y `src/components/sections/About.tsx:107` lo
renderiza con un `<img>` crudo dentro de un contenedor `w-10 h-10` (40×40 px). Se baja el archivo
completo, sin optimizar, sin responsive, sin lazy. Es probablemente la ganancia más barata de todo
el informe: pasar a `next/image` con `width={40} height={40}` lo lleva a ~2 KB.

**PERF-04 — `jspdf` entra al bundle inicial de la página.**
`src/components/sections/Wizard.tsx:11` importa `generateBrief` estáticamente, y
`src/lib/generateBrief.ts:1` importa `jsPDF` en el top level. Como `Wizard` es un client component
renderizado en la home, **jspdf (~350 KB minificado, ~110 KB gzip) se descarga para todo visitante**,
incluyendo el 95 % que nunca completa el wizard. Debería ser `await import('@/lib/generateBrief')`
dentro de `handleSubmit`.

**PERF-05 — Cinco imágenes hotlinkeadas desde Unsplash.**
Una en el hero, cuatro en Services, todas `w=1000&q=80`, todas con `<img>` crudo. Sin optimización
de formato (no se sirve AVIF/WebP negociado), sin `sizes`, sin dimensiones declaradas → riesgo de
CLS. Y suma un tercer origen externo (`images.unsplash.com`) a la ruta crítica.

**PERF-06 — Peso de JS del cliente.**
20 archivos llevan `"use client"`. En la home conviven `framer-motion` (usado en Preloader, Hero,
About, Services, Wizard, ChatWidget), `gsap` + `CustomEase` (Navbar), `jspdf` (PERF-04) y
`lucide-react`. Estimación gruesa, **a confirmar tras arreglar el build**: 250-320 KB de JS
gzipped en first load, contra los ~100-150 KB que sería razonable para un one-pager de marketing.
GSAP se usa exclusivamente para el efecto de shapes del menú; framer-motion sola podría cubrirlo y
ahorrarse una librería de animación entera.

**PERF-07 — 6 archivos de fuente woff2 = ~224 KB.**
Se registran 6 variantes (`coolvetica-rg`, `coolvetica-rg-italic`, `champagne` ×4). El itálico de
Coolvetica y el bold-italic de Champagne casi no se usan. Con `display: "swap"` bien puesto (✓), pero
vale auditar cuáles se cargan realmente y subsetear a caracteres latinos.

### 3.5 Accesibilidad (WCAG 2.2 AA)

**A11Y-01 — El overlay de navegación no es un diálogo accesible.**
`src/components/sections/Navbar.tsx`: el botón hamburguesa no tiene `aria-expanded`, el overlay no
tiene `role="dialog"` ni `aria-modal="true"`, **no hay focus trap** y el foco no se mueve al abrir ni
vuelve al botón al cerrar. Un usuario de teclado abre el menú y tabula hacia el contenido de atrás,
que sigue en el árbol de accesibilidad. `Escape` sí funciona (línea 134-140) — eso está bien.
Falla 2.4.3 (Focus Order) y 4.1.2 (Name, Role, Value).

**A11Y-02 — Labels del wizard sin asociar + indicador de foco eliminado.**
`WizardStep5Contact.tsx`: los tres `<label>` no tienen `htmlFor` y los inputs no tienen `id`. Un
lector de pantalla anuncia "edit text" sin nombre. Los inputs además llevan `focus:outline-none` y
sustituyen el indicador por `focus:border-[var(--brand)]` — `--brand` (#849F54) sobre blanco es
~2,9:1, por debajo del 3:1 que exige 1.4.11 para indicadores no textuales. Faltan también
`autoComplete`, `name` y `required`. Falla 1.3.1, 2.4.7, 1.4.11.

**A11Y-03 — El chat es invisible para lectores de pantalla.**
`ChatWidget.tsx`: el contenedor de mensajes no tiene `aria-live="polite"` ni `role="log"`, así que
las respuestas del asistente nunca se anuncian. El input tiene `outline-none` sin reemplazo y no
tiene label (solo `placeholder`). El estado de carga (los tres puntitos) tampoco se comunica.

**A11Y-04 — `prefers-reduced-motion` prácticamente ignorado.**
`globals.css:42-46` solo desactiva `scroll-behavior`. Siguen corriendo sin condición: el preloader,
los cuatro shapes flotantes del hero en loop `Infinity`, todos los `whileInView` de framer-motion,
las timelines de GSAP y los dos videos en autoplay. Falla 2.3.3 (Animation from Interactions) y es
un problema real de accesibilidad vestibular.

**A11Y-05 — Tipografía de 7-8 px.**
`About.tsx` usa `fontSize: "7px"` para el rol de la fundadora y los chips de credenciales, y `"8px"`
para el eyebrow; `Services.tsx` y `Preloader.tsx` también usan 8-9 px. Con `letter-spacing` de
2,5-4 px y color `--gray-text`, es texto que buena parte de los usuarios simplemente no puede leer.
No hay un umbral WCAG numérico de tamaño, pero esto interactúa con 1.4.4 (Resize Text) y es una
falla de usabilidad seria de todos modos.

**A11Y-06 — Sin skip link.** No hay "saltar al contenido principal" (2.4.1).

**A11Y-07 — Área táctil del botón de menú.** `.nav-close-btn` tiene `height: 24px` fijo — justo en el
límite de 24×24 px de 2.5.8 (Target Size Minimum) de WCAG 2.2, sin margen.

**Puntos positivos:** `lang="es"` correcto, `aria-label` presente en todos los links de icono y
botones del chat, jerarquía `h1`→`h2`→`h3` coherente, `alt` en todas las imágenes, y los tokens de
color documentados en CLAUDE.md sí resuelven bien el contraste de texto en superficies claras.

### 3.6 Contenido, conversión y credibilidad

**CONT-01 — Toda la imagería del sitio es stock de Unsplash.**
Cinco fotos de Unsplash en las secciones vivas (y otras 13 en los componentes muertos). Para una
agencia de eventos, **las fotos del trabajo real son el producto**. Un sitio de agencia que muestra
conferencias genéricas de banco de imágenes le está diciendo al prospecto corporativo, sin querer,
que no tiene portfolio que mostrar.

**CONT-02 — Un `alt` afirma falsamente autoría.**
`hero-section-calton.tsx:233`: `alt="Team building organizado por Calton"` sobre una foto de
Unsplash. Es una afirmación de autoría sobre una imagen de terceros. Hay que corregirlo aunque no se
cambie la foto.

**CONT-03 — Se perdieron las secciones Proceso y FAQ.**
`src/app/page.tsx` renderiza `Preloader → Navbar → Hero → Wizard → About → Services → Manifiesto →
Contact → Footer → ChatWidget`. `Process.tsx` (188 LOC, con el acordeón que los últimos tres commits
se dedicaron a pulir) y `FAQ.tsx` (124 LOC) **existen pero ya no se montan**.

Impacto doble: el sitio perdió su contenido más indexable (las FAQ son el formato preferido para
featured snippets y para respuestas de asistentes de IA) y perdió el bloque que más reduce la
incertidumbre del comprador B2B ("¿cómo trabajan?"). Las respuestas de FAQ hoy solo existen dentro
de `src/lib/chatbot-prompt.ts` — es decir, **son invisibles para Google**.

**CONT-04 — Cero prueba social.** No hay logos de clientes, ni testimonios, ni casos, ni métricas.
En venta B2B de servicios de evento es lo primero que busca un comprador. La sección About afirma
"más de una década de experiencia" sin un solo elemento que lo respalde.

**CONT-05 — El chip "Google Analytics" como credencial.** En `About.tsx:131`, junto a "Lic.
Relaciones Públicas" y "LATAM". Certificarse en GA no es una credencial relevante para un director
de marketing que contrata un congreso científico.

**USA-01 — La barra de progreso del wizard nunca llega a 100 %.**
`Wizard.tsx:75`: `const progress = (step / STEPS) * 100` con `STEPS = 5` y `step` de 0 a 4. En el
paso 1 muestra 0 %, en el paso 5 ("Paso 5 de 5") muestra **80 %**. Debería ser
`((step + 1) / STEPS) * 100`.

**USA-02 — El submit del wizard bloquea sobre una llamada a un LLM.**
`handleSubmit` hace `await fetch('/api/generate-brief')` — una llamada a Haiku con `max_tokens: 1200`
— antes de generar el PDF. Son típicamente 3-8 segundos con el botón en "Generando brief..." y sin
barra de progreso ni feedback intermedio. Es justo el momento de máxima intención del usuario y el
peor momento para hacerlo esperar sin explicación.

**USA-03 — Anclas huérfanas / navegación incompleta.** El menú lista Servicios, Nosotros, Armá tu
Brief y Contacto. Los ids `#proceso` y `#faq` siguen existiendo en el código muerto pero no en la
página. Manifiesto (`#manifiesto`) está en la página pero no en el menú.

**USA-04 — El widget de chat en mobile.** Ancho fijo `w-80` (320 px) con `right-6` (24 px): en un
viewport de 360 px queda pegado al borde izquierdo. `max-h-[480px]` sin considerar `dvh` puede
quedar por debajo del teclado virtual. Además el FAB (`z-50`) comparte z-index con el header
(`z-50`), y el overlay del menú usa `z-9999` mientras el preloader usa `z-[99999]` — hay tres escalas
de z-index distintas conviviendo sin sistema.

### 3.7 SEO técnico

**SEO-01 — Metadata incompleta.** `src/app/layout.tsx` define `title`, `description` y un `openGraph`
parcial. Falta: `metadataBase` (sin él las URLs de OG no resuelven a absolutas y **las previews de
WhatsApp y LinkedIn se rompen** — crítico para una agencia que se comparte por WhatsApp), `openGraph.images`
(no hay imagen de compartido), `twitter` card, `alternates.canonical`, y `keywords`.

**SEO-02 — Sin `robots.ts` ni `sitemap.ts`.** Ninguno de los dos existe en `src/app/`.

**SEO-03 — Sin datos estructurados.** No hay JSON-LD. Para un negocio local de servicios deberían
estar al menos `Organization`, `LocalBusiness` y — si vuelve la sección — `FAQPage`. Es lo que
alimenta el knowledge panel y las respuestas generativas.

**SEO-04 — Página única sin superficie de contenido.** Un solo route (`/`). Sin blog, sin casos, sin
landings por tipo de evento. Para "organización de congresos científicos Buenos Aires" no hay nada
que rankear. La competencia con páginas dedicadas por servicio gana por default.

### 3.8 Deuda técnica

**DEBT-01 — ~723 LOC de componentes muertos.** No los importa nadie:

| Archivo | LOC |
|---|---|
| `src/components/sections/Process.tsx` | 188 |
| `src/components/sections/FAQ.tsx` | 124 |
| `src/components/ui/vertical-tabs.tsx` | 229 |
| `src/components/ui/sticky-scroll-cards-section.tsx` | 182 |
| `src/components/ui/link-hover.tsx` | 146 |

Nota: `link-hover.tsx` aparece como usado en un grep ingenuo por la clase CSS `nav-link-hover-bg`,
pero **el `Navbar` actual no lo importa** — inlinea GSAP directamente. Son ~869 LOC contando
`link-hover`, sobre un total de 3.479 → **el 25 % del código fuente está muerto.**

**DEBT-02 — CLAUDE.md desactualizado en cinco puntos.** Describe una arquitectura que ya no existe:

| CLAUDE.md dice | Realidad |
|---|---|
| Orden: `... → Services → About → Process → FAQ → Contact → ...` | `... → About → Services → Manifiesto → Contact → ...` (sin Process ni FAQ) |
| "`link-hover.tsx` — cargado `ssr: false` vía `next/dynamic`" | Navbar inlinea GSAP con guard `typeof window`; `link-hover` no se usa |
| Lista `editorial-services-grid.tsx` | El archivo no existe |
| "no backend, no database" y 2 API routes | **4** API routes (`chat`, `capture-lead`, `generate-brief`, `send-brief`) |
| No menciona Resend | `resend@^6.12.3` es dependencia y sostiene toda la entrega de leads |

Para un repo cuyo CLAUDE.md abre diciendo "esta no es la Next.js que conocés", que el propio archivo
esté desalineado es un riesgo real de que el próximo agente o desarrollador trabaje sobre supuestos
falsos.

**DEBT-03 — `package-lock.json` (228 KB) commiteado junto a `pnpm-lock.yaml`**, con
`package-lock.json` en `.gitignore` pero ya trackeado. Dos lockfiles es una fuente clásica de
builds divergentes.

**DEBT-04 — Cero tests.** Ni unitarios, ni de integración, ni E2E. Para un one-pager es defendible,
pero las cuatro rutas de API con validación y el pipeline de captura de leads sí justifican al menos
tests de contrato.

**DEBT-05 — Warning de `NODE_ENV` no estándar** en el entorno de build. Vale limpiarlo.

### 3.9 Legal y compliance

**LEGAL-01 — Licencias de tipografía (BLOQUEANTE PRE-PRODUCCIÓN).**
Ya documentado en CLAUDE.md y **confirmado en el código**: `src/app/layout.tsx` carga seis `.woff2`
vía `next/font/local`, que genera reglas `@font-face` — es decir, web embedding.

| Fuente | Titular | Situación |
|---|---|---|
| Coolvetica | Typodermic Fonts | Licencia personal-use. Requiere **licencia web comercial**. |
| Champagne & Limousines | Nymphont | Personal-use / donación. Requiere **la donación al autor**. |

Ambas licencias prohíben explícitamente el embedding web tal como están. No hay workaround técnico:
o se compran/regularizan las licencias, o se sustituyen las fuentes. Y sustituirlas después del
lanzamiento significa rehacer el manual de marca, así que la decisión conviene tomarla ya.

**LEGAL-02 — Sin política de privacidad, con GA activo y captura de PII.**
El sitio corre Google Analytics sin banner de consentimiento, y recolecta nombre, empresa, email y
datos del evento por dos vías (wizard y chatbot). No hay política de privacidad, no hay checkbox de
consentimiento, no hay aviso de tratamiento de datos, y el footer no tiene ningún link legal.

En Argentina, la Ley 25.326 de Protección de Datos Personales exige informar la finalidad del
tratamiento al momento de la recolección. Si el sitio recibe visitantes de la UE — plausible para una
agencia que dice operar en LATAM y trabajar con multinacionales — se suma GDPR, donde GA sin
consentimiento previo es una infracción directa.

**LEGAL-03 — Hotlinking de Unsplash en producción.** Unsplash permite uso comercial, pero el
hotlinking directo desde `images.unsplash.com` sin la API y sin atribución está en zona gris respecto
de sus términos. Se resuelve solo cuando se reemplacen por fotos reales (CONT-01).

---

## 4. Benchmark competitivo

> **Nota de método:** las bandas de referencia de performance provienen de los umbrales públicos de
> Core Web Vitals y de las medianas conocidas de la industria para sitios de marketing. **No se
> auditaron sitios de competidores específicos en esta sesión** — las columnas comparativas
> representan el patrón típico de la categoría, no mediciones. Cualquier claim competitivo puntual
> debe validarse antes de usarlo con el cliente. La columna "Calton hoy" sí está medida o derivada
> del código.

### 4.1 Performance

| Métrica | Umbral "good" (CWV) | Típico agencia de eventos | Calton hoy | Veredicto |
|---|---|---|---|---|
| LCP | ≤ 2,5 s | 2,5-4,5 s | **≥ 3,5 s por diseño** (preloader) | Falla garantizada |
| CLS | ≤ 0,1 | 0,05-0,25 | Riesgo alto (`<img>` sin dimensiones, videos sin poster) | A medir |
| INP | ≤ 200 ms | 100-300 ms | Probablemente OK (interactividad simple) | A medir |
| First-load JS (gzip) | — | 150-400 KB | **~250-320 KB estimado** | En banda, mejorable |
| Peso total de página | — | 2-6 MB (categoría pesada en media) | **~3-5 MB estimado** (2 videos + 5 Unsplash + 562 KB PNG) | En banda, mejorable |
| Lighthouse Performance mobile | — | 40-70 | **estimado 25-45** | Bajo la categoría |

La lectura importante: los sitios de agencias de eventos son, como categoría, **lentos** — es una
vertical visualmente pesada y el listón está bajo. Calton se ubica peor que ese listón ya bajo, y
casi todo el déficit viene de tres decisiones puntuales (preloader, videos con `preload="auto"`,
PNG sin optimizar), no de una arquitectura mal planteada. Eso es una buena noticia: es reparable en
días, no en semanas.

### 4.2 Stack

| Dimensión | Estándar de la categoría | Calton | Lectura |
|---|---|---|---|
| Plataforma | WordPress/Webflow (~70 %), Next.js/Astro (~20 %), Squarespace/Wix (resto) | Next.js 16 + React 19 | **Muy por encima** de la categoría |
| Hosting | Hosting compartido, Webflow, Vercel | Vercel | Correcto |
| CSS | Tema del builder, Bootstrap heredado | Tailwind v4 + tokens de marca | **Muy por encima** |
| Animación | Librería del builder, AOS.js | framer-motion + GSAP | Por encima (redundante) |
| Formularios | Contact Form 7, Typeform embebido | Wizard propio de 5 pasos + PDF | **Diferenciador real** |
| Chat | Tawk.to / WhatsApp Business | Claude Haiku propio | **Diferenciador real** |
| Backend de leads | Plugin CRM / Zapier / HubSpot | Solo email, sin persistencia | **Por debajo del piso** |
| Analytics | GA4 | GA4 | Paridad |
| CMS | WordPress admin, Webflow CMS | **Ninguno** — todo hardcodeado en TSX | **Por debajo** |

El patrón es nítido y vale la pena decirlo tal cual al cliente: **Calton eligió un stack de producto
para resolver un problema de marketing, ejecutó excelente la capa visual e interactiva, y dejó sin
construir la capa aburrida que es la que realmente monetiza** (persistencia, notificación,
observabilidad, edición de contenido). Es el error típico de un proyecto liderado por diseño.

El CMS ausente merece énfasis: en Webflow, Victoria cambia un texto sola. Acá cada corrección de
copy requiere un desarrollador, un commit y un deploy. Sobre 12 meses eso es más costo real que la
diferencia de licencia entre plataformas.

### 4.3 Completitud funcional

| Feature | Baseline de la categoría | Calton | Gap |
|---|---|---|---|
| Hero con propuesta de valor | ✅ | ✅ | — |
| Servicios | ✅ | ✅ | — |
| **Portfolio / casos con fotos reales** | ✅ (universal) | ❌ | **Gap crítico** |
| **Logos de clientes** | ✅ (universal) | ❌ | **Gap crítico** |
| **Testimonios** | ✅ | ❌ | **Gap crítico** |
| Equipo / Nosotros | ✅ | ✅ (parcial) | — |
| Proceso de trabajo | ✅ | ⚠️ codificado pero no montado | Gap fácil |
| FAQ | ✅ | ⚠️ codificado pero no montado | Gap fácil |
| Formulario de contacto | ✅ | ✅ (wizard) | Por encima |
| Chat en vivo | ⚠️ (~40 %) | ✅ IA | Por encima |
| Blog / recursos | ✅ (~60 %) | ❌ | Gap SEO |
| Landings por servicio | ⚠️ (~50 %) | ❌ | Gap SEO |
| Multi-idioma (ES/EN) | ⚠️ (~30 %) | ❌ | Gap para clientes multinacionales |
| Política de privacidad | ✅ (universal) | ❌ | **Gap legal** |
| Prueba social cuantitativa | ✅ | ❌ | Gap |

**Score de completitud: 6 / 15 completos.** Los tres gaps críticos —portfolio, logos, testimonios—
son de contenido, no de código. Ninguno requiere ingeniería; requieren que el cliente entregue
material. Ese pedido debería salir hoy, porque el tiempo de entrega del cliente es el camino crítico
más largo del proyecto.

---

## 5. Ideas equivocadas y malas implementaciones

Listadas por daño descendente. Las cinco primeras son las que hay que revertir.

**1. El preloader de 3,5 segundos.**
Un preloader falso que retiene al usuario 3,5 s mientras un contador simula progreso que no mide
nada. Estéticamente es una convención de sitios de agencia; funcionalmente es una penalidad de
conversión y un techo duro sobre el LCP. Si se conserva por decisión de marca, tiene que: (a) atarse
a carga real con un techo de ~800 ms, (b) saltearse en visitas repetidas vía `sessionStorage`, y
(c) respetar `prefers-reduced-motion`. Recomendación: eliminarlo.

**2. Fire-and-forget sobre la ruta de conversión.** (`Wizard.tsx:52`)
`fetch(...).catch(() => {})` sobre el único canal por el que llega un lead. Nunca se debe tragar un
error en el camino del dinero. El submit debe `await`ear, verificar el status, y ante fallo mostrar
un fallback accionable (mailto directo o WhatsApp) en lugar de la pantalla de éxito.

**3. Email como base de datos.**
Resend es un transporte, no un almacén. Usarlo como registro único significa que no se puede
consultar, deduplicar, medir ni recuperar nada. La corrección no es grande: escribir primero a un
store durable, notificar después.

**4. Una función serverless llamándose a sí misma por HTTP.** (`chat/route.ts:34`)
Latencia extra, cold start extra, punto de fallo extra, y fuerza a exponer `/api/capture-lead`
públicamente. Debe ser una función compartida en `src/lib/`.

**5. Confiar en un marcador generado por el LLM para disparar acciones.** (`chat/route.ts:7`)
`[LEAD_READY:{...}]` extraído por regex del texto del modelo, sin verificación. El texto del modelo
es influenciable por el usuario. Para acciones con efectos secundarios hay que usar **tool use** de
la API de Anthropic, no parseo de marcadores en texto libre — la API devuelve el tool call en un
canal estructurado y separado que el usuario no puede falsificar por conversación.

**6. Dos librerías de animación para un one-pager.**
`framer-motion` (usado en 6 componentes) + `gsap` + `@gsap/react` + `CustomEase`, este último solo
para el efecto de shapes del menú. Es peso duplicado por un efecto. Consolidar en framer-motion.

**7. `preload="auto"` en dos videos above the fold.** Le pide al browser que priorice megabytes de
video por encima del contenido crítico. Debería ser `preload="none"` con `poster`, o directamente un
`poster` estático con carga del video diferida.

**8. Media crítica en infraestructura de terceros no gobernada.** El hero de producción depende de un
bucket público de Supabase (`cdtktxwgtptsazbtehxa`) que no está en la cuenta del proyecto. Es una
dependencia invisible que puede evaporarse sin aviso. Mover a Vercel Blob o al repo.

**9. Sobre-ingeniería: brief generado por IA que bloquea el submit.**
`/api/generate-brief` llama a Haiku para producir prosa que el usuario probablemente hojee una vez.
El costo es 3-8 s de espera en el momento de máxima intención. La alternativa —generar el PDF al
instante con el fallback determinístico que **ya está escrito** en `Wizard.tsx:58-68`, y mandar la
versión enriquecida por IA por email un minuto después— entrega mejor UX y el mismo valor.

**10. Escribir el código y luego dejar de renderizarlo.** Process y FAQ recibieron trabajo dedicado
—los commits `cf42d45` y `070bf6b` son exclusivamente refinamientos del acordeón de Process— y
después se desconectaron de `page.tsx` sin borrarse. O vuelven o se van; que queden en el limbo
confunde a cualquiera que lea el repo, incluido CLAUDE.md, que sigue describiéndolas como activas.

**11. `catch {}` en todos lados.** Nueve bloques catch vacíos o silenciosos. En un sitio sin
observabilidad, cada uno es un fallo que nunca vas a ver.

**12. Números mágicos de z-index.** `z-50`, `z-[9999]`, `z-[99999]` sin escala definida, con el FAB
del chat y el header compartiendo `z-50`.

**13. Aserción de tipo con `any` para colgar estado en nodos del DOM.** (`Navbar.tsx:77`)
`(item as any)._gsapCleanup = ...` — rompe el lint y hay una solución idiomática: `gsap.context()`,
que **ya se está usando en el mismo archivo** y hace exactamente ese cleanup.

---

## 6. Historial de auditorías

| # | Fecha | Alcance | Hallazgos | Críticos | Estado |
|---|---|---|---|---|---|
| 1 | 2026-08-08 | Full stack (build, arquitectura, seguridad, performance, a11y, SEO, contenido, legal) | 46 | 5 | Abierta |

---

## 7. Nota de método

- Todos los hallazgos están anclados a `archivo:línea` verificados por lectura directa.
- `pnpm build` y `pnpm lint` se ejecutaron; la salida está citada literalmente.
- **No se ejecutó Lighthouse ni medición en browser** — BUG-01 impide un build de producción, y
  medir sobre el dev server daría números sin valor. Las cifras de performance marcadas "estimado"
  son análisis estático y deben remedirse apenas el build pase.
- **No se auditaron sitios de competidores.** El benchmark usa patrones de categoría y umbrales
  públicos, explícitamente etiquetados como tales.
</content>
</invoke>
