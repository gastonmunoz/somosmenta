"use client";

import { motion } from "framer-motion";

const CREDENTIALS = [
  { label: "Lic. en Relaciones Públicas", sub: "Universidad Abierta Interamericana" },
  { label: "Cs. Empresariales y Sociales", sub: "UCES" },
  { label: "Google Analytics Avanzado", sub: "Google Digital Academy" },
];

const STATS = [
  { value: "360°", label: "Organización integral" },
  { value: "1:1", label: "Atención personalizada" },
];

export default function About() {
  return (
    <section id="nosotros" className="bg-white py-20 md:py-28 px-8 md:px-12 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">

          {/* LEFT — profile card */}
          <motion.div
            className="md:col-span-5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="rounded-2xl border border-[#1A1A1A]/10 shadow-sm relative">
              {/* Banner */}
              <div className="relative h-44 overflow-hidden rounded-t-2xl">
                <img
                  src="/images/victoria_banner.jfif"
                  alt=""
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-[#1A1A1A]/20" />
              </div>

              {/* Avatar — overlaps banner, not clipped */}
              <div className="absolute left-6 z-10 w-20 h-20 rounded-full overflow-hidden border-[3px] border-white shadow-md" style={{ top: "calc(11rem - 2.5rem)" }}>
                <img
                  src="/images/victoria.png"
                  alt="Victoria Escorsa"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Profile body */}
              <div className="bg-[#F9FAF8] px-6 pb-6 pt-14 rounded-b-2xl">
                {/* Name + title — left of where avatar sits */}
                <div className="mb-4 pl-24 -mt-10">
                  <h3
                    className="text-lg font-normal text-[#1A1A1A] leading-tight"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Victoria Escorsa
                  </h3>
                  <p className="text-[10px] uppercase tracking-[2.5px] text-[#5D8A6B] mt-0.5">
                    Fundadora & Directora
                  </p>
                </div>

                {/* Bio corta */}
                <p className="text-[12px] text-[#888] leading-[1.8] font-light mb-5">
                  Marketing & Communication Strategy · LATAM
                </p>

                {/* Credentials */}
                <div className="flex flex-col gap-2.5">
                  {CREDENTIALS.map((c) => (
                    <div
                      key={c.label}
                      className="flex items-start gap-2.5 bg-white rounded-lg px-3 py-2.5 border border-[#1A1A1A]/8"
                    >
                      <div className="w-1 h-1 rounded-full bg-[#5D8A6B] mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-[11px] font-medium text-[#1A1A1A]">{c.label}</p>
                        <p className="text-[10px] text-[#888]">{c.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Idiomas */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  {["Español", "Inglés", "Portugués"].map((lang) => (
                    <span
                      key={lang}
                      className="text-[9px] uppercase tracking-[1.5px] text-[#888] border border-[#1A1A1A]/10 rounded-full px-2.5 py-0.5"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — copy */}
          <motion.div
            className="md:col-span-7 flex flex-col justify-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="text-[10px] tracking-[4px] uppercase text-[#5D8A6B] mb-4">
              Quiénes somos
            </p>
            <h2
              className="text-3xl md:text-4xl font-normal text-[#1A1A1A] mb-6 leading-snug"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Boutique.
              <br />
              360°. Presente.
            </h2>

            <p className="text-[13px] text-[#555] leading-[1.9] font-light mb-4">
              Detrás de Calton está Victoria Escorsa. Más de una década liderando
              comunicaciones y marketing corporativo en empresas multinacionales le
              enseñó algo simple: los eventos que funcionan no son los más caros,
              sino los que entienden para quién existen.
            </p>
            <p className="text-[13px] text-[#555] leading-[1.9] font-light mb-10">
              Somos el nexo entre tu empresa y los proveedores correctos. No somos
              una agencia masiva: trabajamos con atención personalizada en cada
              proyecto, gestionando cada detalle logístico, creativo y
              comunicacional para que vos te enfoques en lo que importa.
            </p>

            {/* Stats */}
            <div className="flex gap-12 pt-8 border-t border-[#1A1A1A]/10">
              {STATS.map((s) => (
                <div key={s.value}>
                  <p
                    className="text-[32px] font-normal text-[#1A1A1A] leading-none"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {s.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-[1.5px] text-[#888888] mt-2">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
