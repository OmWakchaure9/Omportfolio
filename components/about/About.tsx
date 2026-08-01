"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  GraduationCap,
  Brain,
  Sparkles,
  BarChart3,
  Globe,
  Zap
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { audioFx } from "@/components/ui/AudioFx";

export default function About() {
  const { data } = usePortfolio();
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "passions">("overview");

  const getAboutIcon = (iconName: string) => {
    switch (iconName) {
      case "GraduationCap": return <GraduationCap className="w-5 h-5 text-purple-400" />;
      case "Brain": return <Brain className="w-5 h-5 text-cyan-400" />;
      case "Sparkles": return <Sparkles className="w-5 h-5 text-pink-400" />;
      case "BarChart3": return <BarChart3 className="w-5 h-5 text-emerald-400" />;
      case "Globe": return <Globe className="w-5 h-5 text-blue-400" />;
      case "Zap": return <Zap className="w-5 h-5 text-amber-400" />;
      default: return <User className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="about" className="py-24 relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-purple-500/30 text-purple-300 text-xs font-mono mb-4">
          <User className="w-3.5 h-3.5 text-cyan-400" />
          <span>About {data.personal.name}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Merging Academic Excellence with <span className="gradient-text-ai">AI Innovation</span>
        </h2>
        <p className="text-slate-400 text-base">
          From core computer engineering fundamentals to advanced machine learning models and automated data analytics.
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="flex justify-center mb-12">
        <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 flex gap-2 backdrop-blur-xl">
          <button
            onClick={() => {
              audioFx.playClick();
              setActiveTab("overview");
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-neon-purple"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Overview</span>
          </button>
          <button
            onClick={() => {
              audioFx.playClick();
              setActiveTab("timeline");
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "timeline"
                ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-neon-purple"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Academic Timeline</span>
          </button>
          <button
            onClick={() => {
              audioFx.playClick();
              setActiveTab("passions");
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "passions"
                ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-neon-purple"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Core Passions</span>
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Card: Quick Profile Bio */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-card p-7 border border-white/10 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-purple-500/50 shadow-neon-purple">
                <img
                  src={data.personal.profilePhoto}
                  alt={data.personal.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">{data.personal.name}</h3>
                <p className="text-xs font-mono text-cyan-400">AI & Data Science Engineer</p>
                <p className="text-xs text-slate-400 font-sans mt-0.5">{data.personal.location}</p>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {data.personal.bio}
            </p>

            <div className="space-y-3 font-mono text-xs text-slate-300 border-t border-white/10 pt-4">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Education:</span>
                <span className="text-cyan-300 font-semibold">BE in AI & Data Science</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Diploma:</span>
                <span className="text-purple-300 font-semibold">Computer Engineering</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-semibold">Available for Global Roles</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Tab Content */}
        <div className="lg:col-span-7">
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="glass-card p-7 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span>Engineering Journey & Mission</span>
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  My journey began with a Diploma in Computer Engineering, where I developed a strong foundation in data structures, algorithms, and core programming languages like C, Java, and Python. Moving into my Bachelor of Engineering in Artificial Intelligence & Data Science, I deepened my focus on deep neural networks, quantitative statistics, dataset cleansing, and generative AI systems.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                    <h4 className="text-sm font-bold text-cyan-300 mb-1">Analytical Precision</h4>
                    <p className="text-xs text-slate-400">Specialized in SQL data cleaning, EDA profiling, and Power BI dashboards.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                    <h4 className="text-sm font-bold text-purple-300 mb-1">AI Machine Learning</h4>
                    <p className="text-xs text-slate-400">Supervised & deep learning models, MobileNet CNNs, and RAG chatbots.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "timeline" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {data.aboutTimeline.map((item, idx) => (
                <div key={idx} className="glass-card p-6 border border-white/10 hover:border-purple-500/30 transition-all flex gap-4 items-start">
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10 shrink-0">
                    {getAboutIcon(item.icon)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                      {item.period}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">{item.title}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "passions" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-7 space-y-4 border border-white/10"
            >
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>Passions & Core Pillars</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                  <h4 className="text-sm font-bold text-purple-300 mb-1 flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span>Artificial Intelligence</span>
                  </h4>
                  <p className="text-xs text-slate-400">Designing intelligent neural networks, RAG architectures, and computer vision classification engines.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                  <h4 className="text-sm font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                    <span>Data Analytics</span>
                  </h4>
                  <p className="text-xs text-slate-400">Extracting signals from raw noise with Pandas, SQL queries, and Power BI/Tableau visual dashboards.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                  <h4 className="text-sm font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span>Web Engineering</span>
                  </h4>
                  <p className="text-xs text-slate-400">Connecting AI models to responsive React, Streamlit, and Next.js user interfaces.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                  <h4 className="text-sm font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Problem Solving & Innovation</span>
                  </h4>
                  <p className="text-xs text-slate-400">Winning technical hackathons, leading engineering teams, and building production-ready products.</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
