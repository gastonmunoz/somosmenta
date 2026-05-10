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
