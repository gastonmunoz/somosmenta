"use client"

import { motion, type Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LayoutGrid, Star, Link as LinkIcon } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const floatingVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
  },
}

const stats = [
  { value: '360°', label: 'Organización integral', icon: <LayoutGrid className="h-4 w-4" style={{ color: '#888888' }} /> },
  { value: 'Boutique', label: 'Atención personalizada', icon: <Star className="h-4 w-4" style={{ color: '#888888' }} /> },
  { value: 'Nexo', label: 'Con los mejores proveedores', icon: <LinkIcon className="h-4 w-4" style={{ color: '#888888' }} /> },
]

const images = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
]

export default function HeroSectionCalton() {
  return (
    <section
      id="hero"
      className="w-full min-h-dvh flex items-center overflow-hidden bg-white pt-20 pb-12 px-8 md:px-12"
    >
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

        {/* Left: text content */}
        <motion.div
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.div
            className="text-[10px] tracking-[4px] uppercase mb-5"
            style={{ color: '#5D8A6B' }}
            variants={itemVariants}
          >
            Agencia boutique · Buenos Aires
          </motion.div>

          {/* H1 */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-[52px] font-normal leading-[1.15] mb-5"
            style={{ fontFamily: 'var(--font-playfair)', color: '#1A1A1A' }}
            variants={itemVariants}
          >
            Experiencias que{' '}
            <span className="italic" style={{ color: '#5D8A6B' }}>
              trascienden.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-sm md:text-[15px] leading-relaxed font-light max-w-sm mb-8"
            style={{ color: '#888888' }}
            variants={itemVariants}
          >
            Organizamos eventos corporativos a medida. Somos el nexo entre tu empresa y los mejores proveedores, con un enfoque 360° que cuida cada detalle.
          </motion.p>

          {/* Actions */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 lg:justify-start mb-10"
            variants={itemVariants}
          >
            <Button asChild size="lg" variant="default">
              <a href="https://wa.me/5491157256393" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp">
                Hablemos
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#servicios">
                Ver servicios
              </a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 lg:justify-start"
            variants={itemVariants}
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ backgroundColor: '#EAF0EC' }}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-base font-semibold" style={{ fontFamily: 'var(--font-playfair)', color: '#1A1A1A' }}>
                    {stat.value}
                  </p>
                  <p className="text-[11px] font-light leading-tight" style={{ color: '#888888' }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: image collage */}
        <motion.div
          className="relative h-[380px] w-full sm:h-[480px] order-first lg:order-last"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Floating decorative shapes — sage tones */}
          <motion.div
            className="absolute -top-4 left-1/4 h-14 w-14 rounded-full"
            style={{ backgroundColor: '#EAF0EC', opacity: 0.7 }}
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div
            className="absolute bottom-4 right-1/4 h-10 w-10 rounded-lg"
            style={{ backgroundColor: '#DDE9E1', opacity: 0.6 }}
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div
            className="absolute bottom-1/3 left-2 h-5 w-5 rounded-full"
            style={{ backgroundColor: '#5D8A6B', opacity: 0.25 }}
            variants={floatingVariants}
            animate="animate"
          />

          {/* Image 1 — top center, largest */}
          <motion.div
            className="absolute left-1/2 top-0 h-44 w-44 -translate-x-1/2 rounded-2xl p-1.5 shadow-lg sm:h-60 sm:w-60"
            style={{ backgroundColor: '#EAF0EC' }}
            variants={imageVariants}
          >
            <img
              src={images[0]}
              alt="Evento corporativo organizado por Calton"
              className="h-full w-full rounded-xl object-cover"
              loading="eager"
            />
          </motion.div>

          {/* Image 2 — right middle */}
          <motion.div
            className="absolute right-0 top-1/3 h-36 w-36 rounded-2xl p-1.5 shadow-lg sm:h-52 sm:w-52"
            style={{ backgroundColor: '#EAF0EC' }}
            variants={imageVariants}
          >
            <img
              src={images[1]}
              alt="Lanzamiento de producto coordinado por Calton"
              className="h-full w-full rounded-xl object-cover"
              loading="lazy"
            />
          </motion.div>

          {/* Image 3 — bottom left, smallest */}
          <motion.div
            className="absolute bottom-0 left-0 h-28 w-28 rounded-2xl p-1.5 shadow-md sm:h-44 sm:w-44"
            style={{ backgroundColor: '#EAF0EC' }}
            variants={imageVariants}
          >
            <img
              src={images[2]}
              alt="Team building organizado por Calton"
              className="h-full w-full rounded-xl object-cover"
              loading="lazy"
            />
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
