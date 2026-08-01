"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Github,
  Linkedin,
  Mail,
  FolderCheck,
  Cpu,
  Award,
  GitCommit,
  ChevronDown,
  Play,
  Send,
  Download
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { audioFx } from "@/components/ui/AudioFx";

interface HeroProps {
  onOpenResumeModal: () => void;
}

export default function Hero({ onOpenResumeModal }: HeroProps) {
  const { data } = usePortfolio();
  const titles = data.personal.titles;
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);

  useEffect(() => {
    if (titles && titles.length > 0) {
      const interval = setInterval(() => {
        setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
      }, 2800);
      return () => clearInterval(interval);
    }
  }, [titles]);

  const scrollToSection = (id: string) => {
    audioFx.playClick();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const getStatIcon = (iconName: string) => {
    switch (iconName) {
      case "FolderCheck": return <FolderCheck className="w-5 h-5 text-cyan-400" />;
      case "Cpu": return <Cpu className="w-5 h-5 text-purple-400" />;
      case "Award": return <Award className="w-5 h-5 text-amber-400" />;
      case "GitCommit": return <GitCommit className="w-5 h-5 text-emerald-400" />;
      default: return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 flex flex-col justify-center items-center overflow-hidden">
      {/* Aurora Radial Glow Spotlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 left-1/4 w-[480px] h-[480px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[420px] h-[420px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center flex flex-col items-center">
        {/* Profile Image with Animated Glowing Border */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="mb-8 relative cursor-pointer group"
          onClick={() => scrollToSection("about")}
        >
          <div className="glowing-profile-frame w-32 h-32 sm:w-40 sm:h-40">
            <img
              src={data.personal.profilePhoto}
              alt={data.personal.name}
              className="w-full h-full object-cover rounded-full border-2 border-slate-950 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-slate-900 border border-cyan-400/50 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-cyan-300 flex items-center gap-1 shadow-neon-cyan">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Open for Hire</span>
          </div>
        </motion.div>



        {/* Hero Name Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4 max-w-5xl leading-[1.1]"
        >
          Hi, I&apos;m{" "}
          <span className="gradient-text-ai block sm:inline">
            {data.personal.name}
          </span>
        </motion.h1>

        {/* Animated Role Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="h-12 mb-6 flex items-center justify-center text-lg sm:text-2xl font-mono text-cyan-300 font-medium"
        >
          <span className="text-slate-400 mr-2.5">&gt; I am a</span>
          <motion.span
            key={currentTitleIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-purple-400 font-bold border-b-2 border-cyan-400 px-1"
          >
            {titles[currentTitleIndex] || "AI Engineer"}
          </motion.span>
        </motion.div>

        {/* Bio Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-sans"
        >
          {data.personal.bio}
        </motion.p>

        {/* CTA Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-14"
        >
          {/* Hire Me CTA */}
          <button
            onClick={() => scrollToSection("contact")}
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 text-white font-bold text-sm sm:text-base shadow-neon-purple hover:shadow-neon-cyan hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 group cursor-pointer"
          >
            <Send className="w-4 h-4 fill-white group-hover:translate-x-0.5 transition-transform" />
            <span>Hire Me</span>
          </button>

          {/* View Projects CTA */}
          <button
            onClick={() => scrollToSection("projects")}
            className="px-6 py-3.5 rounded-2xl glass-card text-white font-semibold text-sm sm:text-base border border-purple-500/30 hover:border-cyan-400/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 text-cyan-400" />
            <span>View Projects</span>
          </button>

          {/* Download Resume Modal */}
          <button
            onClick={() => {
              audioFx.playClick();
              onOpenResumeModal();
            }}
            className="px-6 py-3.5 rounded-2xl glass-card text-slate-200 font-semibold text-sm sm:text-base border border-white/10 hover:border-emerald-400/50 hover:text-white hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download Resume</span>
          </button>

          {/* Social Links */}
          <div className="flex items-center gap-2 pl-2">
            <a
              href={data.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl glass-card text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-all hover:scale-110"
              title="GitHub Profile"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={data.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl glass-card text-slate-300 hover:text-purple-400 hover:border-purple-400/50 transition-all hover:scale-110"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${data.personal.email}`}
              className="p-3 rounded-2xl glass-card text-slate-300 hover:text-emerald-400 hover:border-emerald-400/50 transition-all hover:scale-110"
              title="Send Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

        {/* Animated Statistics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl"
        >
          {data.stats.map((stat, idx) => (
            <div
              key={idx}
              className="glass-card p-5 text-center flex flex-col items-center justify-center hover:border-purple-500/40 transition-all group"
            >
              <div className="mb-2 p-2 rounded-xl bg-slate-900 border border-white/10 group-hover:border-cyan-400/40 transition-colors">
                {getStatIcon(stat.icon)}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white mb-1 flex items-baseline justify-center">
                <span className="gradient-text-ai">{stat.value}</span>
                <span className="text-cyan-400 ml-0.5">{stat.suffix}</span>
              </div>
              <span className="text-xs text-slate-400 font-sans group-hover:text-slate-200 transition-colors">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Scroll Down Indicator */}
        <motion.button
          onClick={() => scrollToSection("about")}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="mt-12 text-slate-500 hover:text-cyan-400 transition-colors flex flex-col items-center gap-1 text-xs font-mono cursor-pointer"
        >
          <span>EXPLORE PORTFOLIO</span>
          <ChevronDown className="w-4 h-4" />
        </motion.button>
      </div>
    </section>
  );
}
