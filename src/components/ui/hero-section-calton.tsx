"use client"

import { motion, type Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LayoutGrid, Star, Link as LinkIcon } from 'lucide-react'

const VIDEO_URL = 'https://cdtktxwgtptsazbtehxa.supabase.co/storage/v1/object/public/calton/videos/conference_video.mp4'
const VIDEO_URL_2 = 'https://cdtktxwgtptsazbtehxa.supabase.co/storage/v1/object/public/calton/videos/conference_2.mp4'
const IMAGE_URL = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
}

const mediaVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: 'easeOut' as const, delay: i * 0.12 },
  }),
}

const float1: Variants = {
  animate: {
    y: [0, -14, 0],
    rotate: [0, 4, 0],
    transition: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' as const },
  },
}

const float2: Variants = {
  animate: {
    y: [0, -9, 0],
    rotate: [0, -5, 0],
    scale: [1, 1.08, 1],
    transition: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.9 },
  },
}

const float3: Variants = {
  animate: {
    y: [0, -7, 0],
    x: [0, 5, 0],
    scale: [1, 1.15, 1],
    transition: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' as const, delay: 1.7 },
  },
}

const float4: Variants = {
  animate: {
    y: [0, -10, 0],
    x: [0, -6, 0],
    rotate: [0, 8, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.4 },
  },
}

const stats = [
  { value: '360°', label: 'Organización integral', icon: <LayoutGrid className="h-4 w-4" style={{ color: '#888888' }} /> },
  { value: 'Boutique', label: 'Atención personalizada', icon: <Star className="h-4 w-4" style={{ color: '#888888' }} /> },
  { value: 'Nexo', label: 'Con los mejores proveedores', icon: <LinkIcon className="h-4 w-4" style={{ color: '#888888' }} /> },
]

export default function HeroSectionCalton() {
  return (
    <section
      id="hero"
      className="w-full min-h-dvh flex items-center bg-white overflow-hidden pt-20 pb-12 px-5 sm:px-8 md:px-10 xl:px-14 2xl:px-20"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-12 xl:grid-cols-[4fr_8fr] xl:gap-16 2xl:grid-cols-[3fr_9fr] 2xl:gap-20">

        {/* Left: text */}
        <motion.div
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="text-[10px] tracking-[4px] uppercase mb-5"
            style={{ color: '#5D8A6B' }}
            variants={itemVariants}
          >
            Agencia boutique · Buenos Aires
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-[52px] xl:text-[60px] 2xl:text-[68px] font-normal leading-[1.15] mb-5"
            style={{ fontFamily: 'var(--font-playfair)', color: '#1A1A1A' }}
            variants={itemVariants}
          >
            Experiencias que{' '}
            <span className="italic" style={{ color: '#5D8A6B' }}>
              trascienden.
            </span>
          </motion.h1>

          <motion.p
            className="text-sm md:text-[15px] xl:text-base leading-relaxed font-light max-w-sm mb-8"
            style={{ color: '#888888' }}
            variants={itemVariants}
          >
            Organizamos eventos corporativos a medida. Somos el nexo entre tu empresa y los mejores proveedores, con un enfoque 360° que cuida cada detalle.
          </motion.p>

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

        {/* Right: media grid */}
        <motion.div
          className="relative"
          initial="hidden"
          animate="visible"
        >
          {/* Floating decorative shapes */}
          <motion.div
            className="absolute -top-5 right-8 h-12 w-12 rounded-full pointer-events-none z-10"
            style={{ backgroundColor: '#EAF0EC', opacity: 0.85 }}
            variants={float1}
            animate="animate"
          />
          <motion.div
            className="absolute -bottom-4 left-6 h-8 w-8 rounded-xl pointer-events-none z-10"
            style={{ backgroundColor: '#DDE9E1', opacity: 0.7 }}
            variants={float2}
            animate="animate"
          />
          <motion.div
            className="absolute top-1/2 -left-3 h-4 w-4 rounded-full pointer-events-none z-10"
            style={{ backgroundColor: '#5D8A6B', opacity: 0.3 }}
            variants={float3}
            animate="animate"
          />
          <motion.div
            className="absolute bottom-1/4 -right-2 h-6 w-6 rounded-full pointer-events-none z-10 hidden sm:block"
            style={{ backgroundColor: '#5D8A6B', opacity: 0.15 }}
            variants={float4}
            animate="animate"
          />

          {/* 2-column bento grid — left video spans 2 rows, right col has 2 squares */}
          <div className="grid grid-cols-[3fr_2fr] gap-2 sm:gap-3 lg:gap-4 xl:gap-5">

            {/* Video 1 — left, spans 2 rows */}
            <motion.div
              className="row-span-2 rounded-2xl xl:rounded-3xl overflow-hidden shadow-xl"
              custom={0}
              variants={mediaVariants}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
                src={VIDEO_URL}
              />
            </motion.div>

            {/* Video 2 — top right, square */}
            <motion.div
              className="aspect-square rounded-2xl xl:rounded-3xl overflow-hidden shadow-lg"
              custom={1}
              variants={mediaVariants}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
                src={VIDEO_URL_2}
              />
            </motion.div>

            {/* Image — bottom right, square */}
            <motion.div
              className="aspect-square rounded-2xl xl:rounded-3xl overflow-hidden shadow-md"
              custom={2}
              variants={mediaVariants}
            >
              <img
                src={IMAGE_URL}
                alt="Team building organizado por Calton"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  )
}
