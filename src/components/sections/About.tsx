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
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-16 lg:gap-24">
        {/* LEFT: label + headline */}
        <div>
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

          <div className="overflow-hidden">
            {HEADLINE.map((line, i) => (
              <motion.span
                key={line}
                className="block leading-[0.88]"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(4.5rem, 7vw, 6rem)",
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
            className="h-px bg-[var(--black)]/10 mt-8 mb-8"
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25, ease }}
          />

          <motion.div
            className="flex gap-10 md:gap-12"
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
                    fontSize: "clamp(1.8rem, 2.5vw, 2.5rem)",
                    fontWeight: 900,
                    color: s.accent ? "var(--sage)" : "var(--black)",
                  }}
                >
                  {s.value}
                </p>
                <p
                  className="uppercase mt-2"
                  style={{
                    fontSize: "7px",
                    letterSpacing: "2px",
                    color: "var(--gray-text)",
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT: bio + Victoria */}
        <div className="flex flex-col justify-center mt-10 md:mt-0">
          <motion.div
            className="h-px bg-[var(--black)]/10 mb-8 md:hidden"
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
              style={{ color: "#555" }}
            >
              Detrás de Calton está Victoria Escorsa. Más de una década
              liderando comunicaciones y marketing corporativo en empresas
              multinacionales le enseñó algo simple: los eventos que funcionan
              no son los más caros, sino los que entienden para quién existen.
            </p>
            <p
              className="text-[13px] leading-[1.95] font-light"
              style={{ color: "#555" }}
            >
              Somos el nexo entre tu empresa y los proveedores correctos. No
              somos una agencia masiva: trabajamos con atención personalizada en
              cada proyecto, gestionando cada detalle logístico, creativo y
              comunicacional para que vos te enfoques en lo que importa.
            </p>
          </motion.div>

          <motion.div
            className="flex items-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35, ease }}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--black)]/20 flex-shrink-0">
              <img
                src="/images/victoria.png"
                alt="Victoria Escorsa"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mr-4">
              <p
                className="text-[var(--black)] leading-tight"
                style={{ fontFamily: "var(--font-playfair)", fontSize: "15px" }}
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
                  className="border border-[var(--black)]/20 rounded-full px-2.5 py-0.5"
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
