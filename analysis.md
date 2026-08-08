# Análisis de Producto — Calton

> **Sesión #2 — 2026-08-08** (activa)
> Fuentes: `audit.md` (Auditoría #1) · `swot.md` (FODA #1) · código verificado
> La sesión #1 (2026-08-01, ideación de wizard/estética/Awwwards) está colapsada al pie.

## Cómo leer este documento

La Sesión #1 fue ideación libre sobre un sitio que se asumía sano. La Auditoría #1 mostró que no lo
está: el build no pasa y los leads no se guardan. Esta sesión ordena las ideas por una regla
distinta —primero lo que evita perder dinero, después lo que gana dinero, al final lo que gana
premios— y agrega la pieza que faltaba: la arquitectura cloud.

Cada idea lleva esfuerzo (XS/S/M/L), impacto y stack propuesto.

## 1. Arquitectura cloud, datos y observabilidad

| # | Idea | Esfuerzo | Impacto | Stack |
|---|---|---|---|---|
| 1.1 | Store durable de leads antes de notificar | M | Alto | Neon Postgres + Drizzle |
| 1.2 | Notificación multicanal con reintento | M | Alto | Resend + Vercel Workflow |
| 1.3 | Rate limiting en el borde | S | Alto | Upstash Redis |
| 1.4 | Error tracking + alerta en la ruta de leads | S | Alto | Sentry + webhook a Slack |
| 1.5 | Dashboard interno de leads | M | Medio | Next route + Postgres |

1.1 + 1.3 + 1.4 son la línea de flotación. Sin eso no debería haber deploy.

## 2. Conversión y captura

| # | Idea | Esfuerzo | Impacto | Stack |
|---|---|---|---|---|
| 2.1 | PDF instantáneo, IA por email (usar el fallback que ya existe en `Wizard.tsx:58-68`) | M | Alto | Ya en el código |
| 2.2 | Guardado parcial del wizard (hoy un abandono en el paso 4 no deja nada) | M | Alto | localStorage + POST por paso |
| 2.3 | Chatbot con tool use en vez de marcadores (arregla SEC-03, habilita agendar) | M | Alto | Anthropic tool use |
| 2.4 | Streaming en las respuestas del chat | S | Medio | `messages.stream()` |
| 2.5 | Salida a WhatsApp desde el wizard con contexto precargado | S | Medio | `wa.me` |

## 3. Contenido y credibilidad

| # | Idea | Esfuerzo | Impacto |
|---|---|---|---|
| 3.1 | Portfolio de 4-6 casos reales con fotos propias | M | Alto |
| 3.2 | Franja de logos de clientes | XS | Alto |
| 3.3 | Remontar Proceso y FAQ (312 LOC ya escritos) | XS | Alto |
| 3.4 | Testimonios en video de 30 s | M | Alto |
| 3.5 | Métricas de impacto | S | Medio |

## 4. Features de IA

| # | Idea | Esfuerzo | Impacto |
|---|---|---|---|
| 4.1 | Scoring automático de leads (caliente/tibio/frío) | S | Alto |
| 4.2 | Analizador de RFP — mejor fit para congresos científicos | L | Alto |
| 4.3 | Resumen semanal de leads a la clienta | S | Medio |
| 4.4 | Nombre y concepto para el evento | S | Medio |
| 4.5 | Base de conocimiento del bot desde casos reales | M | Medio |

## 5. SEO, AEO y adquisición

| # | Idea | Esfuerzo | Impacto |
|---|---|---|---|
| 5.1 | `metadataBase`, OG image, robots, sitemap, canonical | S | Alto |
| 5.2 | JSON-LD Organization + LocalBusiness + FAQPage | S | Alto |
| 5.3 | Landings por tipo de evento | M | Alto |
| 5.4 | Recursos descargables con gate de email | M | Medio |
| 5.5 | Versión en inglés | M | Medio |

## 6. Experiencia y estética

Llegan **después** de resolver performance: hoy el techo de LCP es 3,5 s por diseño.

| # | Idea | Esfuerzo | Impacto |
|---|---|---|---|
| 6.1 | Sacar el preloader (o atarlo a carga real, techo 800 ms) | S | Alto |
| 6.2 | Consolidar en una sola librería de animación | M | Medio |
| 6.3 | Reveals con `animation-timeline: view()` nativo | M | Medio |
| 6.4 | Hero tipográfico (resuelve también PERF-02) | M | Medio |
| 6.5 | Pulido para Awwwards | L | Medio |

## 7. Operación y autonomía del cliente

| # | Idea | Esfuerzo | Impacto |
|---|---|---|---|
| 7.1 | CMS para copy y casos | L | Alto |
| 7.2 | Dashboard de leads para Victoria | M | Alto |
| 7.3 | Eventos de GA4 en los hitos del embudo | S | Alto |
| 7.4 | Uptime + presupuesto de performance en CI | S | Medio |
| 7.5 | Runbook de operación | S | Medio |

## Top 3 quick wins

1. **`victoria.png`: 562 KB → ~2 KB** — `next/image` con `width={40} height={40}` en `About.tsx:107`. Diez minutos.
2. **Sacar el preloader** — borrar un componente recupera ~3,5 s de LCP.
3. **`jspdf` a import dinámico** — una línea en `Wizard.tsx:11` saca ~110 KB gzip del bundle de todos.

Los tres juntos: menos de dos horas, probablemente 30-40 puntos de Lighthouse mobile.

## 8. Arquitectura cloud recomendada

### 8.1 Qué hay hoy

    Browser
      ├─ GET /                     → Next 16 en Vercel (SSG/RSC + 20 client components)
      ├─ POST /api/chat            → Anthropic Haiku ──┐
      │                                                └─ fetch HTTP a su propio origen ↓
      ├─ POST /api/capture-lead    → Resend → email          ← ÚNICO REGISTRO
      ├─ POST /api/generate-brief  → Anthropic Haiku (bloquea el submit)
      └─ POST /api/send-brief      → Resend → email          ← ÚNICO REGISTRO
                                      ↑ fire-and-forget, error tragado

    Assets: 2 MP4 en un Supabase de terceros · 5 fotos hotlinkeadas de Unsplash
    Persistencia: ninguna   Observabilidad: ninguna   Rate limiting: ninguno

### 8.2 Los cinco problemas

1. El email es el sistema de registro. Resend es transporte: no se consulta, dedupe, mide ni recupera.
2. La ruta de conversión es fire-and-forget (`Wizard.tsx:52`).
3. Dos endpoints públicos cuestan dinero por request, sin techo.
4. Una función serverless se llama a sí misma por HTTP (`chat/route.ts:34`).
5. Ninguna señal cuando algo se rompe: nueve `catch` ciegos.

### 8.3 Arquitectura propuesta

Dimensionada para decenas de leads por mes. Sin colas dedicadas ni microservicios.
Principio: **escribir primero, notificar después, observar siempre.**

    Browser
      ├─ GET /                     → Next 16 en Vercel (sin cambios)
      ├─ POST /api/chat ───────────┐
      ├─ POST /api/brief ──────────┤  ← Middleware: rate limit por IP + verificación de Origin
      │                            ▼
      │                     src/lib/leads.ts   ← lógica compartida, sin salto HTTP
      │                            │
      │              1. persistLead()  → Neon Postgres   ← FUENTE DE VERDAD
      │              2. notify()       → Resend (+ WhatsApp/Slack)
      │                                  si falla → reintento vía Vercel Workflow
      │              3. track()        → Sentry + GA4
      └─ Assets                    → Vercel Blob (CDN de Vercel)

| Necesidad | Recomendación | Por qué |
|---|---|---|
| Store de leads | Neon Postgres (Vercel Marketplace) | Free tier alcanza; SQL sirve para el dashboard futuro. *Alternativa mínima:* Google Sheets vía service account — Victoria lo filtra sola, sin dashboard que construir. Legítimo a este volumen. |
| Rate limiting | Upstash Redis (`@upstash/ratelimit`) | Serverless, free tier suficiente, dos líneas en middleware. |
| Notificación | Resend (ya está) | No hay razón para cambiarlo; deja de ser el único registro. |
| Reintentos | Vercel Workflow (WDK) | Solo si se prioriza 1.2; con persistencia resuelta, un fallo de email deja de ser pérdida. |
| Errores | Sentry free tier | 5k eventos/mes sobran. |
| Assets | Vercel Blob | Elimina el Supabase ajeno y el hotlinking. |
| Analítica | GA4 + eventos por paso | Saber dónde abandona la gente vale más que el pageview. |
| Secretos | Vercel env vars (ya está) | Bien resuelto. Sumar tope de gasto en la consola de Anthropic. |

**Costo mensual estimado: USD 0-20.** El gasto variable relevante es Anthropic, que hoy no tiene techo.

### 8.4 Qué NO hacer

- No meter Kubernetes, colas dedicadas ni microservicios: el volumen no lo justifica.
- No migrar de Vercel: el fit es correcto.
- No agregar HubSpot/Salesforce todavía: una tabla y un dashboard alcanzan.
- No hacer streaming de todo: el wizard no lo necesita, el chat sí.
- No pasar los endpoints de IA a Edge: Node está bien, no hay ganancia de latencia que importe.

### 8.5 Orden de implementación

1. Arreglar el build (BUG-01)
2. Extraer `src/lib/leads.ts`, eliminar el self-fetch (ARCH-03)
3. Persistencia antes de notificación (ARCH-01)
4. `await` + manejo de error en el submit (ARCH-02)
5. Rate limit en los tres endpoints públicos (SEC-01, SEC-02)
6. Sentry + alerta (ARCH-04)
7. Migrar assets a Vercel Blob (PERF-02)
8. Dashboard de leads (1.5) — el único opcional

Los pasos 1-6 son "listo para producción". Estimado: 2-3 semanas con foco.

## Sesión #1 — 2026-08-01 (colapsada)

Ideación libre previa a la auditoría. Trazabilidad de lo que sobrevivió:

| Idea de la Sesión #1 | Estado en la Sesión #2 |
|---|---|
| Portfolio filtrable por industria | → 3.1 (elevada a Alto: gap universal de la categoría) |
| Métricas de impacto | → 3.5 |
| Smart RFP Analyzer | → 4.2 (mejor fit del que parecía: los congresos usan pliegos) |
| Live Event Naming / Concept Mood Expander | → 4.4 (fusionadas) |
| Kinetic Typography Hero | → 6.4 (ahora también resuelve PERF-02) |
| Pulido para Awwwards | → 6.5 (bloqueada hasta performance y a11y en verde) |
| Timeline de proyecto | → cubierta por CONT-03: `Process.tsx` ya existe, solo hay que remontarlo |
| Live Quote Composer, Venue Match, Agenda Builder, Comparador de Formatos | → despriorizadas: suman superficie de wizard cuando el actual todavía pierde leads |
| Dark mode, micro-interacciones, marquee, Lottie, color harmony, CSS 3D cards | → despriorizadas hasta resolver el techo de LCP |

El texto íntegro de la Sesión #1 (5 categorías × 5 ideas + FODA por categoría) queda anexado
íntegro debajo, sin cambios.

## Historial de sesiones

| Sesión | Fecha | Foco |
|---|---|---|
| #1 | 2026-08-01 | Ideación libre |
| #2 | 2026-08-08 | Post-auditoría: prioridad por riesgo + arquitectura cloud |

---

# Anexo — Sesión #1 completa (2026-08-01): Ideas & FODA original

## 1. Wizard

**Ideas**

1. **Live Quote Composer** — arrastrás/seleccionás servicios y el presupuesto estimado se actualiza en tiempo real, como un carrito para eventos.
2. **Venue Match** — inputás capacidad + ciudad + tipo de espacio → muestra 3 opciones del portfolio con fotos y disponibilidad estimada.
3. **Event Mood Board Selector** — galería visual de estilos (elegante, disruptivo, íntimo, masivo) → al seleccionar genera brief automático con paleta y tono.
4. **Agenda Builder** — construye el timeline del evento hora por hora, Calton sugiere qué servicios se necesitan en cada slot.
5. **Comparador de Formatos** — tabla interactiva: presencial vs. híbrido vs. virtual → diferencias de costo, alcance y experiencia.

**FODA**

| | |
|---|---|
| **F** | Captura leads más calificados que un formulario; experiencia interactiva que refleja la creatividad de la agencia |
| **O** | Segmentación automática de prospectos; datos de uso revelan qué servicios interesan más |
| **D** | Lógica de negocio compleja de mantener; riesgo de abandono si hay demasiados pasos |
| **A** | Expectativas desalineadas si el presupuesto estimado difiere del real; competidores pueden copiar rápido |

---

## 2. Features de Negocio

**Ideas**

1. **Portfolio Filtrable por Industria** — galería de eventos reales filtrable por sector (fintech, pharma, retail). Cada caso: fotos, brief, resultados.
2. **Timeline de Proyecto** — visualización de cómo trabaja Calton: briefing → producción → día D → post-evento. Reduce incertidumbre del cliente.
3. **Calculadora de Timing** — ¿cuánto tiempo necesito? Inputs: fecha, tamaño, complejidad → output: fecha límite para contratar.
4. **Partners & Proveedores** — showcase de alianzas con proveedores premium (catering, A/V, venues). Refuerza credibilidad operativa.
5. **Métricas de Impacto** — sección con counters animados: eventos realizados, asistentes totales, años de experiencia, NPS promedio.

**FODA**

| | |
|---|---|
| **F** | Genera confianza concreta; prueba social cuantitativa y cualitativa en un solo lugar |
| **O** | SEO orgánico con casos reales; aumenta tiempo en sitio; reduce objeciones del equipo de ventas |
| **D** | Requiere contenido real actualizado (fotos, datos, testimonios); esfuerzo editorial continuo |
| **A** | Contenido desactualizado destruye credibilidad; sin fotos reales pierde todo el impacto |

---

## 3. Features AI

**Ideas**

1. **Smart RFP Analyzer** — el usuario pega su RFP y AI extrae puntos clave, identifica servicios aplicables y genera una respuesta preliminar.
2. **Post-Event ROI Report Generator** — inputs: asistentes, objetivos, encuestas → AI genera reporte ejecutivo con métricas y recomendaciones.
3. **Live Event Naming** — AI sugiere nombres creativos para el evento basándose en empresa, industria y objetivo.
4. **Speaker/Entertainment Matcher** — describís el perfil de audiencia → AI sugiere perfiles de speakers o entretenimiento del portfolio.
5. **Concept Mood Expander** — el usuario escribe una palabra (ej: "innovación") → AI devuelve 3 conceptos creativos con paleta, nombre y tono narrativo.

**FODA**

| | |
|---|---|
| **F** | Diferenciación fuerte; "wow factor"; escala sin contratar más personal |
| **O** | Automatiza calificación de leads; posiciona a Calton como agencia tech-forward |
| **D** | Costo de APIs; latencia visible; output de AI puede ser incorrecto o genérico |
| **A** | Privacidad de datos del cliente; expectativas desalineadas si AI falla en vivo |

---

## 4. Estética

**Ideas**

1. **Kinetic Typography Hero** — texto masivo que reacciona al cursor: letras que se repelen, atraen o distorsionan. Sin imágenes, solo tipografía pura.
2. **Micro-interacciones en Cards** — cada card de servicio tiene su propia micro-animación: tilt 3D con perspectiva, reveal con clip-path, particle burst on click.
3. **Infinite Marquee Contextual** — en vez de marquees genéricos, ticker con frases reales de eventos pasados, nombres de clientes, métricas. Integrado al content flow.
4. **Dark Mode con Personalidad** — transición cinematográfica al cambiar de modo (ink spread, luz que se apaga). No el toggle estándar.
5. **Lottie / SVG Illustrations Custom** — ilustraciones propias animadas (no stock) que reemplazan íconos genéricos en secciones clave. Coherentes con la marca.

**FODA**

| | |
|---|---|
| **F** | Primera impresión fuerte; refleja la creatividad de la agencia; eleva percepción de marca |
| **O** | Viralidad / shareable; diferenciación visual clara sobre competidores |
| **D** | Performance impact (LCP, CLS); accesibilidad comprometida si se abusa |
| **A** | Modas visuales envejecen rápido; sobre-diseño puede distraer del mensaje de negocio |

---

## 5. Awwwards Improvements

**Ideas**

1. **Scroll-Driven Narrative** — el scroll cuenta una historia: antes/después de contratar a Calton, morphing de imágenes y texto que se transforma.
2. **Typographic Poster Sections** — secciones enteras basadas en tipografía editorial (NY Times meets Brutalism). Texto como elemento gráfico primario.
3. **Color Harmony Engine** — cada sección tiene su paleta que transita suavemente con el scroll. La experiencia es cromática además de visual.
4. **Codepen-worthy Nav Interaction** — hamburger con SVG path morphing a X. La transición del menú es el highlight de la página.
5. **CSS-only 3D Cards** — sin WebGL, CSS perspective + transforms para tarjetas con profundidad real. Más performante, mismo impacto visual.

**FODA**

| | |
|---|---|
| **F** | Credencial pública de calidad; atrae clientes de alto valor que buscan agencias "premium" |
| **O** | PR gratuito; referral traffic desde Awwwards; portfolio de diseño para el equipo |
| **D** | Requiere pulido extremo (pixel-perfect, sin bugs en inspección); proceso lento |
| **A** | Jurado subjetivo; algunas mejoras para Awwwards pueden dañar conversión real (UX vs. wow) |
