"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

const ease = [0.23, 1, 0.32, 1] as const

export default function Preloader() {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [visible, setVisible] = useState(true)
  const raf = useRef<number | undefined>(undefined)

  useEffect(() => {
    document.body.style.overflow = "hidden"

    let start: number | null = null
    const DURATION = 2200

    const tick = (ts: number) => {
      if (start === null) start = ts
      const t = Math.min((ts - start) / DURATION, 1)
      const eased = 1 - Math.pow(1 - t, 2.8)
      setProgress(Math.round(eased * 100))

      if (t < 1) {
        raf.current = requestAnimationFrame(tick)
      } else {
        setTimeout(() => setExiting(true), 380)
      }
    }

    raf.current = requestAnimationFrame(tick)

    return () => {
      if (raf.current !== undefined) cancelAnimationFrame(raf.current)
      document.body.style.overflow = ""
    }
  }, [])

  if (!visible) return null

  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex flex-col select-none"
      style={{ backgroundColor: "var(--black)" }}
      animate={exiting ? { y: "-100%" } : { y: "0%" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (exiting) {
          document.body.style.overflow = ""
          setVisible(false)
        }
      }}
    >
      {/* Center: logo + tagline */}
      <div className="flex-1 flex flex-col items-center justify-center gap-7">

        {/* Letter-stagger wordmark */}
        <div className="overflow-hidden">
          <div
            className="flex"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2.4rem, 8vw, 6rem)",
              color: "white",
              letterSpacing: "0.4em",
              fontWeight: 400,
            }}
          >
            {"CALTON".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 + 0.15, duration: 0.75, ease }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Thin sage reveal line */}
        <motion.div
          style={{ backgroundColor: "var(--sage)", height: "1px" }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8, ease }}
          className="w-24"
        />

        {/* Tagline */}
        <motion.p
          className="uppercase text-white/30"
          style={{ fontSize: "9px", letterSpacing: "4px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          Experiencias que definen marcas
        </motion.p>
      </div>

      {/* Bottom: counter + meta */}
      <div className="px-8 md:px-12 pb-7 flex items-end justify-between">
        <motion.p
          className="font-normal leading-none tabular-nums"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(3rem, 7vw, 5.5rem)",
            color: "rgba(255,255,255,0.12)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {String(progress).padStart(2, "0")}
        </motion.p>

        <motion.div
          className="text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className="uppercase text-white/20" style={{ fontSize: "8px", letterSpacing: "3px" }}>
            Agencia Boutique
          </p>
          <p className="uppercase text-white/20 mt-1" style={{ fontSize: "8px", letterSpacing: "3px" }}>
            Buenos Aires
          </p>
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="h-px w-full" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
        <div
          className="h-full"
          style={{
            width: `${progress}%`,
            backgroundColor: "var(--sage)",
            transition: "width 50ms linear",
          }}
        />
      </div>
    </motion.div>
  )
}
