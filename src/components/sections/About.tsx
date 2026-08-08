"use client"

import { motion } from "framer-motion"

const ease = [0.23, 1, 0.32, 1] as const

const HEADLINE = ["SOMOS", "LOS QUE", "hacen que", "SUCEDA."]

export default function About() {
  return (
    <section
      id="nosotros"
      className="bg-[var(--brand-tint)] px-8 md:px-12 xl:px-20 py-20 md:py-28"
      style={{ borderBottom: "3px solid var(--charcoal)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-16 lg:gap-24">
        {/* LEFT: label + headline */}
        <div>
          <motion.p
            className="uppercase text-[var(--brand-mid)] mb-10"
            style={{ fontSize: "8px", letterSpacing: "4px" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Quiénes somos
          </motion.p>

          <h2 className="overflow-hidden">
            {HEADLINE.map((line, i) => (
              <motion.span
                key={line}
                className="block leading-[0.88]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(4.5rem, 7vw, 6rem)",
                  fontWeight: 400,
                  fontStyle: i === 2 ? "italic" : "normal",
                  letterSpacing: i === 2 ? "-1px" : "-2px",
                  color: i === 2 ? "var(--brand-mid)" : "var(--charcoal)",
                }}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: i * 0.08, ease }}
              >
                {line}
              </motion.span>
            ))}
          </h2>

          <motion.div
            className="h-px bg-[var(--charcoal)]/10 mt-8 mb-8"
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25, ease }}
          />
        </div>

        {/* RIGHT: bio + Victoria */}
        <div className="flex flex-col justify-start mt-10 md:mt-0 md:pt-14">
          <motion.div
            className="h-px bg-[var(--charcoal)]/10 mb-8 md:hidden"
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25, ease }}
          />

          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
          >
            <p
              className="text-[13px] leading-[1.95] font-light mb-4"
              style={{ color: "var(--charcoal)" }}
            >
              En CALTON creemos que un evento es mucho más que una producción.
              Es una oportunidad para conectar personas, compartir
              conocimiento y fortalecer la identidad de una organización.
            </p>
            <p
              className="text-[13px] leading-[1.95] font-light"
              style={{ color: "var(--charcoal)" }}
            >
              Con más de una década de experiencia liderando proyectos de
              comunicación y organización de eventos para empresas
              multinacionales e instituciones, acompañamos a nuestros clientes
              desde la estrategia hasta la ejecución, integrando comunicación,
              producción y gestión bajo un mismo enfoque.
            </p>
          </motion.div>

          <motion.div
            className="flex items-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35, ease }}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--charcoal)]/20 flex-shrink-0">
              <img
                src="/images/victoria.png"
                alt="Victoria Escorsa"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mr-4">
              <p
                className="text-[var(--charcoal)] leading-tight"
                style={{ fontFamily: "var(--font-display)", fontSize: "15px" }}
              >
                Victoria Escorsa
              </p>
              <p
                className="uppercase mt-0.5"
                style={{
                  fontSize: "7px",
                  letterSpacing: "2.5px",
                  color: "var(--gray-text)",
                }}
              >
                Fundadora & Directora
              </p>
            </div>
            {["Lic. Relaciones Públicas", "Google Analytics", "LATAM"].map(
              (c) => (
                <span
                  key={c}
                  className="border border-[var(--charcoal)]/20 rounded-full px-2.5 py-0.5"
                  style={{
                    fontSize: "7px",
                    letterSpacing: "1px",
                    color: "var(--gray-text)",
                  }}
                >
                  {c}
                </span>
              ),
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
