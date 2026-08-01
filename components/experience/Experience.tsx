"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Experience() {
  const { data } = usePortfolio();

  return (
    <section id="experience" className="py-24 relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-purple-500/30 text-purple-300 text-xs font-mono mb-4">
          <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
          <span>Professional Experience & Internships</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Industry <span className="gradient-text-ai">Experience & Impact</span>
        </h2>
        <p className="text-slate-400 text-base">
          Proven track record in data analytics internship, top performer recognition, dataset cleaning, team collaboration, and dashboard engineering.
        </p>
      </div>

      {/* Experience Timeline Stream */}
      <div className="relative max-w-4xl mx-auto border-l-2 border-purple-500/30 pl-6 sm:pl-8 space-y-12">
        {data.experience.map((exp, idx) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="relative group"
          >
            {/* Timeline Dot Icon */}
            <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-9 h-9 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-neon-cyan group-hover:scale-110 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>

            {/* Main Timeline Glass Card */}
            <div className="glass-card p-7 border border-white/10 hover:border-cyan-400/40 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <span className="text-xs font-mono text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 inline-block mb-2">
                    {exp.type}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">{exp.role}</h3>
                  <p className="text-sm font-semibold text-purple-400 font-mono mt-0.5">{exp.company}</p>
                </div>

                <div className="text-right text-xs font-mono text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 justify-end">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{exp.period}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                {exp.description}
              </p>

              {/* Achievements */}
              <div className="space-y-2 mb-6">
                <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Key Impact & Deliverables:</h4>
                {exp.achievements.map((ach, aIdx) => (
                  <div key={aIdx} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{ach}</span>
                  </div>
                ))}
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                {exp.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md bg-slate-900 text-xs font-mono text-cyan-300 border border-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
