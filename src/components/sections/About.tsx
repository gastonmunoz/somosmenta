"use client";

import { motion } from "framer-motion";

const ease = [0.23, 1, 0.32, 1] as const;

const HEADLINE = ["Boutique.", "360°.", "Presente."];

const STATS = [
  { value: "360°", label: "Organización integral" },
  { value: "1:1", label: "Atención personalizada" },
];

export default function About() {
  return (
    <section id="nosotros" className="overflow-hidden bg-white">
      <div className="flex flex-col md:flex-row">

        {/* LEFT: full-bleed image panel */}
        <motion.div
          className="relative overflow-hidden w-full md:flex-none md:w-[42%] order-2 md:order-1"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease }}
        >
          {/* Mobile: fixed aspect; desktop: stretches to right-col height */}
          <div className="aspect-[4/3] md:aspect-auto md:absolute md:inset-0" />
          <img
            src="/images/victoria_banner.jfif"
            alt="Victoria Escorsa"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-[#1A1A1A]/30 to-[#1A1A1A]/10" />

          {/* Victoria identity overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9">
            <div className="flex items-end gap-4 mb-3">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/40 flex-shrink-0">
                <img
                  src="/images/victoria.png"
                  alt="Victoria Escorsa"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3
                  className="text-white font-normal leading-tight text-lg"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Victoria Escorsa
                </h3>
                <p className="text-white/50 uppercase mt-0.5" style={{ fontSize: "9px", letterSpacing: "2.5px" }}>
                  Fundadora & Directora
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {["Lic. Relaciones Públicas", "Google Analytics", "LATAM"].map(c => (
                <span
                  key={c}
                  className="border border-white/20 text-white/50 rounded-full px-2.5 py-0.5"
                  style={{ fontSize: "8px", letterSpacing: "1px" }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT: editorial text */}
        <div className="flex-1 flex flex-col justify-center px-9 md:px-12 lg:px-16 xl:px-20 py-16 md:py-24 order-1 md:order-2">

          <motion.p
            className="uppercase text-[var(--sage)] mb-7"
            style={{ fontSize: "10px", letterSpacing: "4px" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Quiénes somos
          </motion.p>

          {/* Staircase headline */}
          <div className="overflow-hidden mb-10">
            {HEADLINE.map((word, i) => (
              <motion.span
                key={word}
                className="block font-normal leading-[1.05] text-[var(--black)]"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(2.8rem, 4.5vw, 4.8rem)",
                  marginLeft: `${i * 11}%`,
                  ...(i === 2 ? { fontStyle: "italic", color: "var(--sage)" } : {}),
                }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease }}
              >
                {word}
              </motion.span>
            ))}
          </div>

          <motion.div
            className="h-px bg-[#1A1A1A]/10 mb-8"
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25, ease }}
          >
            <p className="text-[13px] text-[#555] leading-[1.95] font-light mb-4">
              Detrás de Calton está Victoria Escorsa. Más de una década liderando
              comunicaciones y marketing corporativo en empresas multinacionales le
              enseñó algo simple: los eventos que funcionan no son los más caros,
              sino los que entienden para quién existen.
            </p>
            <p className="text-[13px] text-[#555] leading-[1.95] font-light">
              Somos el nexo entre tu empresa y los proveedores correctos. No somos
              una agencia masiva: trabajamos con atención personalizada en cada
              proyecto, gestionando cada detalle logístico, creativo y
              comunicacional para que vos te enfoques en lo que importa.
            </p>
          </motion.div>

          <motion.div
            className="h-px bg-[#1A1A1A]/10 mt-8 mb-8"
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
          />

          {/* Editorial stats */}
          <motion.div
            className="flex gap-12"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35, ease }}
          >
            {STATS.map(s => (
              <div key={s.value}>
                <p
                  className="font-normal text-[var(--black)] leading-none"
                  style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2.5rem, 4vw, 3.5rem)" }}
                >
                  {s.value}
                </p>
                <p className="uppercase text-[var(--gray-text)] mt-2" style={{ fontSize: "10px", letterSpacing: "2px" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
