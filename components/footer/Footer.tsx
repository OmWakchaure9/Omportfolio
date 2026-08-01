"use client";

import { Sparkles, ArrowUp, Github, Linkedin, Mail, Instagram } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { audioFx } from "@/components/ui/AudioFx";

export default function Footer() {
  const { data } = usePortfolio();

  const scrollToTop = () => {
    audioFx.playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 border-t border-white/10 bg-slate-950/90 pt-16 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-cyan-500 to-blue-600 p-[1px] shadow-neon-purple mb-3">
            <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">{data.personal.name}</h3>
          <p className="text-xs font-mono text-cyan-400 mt-1">AI & Data Science Engineer</p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3 mb-10">
          <a
            href={data.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl glass-card text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-all hover:scale-110"
            title="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href={data.personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl glass-card text-slate-300 hover:text-purple-400 hover:border-purple-400/50 transition-all hover:scale-110"
            title="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href={data.personal.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl glass-card text-slate-300 hover:text-pink-400 hover:border-pink-400/50 transition-all hover:scale-110"
            title="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href={`mailto:${data.personal.email}`}
            className="p-3 rounded-2xl glass-card text-slate-300 hover:text-emerald-400 hover:border-emerald-400/50 transition-all hover:scale-110"
            title="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>

        {/* Visitor Counter & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl border-t border-white/10 pt-8 text-xs font-mono text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {data.personal.name}. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Visitor Count: 1,482</span>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-all hover:scale-105 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
