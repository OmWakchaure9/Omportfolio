"use client";

import { motion } from "framer-motion";
import { Github, GitCommit, Users, Star, Code, ExternalLink, GitBranch } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

export default function GithubSection() {
  const { githubStats } = PORTFOLIO_DATA;

  // Generate realistic contribution graph heatmap grid cells (52 weeks x 7 days)
  const generateHeatmap = () => {
    const cells = [];
    for (let i = 0; i < 140; i++) {
      // Deterministic seed based on index to avoid SSR hydration mismatch
      const seed = (i * 17 + 5) % 100;
      let level = 0;
      if (seed > 30) level = 1;
      if (seed > 55) level = 2;
      if (seed > 80) level = 3;
      if (seed > 92) level = 4;

      let bg = "bg-slate-900 border border-white/5";
      if (level === 1) bg = "bg-emerald-950/80 border border-emerald-800/40";
      if (level === 2) bg = "bg-emerald-800/90 border border-emerald-600/50";
      if (level === 3) bg = "bg-emerald-600 shadow-neon-cyan";
      if (level === 4) bg = "bg-cyan-400 shadow-neon-cyan";
      cells.push({ id: i, bg });
    }
    return cells;
  };

  const heatmapCells = generateHeatmap();

  const featuredRepos = [
    {
      name: "AutoViz-AI-Assistant",
      desc: "Automated Data Analytics & Gemini AI Insight Generation Engine.",
      stars: 48,
      forks: 12,
      lang: "Python",
      langColor: "#3572A5"
    },
    {
      name: "Plant-Disease-Detection-CNN",
      desc: "Deep Convolutional Neural Network crop diagnostic system.",
      stars: 34,
      forks: 9,
      lang: "Python",
      langColor: "#3572A5"
    },
    {
      name: "Executive-Sales-Analytics-Dashboard",
      desc: "Power BI style real-time SQL transaction intelligence.",
      stars: 22,
      forks: 5,
      lang: "TypeScript",
      langColor: "#3178C6"
    }
  ];

  return (
    <section id="github" className="py-24 relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-purple-500/30 text-purple-300 text-xs font-mono mb-4">
          <Github className="w-3.5 h-3.5 text-cyan-400" />
          <span>Open Source & GitHub Activity</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          GitHub Profile & <span className="gradient-text-ai">Contribution Analytics</span>
        </h2>
        <p className="text-slate-400 text-base">
          Live statistics, repository cards, language distribution, and contribution activity heatmap for @{githubStats.username}.
        </p>
      </div>

      {/* GitHub Profile Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
        <div className="glass-card p-5 text-center flex flex-col items-center">
          <Github className="w-6 h-6 text-purple-400 mb-2" />
          <span className="text-2xl font-extrabold text-white font-mono">{githubStats.publicRepos}</span>
          <span className="text-xs text-slate-400 font-sans mt-0.5">Public Repos</span>
        </div>
        <div className="glass-card p-5 text-center flex flex-col items-center">
          <Users className="w-6 h-6 text-cyan-400 mb-2" />
          <span className="text-2xl font-extrabold text-white font-mono">{githubStats.followers}</span>
          <span className="text-xs text-slate-400 font-sans mt-0.5">Followers</span>
        </div>
        <div className="glass-card p-5 text-center flex flex-col items-center">
          <Star className="w-6 h-6 text-amber-400 mb-2" />
          <span className="text-2xl font-extrabold text-white font-mono">{githubStats.stars}</span>
          <span className="text-xs text-slate-400 font-sans mt-0.5">Total Stars</span>
        </div>
        <div className="glass-card p-5 text-center flex flex-col items-center">
          <GitCommit className="w-6 h-6 text-emerald-400 mb-2" />
          <span className="text-2xl font-extrabold text-white font-mono">{githubStats.contributionsThisYear}+</span>
          <span className="text-xs text-slate-400 font-sans mt-0.5">Yearly Commits</span>
        </div>
      </div>

      {/* Heatmap Contribution Graph */}
      <div className="glass-card p-6 border border-white/10 mb-12 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
            <GitCommit className="w-4 h-4 text-emerald-400" />
            <span>Contribution Heatmap Grid ({githubStats.contributionsThisYear} contributions)</span>
          </h3>
          <a
            href={PORTFOLIO_DATA.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
          >
            <span>View GitHub Profile</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-20 sm:grid-cols-28 gap-1.5 p-2 bg-slate-950/80 rounded-xl overflow-x-auto">
          {heatmapCells.map((cell) => (
            <div key={cell.id} className={`w-3 h-3 rounded-sm ${cell.bg}`} />
          ))}
        </div>
      </div>

      {/* Repository Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {featuredRepos.map((repo, idx) => (
          <div key={idx} className="glass-card p-6 border border-white/10 hover:border-cyan-400/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                  <Github className="w-4 h-4 text-purple-400" />
                  <span>{repo.name}</span>
                </h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{repo.desc}</p>
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-white/10 text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: repo.langColor }} />
                <span>{repo.lang}</span>
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" />{repo.stars}</span>
                <span className="flex items-center gap-1"><GitBranch className="w-3.5 h-3.5 text-cyan-400" />{repo.forks}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
