"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Upload, FileText, BarChart3, PieChart, LineChart, CheckCircle2, Download, RefreshCw, Layers } from "lucide-react";
import { audioFx } from "@/components/ui/AudioFx";

export default function AutoVizDemo() {
  const [selectedDataset, setSelectedDataset] = useState<"sales" | "ai_crops" | "churn">("sales");
  const [activeChartTab, setActiveChartTab] = useState<"bar" | "line" | "pie">("bar");
  const [isProcessing, setIsProcessing] = useState(false);

  const sampleDatasets = {
    sales: {
      name: "Q3_Retail_Sales_Data.csv",
      rows: 15420,
      columns: 12,
      cleanedPct: 100,
      aiSummary: "Gemini AI Insight: Sales peaked in August driven by AI electronics promotion (+42% YoY). Regional decay detected in Northern sector due to supply chain latency.",
      chartData: [
        { label: "Jan", val: 4200 },
        { label: "Feb", val: 5100 },
        { label: "Mar", val: 6800 },
        { label: "Apr", val: 7400 },
        { label: "May", val: 9200 },
        { label: "Jun", val: 11400 },
      ]
    },
    ai_crops: {
      name: "Plant_Disease_Pathology_Metrics.csv",
      rows: 38400,
      columns: 8,
      cleanedPct: 99.8,
      aiSummary: "Gemini AI Insight: MobileNet CNN classified Tomato Late Blight with 98.7% accuracy. Early symptom detection averted estimated $14,000 crop loss per acre.",
      chartData: [
        { label: "Healthy", val: 14200 },
        { label: "Blight", val: 8900 },
        { label: "Rust", val: 6300 },
        { label: "Mildew", val: 5100 },
        { label: "Mite", val: 3900 },
      ]
    },
    churn: {
      name: "SaaS_Customer_Churn_Prediction.csv",
      rows: 8500,
      columns: 16,
      cleanedPct: 100,
      aiSummary: "Gemini AI Insight: High support ticket volume (>4/mo) correlates with 78% churn risk. Proactive outreach recommended for Tier-2 subscribers.",
      chartData: [
        { label: "Low Risk", val: 5200 },
        { label: "Medium", val: 2100 },
        { label: "High Risk", val: 1200 },
      ]
    }
  };

  const current = sampleDatasets[selectedDataset];

  const handleDatasetChange = (key: "sales" | "ai_crops" | "churn") => {
    audioFx.playClick();
    setIsProcessing(true);
    setSelectedDataset(key);
    setTimeout(() => {
      setIsProcessing(false);
    }, 450);
  };

  return (
    <div id="autoviz-demo" className="glass-card p-6 sm:p-8 border border-purple-500/30 shadow-2xl relative overflow-hidden my-12">
      {/* Header Spotlight */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 text-white shadow-neon-purple">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span>AutoViz AI Assistant</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-mono">
                Interactive Live Tool
              </span>
            </h3>
            <p className="text-xs text-slate-400">Automated Data Cleansing, Profiling & Gemini AI Report Engine</p>
          </div>
        </div>

        {/* Dataset Switcher Pills */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-white/10">
          <span className="text-[10px] font-mono text-slate-400 px-2">Dataset:</span>
          <button
            onClick={() => handleDatasetChange("sales")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedDataset === "sales" ? "bg-purple-600 text-white shadow-neon-purple" : "text-slate-400 hover:text-white"
            }`}
          >
            Sales CSV
          </button>
          <button
            onClick={() => handleDatasetChange("ai_crops")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedDataset === "ai_crops" ? "bg-cyan-600 text-white shadow-neon-cyan" : "text-slate-400 hover:text-white"
            }`}
          >
            Crops Path
          </button>
          <button
            onClick={() => handleDatasetChange("churn")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedDataset === "churn" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Churn Risk
          </button>
        </div>
      </div>

      {/* Main Workbench Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Data Metrics & AI Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-slate-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>{current.name}</span>
              </span>
              <span className="text-emerald-400 font-bold">{current.cleanedPct}% Cleaned</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-white/5">
              <div className="bg-slate-950 p-2 rounded-lg border border-white/5">
                <span className="text-slate-500 block">Total Records:</span>
                <span className="text-white font-bold text-sm">{current.rows.toLocaleString()}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-white/5">
                <span className="text-slate-500 block">Dimensions:</span>
                <span className="text-cyan-400 font-bold text-sm">{current.columns} Cols</span>
              </div>
            </div>
          </div>

          {/* Gemini AI Insight Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-cyan-950/40 to-slate-900 border border-cyan-500/30 relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-cyan-300">Gemini AI Executive Summary</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {isProcessing ? "Analyzing dataset patterns..." : current.aiSummary}
            </p>
          </div>
        </div>

        {/* Right Chart Visualization */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-950/90 border border-white/10 min-h-[250px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Automated Chart Recommendation</span>
            </span>

            <div className="flex gap-1.5 bg-slate-900 p-1 rounded-lg border border-white/10">
              <button
                onClick={() => {
                  audioFx.playClick();
                  setActiveChartTab("bar");
                }}
                className={`p-1.5 rounded text-xs ${activeChartTab === "bar" ? "bg-purple-600 text-white" : "text-slate-400"}`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  audioFx.playClick();
                  setActiveChartTab("line");
                }}
                className={`p-1.5 rounded text-xs ${activeChartTab === "line" ? "bg-cyan-600 text-white" : "text-slate-400"}`}
              >
                <LineChart className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  audioFx.playClick();
                  setActiveChartTab("pie");
                }}
                className={`p-1.5 rounded text-xs ${activeChartTab === "pie" ? "bg-blue-600 text-white" : "text-slate-400"}`}
              >
                <PieChart className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bar Chart Renderer */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-white/10 pb-2">
            {current.chartData.map((d, idx) => {
              const maxVal = Math.max(...current.chartData.map((cd) => cd.val));
              const heightPct = Math.round((d.val / maxVal) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.val}
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-purple-600 via-cyan-500 to-blue-500 group-hover:brightness-125 transition-all shadow-neon-purple"
                  />
                  <span className="text-[10px] font-mono text-slate-400">{d.label}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-3 text-[11px] font-mono text-slate-400">
            <span>Powered by AutoViz AI Python Engine</span>
            <span className="text-cyan-400 font-bold">100% Real-Time Parsing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
