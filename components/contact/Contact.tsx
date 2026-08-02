"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin, Linkedin, Github, Instagram, MessageSquare, CheckCircle2, AlertCircle } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { audioFx } from "@/components/ui/AudioFx";

export default function Contact() {
  const { data } = usePortfolio();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    audioFx.playClick();

    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();

      if (resData.success) {
        audioFx.playSuccess();
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(resData.error || "Failed to send message. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error while sending message. Please try again.");
    }
  };

  return (
    <section id="contact" className="py-24 relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-purple-500/30 text-purple-300 text-xs font-mono mb-4">
          <Send className="w-3.5 h-3.5 text-cyan-400" />
          <span>Get In Touch</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Let&apos;s Build Something <span className="gradient-text-ai">Extraordinary</span>
        </h2>
        <p className="text-slate-400 text-base">
          Have an exciting project, AI engineering opportunity, or research collaboration? Send Om a message directly!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        {/* Contact Info & Social Channels Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-7 border border-white/10 space-y-6">
            <h3 className="text-xl font-bold text-white mb-2">Direct Contact Channels</h3>

            <div className="space-y-4">
              <a
                href={`mailto:${data.personal.email}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/80 border border-white/5 hover:border-cyan-400/40 transition-all group"
              >
                <div className="p-3 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Email</span>
                  <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {data.personal.email}
                  </span>
                </div>
              </a>

              <a
                href={`tel:${data.personal.phone}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/80 border border-white/5 hover:border-cyan-400/40 transition-all group"
              >
                <div className="p-3 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Phone</span>
                  <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {data.personal.phone}
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/80 border border-white/5">
                <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Location</span>
                  <span className="text-sm font-semibold text-white">
                    {data.personal.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Buttons */}
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3">Connect on Social Platforms:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <a
                  href={data.personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl glass-card text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 flex flex-col items-center gap-1.5 transition-all text-xs"
                >
                  <Linkedin className="w-5 h-5 text-purple-400" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={data.personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl glass-card text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 flex flex-col items-center gap-1.5 transition-all text-xs"
                >
                  <Github className="w-5 h-5 text-cyan-400" />
                  <span>GitHub</span>
                </a>
                <a
                  href={data.personal.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl glass-card text-slate-300 hover:text-pink-400 hover:border-pink-400/50 flex flex-col items-center gap-1.5 transition-all text-xs"
                >
                  <Instagram className="w-5 h-5 text-pink-400" />
                  <span>Instagram</span>
                </a>
                <a
                  href={data.personal.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl glass-card text-slate-300 hover:text-emerald-400 hover:border-emerald-400/50 flex flex-col items-center gap-1.5 transition-all text-xs"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7">
          <div className="glass-card p-8 border border-white/10 relative">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Send className="w-5 h-5 text-cyan-400" />
              <span>Send Message</span>
            </h3>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center bg-slate-900/90 rounded-2xl border border-emerald-500/40 space-y-3"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-white">Message Sent Successfully!</h4>
                <p className="text-xs text-slate-300">
                  Thank you for reaching out to Om Santosh Wakchaure. I will get back to you shortly.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold mt-2"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                {status === "error" && (
                  <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Your Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Your Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. sarah@techcorp.com"
                      className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. AI Engineer Role Opportunity / Project Collaboration"
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Your Message *</label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project goals or team role..."
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 text-white font-bold text-sm shadow-neon-purple hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{status === "submitting" ? "Transmitting Message..." : "Send Message"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
