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

      <div className="overflow-hidden pb-6 mb-10">
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
