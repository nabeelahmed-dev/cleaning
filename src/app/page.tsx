import { Animations } from "@/components/Animations";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { About, Process, Reviews, Services } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <About />
        <Process />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <Animations />
    </>
  );
}
