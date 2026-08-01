"use client";

import { motion } from "framer-motion";
import { Award, Trophy, Users, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Achievements() {
  const { data } = usePortfolio();

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case "Award": return <Award className="w-6 h-6 text-amber-400" />;
      case "Trophy": return <Trophy className="w-6 h-6 text-yellow-400" />;
      case "Users": return <Users className="w-6 h-6 text-cyan-400" />;
      case "BookOpen": return <BookOpen className="w-6 h-6 text-purple-400" />;
      default: return <Sparkles className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <section id="achievements" className="py-24 relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-purple-500/30 text-purple-300 text-xs font-mono mb-4">
          <Trophy className="w-3.5 h-3.5 text-cyan-400" />
          <span>Honors & Recognitions</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Key Achievements & <span className="gradient-text-ai">Milestones</span>
        </h2>
        <p className="text-slate-400 text-base">
          Recognitions across internship top performer awards, hackathon wins, AI project milestones, and technical workshop leadership.
        </p>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.achievements.map((ach, idx) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="glass-card p-6 border border-white/10 hover:border-amber-400/40 transition-all hover:scale-[1.03] flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 group-hover:border-amber-400/50 transition-colors">
                  {getAchievementIcon(ach.icon)}
                </div>
                <span className="text-[10px] font-mono text-amber-400 px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 font-bold">
                  {ach.badgeText}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                {ach.title}
              </h3>
              <p className="text-[11px] font-mono text-purple-400 mb-3">{ach.category} • {ach.date}</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {ach.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Milestone</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
