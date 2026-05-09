export default function Footer() {
  return (
    <footer className="bg-[#111111] py-5 px-8 md:px-12">
      <div className="max-w-6xl mx-auto flex justify-between items-center flex-wrap gap-4">
        <span
          className="text-sm uppercase tracking-[3px] text-white/30"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Menta
        </span>
        <span className="text-[10px] text-white/20 tracking-[1px]">
          © 2026 Menta. Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
}
