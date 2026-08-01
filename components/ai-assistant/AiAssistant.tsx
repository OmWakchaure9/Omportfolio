"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User, ArrowRight, CornerDownLeft, RefreshCw } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { audioFx } from "@/components/ui/AudioFx";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: `Hello! I am Om Wakchaure's AI Assistant. Ask me anything about Om's Machine Learning expertise, Data Science projects, skills, or contact info!`,
      timestamp: "Just now"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (userQuery?: string) => {
    const query = userQuery || input.trim();
    if (!query) return;

    audioFx.playClick();

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userQuery) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = "";
      const q = query.toLowerCase();

      if (q.includes("skill") || q.includes("tech") || q.includes("python")) {
        aiReply = `Om is proficient in Programming (Python, Java, C, SQL), AI & Data Science (Machine Learning, Deep Learning, Pandas, NumPy, Scikit-learn, Statistics), Web (HTML, CSS, JavaScript, React, Streamlit), Database (MySQL), and Data Tools (Power BI, Tableau, Git, Jupyter).`;
      } else if (q.includes("project") || q.includes("autoviz") || q.includes("plant") || q.includes("work")) {
        aiReply = `Om's flagship projects include:\n1. AI Data Visualization Assistant (AutoViz AI)\n2. Plant Disease Detection using Deep Learning CNNs\n3. Smart Analytics Dashboard for revenue insights\n4. Enterprise Context-Aware AI Chatbot (RAG)\n5. AutoML Business Insight Generator`;
      } else if (q.includes("education") || q.includes("diploma") || q.includes("degree") || q.includes("be")) {
        aiReply = `Om is pursuing his BE in Artificial Intelligence & Data Science with First Class Distinction. He also holds a Diploma in Computer Engineering with First Class Distinction.`;
      } else if (q.includes("internship") || q.includes("experience") || q.includes("performer")) {
        aiReply = `Om completed a Data Analytics Internship where he processed 100,000+ data records and was awarded the 'Top Performer Intern Award' for his high-accuracy SQL & Power BI analytics.`;
      } else if (q.includes("contact") || q.includes("hire") || q.includes("email") || q.includes("phone")) {
        aiReply = `You can reach Om directly via Email at omwakchaure.ai@gmail.com or connect with him on LinkedIn & GitHub. He is actively seeking top AI & Data Science engineering roles!`;
      } else if (q.includes("resume") || q.includes("cv")) {
        aiReply = `You can preview and download Om's official resume by clicking the 'Download Resume' button in the Hero section or navigation bar!`;
      } else {
        aiReply = `Om Santosh Wakchaure is an exceptional AI & Data Science Engineer specializing in Neural Pipelines, Generative AI, Automated Data Analytics, and Fullstack Machine Learning applications. Feel free to explore his project demos on this portfolio!`;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  const quickPrompts = [
    "What are Om's top skills?",
    "Tell me about AutoViz AI project",
    "How to contact Om for hiring?"
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => {
          audioFx.playClick();
          setIsOpen(!isOpen);
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 text-white shadow-neon-purple border border-white/20 flex items-center gap-2 group cursor-pointer"
        title="Chat with Om's AI Assistant"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
        <span className="text-xs font-bold font-mono hidden sm:inline-block pr-1">AI Portfolio Bot</span>
      </motion.button>

      {/* Chat Window Drawer / Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] h-[520px] glass-card border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Top Bar */}
            <div className="p-4 bg-slate-950/90 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-[1px]">
                  <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Om&apos;s AI Assistant</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </h4>
                  <p className="text-[10px] text-cyan-400 font-mono">Gemini AI Model Context</p>
                </div>
              </div>

              <button
                onClick={() => {
                  audioFx.playClick();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs font-sans">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.sender === "ai" && (
                    <div className="w-6 h-6 rounded-full bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                      m.sender === "user"
                        ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-br-none"
                        : "bg-slate-900/90 border border-white/10 text-slate-200 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                    <span className="text-[9px] text-slate-400 block mt-1 text-right font-mono">
                      {m.timestamp}
                    </span>
                  </div>

                  {m.sender === "user" && (
                    <div className="w-6 h-6 rounded-full bg-cyan-600/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs font-mono pl-8">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>AI Assistant thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-2 bg-slate-950/60 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qp)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-[10px] text-cyan-300 whitespace-nowrap hover:border-cyan-400/50 hover:bg-slate-800 transition-all"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-slate-950 border-t border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Om's experience..."
                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:scale-105 transition-all shadow-neon-purple"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
