"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Menu,
  X,
  FileText,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Code,
  User,
  FolderKanban,
  GraduationCap,
  Award,
  Github,
  Send,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { usePortfolio } from "@/context/PortfolioContext";
import { audioFx } from "@/components/ui/AudioFx";

interface NavbarProps {
  onOpenResumeModal: () => void;
  onOpenTerminalModal?: () => void;
}

export default function Navbar({ onOpenResumeModal }: NavbarProps) {
  const { data } = usePortfolio();
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const navLinks = [
    { id: "hero", label: "Home", icon: Sparkles },
    { id: "about", label: "About", icon: User },
    { id: "skills", label: "Skills", icon: Code },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "experience", label: "Experience", icon: GraduationCap },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "github", label: "GitHub", icon: Github },
    { id: "contact", label: "Contact", icon: Send },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = navLinks.map((link) => document.getElementById(link.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navLinks[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    audioFx.playClick();
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioFx.setEnabled(next);
    if (next) audioFx.playSuccess();
  };

  const toggleTheme = () => {
    audioFx.playClick();
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? "py-3" : "py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="glass-card px-4 sm:px-6 py-3 border border-white/10 flex items-center justify-between shadow-2xl backdrop-blur-xl">
            {/* Logo */}
            <button
              onClick={() => scrollToSection("hero")}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-cyan-500 to-blue-600 p-[1px] shadow-neon-purple group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-base font-extrabold text-white tracking-tight block">
                  {data.personal.shortName || "Om Wakchaure"}
                </span>
                <span className="text-[10px] font-mono text-cyan-400 block -mt-0.5">
                  AI & Data Science
                </span>
              </div>
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-2xl border border-white/5">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 relative ${
                      isActive
                        ? "text-white font-bold"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavTab"
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl shadow-neon-purple -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Admin Panel Link */}
              <Link
                href="/admin"
                className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-purple-400 hover:border-purple-400/50 transition-all hover:scale-105"
                title="Open Admin Edit Panel"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              </Link>

              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                className={`p-2.5 rounded-xl glass-card transition-all hover:scale-105 ${
                  soundEnabled ? "text-cyan-400 border-cyan-400/50" : "text-slate-400"
                }`}
                title={soundEnabled ? "Audio Effects On" : "Audio Effects Off"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-purple-400 hover:border-purple-400/50 transition-all hover:scale-105"
                title="Toggle Dark/Light theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Download Resume Button */}
              <button
                onClick={() => {
                  audioFx.playClick();
                  onOpenResumeModal();
                }}
                className="hidden sm:flex px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 text-white font-semibold text-xs shadow-neon-purple hover:scale-105 active:scale-95 transition-all items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Resume</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => {
                  audioFx.playClick();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className="lg:hidden p-2.5 rounded-xl glass-card text-slate-300 hover:text-white"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-24 z-50 glass-card p-6 border border-purple-500/30 shadow-2xl lg:hidden flex flex-col gap-3"
          >
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                    activeSection === link.id
                      ? "bg-purple-600/30 border-purple-400 text-white"
                      : "bg-slate-900/60 border-white/5 text-slate-300"
                  }`}
                >
                  <link.icon className="w-4 h-4 text-cyan-400" />
                  <span>{link.label}</span>
                </button>
              ))}
            </div>

            <Link
              href="/admin"
              className="w-full py-3 rounded-xl bg-slate-900 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Open Admin Panel</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
