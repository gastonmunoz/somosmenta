"use client"

import { motion } from "framer-motion"
import { ConnoisseurStackInteractor } from "@/components/ui/connoisseur-stack-interactor"

const SERVICES = [
  {
    num: "01",
    name: "Eventos Corporativos",
    clipId: "clip-original",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80",
  },
  {
    num: "02",
    name: "Lanzamientos de Marca",
    clipId: "clip-hexagons",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80",
  },
  {
    num: "03",
    name: "Team Building",
    clipId: "clip-pixels",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80",
  },
  {
    num: "04",
    name: "Gestión de Prensa",
    clipId: "clip-diagonals",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1000&auto=format&fit=crop&q=80",
  },
]

export default function Services() {
  return (
    <section
      id="servicios"
      className="bg-[var(--black)] px-8 md:px-12 xl:px-20 pt-20 md:pt-28 pb-16 md:pb-24"
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

      <ConnoisseurStackInteractor items={SERVICES} />
    </section>
  )
}
