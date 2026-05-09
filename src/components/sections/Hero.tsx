export default function Hero() {
  return (
    <section
      id="hero"
      className="pt-24 pb-20 px-8 md:px-12 bg-white"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
        {/* Left: text */}
        <div>
          {/* Eyebrow */}
          <div
            className="text-[10px] tracking-[4px] uppercase mb-5"
            style={{ color: "var(--sage)" }}
          >
            Agencia boutique · Buenos Aires
          </div>

          {/* H1 */}
          <h1
            className="text-4xl md:text-5xl lg:text-[52px] font-normal leading-[1.15] mb-5"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "var(--black)",
            }}
          >
            Experiencias que{" "}
            <span
              className="italic"
              style={{ color: "var(--sage)" }}
            >
              trascienden.
            </span>
          </h1>

          {/* Body */}
          <p
            className="text-sm md:text-[15px] leading-relaxed font-light max-w-sm mb-8"
            style={{ color: "var(--gray-text)" }}
          >
            Organizamos eventos corporativos a medida. Somos el nexo entre tu
            empresa y los mejores proveedores, con un enfoque 360° que cuida
            cada detalle.
          </p>

          {/* CTA row */}
          <div className="flex gap-3 items-center">
            <a
              href="https://wa.me/549XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp"
              className="text-[10px] tracking-[2.5px] uppercase text-white rounded-sm px-6 py-3 transition-colors bg-[#1A1A1A] hover:bg-[#333333]"
            >
              Hablemos
            </a>
            <a
              href="#servicios"
              className="text-[10px] tracking-wider uppercase underline underline-offset-4 transition-colors text-[#888888] hover:text-[#1A1A1A]"
            >
              Ver servicios
            </a>
          </div>
        </div>

        {/* Right: image placeholder */}
        <div className="order-first md:order-last">
          <div
            className="rounded-sm h-[360px] md:h-[440px] flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: "var(--sage-light)" }}
          >
            <span
              className="text-[10px] tracking-[3px] uppercase opacity-50"
              style={{ color: "var(--sage)" }}
            >
              Foto evento
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
