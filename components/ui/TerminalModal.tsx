"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, Play, CornerDownLeft, Sparkles } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { audioFx } from "./AudioFx";

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TerminalModal({ isOpen, onClose }: TerminalModalProps) {
  const [inputCommand, setInputCommand] = useState("");
  const [history, setHistory] = useState<Array<{ command: string; output: string }>>([
    {
      command: "om --help",
      output: "Available commands: 'skills', 'projects', 'about', 'contact', 'clear', 'exit'"
    }
  ]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    audioFx.playClick();

    const cmd = inputCommand.trim().toLowerCase();
    let responseOutput = "";

    if (cmd === "help" || cmd === "om --help") {
      responseOutput = "Commands: 'skills', 'projects', 'about', 'contact', 'clear', 'exit'";
    } else if (cmd === "skills") {
      responseOutput = "Python, Java, C, SQL, Machine Learning, Deep Learning, Data Analysis, Pandas, NumPy, Scikit-learn, React, Streamlit, MySQL, Git, VS Code, Power BI, Tableau.";
    } else if (cmd === "projects") {
      responseOutput = "1. AI Data Visualization Assistant (AutoViz AI)\n2. Plant Disease Detection using AI\n3. Smart Analytics Dashboard\n4. Context-Aware AI Chatbot\n5. Data Analysis & Cleansing Dashboard\n6. AutoML Business Insight Generator";
    } else if (cmd === "about") {
      responseOutput = `Name: ${PORTFOLIO_DATA.personal.name}\nDegree: BE in Artificial Intelligence & Data Science\nDiploma: Computer Engineering\nPassions: AI, ML, Data Analytics, Web Engineering, Problem Solving.`;
    } else if (cmd === "contact") {
      responseOutput = `Email: ${PORTFOLIO_DATA.personal.email}\nGitHub: ${PORTFOLIO_DATA.personal.github}\nLinkedIn: ${PORTFOLIO_DATA.personal.linkedin}`;
    } else if (cmd === "clear") {
      setHistory([]);
      setInputCommand("");
      return;
    } else if (cmd === "exit") {
      onClose();
      return;
    } else {
      responseOutput = `Command not recognized: '${cmd}'. Type 'help' to see list of valid commands.`;
    }

    setHistory((prev) => [...prev, { command: inputCommand, output: responseOutput }]);
    setInputCommand("");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-3xl glass-card overflow-hidden border border-cyan-500/40 shadow-neon-cyan flex flex-col font-mono"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
              </div>
              <span className="text-xs text-cyan-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                <span>om-wakchaure-ai-terminal v1.0</span>
              </span>
            </div>

            <button
              onClick={() => {
                audioFx.playClick();
                onClose();
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Terminal Output Area */}
          <div className="p-6 h-[380px] overflow-y-auto bg-slate-950/90 text-xs leading-relaxed space-y-4">
            <div className="text-emerald-400">
              <p>Welcome to Om Santosh Wakchaure&apos;s AI Terminal Prompt.</p>
              <p className="text-slate-400">Type &apos;<span className="text-cyan-300 font-bold">help</span>&apos; to view available options.</p>
            </div>

            {history.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center gap-2 text-cyan-400">
                  <span className="text-purple-400">om@ai-engine:~$</span>
                  <span>{item.command}</span>
                </div>
                <pre className="text-slate-300 font-mono whitespace-pre-wrap pl-4 border-l border-cyan-500/30">
                  {item.output}
                </pre>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleCommand} className="p-4 bg-slate-900 border-t border-white/10 flex items-center gap-2">
            <span className="text-purple-400 text-xs font-bold">om@ai-engine:~$</span>
            <input
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              placeholder="type command (e.g. skills, projects, about)..."
              className="flex-1 bg-transparent text-xs text-white focus:outline-none font-mono"
              autoFocus
            />
            <button type="submit" className="p-1.5 rounded bg-cyan-600/30 text-cyan-300 hover:bg-cyan-600/50">
              <CornerDownLeft className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
