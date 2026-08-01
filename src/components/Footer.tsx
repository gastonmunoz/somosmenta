import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-brand-dark py-5 px-8 md:px-12">
      <div className="max-w-6xl mx-auto flex justify-between items-center flex-wrap gap-4">
        <Image
          src="/images/logo/calton-blanco.png"
          alt="Calton"
          width={1185}
          height={420}
          className="h-6 w-auto opacity-80"
        />
        <span className="text-[10px] text-white/20 tracking-[1px]">
          © 2026 Calton. Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
}
