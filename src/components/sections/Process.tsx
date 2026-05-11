"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const ease = [0.23, 1, 0.32, 1] as const

const STEPS = [
  {
    id: "01",
    title: "Escuchamos",
    description:
      "Entendemos tu empresa, tu cultura y los objetivos del evento antes de proponer cualquier cosa. Cada evento es único, y queremos comprenderlo en profundidad antes de sugerir cualquier solución.",
    bullets: ["Brief de evento", "Análisis de objetivos", "Definición de audiencia", "Alineación con la identidad de marca"],
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800",
  },
  {
    id: "02",
    title: "Diseñamos",
    description:
      "Creamos la propuesta a medida: concepto, presupuesto, proveedores y cronograma. Nada es genérico: cada propuesta refleja tu identidad y los objetivos que querés alcanzar.",
    bullets: ["Concepto creativo", "Presupuesto detallado", "Selección de proveedores", "Cronograma de producción"],
    image:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800",
  },
  {
    id: "03",
    title: "Conectamos",
    description:
      "Gestionamos cada proveedor para que vos no tengas que hablar con nadie más. Tenemos una red de proveedores seleccionados y negociamos en tu nombre para garantizar calidad y precio.",
    bullets: ["Coordinación de proveedores", "Negociación de contratos", "Supervisión de entregas", "Comunicación centralizada"],
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800",
  },
  {
    id: "04",
    title: "Ejecutamos",
    description:
      "Estamos presentes el día del evento, de principio a fin, para que todo salga perfecto. Nuestra presencia garantiza que cada detalle se cumpla según lo planificado, sin que vos tengas que preocuparte por nada.",
    bullets: ["Dirección en sitio", "Coordinación en tiempo real", "Gestión de imprevistos", "Cierre y evaluación"],
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800",
  },
]

export default function Process() {
  const [open, setOpen] = useState<number>(0)

  return (
    <section
      id="proceso"
      className="bg-white px-8 md:px-12 xl:px-20 py-20 md:py-28"
    >
      <motion.p
        className="uppercase text-[var(--sage)] mb-12"
        style={{ fontSize: "8px", letterSpacing: "4px" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Cómo trabajamos
      </motion.p>

      <div>
        {STEPS.map((step, i) => {
          const isOpen = open === i
          const isLast = i === STEPS.length - 1

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease }}
            >
              <button
                onClick={() => setOpen(i)}
                className="w-full text-left py-5 relative"
                style={{
                  borderTop:
                    i === 0
                      ? "2px solid var(--black)"
                      : "1px solid #eeeeee",
                }}
              >
                <span
                  className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "clamp(3rem, 6vw, 5rem)",
                    fontWeight: 900,
                    color: "#f0f0f0",
                    lineHeight: 1,
                  }}
                >
                  {step.id}
                </span>

                <div className="relative z-10 flex flex-col gap-1 pr-20">
                  <span
                    className="uppercase"
                    style={{
                      fontSize: "7px",
                      letterSpacing: "2px",
                      color: "var(--sage)",
                    }}
                  >
                    Etapa {step.id}
                  </span>
                  <span
                    className="leading-none"
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                      fontWeight: 900,
                      letterSpacing: "-0.5px",
                      color: isOpen ? "var(--black)" : "#cccccc",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {step.title}
                  </span>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                    style={{ borderLeft: "3px solid var(--sage)" }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6 pl-5 pb-8 pt-4">
                      <div>
                        <p
                          className="font-light leading-[1.75] mb-6"
                          style={{ fontSize: "14px", color: "#888888" }}
                        >
                          {step.description}
                        </p>
                        <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
                          {step.bullets.map((b) => (
                            <li
                              key={b}
                              className="flex items-center gap-2"
                            >
                              <span
                                className="flex-shrink-0 w-1 h-1 rounded-full"
                                style={{ background: "var(--sage)" }}
                              />
                              <span
                                className="uppercase"
                                style={{ fontSize: "7px", letterSpacing: "1.5px", color: "#aaaaaa" }}
                              >
                                {b}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full object-cover object-top hidden md:block"
                        style={{ maxHeight: "220px", borderRadius: "2px" }}
                        loading="lazy"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {isLast && (
                <div style={{ borderBottom: "2px solid var(--sage)" }} />
              )}
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
