import Preloader from "@/components/ui/preloader";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Process from "@/components/sections/Process";
import Wizard from "@/components/sections/Wizard";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ui/chatbot/ChatWidget";

export default function Home() {
  return (
    <main>
      <Preloader />
      <Navbar />
      <Hero />
      <Wizard />
      <Services />
      <About />
      <Process />
      <FAQ />
      <Contact />
      <Footer />
      <ChatWidget />
    </main>
  );
}
