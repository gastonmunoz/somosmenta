"use client";

import { useState, useEffect } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";

const ImageHover = dynamic(() => import("@/components/ui/link-hover"), {
  ssr: false,
});

const navLinks = [
  { label: "Servicios", href: "#servicios" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Proceso", href: "#proceso" },
  { label: "Armá tu Brief", href: "#brief" },
  { label: "Contacto", href: "#contacto" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white transition-shadow"
        style={{
          borderBottom: "1px solid var(--gray-mid)",
          boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="flex justify-between items-center px-8 md:px-12 py-4">
          {/* Logo */}
          <a
            href="#hero"
            className="text-[20px] tracking-widest uppercase font-normal"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--black)" }}
          >
            Calton
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs tracking-widest uppercase transition-colors"
                style={{ color: "var(--gray-text)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--black)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--gray-text)")
                }
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <a
            href="https://wa.me/5491157256393"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
            className="hidden items-center text-xs tracking-wider uppercase text-white rounded-sm px-4 py-2 transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--sage)" }}
          >
            <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
            WhatsApp
          </a>

          {/* Hamburger */}
          <button
            className="p-1"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            style={{ color: "var(--black)" }}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="nav-overlay"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-[9999] flex flex-col"
            style={{ backgroundColor: "var(--white)" }}
          >
            {/* Close button row */}
            <div className="flex justify-between items-center px-8 py-4">
              <a
                href="#hero"
                onClick={() => setMenuOpen(false)}
                className="text-[20px] tracking-widest uppercase font-normal text-black/40"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Calton
              </a>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Cerrar menú"
                className="p-1 text-black/40 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ImageHover nav */}
            <div className="flex-1 overflow-hidden">
              <ImageHover onNavigate={() => setMenuOpen(false)} />
            </div>

            {/* WhatsApp CTA */}
            <div className="px-8 pb-8 pt-4 flex justify-center">
              <a
                href="https://wa.me/5491157256393"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactar por WhatsApp"
                className="inline-flex items-center gap-2 text-[11px] md:text-xs lg:text-sm tracking-wider uppercase text-white rounded-sm px-5 md:px-8 lg:px-10 py-3 md:py-4 transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--sage)" }}
                onClick={() => setMenuOpen(false)}
              >
                <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
