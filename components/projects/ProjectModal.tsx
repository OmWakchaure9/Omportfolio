"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ExternalLink, Sparkles, CheckCircle2, Cpu, Zap, Code, ShieldCheck } from "lucide-react";
import { Project } from "@/data/portfolioData";
import { audioFx } from "@/components/ui/AudioFx";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}




export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] glass-card overflow-hidden border border-purple-500/30 shadow-2xl flex flex-col"
        >
          {/* Header Image Cover */}
          <div className="relative h-56 sm:h-64 overflow-hidden shrink-0">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            {/* Close Button */}
            <button
              onClick={() => {
                audioFx.playClick();
                onClose();
              }}
              className="absolute top-4 right-4 p-2 rounded-full glass-card text-white hover:text-cyan-400 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title Badge overlay */}
            <div className="absolute bottom-4 left-6 right-6">
              <span className="text-xs font-mono text-cyan-400 px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-500/40">
                {project.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">{project.title}</h2>
              <p className="text-xs sm:text-sm text-purple-300 font-mono mt-0.5">{project.tagline}</p>
            </div>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-xs sm:text-sm font-sans">
            {/* Description */}
            <div>
              <h3 className="text-xs font-mono uppercase text-purple-400 tracking-wider mb-2">Overview</h3>
              <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-white/5">
                {project.description}
              </p>
            </div>


            {/* Problem & Solution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                <h4 className="text-xs font-bold text-red-400 mb-1 flex items-center gap-1.5 font-mono">
                  <Zap className="w-4 h-4" />
                  <span>The Challenge</span>
                </h4>
                <p className="text-slate-400 leading-relaxed text-xs">{project.problem}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                <h4 className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5 font-mono">
                  <ShieldCheck className="w-4 h-4" />
                  <span>The AI Engineering Solution</span>
                </h4>
                <p className="text-slate-400 leading-relaxed text-xs">{project.solution}</p>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider mb-3">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-slate-900/50 border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-xs">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="text-xs font-mono uppercase text-purple-400 tracking-wider mb-2">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-lg bg-slate-900 text-xs font-mono text-cyan-300 border border-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="p-4 border-t border-white/10 bg-slate-950 flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 font-bold">{project.metrics}</span>

            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl glass-card text-white text-xs font-semibold flex items-center gap-2 hover:border-cyan-400/50 transition-all"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-semibold flex items-center gap-2 shadow-neon-purple hover:scale-105 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
