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
