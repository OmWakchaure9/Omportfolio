"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FolderKanban,
  Sparkles,
  Search,
  Check,
  Github,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { Project } from "@/data/portfolioData";
import { usePortfolio } from "@/context/PortfolioContext";
import AutoVizDemo from "./AutoVizDemo";
import ProjectModal from "./ProjectModal";
import { audioFx } from "@/components/ui/AudioFx";

export default function Projects() {
  const { data } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const categories = ["All", "AI / ML", "Data Science", "Analytics"];

  const filteredProjects = data.projects.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="py-24 relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Modal Popup */}
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-purple-500/30 text-purple-300 text-xs font-mono mb-4">
          <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
          <span>Featured AI & Data Science Engineering Works</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Interactive <span className="gradient-text-ai">Projects Showcase</span>
        </h2>
        <p className="text-slate-400 text-base">
          Production-grade machine learning models, computer vision diagnostic engines, automated data assistants, and real-time analytical dashboards.
        </p>
      </div>

      {/* Live Interactive AutoViz AI Demo Spotlight */}
      <AutoVizDemo />

      {/* Filter and Search Bar Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                audioFx.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-neon-purple scale-105"
                  : "glass-card text-slate-400 hover:text-white hover:border-white/20"
              }`}
            >
              <span>{cat}</span>
              {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>

        {/* Search Bar Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by tech/name..."
            className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
      </div>

      {/* Project Cards Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="glass-card overflow-hidden border border-white/10 hover:border-purple-500/40 transition-all hover:scale-[1.02] flex flex-col group"
          >
            {/* Project Image Thumbnail */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <span className="absolute top-3 left-3 text-[10px] font-mono text-cyan-300 px-2.5 py-1 rounded-full bg-slate-950/80 border border-cyan-500/30">
                {project.category}
              </span>

              {project.isFeatured && (
                <span className="absolute top-3 right-3 text-[10px] font-mono text-amber-300 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Featured</span>
                </span>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5">
                  {project.title}
                </h3>
                <p className="text-xs text-purple-300 font-mono mb-3">{project.tagline}</p>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Metrics Highlight */}
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-white/5 text-[11px] font-mono text-emerald-400 mb-4">
                  {project.metrics}
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-slate-300 border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-slate-500">
                      +{project.technologies.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => {
                    audioFx.playClick();
                    setActiveProject(project);
                  }}
                  className="text-xs text-cyan-400 hover:text-white font-semibold flex items-center gap-1 group/btn cursor-pointer"
                >
                  <span>Details & Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg glass-card text-slate-300 hover:text-cyan-400 transition-colors"
                      title="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg glass-card text-slate-300 hover:text-purple-400 transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
