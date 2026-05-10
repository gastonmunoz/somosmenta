"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "¿Cuánto tiempo lleva organizar un evento corporativo?",
    answer:
      "Depende de la escala. Para eventos de hasta 100 personas, trabajamos con un mínimo de 3 semanas. Para lanzamientos o conferencias de mayor envergadura, recomendamos entre 6 y 12 semanas para asegurar disponibilidad de venue, proveedores y producción.",
  },
  {
    question: "¿Trabajan con empresas de cualquier tamaño?",
    answer:
      "Sí. Tenemos experiencia tanto con startups de 20 personas como con corporaciones de más de 1.000 empleados. La propuesta siempre se adapta a la escala y al presupuesto disponible.",
  },
  {
    question: "¿Pueden organizar eventos fuera de Buenos Aires?",
    answer:
      "Sí. Operamos en todo el país y con capacidad para eventos en Latinoamérica. Contamos con una red de proveedores locales en las principales ciudades, lo que nos permite mantener los mismos estándares sin importar la locación.",
  },
  {
    question: "¿Qué pasa si necesito hacer cambios de último momento?",
    answer:
      "Asignamos un producer dedicado a cada proyecto que actúa como punto de contacto único. Los cambios se gestionan en tiempo real; somos agnósticos al caos porque está incorporado en nuestro proceso.",
  },
  {
    question: "¿Cómo se manejan los imprevistos el día del evento?",
    answer:
      "Todos nuestros proyectos incluyen un plan de contingencia documentado antes del evento: proveedores alternativos, protocolos de comunicación y un equipo presencial durante la producción. El día D, nosotros resolvemos; vos disfrutás.",
  },
  {
    question: "¿Tienen paquetes cerrados o todo es a medida?",
    answer:
      "Mayormente a medida. Tenemos estructuras de servicio que funcionan como punto de partida (logística, producción, experiencia completa), pero nunca envasamos un evento genérico. Cada brief da lugar a una propuesta específica.",
  },
  {
    question: "¿Cuál es el presupuesto mínimo para trabajar juntos?",
    answer:
      "No tenemos un mínimo fijo publicado porque varía según el tipo de evento. La mejor forma de entender si somos la opción correcta es completar el brief — en 24 horas te respondemos con un rango estimado y una propuesta preliminar.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="bg-white py-20 md:py-28 px-8 md:px-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mb-12"
        >
          <p className="text-[10px] tracking-[4px] uppercase text-[var(--sage)] mb-4">
            Preguntas frecuentes
          </p>
          <h2
            className="text-4xl md:text-5xl font-normal text-[var(--black)] leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Todo lo que querés saber
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.23, 1, 0.32, 1] }}
          className="divide-y divide-[#1A1A1A]/10"
        >
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index}>
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between py-5 text-left gap-4 group"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-medium text-[var(--black)] group-hover:text-[var(--sage)] transition-colors duration-200">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                    className="flex-shrink-0 text-[var(--gray-text)]"
                  >
                    <ChevronDown size={18} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-[14px] leading-relaxed text-[var(--gray-text)]">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
