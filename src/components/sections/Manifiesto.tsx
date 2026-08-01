"use client"

import { motion } from "framer-motion"

const ease = [0.23, 1, 0.32, 1] as const

const HEADLINE = ["CADA", "EVENTO", "importa."]

export default function Manifiesto() {
  return (
    <section
      id="manifiesto"
      className="bg-[var(--brand-tint)] px-8 md:px-12 xl:px-20 py-20 md:py-28"
      style={{ borderBottom: "3px solid var(--charcoal)" }}
    >
      <motion.p
        className="uppercase text-[var(--brand-mid)] mb-10"
        style={{ fontSize: "8px", letterSpacing: "4px" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Manifiesto
      </motion.p>

      <div className="overflow-hidden pb-6 mb-10">
        {HEADLINE.map((line, i) => (
          <motion.span
            key={line}
            className="block leading-[0.82]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(4rem, 9vw, 10rem)",
              fontWeight: 400,
              fontStyle: i === 2 ? "italic" : "normal",
              letterSpacing: i === 2 ? "-1px" : "-3px",
              color: i === 2 ? "var(--brand-mid)" : "var(--charcoal)",
            }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.8, delay: i * 0.1, ease }}
          >
            {line}
          </motion.span>
        ))}
      </div>

      <motion.p
        className="font-light leading-[1.7]"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          color: "var(--gray-text)",
          maxWidth: "420px",
        }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.35, ease }}
      >
        En CALTON entendemos que la estrategia, la comunicación y la producción no funcionan por separado. Diseñamos experiencias que representan la esencia de cada organización.
      </motion.p>
    </section>
  )
}
