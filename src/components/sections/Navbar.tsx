"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { MessageCircle } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

const NAV_LINKS = [
  { label: "Servicios",    href: "#servicios", shape: "1" },
  { label: "Nosotros",     href: "#nosotros",  shape: "2" },
  { label: "Proceso",      href: "#proceso",   shape: "3" },
  { label: "Armá tu Brief",href: "#brief",     shape: "4" },
  { label: "Contacto",     href: "#contacto",  shape: "5" },
];

export default function Navbar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  // Shape hover effects (runs once on mount)
  useEffect(() => {
    if (!containerRef.current) return;

    try {
      CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
      gsap.defaults({ ease: "main", duration: 0.7 });
    } catch {
      gsap.defaults({ ease: "power2.out", duration: 0.7 });
    }

    const ctx = gsap.context(() => {
      const items = containerRef.current!.querySelectorAll(".menu-list-item[data-shape]");
      const shapesWrap = containerRef.current!.querySelector(".ambient-background-shapes");

      items.forEach((item) => {
        const idx   = item.getAttribute("data-shape");
        const shape = shapesWrap?.querySelector(`.bg-shape-${idx}`);
        if (!shape) return;

        const els = shape.querySelectorAll(".shape-element");

        const onEnter = () => {
          shapesWrap?.querySelectorAll(".bg-shape").forEach((s) => s.classList.remove("active"));
          shape.classList.add("active");
          gsap.fromTo(els,
            { scale: 0.5, opacity: 0, rotation: -10 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.7)", overwrite: "auto" }
          );
        };

        const onLeave = () => {
          gsap.to(els, {
            scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in",
            onComplete: () => shape.classList.remove("active"),
            overwrite: "auto",
          });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);
        (item as any)._gsapCleanup = () => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
        };
      });
    }, containerRef);

    return () => {
      ctx.revert();
      containerRef.current
        ?.querySelectorAll(".menu-list-item[data-shape]")
        .forEach((item: any) => item._gsapCleanup?.());
    };
  }, []);

  // Open / close animation
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const navWrap   = containerRef.current!.querySelector(".nav-overlay-wrapper");
      const menu      = containerRef.current!.querySelector(".menu-content");
      const overlay   = containerRef.current!.querySelector(".overlay");
      const panels    = containerRef.current!.querySelectorAll(".backdrop-layer");
      const links     = containerRef.current!.querySelectorAll(".nav-link");
      const fades     = containerRef.current!.querySelectorAll("[data-menu-fade]");
      const btn       = containerRef.current!.querySelector(".nav-close-btn");
      const btnTexts  = btn?.querySelectorAll("p");
      const btnIcon   = btn?.querySelector(".menu-button-icon");

      const tl = gsap.timeline();

      if (isMenuOpen) {
        navWrap?.setAttribute("data-nav", "open");
        tl.set(navWrap, { display: "block" })
          .set(menu, { xPercent: 0 }, "<")
          .fromTo(btnTexts,  { yPercent: 0 },         { yPercent: -100, stagger: 0.2 })
          .fromTo(btnIcon,   { rotate: 0 },            { rotate: 315 }, "<")
          .fromTo(overlay,   { autoAlpha: 0 },         { autoAlpha: 1 }, "<")
          .fromTo(panels,    { xPercent: 101 },        { xPercent: 0, stagger: 0.12, duration: 0.575 }, "<")
          .fromTo(links,     { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, "<+=0.35");
        if (fades.length) {
          tl.fromTo(fades, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, stagger: 0.04, clearProps: "all" }, "<+=0.2");
        }
      } else {
        navWrap?.setAttribute("data-nav", "closed");
        tl.to(overlay,    { autoAlpha: 0 })
          .to(menu,       { xPercent: 120 }, "<")
          .to(btnTexts,   { yPercent: 0 }, "<")
          .to(btnIcon,    { rotate: 0 }, "<")
          .set(navWrap,   { display: "none" });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isMenuOpen]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div ref={containerRef}>
      {/* ── Fixed header ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white transition-shadow"
        style={{
          borderBottom: "1px solid var(--gray-mid)",
          boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="flex justify-between items-center px-8 md:px-12 py-4">
          <a
            href="#hero"
            className="text-[20px] tracking-widest uppercase font-normal"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--black)" }}
          >
            Calton
          </a>

          <button
            className="nav-close-btn"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <div className="menu-button-text">
              <p className="p-large">Menú</p>
              <p className="p-large">Cerrar</p>
            </div>
            <div className="icon-wrap">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                viewBox="0 0 16 16"
                fill="none"
                className="menu-button-icon"
              >
                <path d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z" fill="currentColor" />
                <path d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z" fill="currentColor" />
                <path d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z" fill="currentColor" />
                <path d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z" fill="currentColor" />
                <path d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z" fill="currentColor" />
                <path d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z" fill="currentColor" />
              </svg>
            </div>
          </button>
        </div>
      </header>

      {/* ── Fullscreen overlay ── */}
      <div>
        <div data-nav="closed" className="nav-overlay-wrapper">
          <div className="overlay" onClick={closeMenu} />
          <nav className="menu-content" aria-label="Menú principal">
            <div className="menu-bg">
              <div className="backdrop-layer first" />
              <div className="backdrop-layer second" />
              <div className="backdrop-layer" />

              {/* Ambient shapes — sage-toned */}
              <div className="ambient-background-shapes">
                <svg className="bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="80"  cy="120" r="40" fill="rgba(93,138,107,0.2)"  />
                  <circle className="shape-element" cx="300" cy="80"  r="60" fill="rgba(234,240,236,0.12)"/>
                  <circle className="shape-element" cx="200" cy="300" r="80" fill="rgba(93,138,107,0.1)"  />
                  <circle className="shape-element" cx="350" cy="280" r="30" fill="rgba(234,240,236,0.15)"/>
                </svg>
                <svg className="bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none">
                  <path className="shape-element" d="M0 200 Q100 100,200 200 T400 200" stroke="rgba(93,138,107,0.25)"  strokeWidth="60" fill="none"/>
                  <path className="shape-element" d="M0 280 Q100 180,200 280 T400 280" stroke="rgba(234,240,236,0.15)" strokeWidth="40" fill="none"/>
                </svg>
                <svg className="bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="50"  cy="50"  r="8"  fill="rgba(93,138,107,0.3)"  />
                  <circle className="shape-element" cx="150" cy="50"  r="8"  fill="rgba(234,240,236,0.3)" />
                  <circle className="shape-element" cx="250" cy="50"  r="8"  fill="rgba(93,138,107,0.3)"  />
                  <circle className="shape-element" cx="350" cy="50"  r="8"  fill="rgba(234,240,236,0.3)" />
                  <circle className="shape-element" cx="100" cy="150" r="12" fill="rgba(93,138,107,0.25)"  />
                  <circle className="shape-element" cx="200" cy="150" r="12" fill="rgba(234,240,236,0.25)"/>
                  <circle className="shape-element" cx="300" cy="150" r="12" fill="rgba(93,138,107,0.25)"  />
                  <circle className="shape-element" cx="50"  cy="250" r="10" fill="rgba(234,240,236,0.3)" />
                  <circle className="shape-element" cx="150" cy="250" r="10" fill="rgba(93,138,107,0.3)"  />
                  <circle className="shape-element" cx="250" cy="250" r="10" fill="rgba(234,240,236,0.3)" />
                  <circle className="shape-element" cx="350" cy="250" r="10" fill="rgba(93,138,107,0.3)"  />
                  <circle className="shape-element" cx="100" cy="350" r="6"  fill="rgba(234,240,236,0.3)" />
                  <circle className="shape-element" cx="200" cy="350" r="6"  fill="rgba(93,138,107,0.3)"  />
                  <circle className="shape-element" cx="300" cy="350" r="6"  fill="rgba(234,240,236,0.3)" />
                </svg>
                <svg className="bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none">
                  <path className="shape-element" d="M100 100 Q150 50,200 100 Q250 150,200 200 Q150 250,100 200 Q50 150,100 100" fill="rgba(93,138,107,0.15)"/>
                  <path className="shape-element" d="M250 200 Q300 150,350 200 Q400 250,350 300 Q300 350,250 300 Q200 250,250 200" fill="rgba(234,240,236,0.1)"/>
                </svg>
                <svg className="bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none">
                  <line className="shape-element" x1="0"   y1="100" x2="300" y2="400" stroke="rgba(93,138,107,0.2)"  strokeWidth="30"/>
                  <line className="shape-element" x1="100" y1="0"   x2="400" y2="300" stroke="rgba(234,240,236,0.15)" strokeWidth="25"/>
                  <line className="shape-element" x1="200" y1="0"   x2="400" y2="200" stroke="rgba(93,138,107,0.12)"  strokeWidth="20"/>
                </svg>
              </div>
            </div>

            <div className="menu-content-wrapper">
              <ul className="menu-list">
                {NAV_LINKS.map((link) => (
                  <li key={link.href} className="menu-list-item" data-shape={link.shape}>
                    <a href={link.href} className="nav-link w-inline-block" onClick={closeMenu}>
                      <p className="nav-link-text">{link.label}</p>
                      <div className="nav-link-hover-bg" />
                    </a>
                  </li>
                ))}
              </ul>

              <div data-menu-fade="true">
                <a
                  href="https://wa.me/5491157256393"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="inline-flex items-center gap-2 text-[10px] tracking-wider uppercase text-white rounded-sm px-5 py-3 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--sage)", fontFamily: "var(--font-inter)" }}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
