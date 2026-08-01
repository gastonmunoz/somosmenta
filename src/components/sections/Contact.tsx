import { Mail } from "lucide-react";
import SocialIcons from "@/components/ui/social-icons";

export default function Contact() {
  return (
    <section
      id="contacto"
      className="bg-brand-dark py-20 md:py-24 px-8 md:px-12 text-center"
    >
      <div className="max-w-xl mx-auto">
        <p className="text-[10px] tracking-[4px] uppercase text-white/60 mb-4">
          ¿Tenés un evento en mente?
        </p>
        <h2
          className="text-4xl md:text-5xl font-normal text-white mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Hablemos.
        </h2>
        <p className="text-[13px] text-white/45 font-light mb-10 leading-relaxed">
          Contanos tu proyecto y te armamos una propuesta a medida.
        </p>
        <a
          href="mailto:hola@calton.com.ar"
          aria-label="Contactar por mail"
          className="block mx-auto w-fit bg-brand-mid text-white text-[11px] tracking-[3px] uppercase px-9 py-4 rounded-sm mb-10 hover:brightness-110 transition-all"
        >
          <Mail className="w-4 h-4 inline mr-2 align-middle" />
          Escribinos por mail
        </a>
        <SocialIcons />
        <p className="text-[10px] text-white/30 tracking-[2.5px] uppercase mt-4">
          hola@calton.com.ar
        </p>
      </div>
    </section>
  );
}
