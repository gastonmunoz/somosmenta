import Preloader from "@/components/ui/preloader";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Wizard from "@/components/sections/Wizard";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Manifiesto from "@/components/sections/Manifiesto";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ui/chatbot/ChatWidget";

export default function Home() {
  return (
    <>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-sm focus:bg-brand-dark focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <Preloader />
      <Navbar />
      <div id="page-content">
        <main>
          <Hero />
          <Wizard />
          <About />
          <Services />
          <Manifiesto />
          <Contact />
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </>
  );
}
