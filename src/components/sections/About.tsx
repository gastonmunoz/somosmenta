export default function About() {
  return (
    <section id="nosotros" className="bg-white py-20 md:py-24 px-8 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-[10px] tracking-[4px] uppercase text-[#5D8A6B] mb-3">
            Quiénes somos
          </p>
          <h2
            className="text-3xl md:text-4xl font-normal text-[#1A1A1A] mb-6 leading-snug"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Boutique.
            <br />
            360°. Presente.
          </h2>
          <p className="text-[13px] text-[#555] leading-[1.85] font-light mb-4">
            Somos el nexo entre tu empresa y los proveedores correctos. No somos
            una agencia masiva: trabajamos con atención personalizada en cada
            proyecto, sin importar el tamaño del evento.
          </p>
          <p className="text-[13px] text-[#555] leading-[1.85] font-light mb-8">
            Gestionamos cada detalle logístico, creativo y comunicacional para
            que vos te enfoques en lo que importa: tu empresa y tu gente.
          </p>
          <div className="flex gap-10 mt-2">
            <div>
              <p
                className="text-[32px] text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                360°
              </p>
              <p className="text-[10px] uppercase tracking-[1.5px] text-[#888888] mt-1">
                Organización integral
              </p>
            </div>
            <div>
              <p
                className="text-[32px] text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                1:1
              </p>
              <p className="text-[10px] uppercase tracking-[1.5px] text-[#888888] mt-1">
                Atención personalizada
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-sm h-[300px] md:h-[360px] relative overflow-hidden flex items-end p-6">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #5D8A6B, #1A1A1A)",
              opacity: 0.6,
            }}
          />
          <p className="relative z-10 text-[10px] tracking-[2px] uppercase text-white/60">
            Foto de Vicky / equipo
          </p>
        </div>
      </div>
    </section>
  );
}
