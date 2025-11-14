import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { StoryStats } from "@/components/StoryStats";
import { Symptoms } from "@/components/Symptoms";
import { Services } from "@/components/Services";
import { Certificates } from "@/components/Certificates";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";

export default function Home() {
  return (
    <main className="min-h-screen">
      <SmoothScroll />
      <Header />
      <Hero />
      <StoryStats />
      <Symptoms />
      <Services />
      <Certificates />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}

