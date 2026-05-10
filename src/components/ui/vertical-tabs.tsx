"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STEPS = [
  {
    id: "01",
    title: "Escuchamos",
    description:
      "Entendemos tu empresa, tu cultura y los objetivos del evento antes de proponer cualquier cosa.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200",
  },
  {
    id: "02",
    title: "Diseñamos",
    description:
      "Creamos la propuesta a medida: concepto, presupuesto, proveedores y cronograma.",
    image:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200",
  },
  {
    id: "03",
    title: "Conectamos",
    description:
      "Gestionamos cada proveedor para que vos no tengas que hablar con nadie más.",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200",
  },
  {
    id: "04",
    title: "Ejecutamos",
    description:
      "Estamos presentes el día del evento, de principio a fin, para que todo salga perfecto.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200",
  },
];

const AUTO_PLAY_DURATION = 5000;

const variants = {
  enter: (direction: number) => ({
    y: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    y: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

export function VerticalTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % STEPS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + STEPS.length) % STEPS.length);
  }, []);

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setIsPaused(false);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(handleNext, AUTO_PLAY_DURATION);
    return () => clearInterval(interval);
  }, [activeIndex, isPaused, handleNext]);

  return (
    <section id="proceso" className="w-full bg-[#F5F5F3] py-8 md:py-16 lg:py-24">
      <div className="w-full px-8 md:px-12 lg:px-16 xl:px-20 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 pt-4">
            <div className="space-y-1 mb-12">
              <p className="text-[10px] tracking-[4px] uppercase text-sage mb-1">
                Cómo trabajamos
              </p>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-normal text-[--black] tracking-tight text-balance"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                El enfoque Calton
              </h2>
            </div>

            <div className="flex flex-col space-y-0">
              {STEPS.map((step, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleTabClick(index)}
                    className={cn(
                      "group relative flex items-start gap-4 py-6 md:py-8 text-left transition-all duration-500 border-t border-[#1A1A1A]/10 first:border-0",
                      isActive
                        ? "text-[--black]"
                        : "text-[#888888] hover:text-[--black]"
                    )}
                  >
                    <div className="absolute left-[-16px] md:left-[-24px] top-0 bottom-0 w-[2px] bg-[#1A1A1A]/10">
                      {isActive && (
                        <motion.div
                          key={`progress-${index}-${isPaused}`}
                          className="absolute top-0 left-0 w-full bg-sage origin-top"
                          initial={{ height: "0%" }}
                          animate={isPaused ? { height: "0%" } : { height: "100%" }}
                          transition={{
                            duration: AUTO_PLAY_DURATION / 1000,
                            ease: "linear",
                          }}
                        />
                      )}
                    </div>

                    <span className="text-[9px] md:text-[10px] font-medium mt-1 tabular-nums opacity-50">
                      /{step.id}
                    </span>

                    <div className="flex flex-col gap-2 flex-1">
                      <span
                        className={cn(
                          "text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight transition-colors duration-500",
                          isActive ? "text-[--black]" : ""
                        )}
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {step.title}
                      </span>

                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="text-[#888888] text-sm md:text-base font-normal leading-relaxed max-w-sm pb-2">
                              {step.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-end h-full order-1 lg:order-2">
            <div
              className="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="relative aspect-4/5 md:aspect-4/3 lg:aspect-16/11 rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-sage-light border border-[#1A1A1A]/10">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      y: { type: "spring", stiffness: 260, damping: 32 },
                      opacity: { duration: 0.4 },
                    }}
                    className="absolute inset-0 w-full h-full cursor-pointer"
                    onClick={handleNext}
                  >
                    <img
                      src={STEPS[activeIndex].image}
                      alt={STEPS[activeIndex].title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 m-0! p-0! block"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex gap-2 md:gap-3 z-20">
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-md border border-[#1A1A1A]/10 flex items-center justify-center text-[--black] hover:bg-white transition-all active:scale-90"
                    aria-label="Anterior"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-md border border-[#1A1A1A]/10 flex items-center justify-center text-[--black] hover:bg-white transition-all active:scale-90"
                    aria-label="Siguiente"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VerticalTabs;
