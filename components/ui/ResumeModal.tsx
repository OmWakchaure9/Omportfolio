"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText, CheckCircle2, ExternalLink, Eye, Upload } from "lucide-react";
import Link from "next/link";
import { usePortfolio } from "@/context/PortfolioContext";
import { audioFx } from "./AudioFx";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const { data } = usePortfolio();

  if (!isOpen) return null;

  const hasUploadedResume = Boolean(data.personal.resumeUrl && data.personal.resumeUrl !== "#resume");

  const handleDownloadFile = () => {
    audioFx.playClick();
    if (hasUploadedResume) {
      const element = document.createElement("a");
      element.href = data.personal.resumeUrl;
      element.download = data.personal.resumeFileName || `${data.personal.name.replace(/\s+/g, "_")}_Resume.pdf`;
      element.target = "_blank";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] glass-card overflow-hidden border border-purple-500/30 shadow-2xl flex flex-col"
        >
          {/* Top Bar Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{data.personal.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-mono">
                    Official Resume
                  </span>
                </h3>
                <p className="text-xs text-slate-400">System Uploaded Resume Document</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasUploadedResume && (
                <button
                  onClick={handleDownloadFile}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 hover:scale-105 text-white text-xs font-bold flex items-center gap-2 shadow-neon-cyan transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Uploaded Resume</span>
                </button>
              )}
              <button
                onClick={() => {
                  audioFx.playClick();
                  onClose();
                }}
                className="p-2 rounded-xl glass-card text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Resume Viewer Body */}
          <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-200 text-sm font-sans flex-1">
            {hasUploadedResume ? (
              <div className="w-full flex flex-col space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-white font-bold">Uploaded Resume Document Active</div>
                      <div className="text-slate-400">File: {data.personal.resumeFileName || "Uploaded_Resume.pdf"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={data.personal.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-emerald-400 text-slate-200 flex items-center gap-1.5 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Open Full Screen</span>
                    </a>
                    <button
                      onClick={handleDownloadFile}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>

                <div className="w-full bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-[65vh]">
                  <iframe
                    src={data.personal.resumeUrl}
                    className="w-full h-full border-0"
                    title="Uploaded Resume File Preview"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 min-h-[50vh]">
                <div className="w-16 h-16 rounded-2xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-neon-purple">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">No Custom Resume Uploaded Yet</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Upload your official PDF resume from the Admin Panel so visitors can view and download it directly.
                  </p>
                </div>
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 text-white font-bold text-xs shadow-neon-purple hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Go to Admin Panel to Upload Resume</span>
                </Link>
              </div>
            )}
          </div>

          {/* Footer controls */}
          <div className="p-4 border-t border-white/10 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>{data.personal.name} • Resume Viewer</span>
            {hasUploadedResume && (
              <button
                onClick={handleDownloadFile}
                className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Download Resume File</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
