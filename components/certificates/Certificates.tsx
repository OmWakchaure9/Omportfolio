"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Download, X, Eye, ShieldCheck } from "lucide-react";
import { Certificate } from "@/data/portfolioData";
import { usePortfolio } from "@/context/PortfolioContext";
import { audioFx } from "@/components/ui/AudioFx";

export default function Certificates() {
  const { data } = usePortfolio();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const handleDownloadCert = (cert: Certificate) => {
    audioFx.playClick();
    const element = document.createElement("a");
    const file = new Blob([
      `CERTIFICATE VERIFICATION DOCUMENT\n\nTitle: ${cert.title}\nIssuer: ${cert.issuer}\nDate: ${cert.date}\nCredential ID: ${cert.credentialId}\nVerification Link: ${cert.verifyUrl}\nSkills Certified: ${cert.skills.join(", ")}`
    ], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${cert.title.replace(/\s+/g, "_")}_Certificate.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <section id="certificates" className="py-24 relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Certificate Modal Preview */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-2xl glass-card overflow-hidden border border-purple-500/30 shadow-2xl flex flex-col"
            >
              {/* Header Image */}
              <div className="relative h-60 overflow-hidden">
                <img
                  src={selectedCert.image}
                  alt={selectedCert.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

                <button
                  onClick={() => {
                    audioFx.playClick();
                    setSelectedCert(null);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-full glass-card text-white hover:text-cyan-400"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-4 left-6 right-6">
                  <span className="text-xs font-mono text-cyan-400 px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-500/40">
                    {selectedCert.badge}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">{selectedCert.title}</h3>
                  <p className="text-xs text-purple-300 font-mono mt-0.5">{selectedCert.issuer}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 text-xs font-sans">
                <div className="flex justify-between items-center bg-slate-900/80 p-3 rounded-xl border border-white/5 font-mono">
                  <span className="text-slate-400">Credential ID:</span>
                  <span className="text-cyan-400 font-bold">{selectedCert.credentialId}</span>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-purple-400 tracking-wider mb-2">Verified Skill Competencies</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCert.skills.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-white/10 font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/10 bg-slate-950 flex items-center justify-between">
                <a
                  href={selectedCert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verify Credential Issuer</span>
                </a>

                <button
                  onClick={() => handleDownloadCert(selectedCert)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-semibold flex items-center gap-2 shadow-neon-purple"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Record</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-purple-500/30 text-purple-300 text-xs font-mono mb-4">
          <Award className="w-3.5 h-3.5 text-cyan-400" />
          <span>Professional Certifications</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Verified <span className="gradient-text-ai">Certificates & Credentials</span>
        </h2>
        <p className="text-slate-400 text-base">
          Certified credentials across Data Analytics internship, Machine Learning specialization, Python for Data Science, and SQL database engineering.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.certificates.map((cert, idx) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="glass-card overflow-hidden border border-white/10 hover:border-purple-500/40 transition-all hover:scale-[1.02] flex flex-col group"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={cert.image}
                alt={cert.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <span className="absolute top-3 left-3 text-[10px] font-mono text-cyan-300 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-cyan-500/30">
                {cert.badge}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {cert.title}
                </h3>
                <p className="text-xs font-mono text-purple-400 mt-1">{cert.issuer}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => {
                    audioFx.playClick();
                    setSelectedCert(cert);
                  }}
                  className="text-xs text-cyan-400 hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => handleDownloadCert(cert)}
                  className="p-2 rounded-lg glass-card text-slate-300 hover:text-purple-400 transition-colors"
                  title="Download Certificate"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
