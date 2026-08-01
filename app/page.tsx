"use client";

import { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import CustomCursor from "@/components/ui/CustomCursor";
import ParticleCanvas from "@/components/ui/ParticleCanvas";
import Navbar from "@/components/navigation/Navbar";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Skills from "@/components/skills/Skills";
import Projects from "@/components/projects/Projects";
import Experience from "@/components/experience/Experience";
import Education from "@/components/education/Education";
import Achievements from "@/components/achievements/Achievements";
import Certificates from "@/components/certificates/Certificates";
import GithubSection from "@/components/github/GithubSection";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/footer/Footer";
import ResumeModal from "@/components/ui/ResumeModal";
import AiAssistant from "@/components/ai-assistant/AiAssistant";

export default function Home() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  // Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="relative min-h-screen bg-[#030712] overflow-x-hidden">
      {/* Scroll Progress Bar at Top */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-cyan-400 to-blue-600 z-50 origin-left shadow-neon-cyan"
        style={{ scaleX }}
      />

      {/* Interactive Background & Cursor Effects */}
      <CustomCursor />
      <ParticleCanvas />

      {/* Floating Header Navbar */}
      <Navbar
        onOpenResumeModal={() => setIsResumeModalOpen(true)}
      />

      {/* Main Page Sections */}
      <Hero onOpenResumeModal={() => setIsResumeModalOpen(true)} />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      <Achievements />
      <Certificates />
      <GithubSection />
      <Contact />
      <Footer />

      {/* Modals & Floating AI Assistant */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
      <AiAssistant />
    </main>
  );
}
