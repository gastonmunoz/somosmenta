"use client";

import { useState, useEffect } from "react";
import { Menu, X, MessageCircle } from "lucide-react";

const navLinks = [
  { label: "Servicios", href: "#servicios" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Proceso", href: "#proceso" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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
        <nav className="hidden md:flex items-center gap-8">
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
          className="hidden md:inline-flex items-center text-xs tracking-wider uppercase text-white rounded-sm px-4 py-2 transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--sage)" }}
        >
          <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
          WhatsApp
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          style={{ color: "var(--black)" }}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden flex flex-col gap-5 px-8 pb-6 pt-2"
          style={{ borderTop: "1px solid var(--gray-mid)" }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs tracking-widest uppercase"
              style={{ color: "var(--gray-text)" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://wa.me/5491157256393"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
            className="inline-flex items-center justify-center text-xs tracking-wider uppercase text-white rounded-sm px-4 py-2.5 mt-1"
            style={{ backgroundColor: "var(--sage)" }}
            onClick={() => setMenuOpen(false)}
          >
            <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
            WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
