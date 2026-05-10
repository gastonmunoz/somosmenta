"use client"

import { motion } from "framer-motion"

const ease = [0.23, 1, 0.32, 1] as const

const IMGS = {
  eventos: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&auto=format&fit=crop&q=80",
  marca: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&auto=format&fit=crop&q=80",
  equipo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80",
  prensa: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&auto=format&fit=crop&q=80",
}

const Tag = ({ label, dark = false }: { label: string; dark?: boolean }) => (
  <span
    className={`uppercase rounded-full px-2.5 py-0.5 border ${
      dark
        ? "border-white/25 text-white/55"
        : "border-[var(--sage)]/40 text-[var(--sage)]"
    }`}
    style={{ fontSize: "9px", letterSpacing: "1.5px" }}
  >
    {label}
  </span>
)

const STAIRCASE = [
  { text: "Experiencias", indent: "" },
  { text: "que definen", indent: "ml-[8%] md:ml-[14%]" },
  { text: "marcas.", indent: "ml-[16%] md:ml-[28%]", accent: true },
]

export function EditorialServicesGrid() {
  return (
    <section id="servicios" className="overflow-hidden bg-white py-20 md:py-28">

      {/* Header */}
      <div className="px-8 md:px-12 xl:px-20 mb-10 md:mb-14">
        <motion.p
          className="uppercase text-[var(--sage)] mb-6"
          style={{ fontSize: "10px", letterSpacing: "4px" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Lo que hacemos
        </motion.p>

        <div className="overflow-hidden">
          {STAIRCASE.map((line, i) => (
            <motion.span
              key={line.text}
              className={`block font-normal leading-[1.08] ${line.indent} ${
                line.accent ? "italic text-[var(--sage)]" : "text-[var(--black)]"
              }`}
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(2.5rem, 5.5vw, 5.5rem)",
              }}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: i * 0.1, ease }}
            >
              {line.text}
            </motion.span>
          ))}
        </div>
      </div>

      {/* ── MOBILE: stacked tiles ── */}
      <div className="md:hidden px-8 flex flex-col gap-2.5">
        {[
          { num: "01 — Eventos", title: "Eventos corporativos", img: IMGS.eventos, tags: ["Conferencias", "Convenciones"] },
          { num: "02 — Marca", title: "Lanzamientos de marca", img: IMGS.marca, tags: ["Lanzamientos", "Activaciones"] },
          { num: "03 — Equipo", title: "Team Building", img: IMGS.equipo, tags: ["Team building", "Cenas"] },
          { num: "04 — Prensa", title: "Gestión de prensa", img: IMGS.prensa, tags: ["Medios", "Cobertura"] },
        ].map((s, i) => (
          <motion.div
            key={s.num}
            className="relative overflow-hidden"
            style={{ aspectRatio: "4/3" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.06, ease }}
          >
            <img
              src={s.img}
              alt={s.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/85 via-[#1A1A1A]/25 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="text-white/50 uppercase" style={{ fontSize: "9px", letterSpacing: "3px" }}>{s.num}</span>
            </div>
            <div className="absolute bottom-5 left-4 right-4">
              <h3 className="text-white text-xl font-normal mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                {s.title}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map(t => <Tag key={t} label={t} dark />)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── DESKTOP: editorial asymmetric grid ── */}
      <div className="hidden md:flex gap-2 px-8 md:px-12 xl:px-20">

        {/* LEFT: 01 Eventos — tall image spanning full height */}
        <motion.div
          className="relative overflow-hidden flex-none"
          style={{ width: "41%" }}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
        >
          <img
            src={IMGS.eventos}
            alt="Eventos corporativos"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/88 via-[#1A1A1A]/20 to-transparent" />

          <div className="absolute top-7 left-7">
            <span className="text-white/50 uppercase" style={{ fontSize: "10px", letterSpacing: "3px" }}>
              01 — Eventos
            </span>
          </div>

          <div className="absolute bottom-8 left-7 right-7">
            <h3
              className="text-white font-normal leading-snug mb-3"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)" }}
            >
              Eventos corporativos a gran escala
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Conferencias", "Convenciones", "Seminarios"].map(t => <Tag key={t} label={t} dark />)}
            </div>
          </div>
        </motion.div>

        {/* RIGHT column */}
        <div className="flex-1 flex flex-col gap-2">

          {/* Top row: 02 text + 03 image */}
          <div className="flex gap-2 min-h-[320px] lg:min-h-[360px]">

            {/* 02 Marca — editorial text tile */}
            <motion.div
              className="flex-1 bg-[var(--sage-light)] p-8 lg:p-10 flex flex-col justify-between"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.08, ease }}
            >
              <div>
                <span className="text-[var(--sage)] uppercase block mb-5" style={{ fontSize: "10px", letterSpacing: "3px" }}>
                  02 — Marca
                </span>
                <h3
                  className="font-normal text-[var(--black)] leading-snug mb-4"
                  style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)" }}
                >
                  Lanzamientos y experiencias de marca
                </h3>
                <p className="text-[13px] text-[#555] leading-[1.9] font-light">
                  Presentaciones de producto y activaciones inmersivas que generan impacto real y conectan tu marca con las personas.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                {["Lanzamientos", "Activaciones", "Brand experience"].map(t => <Tag key={t} label={t} />)}
              </div>
            </motion.div>

            {/* 03 Equipo — image tile */}
            <motion.div
              className="relative overflow-hidden flex-none"
              style={{ width: "36%" }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.16, ease }}
            >
              <img
                src={IMGS.equipo}
                alt="Team building"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-[#1A1A1A]/10 to-transparent" />
              <div className="absolute bottom-6 left-5 right-5">
                <span className="text-white/50 uppercase block mb-1" style={{ fontSize: "10px", letterSpacing: "3px" }}>
                  03 — Equipo
                </span>
                <span
                  className="text-white font-normal"
                  style={{ fontFamily: "var(--font-playfair)", fontSize: "1.15rem" }}
                >
                  Team Building
                </span>
              </div>
            </motion.div>
          </div>

          {/* Bottom: 04 Prensa — wide image stripe */}
          <motion.div
            className="relative overflow-hidden min-h-[200px] lg:min-h-[220px]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.24, ease }}
          >
            <img
              src={IMGS.prensa}
              alt="Gestión de prensa"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/85 via-[#1A1A1A]/45 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <span className="text-white/50 uppercase block mb-2" style={{ fontSize: "10px", letterSpacing: "3px" }}>
                04 — Prensa
              </span>
              <h3
                className="text-white font-normal leading-snug"
                style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)" }}
              >
                Gestión de prensa y comunicación
              </h3>
            </div>
          </motion.div>

        </div>
      </div>

    </section>
  )
}
