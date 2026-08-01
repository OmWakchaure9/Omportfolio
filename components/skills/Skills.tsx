"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Code,
  Brain,
  Network,
  Sparkles,
  Zap,
  Box,
  Database,
  BarChart3,
  Table,
  Binary,
  Sliders,
  PieChart,
  Layout,
  Atom,
  Globe,
  FileCode,
  GitBranch,
  GitCommit,
  Coffee,
  Cpu,
  BookOpen,
  Check
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { audioFx } from "@/components/ui/AudioFx";

export default function Skills() {
  const { data } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Programming", "AI & Data Science", "Web", "Database", "Tools"];

  const filteredSkills =
    selectedCategory === "All"
      ? data.skills
      : data.skills.filter((s) => s.category === selectedCategory);

  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case "Code": return <Code className="w-5 h-5 text-purple-400" />;
      case "Coffee": return <Coffee className="w-5 h-5 text-amber-400" />;
      case "Binary": return <Binary className="w-5 h-5 text-indigo-400" />;
      case "Database": return <Database className="w-5 h-5 text-emerald-400" />;
      case "Brain": return <Brain className="w-5 h-5 text-cyan-400" />;
      case "Network": return <Network className="w-5 h-5 text-blue-400" />;
      case "BarChart3": return <BarChart3 className="w-5 h-5 text-teal-400" />;
      case "PieChart": return <PieChart className="w-5 h-5 text-yellow-400" />;
      case "Sliders": return <Sliders className="w-5 h-5 text-purple-300" />;
      case "Table": return <Table className="w-5 h-5 text-cyan-300" />;
      case "Cpu": return <Cpu className="w-5 h-5 text-pink-400" />;
      case "Sparkles": return <Sparkles className="w-5 h-5 text-pink-300" />;
      case "FileCode": return <FileCode className="w-5 h-5 text-orange-400" />;
      case "Layout": return <Layout className="w-5 h-5 text-blue-400" />;
      case "Zap": return <Zap className="w-5 h-5 text-amber-300" />;
      case "Atom": return <Atom className="w-5 h-5 text-cyan-400" />;
      case "Globe": return <Globe className="w-5 h-5 text-emerald-400" />;
      case "GitBranch": return <GitBranch className="w-5 h-5 text-orange-500" />;
      case "GitCommit": return <GitCommit className="w-5 h-5 text-emerald-500" />;
      case "BookOpen": return <BookOpen className="w-5 h-5 text-purple-400" />;
      default: return <Brain className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="skills" className="py-24 relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-purple-500/30 text-purple-300 text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Skills & Technical Expertise</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Core Technical <span className="gradient-text-ai">Proficiency</span>
        </h2>
        <p className="text-slate-400 text-base">
          Complete skill matrix covering programming languages, AI modeling frameworks, data analytics tools, and web engineering.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
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

      {/* Skills Card Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredSkills.map((skill, idx) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.03 }}
            className="glass-card p-6 border border-white/10 hover:border-cyan-400/40 transition-all hover:scale-[1.02] group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 group-hover:border-cyan-400/50 transition-colors">
                  {getSkillIcon(skill.icon)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {skill.name}
                  </h3>
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                    {skill.category}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-mono font-bold text-white gradient-text-ai">
                  {skill.level}%
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 leading-relaxed mb-4 min-h-[36px]">
              {skill.description}
            </p>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-900 border border-white/5 overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500 rounded-full"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-slate-900/90 text-[10px] font-mono text-slate-400 border border-white/5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
