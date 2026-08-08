# FODA — Calton

> FODA #1 — 2026-08-08
> Fuentes: `audit.md` (Auditoría #1, misma fecha) · código en `C:\code\rebranding-projects\calton`
> · `analysis.md` previo (sesión de ideación, 2026-08-01)
>
> **Nota de método:** los claims sobre mercado y competencia están marcados como
> **[SUPUESTO]** cuando no fueron validados con fuentes externas en esta sesión. No se hizo
> búsqueda web ni auditoría de sitios de competidores. Todo lo referido al producto y al código
> **sí** está verificado por lectura directa y por la ejecución de `pnpm build` / `pnpm lint`.

---

## Killer risk

**El sitio no compila, y si compilara perdería leads en silencio: Calton está a punto de lanzar una
máquina de captación que no puede desplegarse y que no guarda lo que captura.**

---

## Scoring estratégico

| Dimensión | Score /10 | Fundamento |
|---|---|---|
| Diferenciación de producto | **8** | Wizard con PDF + chatbot con IA: nadie más en la categoría los tiene juntos. |
| Madurez técnica | **3** | Build roto, cero persistencia, cero observabilidad. |
| Preparación para lanzar | **2** | Cinco bloqueantes críticos abiertos, uno de ellos legal. |
| Fortaleza de marca / diseño | **8** | Manual de marca aplicado con rigor; tokens y tipografía coherentes. |
| Capacidad de conversión | **4** | El embudo existe y es bueno, pero pierde por el fondo. |

**Promedio: 5,0 / 10** — un producto con techo alto y piso roto.

---

## Fortalezas

1. **Un embudo de conversión que la categoría no tiene.** El wizard de 5 pasos que emite un PDF
   personalizado (`src/lib/generateBrief.ts`, 158 LOC) más un chatbot con Claude Haiku que califica
   leads en conversación (`src/lib/chatbot-prompt.ts`) es un aparato de captación de nivel producto,
   no de nivel folleto. La competencia típica de la categoría ofrece un Contact Form 7. **[SUPUESTO
   sobre el estado de la competencia]**

2. **Ejecución de marca genuinamente buena.** El manual (`manual-de-marca/`) está traducido a tokens
   CSS con criterio real, no decorativo: la nota en CLAUDE.md sobre por qué `--brand` (#849F54,
   2,9:1) nunca puede ser texto y `--brand-mid` (#3F592A, 8,6:1) sí, es el tipo de rigor que casi
   ningún sitio de agencia tiene. El diseño es el activo más terminado del proyecto.

3. **Stack moderno y con techo.** Next.js 16.2.6 + React 19 + Tailwind v4 sobre Vercel. Comparado con
   el WordPress heredado que domina la vertical **[SUPUESTO]**, Calton tiene margen para agregar
   landings, blog, i18n y features de IA sin replataformar. La deuda es de implementación, no de
   arquitectura.

4. **Superficie de ataque acotada y secretos bien manejados.** Un solo route, cuatro API routes, sin
   auth, sin base de datos. Todas las claves salen de `process.env`, `.env*` está en `.gitignore` y
   no hay un solo secreto hardcodeado. Es una base chica y limpia para endurecer.

5. **Copy con voz propia.** El tuteo rioplatense es consistente entre la página y el system prompt
   del bot. "Somos agnósticos al caos porque está incorporado en nuestro proceso"
   (`chatbot-prompt.ts:24`) es posicionamiento real, no relleno.

6. **El fallback del wizard ya está escrito.** `Wizard.tsx:58-68` tiene el contenido determinístico
   listo para cuando la IA falla. Es el 80 % del trabajo de USA-02 ya hecho: solo hay que invertir el
   orden de ejecución.

7. **Ámbito bien delimitado.** 3.479 LOC, un route. Todo lo que este informe pide se puede hacer en
   semanas, no en trimestres. La chicura del proyecto es una fortaleza estratégica.

---

## Debilidades

1. **🔴 El build no pasa.** `pnpm build` sale con exit 1 en el prerender de `/_global-error`. Vercel
   corre `next build` en cada deploy. El proyecto ya está linkeado (`.vercel/project.json`).
   **Hoy no hay forma de publicar.** (BUG-01)

2. **🔴 Los leads no se guardan.** Ambas rutas de captura solo hacen `resend.emails.send(...)`. El
   email es el único registro. Y `Wizard.tsx:52` lo envía con `.catch(() => {})` — sin `await`, sin
   chequear el status, mostrando la pantalla de éxito pase lo que pase. Un fallo de Resend, o un
   usuario que cierra la pestaña, borra el lead sin dejar traza. (ARCH-01, ARCH-02)

3. **🔴 Los endpoints de IA son de acceso libre.** `/api/chat` y `/api/generate-brief` aceptan POST de
   cualquiera y cada request factura tokens de Anthropic. Sin rate limit, sin verificación de origen,
   sin tope de gasto, y `messages` se reenvía sin validar longitud. El chat es, efectivamente, un
   asistente de propósito general gratis pagado por Calton. (SEC-01)

4. **🔴 Las tipografías no tienen licencia web.** Coolvetica (Typodermic) y Champagne & Limousines
   (Nymphont) están embebidas por `next/font/local` bajo licencias personal-use que prohíben
   explícitamente el web embedding. No hay solución técnica. Y como la marca entera se apoya en esas
   fuentes, sustituirlas post-lanzamiento significa rehacer el manual. (LEGAL-01)

5. **🟠 3,5 segundos de preloader falso.** `DURATION = 2200` + 380 ms + 900 ms de salida, con el
   scroll bloqueado, en cada visita, sin skip, sin relación con la carga real. Fija un piso de ~3,5 s
   al LCP contra un umbral "good" de 2,5 s. Ninguna otra optimización importa mientras esté.
   (PERF-01)

6. **🟠 El sitio no tiene una sola foto de un evento real de Calton.** Cinco imágenes de Unsplash en
   las secciones vivas, y un `alt` que afirma "Team building organizado por Calton" sobre una de
   ellas. Para una agencia de eventos, el portfolio *es* el producto. (CONT-01, CONT-02)

7. **🟠 Se perdieron Proceso y FAQ.** Existen como código (312 LOC, con commits recientes dedicados a
   pulirlos) pero `page.tsx` ya no los monta. Se fue el contenido más indexable del sitio y el bloque
   que más reduce la incertidumbre del comprador B2B. Las FAQ hoy viven solo dentro del prompt del
   chatbot: invisibles para Google. (CONT-03)

8. **🟠 Sin política de privacidad, con GA corriendo y PII entrando por dos vías.** Ley 25.326 exige
   informar la finalidad al recolectar; GDPR exige consentimiento previo para GA si hay visitantes de
   la UE. El footer no tiene un solo link legal. (LEGAL-02)

9. **🟡 Ciego en producción.** Nueve bloques `catch` vacíos, sin Sentry, sin logging, sin alertas.
   Cuando el pipeline de leads se rompa, la señal va a ser el cliente preguntando por qué hace tres
   semanas no entra nada. (ARCH-04)

10. **🟡 Un cuarto del código está muerto.** 869 de 3.479 LOC sin importadores. Y CLAUDE.md describe
    una arquitectura que ya no existe en cinco puntos distintos — riesgoso en un repo cuyo propio
    CLAUDE.md advierte "esta no es la Next.js que conocés". (DEBT-01, DEBT-02)

11. **🟡 No hay CMS.** Cada corrección de copy exige desarrollador, commit y deploy. Sobre 12 meses
    eso cuesta más que la diferencia de licencia con Webflow, y le quita autonomía a la clienta.

---

## Oportunidades

1. **Posicionarse como "la agencia de eventos que piensa como producto".** Ninguna agencia de la
   vertical se presenta con esa identidad **[SUPUESTO]**. El wizard y el chatbot ya la sostienen — lo
   que falta es contarla explícitamente en el copy y en el pitch de ventas.

2. **Congresos científicos como nicho defendible.** El H1 y el copy ya lo mencionan
   (`hero-section-calton.tsx:93`) y `wizard-types.ts` tiene `congreso-cientifico` como tipo de
   evento. Es un segmento de alto ticket, ciclo largo y comprador sofisticado, donde una experiencia
   digital superior pesa mucho más que en eventos corporativos genéricos. Merece su propia landing.

3. **SEO/AEO con las FAQ que ya están escritas.** Las siete respuestas de `chatbot-prompt.ts:14-33`
   son contenido terminado y de calidad. Publicadas como sección con `FAQPage` JSON-LD alimentan
   featured snippets y respuestas de asistentes de IA. **Es contenido que ya existe y solo hay que
   dejar de esconderlo.**

4. **Los datos del wizard son inteligencia de mercado.** Una vez que ARCH-01 esté resuelto, cada
   brief completado revela tipo de evento, tamaño y banda de presupuesto de la demanda real. En seis
   meses eso es un dataset propietario para decidir qué servicios empujar — y potencialmente un
   informe anual de mercado que sirve como pieza de PR.

5. **Landings por tipo de evento.** Un route por tipo (`/congresos-cientificos`,
   `/lanzamientos`, `/capacitaciones`) reutilizando los componentes existentes. Es multiplicar la
   superficie de SEO reutilizando código y contenido ya escrito.

6. **Español/inglés para clientes multinacionales.** El copy dice "corporaciones de más de 1.000
   empleados" y "multinacionales". Esos compradores frecuentemente evalúan en inglés. Next tiene
   i18n nativo y el contenido es chico.

7. **Awwwards / Site of the Day como canal de PR.** La sesión de ideación previa
   (`analysis.md` §5) ya lo apuntó. Con el nivel de diseño actual es alcanzable — pero **solo después**
   de resolver performance y accesibilidad, porque el jurado penaliza ambas. La oportunidad y la
   remediación apuntan en la misma dirección.

8. **Cerrar el loop del chatbot con agendamiento.** El bot ya deriva a `cal.com/calton`
   (`chatbot-prompt.ts:49`). Convertir el marcador `[LEAD_READY]` en tool use real (que además
   arregla SEC-03) permitiría que el bot agende la llamada dentro de la conversación. El fix de
   seguridad y la mejora de producto son la misma tarea.

---

## Amenazas

1. **Un deploy a producción con el estado actual del pipeline de leads quema la relación con la
   clienta.** El escenario concreto: se lanza, entran diez briefs, Resend falla en tres, nadie se
   entera hasta que un prospecto llama enojado. La confianza no se recupera con un parche.

2. **Abuso económico de los endpoints de IA.** No hipotético: los scrapers y bots que barren
   `/api/*` en busca de proxies LLM abiertos son un fenómeno corriente. Una factura inesperada de
   Anthropic en el mes uno es un evento de relación con el cliente, no solo un incidente técnico.

3. **Exposición legal por las tipografías.** Typodermic tiene historial de hacer valer sus licencias
   **[SUPUESTO — verificar]**. Un reclamo llegaría justo en el lanzamiento, cuando el sitio recién
   toma visibilidad.

4. **Reclamo por privacidad.** GA sin consentimiento + captura de PII sin aviso, para una agencia que
   dice trabajar con multinacionales — es decir, exactamente el tipo de cliente con departamento de
   compliance que revisa a sus proveedores.

5. **Los videos del hero dependen de un Supabase ajeno.** `cdtktxwgtptsazbtehxa.supabase.co` no está
   en la cuenta del proyecto. Si se pausa por inactividad, agota su egress o alguien lo borra, el
   hero de producción queda roto sin aviso y sin que nadie de Calton pueda arreglarlo.

6. **Sin fotos reales, un competidor con portfolio gana la comparación.** Un comprador que ve dos
   sitios —uno con conferencias de Unsplash y otro con fotos de eventos entregados— elige el segundo,
   por mejor que sea el wizard del primero. El diferenciador tecnológico no compensa la ausencia de
   evidencia de trabajo.

7. **Riesgo de bus factor sobre un stack sofisticado.** Next 16 + React 19 + Tailwind v4 + GSAP +
   framer-motion no lo mantiene cualquier freelance. Si el desarrollador actual sale, la clienta
   queda con un sitio que no puede editar ni contratar fácilmente que le editen.

8. **CLAUDE.md desalineado propaga errores.** Cinco afirmaciones falsas en el documento que orienta a
   cualquier agente o desarrollador nuevo, en un repo que se apoya explícitamente en ese documento.

---

## Cruces estratégicos

### FO — Fortalezas × Oportunidades (atacar)

- **F1 + O1 + O2 → Vender el wizard como argumento comercial.** El wizard y el chatbot no son
  features del sitio: son la demostración de cómo Calton produce eventos. Bajarlo al copy del hero y
  al pitch de ventas convierte un costo de desarrollo en un diferenciador articulado. Empezar por la
  landing de congresos científicos, donde el comprador es el más sofisticado.
- **F3 + O5 → Escalar landings sobre los componentes que ya existen.** Con Next 16 y una biblioteca
  de secciones ya construida, cada landing nueva es contenido, no ingeniería.
- **F6 + O8 → Convertir `[LEAD_READY]` en tool use.** Arregla SEC-03, elimina el parseo frágil y
  habilita agendamiento dentro del chat. Un solo trabajo, tres resultados.

### FA — Fortalezas × Amenazas (defender)

- **F4 + A2 → El código chico y limpio hace que blindar los endpoints sea trabajo de medio día.**
  Rate limit + validación de origen + tope de gasto en la consola de Anthropic. Barato ahora,
  carísimo después de la primera factura.
- **F2 + A6 → El diseño fuerte hace que las fotos reales rindan el doble.** El sistema visual ya
  está; solo le falta el contenido correcto. Es la inversión con mejor retorno del proyecto y no
  requiere una línea de código.

### DO — Debilidades × Oportunidades (reforzar)

- **D7 + O3 → Remontar la FAQ resuelve una debilidad y captura una oportunidad con el mismo commit.**
  El contenido ya está escrito y probado en el prompt del bot; solo hay que renderizarlo y agregar
  JSON-LD.
- **D2 + O4 → Arreglar la persistencia no es solo tapar un agujero, es empezar a construir el
  dataset.** El mismo trabajo que evita perder leads genera la inteligencia de mercado.
- **D5 + O7 → El camino a Awwwards pasa por arreglar performance.** Sacar el preloader mejora
  conversión *y* acerca la credencial. No hay que elegir.

### DA — Debilidades × Amenazas (sobrevivir)

- **D1 + D2 + A1 → No desplegar a producción hasta cerrar BUG-01, ARCH-01 y ARCH-02.** Es la
  recomendación más importante de todo este informe. Un lanzamiento con leads perdiéndose hace más
  daño que un lanzamiento tres semanas más tarde.
- **D4 + A3 → La decisión de tipografías tiene que tomarse esta semana**, no en el lanzamiento.
  Si se opta por sustituir, hay que rehacer el manual de marca — y eso tiene un plazo que corre.
- **D8 + A4 → Privacidad y consentimiento son un día de trabajo** y eliminan una categoría entera de
  riesgo. No hay razón para postergarlo.

---

## Lectura de conjunto

Calton hizo la parte difícil y salteó la fácil. La capa que normalmente distingue a un buen sitio de
agencia —marca, diseño, interacción, un embudo que realmente califica— está construida y bien
construida. Lo que falta es la plomería sin gloria: que el build pase, que el lead se guarde, que el
endpoint no se pueda abusar, que las fuentes tengan licencia.

Eso es una buena posición. La plomería se resuelve con semanas de trabajo conocido; el diseño y el
posicionamiento habrían tomado meses y no se compran. El error sería confundir "se ve terminado" con
"está terminado" y publicar.

**Recomendación central: congelar la fecha de lanzamiento hasta cerrar los cinco críticos.** Con
foco, son de dos a tres semanas.

---

## Historial

| FODA | Fecha | Killer risk | Score | Estado |
|---|---|---|---|---|
| #1 | 2026-08-08 | Build roto + leads perdiéndose en silencio | 5,0/10 | Vigente |

**Próxima revisión sugerida:** 2026-11-08 (3 meses), o antes si se lanza a producción.
</content>
