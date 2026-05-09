"use client"

import React from 'react'

type ServiceCard = {
  num: string
  title: string
  desc: string
  tags: string[]
  image: string
  bg: string
  top: string
  zIndex: number
  dark: boolean
  shadow: string
}

const services: ServiceCard[] = [
  {
    num: "01 — Eventos",
    title: "Eventos corporativos a gran escala",
    desc: "Conferencias, convenciones, seminarios y congresos. Planificamos y ejecutamos eventos de cualquier magnitud con precisión y creatividad, asegurándonos de que cada asistente viva algo memorable.",
    tags: ["Conferencias", "Convenciones", "Seminarios", "Congresos"],
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&auto=format&fit=crop&q=80",
    bg: "#F2F6F3",
    top: "64px",
    zIndex: 10,
    dark: false,
    shadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  {
    num: "02 — Marca",
    title: "Lanzamientos y experiencias de marca",
    desc: "Presentaciones de producto y activaciones inmersivas que generan impacto real. Cada lanzamiento conecta tu marca con las personas de una forma que trasciende el evento.",
    tags: ["Lanzamientos", "Activaciones", "Brand experience"],
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&auto=format&fit=crop&q=80",
    bg: "#E8F0EB",
    top: "72px",
    zIndex: 20,
    dark: false,
    shadow: "0 4px 20px rgba(0,0,0,0.09)",
  },
  {
    num: "03 — Equipo",
    title: "Team building, cenas y celebraciones",
    desc: "Actividades que fortalecen vínculos, cenas de fin de año, cocktails corporativos y premiaciones. Momentos que refuerzan la cultura y el sentido de pertenencia del equipo.",
    tags: ["Team building", "Cenas", "Premiaciones", "Cocktails"],
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80",
    bg: "#DDE9E1",
    top: "80px",
    zIndex: 30,
    dark: false,
    shadow: "0 6px 28px rgba(0,0,0,0.12)",
  },
  {
    num: "04 — Prensa",
    title: "Gestión de prensa y comunicación",
    desc: "Coordinamos la relación con medios para que tus eventos tengan la repercusión que merecen. Desde la convocatoria hasta la cobertura, somos el nexo entre tu empresa y la prensa.",
    tags: ["Medios", "Convocatoria", "Cobertura"],
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&auto=format&fit=crop&q=80",
    bg: "#1A1A1A",
    top: "88px",
    zIndex: 40,
    dark: true,
    shadow: "0 8px 36px rgba(0,0,0,0.22)",
  },
]

export function StickyScrollCardsSection() {
  return (
    <section id="servicios">
      {/* Section header */}
      <div className="py-16 md:py-20 px-8 md:px-12 text-center bg-white">
        <p
          style={{ letterSpacing: "4px", fontSize: "10px" }}
          className="uppercase text-[#5D8A6B] mb-3"
        >
          Lo que hacemos
        </p>
        <h2
          style={{ fontFamily: "var(--font-playfair)" }}
          className="text-3xl md:text-4xl lg:text-[40px] font-normal text-[#1A1A1A] mb-4"
        >
          Cada evento, una{" "}
          <span className="italic" style={{ color: "var(--sage)" }}>
            experiencia
          </span>{" "}
          a medida.
        </h2>
        <p className="text-sm md:text-[15px] text-[#888888] font-light max-w-lg mx-auto leading-relaxed">
          Somos el nexo entre tu empresa y los mejores proveedores. Organizamos,
          coordinamos y ejecutamos cada detalle.
        </p>
      </div>

      {/* Cards container */}
      <div className="px-8 md:px-12 pb-24 relative">
        {services.map((card, i) => (
          <div
            key={card.num}
            className="sticky mb-5"
            style={{
              top: card.top,
              zIndex: card.zIndex,
              boxShadow: card.shadow,
              borderRadius: "22px",
              backgroundColor: card.bg,
            }}
          >
            <div
              className="grid grid-cols-1 md:grid-cols-2 min-h-[380px] md:min-h-[420px] overflow-hidden"
              style={{ borderRadius: "22px" }}
            >
              {/* Image col — order-first on mobile */}
              <div className="relative overflow-hidden min-h-[220px] md:min-h-[420px] order-first md:order-last">
                <img
                  src={card.image}
                  alt={card.title}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background: card.dark
                      ? "linear-gradient(to right, rgba(10,10,10,0.65) 0%, transparent 55%)"
                      : `linear-gradient(to right, ${card.bg}88 0%, transparent 45%)`,
                  }}
                />
              </div>

              {/* Content col */}
              <div className="p-10 md:p-12 lg:p-14 flex flex-col justify-center order-last md:order-first">
                <p
                  style={{ fontSize: "10px", letterSpacing: "3px" }}
                  className={`uppercase mb-4 ${card.dark ? "text-white/60" : "text-[#5D8A6B]"}`}
                >
                  {card.num}
                </p>
                <h3
                  style={{ fontFamily: "var(--font-playfair)" }}
                  className={`text-2xl md:text-[28px] font-normal leading-snug mb-3 ${
                    card.dark ? "text-white" : "text-[#1A1A1A]"
                  }`}
                >
                  {card.title}
                </h3>
                <p
                  style={{ fontSize: "13px" }}
                  className={`leading-relaxed font-light mb-7 ${
                    card.dark ? "text-white/50" : "text-[#555555]"
                  }`}
                >
                  {card.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{ fontSize: "9px", letterSpacing: "1.5px" }}
                      className={`uppercase border rounded-full px-3 py-1 ${
                        card.dark
                          ? "border-white/20 text-white/45"
                          : "border-[#5D8A6B]/40 text-[#5D8A6B]"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Scroll spacer so last card has room to fully stick */}
        <div className="h-32 md:h-48" />
      </div>
    </section>
  )
}
