import { MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <section
      id="contacto"
      className="bg-[#1A1A1A] py-20 md:py-24 px-8 md:px-12 text-center"
    >
      <div className="max-w-xl mx-auto">
        <p className="text-[10px] tracking-[4px] uppercase text-[#5D8A6B] mb-4">
          ¿Tenés un evento en mente?
        </p>
        <h2
          className="text-4xl md:text-5xl font-normal text-white mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Hablemos.
        </h2>
        <p className="text-[13px] text-white/45 font-light mb-10 leading-relaxed">
          Contanos tu proyecto y te armamos una propuesta a medida.
        </p>
        <a
          href="https://wa.me/5491157256393"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="block mx-auto w-fit bg-[#5D8A6B] text-white text-[11px] tracking-[3px] uppercase px-9 py-4 rounded-sm mb-10 hover:bg-[#4a7057] transition-colors"
        >
          <MessageCircle className="w-4 h-4 inline mr-2 align-middle" />
          Escribinos por WhatsApp
        </a>
        <p className="text-[10px] text-white/30 tracking-[2.5px] uppercase">
          Instagram&nbsp;&nbsp;·&nbsp;&nbsp;LinkedIn&nbsp;&nbsp;·&nbsp;&nbsp;hola@calton.com.ar
        </p>
      </div>
    </section>
  );
}
