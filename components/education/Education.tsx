"use client";

import { motion } from "framer-motion";
import { GraduationCap, CheckCircle2, Building2 } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Education() {
  const { data } = usePortfolio();

  return (
    <section id="education" className="py-24 relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-purple-500/30 text-purple-300 text-xs font-mono mb-4">
          <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Academic Background</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Education & <span className="gradient-text-ai">Qualifications</span>
        </h2>
        <p className="text-slate-400 text-base">
          Interactive educational timeline highlighting Diploma in Computer Engineering and BE in Artificial Intelligence & Data Science.
        </p>
      </div>

      {/* Grid Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {data.education.map((edu, idx) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="glass-card p-7 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 text-cyan-400 group-hover:border-cyan-400/50 transition-colors">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30">
                  {edu.year}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                {edu.degree}
              </h3>
              <p className="text-xs font-mono text-purple-400 mb-3 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>{edu.institution}</span>
              </p>

              <div className="mb-4 text-xs font-mono text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/20">
                Performance: {edu.grade}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {edu.description}
              </p>

              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Key Accomplishments:</h4>
              <div className="space-y-2">
                {edu.highlights.map((h, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
