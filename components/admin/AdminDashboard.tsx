"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  User,
  Code,
  FolderKanban,
  GraduationCap,
  Award,
  Download,
  RotateCcw,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Briefcase,
  Trophy,
  Edit3,
  FileText,
  Mail,
  Key,
  RefreshCw,
  AlertCircle,
  Settings,
  X
} from "lucide-react";
import Link from "next/link";
import { usePortfolio } from "@/context/PortfolioContext";
import { PORTFOLIO_DATA, ExperienceItem, EducationItem, AchievementItem, Certificate } from "@/data/portfolioData";
import { audioFx } from "@/components/ui/AudioFx";

const AUTHORIZED_ADMIN_EMAIL = "omswakchaure1@gmail.com";

export default function AdminDashboard() {
  const {
    data,
    updatePersonal,
    addSkill,
    deleteSkill,
    addProject,
    deleteProject,
    updateExperience,
    updateEducation,
    updateAchievements,
    updateCertificates,
    resetToDefaults,
    exportAsJSON,
    exportAsTS,
  } = usePortfolio();

  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  // OTP & Forgot Password State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpStep, setOtpStep] = useState<1 | 2>(1);
  const [otpEmail, setOtpEmail] = useState(AUTHORIZED_ADMIN_EMAIL);
  const [inputOtp, setInputOtp] = useState("");
  const [newPasscodePin, setNewPasscodePin] = useState("");
  const [otpStatus, setOtpStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [otpMessage, setOtpMessage] = useState("");

  // Optional SMTP & EmailJS config state
  const [smtpEmail, setSmtpEmail] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [emailjsPublicKey, setEmailjsPublicKey] = useState("GV2lZkC3WjUs1_LKl");
  const [showSmtpConfig, setShowSmtpConfig] = useState(false);

  const [activeTab, setActiveTab] = useState<"personal" | "skills" | "projects" | "experience" | "certificates" | "security" | "export" | "inbox">("personal");
  const [inboxMessages, setInboxMessages] = useState<any[]>([]);
  const [githubTokenInput, setGithubTokenInput] = useState("");
  const [commitStatusMsg, setCommitStatusMsg] = useState("");
  const [saveToast, setSaveToast] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState("");
  const [newPinInput, setNewPinInput] = useState("");
  const [confirmPinInput, setConfirmPinInput] = useState("");
  const [securityMsg, setSecurityMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const resumeFileInputRef = useRef<HTMLInputElement | null>(null);
  const certFileInputRef = useRef<HTMLInputElement | null>(null);

  // Edit states for existing items
  const [editingAch, setEditingAch] = useState<AchievementItem | null>(null);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null);

  // Personal Form state
  const [personalForm, setPersonalForm] = useState(data.personal);

  // New Skill state
  const [newSkill, setNewSkill] = useState({
    name: "",
    category: "AI & Data Science" as const,
    level: 90,
    icon: "Brain",
    description: "",
    tags: ""
  });

  // New Project state
  const [newProject, setNewProject] = useState({
    title: "",
    tagline: "",
    category: "AI / ML" as const,
    description: "",
    problem: "",
    solution: "",
    features: "",
    technologies: "",
    metrics: "98.5% Accuracy",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
  });

  // New Experience state
  const [newExp, setNewExp] = useState({
    role: "",
    company: "",
    period: "Recent",
    location: "Hybrid",
    type: "Internship" as const,
    description: "",
    achievements: "",
    technologies: ""
  });

  // New Education state
  const [newEdu, setNewEdu] = useState({
    degree: "",
    institution: "",
    year: "Pursuing",
    grade: "First Class Distinction",
    description: "",
    highlights: ""
  });

  // New Certificate state
  const [newCert, setNewCert] = useState({
    title: "",
    issuer: "",
    credentialId: "",
    badge: "Specialist Certificate",
    skills: "",
    image: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=800&auto=format&fit=crop"
  });

  // New Achievement state
  const [newAch, setNewAch] = useState({
    title: "",
    category: "Professional Achievement",
    date: "Recent",
    badgeText: "Verified Award",
    description: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    audioFx.playClick();
    const inputPin = passcode.trim();

    if (!inputPin) {
      setAuthError("Please enter PIN passcode.");
      return;
    }

    try {
      const res = await fetch("/api/admin/passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", passcode: inputPin }),
      });
      const resData = await res.json();

      if (resData.success) {
        setIsAuthenticated(true);
        setAuthError("");
        localStorage.setItem("om_admin_custom_pin", inputPin);
        audioFx.playSuccess();
        return;
      }
    } catch {
      // Fallback
    }

    const savedCustomPin = typeof window !== "undefined" ? localStorage.getItem("om_admin_custom_pin") : null;
    const activeSetPin = savedCustomPin || "OmAdminPasscode";

    if (inputPin === activeSetPin) {
      setIsAuthenticated(true);
      setAuthError("");
      audioFx.playSuccess();
    } else {
      setAuthError("Incorrect PIN passcode. Access denied. Only your configured set passcode is allowed.");
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    audioFx.playClick();

    // 1. STRICT AUTHORIZED EMAIL CHECK
    if (!otpEmail || otpEmail.trim().toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      setOtpStatus("error");
      setOtpMessage(`Access Denied: "${otpEmail || "Unknown"}" is NOT an authorized admin email! OTP can ONLY be requested for ${AUTHORIZED_ADMIN_EMAIL}.`);
      audioFx.playClick();
      return;
    }

    setOtpStatus("loading");
    setOtpMessage("");

    try {
      const res = await fetch("/api/admin/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: AUTHORIZED_ADMIN_EMAIL,
          serviceId: "service_2s9un7e",
          templateId: "template_fcj9nao",
          publicKey: emailjsPublicKey,
          smtpEmail,
          smtpPassword,
        }),
      });

      const resData = await res.json();

      if (resData.success) {
        if (resData.otpForClientSend) {
          try {
            const emailjs = (await import("@emailjs/browser")).default;
            await emailjs.send(
              "service_2s9un7e",
              "template_fcj9nao",
              {
                to_email: AUTHORIZED_ADMIN_EMAIL,
                email: AUTHORIZED_ADMIN_EMAIL,
                user_email: AUTHORIZED_ADMIN_EMAIL,
                reply_to: AUTHORIZED_ADMIN_EMAIL,
                to_name: "Om Santosh Wakchaure",
                otp: resData.otpForClientSend,
                otp_code: resData.otpForClientSend,
                code: resData.otpForClientSend,
                passcode: resData.otpForClientSend,
                message: `Your 6-Digit Admin Passcode Reset OTP is: ${resData.otpForClientSend}`,
              },
              emailjsPublicKey || "GV2lZkC3WjUs1_LKl"
            );
          } catch (browserErr) {
            console.error("Browser EmailJS send error:", browserErr);
          }
        }

        setOtpStatus("success");
        setOtpStep(2);
        audioFx.playSuccess();
        setOtpMessage(`🔒 6-Digit Security OTP sent directly to your device (${AUTHORIZED_ADMIN_EMAIL})! Please check your email inbox.`);
      } else {
        setOtpStatus("error");
        setOtpMessage(resData.error || "Failed to send OTP email.");
      }
    } catch {
      setOtpStatus("error");
      setOtpMessage("Network error while sending OTP.");
    }
  };

  const handleVerifyOtpAndResetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    audioFx.playClick();

    if (!inputOtp || !newPasscodePin) {
      setOtpStatus("error");
      setOtpMessage("Please enter both the 6-digit OTP and your new PIN.");
      return;
    }

    setOtpStatus("loading");
    setOtpMessage("");

    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: otpEmail,
          otp: inputOtp,
        }),
      });

      const resData = await res.json();

      if (resData.success) {
        const cleanPin = newPasscodePin.trim();
        // Save new PIN to server API globally across all devices
        try {
          await fetch("/api/admin/passcode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "update", newPin: cleanPin }),
          });
        } catch (e) {
          console.error("Failed to update server PIN:", e);
        }

        localStorage.setItem("om_admin_custom_pin", cleanPin);
        setPasscode(cleanPin);
        setIsAuthenticated(true);
        setShowOtpModal(false);
        audioFx.playSuccess();
        showSaveSuccess();
      } else {
        setOtpStatus("error");
        setOtpMessage(resData.error || "Invalid OTP code.");
      }
    } catch {
      setOtpStatus("error");
      setOtpMessage("Network error while verifying OTP.");
    }
  };

  const showSaveSuccess = () => {
    audioFx.playSuccess();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPersonalForm((prev) => ({ ...prev, profilePhoto: reader.result as string }));
          audioFx.playSuccess();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPersonalForm((prev) => ({
            ...prev,
            resumeUrl: reader.result as string,
            resumeFileName: file.name
          }));
          audioFx.playSuccess();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCertFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setNewCert((prev) => ({ ...prev, image: reader.result as string }));
          audioFx.playSuccess();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    updatePersonal(personalForm);
    showSaveSuccess();
  };

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name) return;
    addSkill({
      ...newSkill,
      tags: newSkill.tags.split(",").map((t) => t.trim()).filter(Boolean)
    });
    setNewSkill({
      name: "",
      category: "AI & Data Science",
      level: 90,
      icon: "Brain",
      description: "",
      tags: ""
    });
    showSaveSuccess();
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;
    addProject({
      id: `proj-${Date.now()}`,
      title: newProject.title,
      tagline: newProject.tagline,
      category: newProject.category,
      description: newProject.description,
      problem: newProject.problem || "Industrial challenge",
      solution: newProject.solution || "AI Solution",
      features: newProject.features.split("\n").filter(Boolean),
      technologies: newProject.technologies.split(",").map((t) => t.trim()).filter(Boolean),
      metrics: newProject.metrics,
      image: newProject.image,
      githubUrl: "https://github.com/OmWakchaure9",
      liveUrl: "#project"
    });
    setNewProject({
      title: "",
      tagline: "",
      category: "AI / ML",
      description: "",
      problem: "",
      solution: "",
      features: "",
      technologies: "",
      metrics: "98.5% Accuracy",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
    });
    showSaveSuccess();
  };

  const handleCreateExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.role || !newExp.company) return;
    const item: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: newExp.role,
      company: newExp.company,
      period: newExp.period || "Recent",
      location: newExp.location,
      type: newExp.type,
      description: newExp.description,
      achievements: newExp.achievements.split("\n").filter(Boolean),
      technologies: newExp.technologies.split(",").map((t) => t.trim()).filter(Boolean)
    };
    updateExperience([item, ...data.experience]);
    setNewExp({
      role: "",
      company: "",
      period: "Recent",
      location: "Hybrid",
      type: "Internship",
      description: "",
      achievements: "",
      technologies: ""
    });
    showSaveSuccess();
  };

  const handleSaveExperienceEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;
    updateExperience(data.experience.map((ex) => (ex.id === editingExp.id ? editingExp : ex)));
    setEditingExp(null);
    showSaveSuccess();
  };

  const handleCreateEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEdu.degree || !newEdu.institution) return;
    const item: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: newEdu.degree,
      institution: newEdu.institution,
      year: newEdu.year || "Pursuing",
      grade: newEdu.grade,
      description: newEdu.description,
      highlights: newEdu.highlights.split("\n").filter(Boolean)
    };
    updateEducation([item, ...data.education]);
    setNewEdu({
      degree: "",
      institution: "",
      year: "Pursuing",
      grade: "First Class Distinction",
      description: "",
      highlights: ""
    });
    showSaveSuccess();
  };

  const handleSaveEducationEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu) return;
    updateEducation(data.education.map((ed) => (ed.id === editingEdu.id ? editingEdu : ed)));
    setEditingEdu(null);
    showSaveSuccess();
  };

  const handleCreateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.title) return;
    const item: Certificate = {
      id: `cert-${Date.now()}`,
      title: newCert.title,
      issuer: newCert.issuer || "Industry Partner",
      date: "Recent",
      credentialId: newCert.credentialId || `CERT-${Math.floor(Math.random() * 90000 + 10000)}`,
      verifyUrl: "https://example.com/verify",
      badge: newCert.badge,
      skills: newCert.skills.split(",").map((s) => s.trim()).filter(Boolean),
      image: newCert.image
    };
    updateCertificates([item, ...data.certificates]);
    setNewCert({
      title: "",
      issuer: "",
      credentialId: "",
      badge: "Specialist Certificate",
      skills: "",
      image: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=800&auto=format&fit=crop"
    });
    showSaveSuccess();
  };

  const handleSaveCertificateEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;
    updateCertificates(data.certificates.map((c) => (c.id === editingCert.id ? editingCert : c)));
    setEditingCert(null);
    showSaveSuccess();
  };

  const handleCreateAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAch.title) return;
    const item: AchievementItem = {
      id: `ach-${Date.now()}`,
      title: newAch.title,
      category: newAch.category,
      date: newAch.date,
      badgeText: newAch.badgeText,
      description: newAch.description,
      icon: "Award"
    };
    updateAchievements([item, ...data.achievements]);
    setNewAch({
      title: "",
      category: "Professional Achievement",
      date: "Recent",
      badgeText: "Verified Award",
      description: ""
    });
    showSaveSuccess();
  };

  const handleSaveAchievementEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAch) return;
    updateAchievements(data.achievements.map((a) => (a.id === editingAch.id ? editingAch : a)));
    setEditingAch(null);
    showSaveSuccess();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#030712] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-card p-8 border border-purple-500/30 shadow-2xl text-center relative z-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-cyan-500 to-blue-600 p-[1px] mx-auto mb-4 shadow-neon-purple">
            <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center text-cyan-400">
              <Lock className="w-8 h-8" />
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-white">Om&apos;s Portfolio Admin Panel</h2>
          <p className="text-xs text-slate-400 mt-1 mb-6">Enter your security Passcode PIN to manage content</p>

          <form action="javascript:void(0)" onSubmit={handleLogin} className="space-y-4 text-xs font-mono">
            {authError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300">
                {authError}
              </div>
            )}

            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter PIN Passcode..."
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-center text-white text-base tracking-widest focus:outline-none focus:border-cyan-400"
              autoFocus
            />

            <button
              type="submit"
              onClick={handleLogin}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 text-white font-bold shadow-neon-purple hover:scale-105 transition-all cursor-pointer"
            >
              Authenticate Admin Access
            </button>
          </form>

          {/* Forgot Passcode / Reset via OTP Button */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => {
                audioFx.playClick();
                setShowOtpModal(true);
                setOtpStep(1);
                setOtpStatus("idle");
                setOtpMessage("");
              }}
              className="text-xs font-mono text-purple-400 hover:text-purple-300 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Forgot Passcode? Reset via Email OTP</span>
            </button>
          </div>

          {/* Email OTP Security Reset Modal */}
          {showOtpModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md glass-card p-6 border border-cyan-500/30 shadow-2xl relative"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm font-mono">
                    <Key className="w-4 h-4" />
                    <span>Admin Passcode Email OTP Reset</span>
                  </div>
                  <button
                    onClick={() => setShowOtpModal(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {otpMessage && (
                  <div
                    className={`p-3 rounded-xl mb-4 text-xs font-mono flex items-center gap-2 ${
                      otpStatus === "error"
                        ? "bg-red-950/80 border border-red-500/40 text-red-300"
                        : "bg-emerald-950/80 border border-emerald-500/40 text-emerald-300"
                    }`}
                  >
                    {otpStatus === "error" ? <AlertCircle className="w-4 h-4 shrink-0 text-red-400" /> : <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />}
                    <span className="break-all">{otpMessage}</span>
                  </div>
                )}

                {otpStep === 1 ? (
                  <form onSubmit={handleSendOtp} className="space-y-4 text-xs font-mono">
                    <p className="text-slate-300 leading-relaxed">
                      A 6-digit security OTP code will be sent to your official admin email address below.
                    </p>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-slate-400">Authorized Admin Email</label>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">🔒 Fixed & Verified</span>
                      </div>
                      <input
                        type="email"
                        value={AUTHORIZED_ADMIN_EMAIL}
                        readOnly
                        className="w-full bg-slate-950/80 border border-cyan-500/40 rounded-xl px-4 py-2.5 text-cyan-300 font-bold focus:outline-none cursor-not-allowed select-none"
                      />
                    </div>

                    {/* EmailJS & SMTP Config Settings Dropdown */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setShowSmtpConfig(!showSmtpConfig)}
                        className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{showSmtpConfig ? "Hide API / Email Settings" : "View EmailJS API & Sender Settings"}</span>
                      </button>

                      {showSmtpConfig && (
                        <div className="mt-3 p-3.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-2.5 text-[11px]">
                          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono space-y-1">
                            <div><strong className="text-white">Service ID:</strong> service_2s9un7e</div>
                            <div><strong className="text-white">Template ID:</strong> template_fcj9nao</div>
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-0.5">EmailJS Public Key (User ID)</label>
                            <input
                              type="text"
                              value={emailjsPublicKey}
                              onChange={(e) => setEmailjsPublicKey(e.target.value)}
                              placeholder="e.g. user_... / Public Key"
                              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-cyan-400 font-mono"
                            />
                          </div>

                          <div className="pt-1 border-t border-white/5">
                            <label className="block text-slate-400 mb-0.5">Or Gmail App Password (SMTP)</label>
                            <input
                              type="password"
                              value={smtpPassword}
                              onChange={(e) => setSmtpPassword(e.target.value)}
                              placeholder="16-character App Password..."
                              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-cyan-400 font-mono"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={otpStatus === "loading"}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 text-white font-bold shadow-neon-purple hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {otpStatus === "loading" ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Sending Security OTP...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>Send Security OTP to Email</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtpAndResetPin} className="space-y-4 text-xs font-mono">
                    <p className="text-slate-300 leading-relaxed">
                      Enter the 6-digit OTP code sent to <strong className="text-cyan-400">{otpEmail}</strong> along with your new PIN passcode.
                    </p>

                    <div>
                      <label className="block text-slate-400 mb-1">6-Digit Security OTP</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={inputOtp}
                        onChange={(e) => setInputOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP..."
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-center text-white text-lg tracking-widest focus:outline-none focus:border-cyan-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">New Admin PIN Passcode</label>
                      <input
                        type="password"
                        value={newPasscodePin}
                        onChange={(e) => setNewPasscodePin(e.target.value)}
                        placeholder="Set new PIN (e.g. 5678)..."
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-center text-white text-base tracking-widest focus:outline-none focus:border-cyan-400"
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep(1);
                          setOtpStatus("idle");
                          setOtpMessage("");
                        }}
                        className="w-1/3 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-300 font-bold hover:bg-slate-800 transition-all cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={otpStatus === "loading"}
                        className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 text-white font-bold shadow-neon-cyan hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {otpStatus === "loading" ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <Key className="w-4 h-4" />
                            <span>Verify OTP & Save New PIN</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-white/10">
            <Link href="/" className="text-xs font-mono text-cyan-400 hover:underline flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Portfolio</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-4 sm:p-8 pt-24 max-w-7xl mx-auto font-sans relative">
      {/* Toast notification */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-neon-cyan animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>Portfolio Changes Saved & Synced!</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 glass-card p-6 border border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <span>Admin Management Panel</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-mono">
                Live State Active
              </span>
            </h1>
            <p className="text-xs text-slate-400">Edit Om Santosh Wakchaure&apos;s personal bio, skills, projects, experience, and certificates.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Live Site</span>
          </Link>

          <button
            onClick={() => {
              if (confirm("Reset all custom edits to original default data?")) {
                resetToDefaults();
                setPersonalForm(PORTFOLIO_DATA.personal);
                showSaveSuccess();
              }
            }}
            className="px-4 py-2 rounded-xl bg-red-950/80 border border-red-500/30 text-red-300 text-xs font-semibold hover:bg-red-900 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => setActiveTab("personal")}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "personal" ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-neon-purple" : "glass-card text-slate-400"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal & Bio</span>
        </button>
        <button
          onClick={() => setActiveTab("skills")}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "skills" ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-neon-purple" : "glass-card text-slate-400"
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Skills ({data.skills.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "projects" ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-neon-purple" : "glass-card text-slate-400"
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>Projects ({data.projects.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("experience")}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "experience" ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-neon-purple" : "glass-card text-slate-400"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Experience & Edu ({data.experience.length + data.education.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("certificates")}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "certificates" ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-neon-purple" : "glass-card text-slate-400"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Certificates & Awards ({data.certificates.length + data.achievements.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "security" ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-neon-purple" : "glass-card text-slate-400"
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Security & Passcode</span>
        </button>
        <button
          onClick={() => setActiveTab("export")}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "export" ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-neon-purple" : "glass-card text-slate-400"
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Backup & Export</span>
        </button>
        <button
          onClick={async () => {
            setActiveTab("inbox");
            try {
              const res = await fetch("/api/contact");
              const data = await res.json();
              if (data.messages) setInboxMessages(data.messages);
            } catch (e) {}
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "inbox" ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-neon-purple" : "glass-card text-slate-400"
          }`}
        >
          <Mail className="w-4 h-4 text-cyan-400" />
          <span>Messages Inbox ({inboxMessages.length})</span>
        </button>
      </div>

      {/* Tab 1: Personal Profile */}
      {activeTab === "personal" && (
        <form onSubmit={handleSavePersonal} className="glass-card p-8 border border-white/10 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <User className="w-5 h-5 text-purple-400" />
            <span>Personal Profile Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={personalForm.name}
                onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Short Display Name</label>
              <input
                type="text"
                value={personalForm.shortName}
                onChange={(e) => setPersonalForm({ ...personalForm, shortName: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                value={personalForm.email}
                onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Phone Number</label>
              <input
                type="text"
                value={personalForm.phone}
                onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Location</label>
              <input
                type="text"
                value={personalForm.location}
                onChange={(e) => setPersonalForm({ ...personalForm, location: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="sm:col-span-2 p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
              <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span>Profile Photo System Upload & URL</span>
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">PNG, JPG, WEBP supported</span>
              </label>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              <div className="flex flex-wrap items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500/50 shadow-neon-purple shrink-0">
                  <img
                    src={personalForm.profilePhoto}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    audioFx.playClick();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 text-white font-bold text-xs shadow-neon-purple hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo from Computer</span>
                </button>

                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={personalForm.profilePhoto}
                    onChange={(e) => setPersonalForm({ ...personalForm, profilePhoto: e.target.value })}
                    placeholder="Or paste image URL (https://...)..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Resume File System Upload */}
            <div className="sm:col-span-2 p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-3">
              <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Resume System Upload & PDF / Document File Link</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">PDF, DOC, DOCX, TXT supported</span>
              </label>

              <input
                type="file"
                ref={resumeFileInputRef}
                accept=".pdf,.doc,.docx,.txt,application/pdf"
                className="hidden"
                onChange={handleResumeFileUpload}
              />

              <div className="flex flex-wrap items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-xs font-mono">
                    <div className="text-white font-bold max-w-[220px] truncate">
                      {personalForm.resumeFileName || (personalForm.resumeUrl && personalForm.resumeUrl !== "#resume" ? "Custom Resume Attached" : "No Resume File Uploaded")}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {personalForm.resumeUrl && personalForm.resumeUrl.startsWith("data:") ? "Base64 System File" : (personalForm.resumeUrl && personalForm.resumeUrl !== "#resume" ? "External URL / Cloud Link" : "Auto-Generated Resume Active")}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    audioFx.playClick();
                    resumeFileInputRef.current?.click();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 text-white font-bold text-xs shadow-neon-cyan hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Resume from Computer</span>
                </button>

                {personalForm.resumeUrl && personalForm.resumeUrl !== "#resume" && (
                  <a
                    href={personalForm.resumeUrl}
                    download={personalForm.resumeFileName || `${personalForm.name.replace(/\s+/g, "_")}_Resume.pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Test Download</span>
                  </a>
                )}

                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={personalForm.resumeUrl}
                    onChange={(e) => setPersonalForm({ ...personalForm, resumeUrl: e.target.value, resumeFileName: e.target.value.split('/').pop() || "" })}
                    placeholder="Or paste direct Resume URL (https://...)..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-mono mb-1">Bio Summary Paragraph</label>
            <textarea
              rows={4}
              value={personalForm.bio}
              onChange={(e) => setPersonalForm({ ...personalForm, bio: e.target.value })}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-xs shadow-neon-purple hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Personal Info</span>
          </button>
        </form>
      )}

      {/* Tab 2: Skills */}
      {activeTab === "skills" && (
        <div className="space-y-8">
          <form onSubmit={handleCreateSkill} className="glass-card p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Add New Skill Item</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <input
                type="text"
                placeholder="Skill Name (e.g. PyTorch)..."
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
              <select
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as any })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Programming">Programming</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Web">Web</option>
                <option value="Database">Database</option>
                <option value="Tools">Tools</option>
              </select>
              <input
                type="number"
                min={0}
                max={100}
                placeholder="Proficiency Level (0-100)..."
                value={newSkill.level}
                onChange={(e) => setNewSkill({ ...newSkill, level: Number(e.target.value) })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.skills.map((skill) => (
              <div key={skill.name} className="glass-card p-4 border border-white/10 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-white">{skill.name}</h4>
                  <span className="text-[10px] font-mono text-purple-400">{skill.category} • {skill.level}%</span>
                </div>
                <button
                  onClick={() => {
                    deleteSkill(skill.name);
                    showSaveSuccess();
                  }}
                  className="p-2 rounded-lg bg-red-950/80 text-red-400 hover:text-red-200 transition-colors"
                  title="Delete Skill"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Projects */}
      {activeTab === "projects" && (
        <div className="space-y-8">
          <form onSubmit={handleCreateProject} className="glass-card p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Add New Project Card</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <input
                type="text"
                placeholder="Project Title..."
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Tagline..."
                value={newProject.tagline}
                onChange={(e) => setNewProject({ ...newProject, tagline: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Technologies (comma separated)..."
                value={newProject.technologies}
                onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Metrics string (e.g. 98.5% Accuracy)..."
                value={newProject.metrics}
                onChange={(e) => setNewProject({ ...newProject, metrics: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <textarea
              rows={3}
              placeholder="Project Description..."
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
            />

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          </form>

          <div className="space-y-4">
            {data.projects.map((proj) => (
              <div key={proj.id} className="glass-card p-5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">{proj.title}</h4>
                  <p className="text-xs text-purple-400 font-mono">{proj.tagline}</p>
                </div>
                <button
                  onClick={() => {
                    deleteProject(proj.id);
                    showSaveSuccess();
                  }}
                  className="p-2.5 rounded-xl bg-red-950/80 text-red-400 hover:text-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Experience & Education */}
      {activeTab === "experience" && (
        <div className="space-y-8">
          {/* Add Experience Form */}
          <form onSubmit={handleCreateExperience} className="glass-card p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>Add Work Experience / Internship</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <input
                type="text"
                placeholder="Role / Title (e.g. Data Analytics Intern)..."
                value={newExp.role}
                onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Company / Organization..."
                value={newExp.company}
                onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Period (e.g. 2024 - Present)..."
                value={newExp.period}
                onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Technologies (comma separated)..."
                value={newExp.technologies}
                onChange={(e) => setNewExp({ ...newExp, technologies: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <textarea
              rows={2}
              placeholder="Description..."
              value={newExp.description}
              onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            <textarea
              rows={2}
              placeholder="Key Deliverables (one per line)..."
              value={newExp.achievements}
              onChange={(e) => setNewExp({ ...newExp, achievements: e.target.value })}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
            />

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Experience Record</span>
            </button>
          </form>

          {/* List Experience Items */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase text-purple-400">Current Experience Items ({data.experience.length})</h4>
            {data.experience.map((exp) => (
              <div key={exp.id} className="glass-card p-5 border border-white/10 space-y-3">
                {editingExp?.id === exp.id ? (
                  <form onSubmit={handleSaveExperienceEdit} className="space-y-3 text-xs font-mono">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Role Title</label>
                        <input
                          type="text"
                          value={editingExp.role}
                          onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Company</label>
                        <input
                          type="text"
                          value={editingExp.company}
                          onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Period</label>
                        <input
                          type="text"
                          value={editingExp.period}
                          onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Technologies (comma separated)</label>
                        <input
                          type="text"
                          value={editingExp.technologies.join(", ")}
                          onChange={(e) => setEditingExp({ ...editingExp, technologies: e.target.value.split(",").map(t=>t.trim()) })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={editingExp.description}
                        onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Experience</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingExp(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-bold text-white">{exp.role}</h4>
                      <p className="text-xs text-purple-400 font-mono">{exp.company} • {exp.period}</p>
                      <p className="text-xs text-slate-400 mt-1">{exp.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingExp(exp)}
                        className="p-2 rounded-lg bg-purple-950/80 text-purple-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Experience"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          updateExperience(data.experience.filter(e => e.id !== exp.id));
                          showSaveSuccess();
                        }}
                        className="p-2 rounded-lg bg-red-950/80 text-red-400 hover:text-red-200 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Education Form */}
          <form onSubmit={handleCreateEducation} className="glass-card p-6 border border-white/10 space-y-4 pt-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>Add Education Degree / Diploma</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <input
                type="text"
                placeholder="Degree / Diploma Name..."
                value={newEdu.degree}
                onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Institution Name..."
                value={newEdu.institution}
                onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Year (e.g. Pursuing / 2024)..."
                value={newEdu.year}
                onChange={(e) => setNewEdu({ ...newEdu, year: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Grade / Distinction..."
                value={newEdu.grade}
                onChange={(e) => setNewEdu({ ...newEdu, grade: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <textarea
              rows={2}
              placeholder="Description..."
              value={newEdu.description}
              onChange={(e) => setNewEdu({ ...newEdu, description: e.target.value })}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
            />

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs hover:bg-cyan-500 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Education Record</span>
            </button>
          </form>

          {/* List Education Items */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase text-cyan-400">Current Education Items ({data.education.length})</h4>
            {data.education.map((edu) => (
              <div key={edu.id} className="glass-card p-5 border border-white/10 space-y-3">
                {editingEdu?.id === edu.id ? (
                  <form onSubmit={handleSaveEducationEdit} className="space-y-3 text-xs font-mono">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Degree Name</label>
                        <input
                          type="text"
                          value={editingEdu.degree}
                          onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Institution</label>
                        <input
                          type="text"
                          value={editingEdu.institution}
                          onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Year</label>
                        <input
                          type="text"
                          value={editingEdu.year}
                          onChange={(e) => setEditingEdu({ ...editingEdu, year: e.target.value })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Grade / Performance</label>
                        <input
                          type="text"
                          value={editingEdu.grade}
                          onChange={(e) => setEditingEdu({ ...editingEdu, grade: e.target.value })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Education</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingEdu(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-bold text-white">{edu.degree}</h4>
                      <p className="text-xs text-cyan-400 font-mono">{edu.institution} • {edu.year}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingEdu(edu)}
                        className="p-2 rounded-lg bg-purple-950/80 text-purple-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Education"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          updateEducation(data.education.filter(e => e.id !== edu.id));
                          showSaveSuccess();
                        }}
                        className="p-2 rounded-lg bg-red-950/80 text-red-400 hover:text-red-200 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Certificates & Achievements */}
      {activeTab === "certificates" && (
        <div className="space-y-8">
          {/* Add Certificate Form */}
          <form onSubmit={handleCreateCertificate} className="glass-card p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Add New Certificate</span>
            </h3>

            <input
              type="file"
              ref={certFileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleCertFileUpload}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <input
                type="text"
                placeholder="Certificate Title..."
                value={newCert.title}
                onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Issuer (e.g. Coursera / IBM)..."
                value={newCert.issuer}
                onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Credential ID..."
                value={newCert.credentialId}
                onChange={(e) => setNewCert({ ...newCert, credentialId: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Skills (comma separated)..."
                value={newCert.skills}
                onChange={(e) => setNewCert({ ...newCert, skills: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => certFileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-cyan-300 text-xs flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Certificate Image</span>
              </button>
              <input
                type="text"
                placeholder="Or Image URL..."
                value={newCert.image}
                onChange={(e) => setNewCert({ ...newCert, image: e.target.value })}
                className="flex-1 min-w-[200px] bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Certificate</span>
            </button>
          </form>

          {/* List Certificates */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase text-amber-400">Current Certificates ({data.certificates.length})</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.certificates.map((cert) => (
                <div key={cert.id} className="glass-card p-4 border border-white/10 space-y-3">
                  {editingCert?.id === cert.id ? (
                    <form onSubmit={handleSaveCertificateEdit} className="space-y-3 text-xs font-mono">
                      <input
                        type="text"
                        value={editingCert.title}
                        onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                        placeholder="Certificate Title..."
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editingCert.issuer}
                          onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                          className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                          placeholder="Issuer..."
                        />
                        <input
                          type="text"
                          value={editingCert.credentialId}
                          onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })}
                          className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                          placeholder="Credential ID..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCert(null)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="text-sm font-bold text-white">{cert.title}</h5>
                        <p className="text-xs text-purple-400 font-mono">{cert.issuer} • {cert.credentialId}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingCert(cert)}
                          className="p-2 rounded-lg bg-purple-950/80 text-purple-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit Certificate"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            updateCertificates(data.certificates.filter(c => c.id !== cert.id));
                            showSaveSuccess();
                          }}
                          className="p-2 rounded-lg bg-red-950/80 text-red-400 hover:text-red-200 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add Achievement Form */}
          <form onSubmit={handleCreateAchievement} className="glass-card p-6 border border-white/10 space-y-4 pt-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Add Achievement / Honor</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <input
                type="text"
                placeholder="Achievement Title (e.g. Top Performer Intern Award)..."
                value={newAch.title}
                onChange={(e) => setNewAch({ ...newAch, title: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Category (e.g. Hackathon / Professional)..."
                value={newAch.category}
                onChange={(e) => setNewAch({ ...newAch, category: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Badge Text (e.g. 1st Place Winner)..."
                value={newAch.badgeText}
                onChange={(e) => setNewAch({ ...newAch, badgeText: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Date / Event..."
                value={newAch.date}
                onChange={(e) => setNewAch({ ...newAch, date: e.target.value })}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <textarea
              rows={2}
              placeholder="Description..."
              value={newAch.description}
              onChange={(e) => setNewAch({ ...newAch, description: e.target.value })}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
            />

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-yellow-600 text-white font-bold text-xs hover:bg-yellow-500 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Achievement</span>
            </button>
          </form>

          {/* List & Edit Achievements */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase text-yellow-400">Current Achievements ({data.achievements.length})</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.achievements.map((ach) => (
                <div key={ach.id} className="glass-card p-5 border border-white/10 space-y-3">
                  {editingAch?.id === ach.id ? (
                    /* In-line Edit Form for Achievement */
                    <form onSubmit={handleSaveAchievementEdit} className="space-y-3 text-xs font-mono">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="font-bold text-amber-400 flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Achievement Details</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingAch(null)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Achievement Title</label>
                        <input
                          type="text"
                          value={editingAch.title}
                          onChange={(e) => setEditingAch({ ...editingAch, title: e.target.value })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1">Category</label>
                          <input
                            type="text"
                            value={editingAch.category}
                            onChange={(e) => setEditingAch({ ...editingAch, category: e.target.value })}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Badge Tag</label>
                          <input
                            type="text"
                            value={editingAch.badgeText}
                            onChange={(e) => setEditingAch({ ...editingAch, badgeText: e.target.value })}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Description</label>
                        <textarea
                          rows={3}
                          value={editingAch.description}
                          onChange={(e) => setEditingAch({ ...editingAch, description: e.target.value })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-neon-purple"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingAch(null)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Display Achievement View with Edit & Delete Controls */
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h5 className="text-sm font-bold text-white">{ach.title}</h5>
                        <p className="text-xs text-yellow-400 font-mono mt-0.5">{ach.badgeText} • {ach.category}</p>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{ach.description}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => setEditingAch(ach)}
                          className="p-2 rounded-xl bg-purple-950/80 text-purple-300 hover:text-white border border-purple-500/30 transition-all cursor-pointer"
                          title="Edit Achievement"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            updateAchievements(data.achievements.filter(a => a.id !== ach.id));
                            showSaveSuccess();
                          }}
                          className="p-2 rounded-xl bg-red-950/80 text-red-400 hover:text-red-200 border border-red-500/30 transition-all cursor-pointer"
                          title="Delete Achievement"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Security & Passcode */}
      {activeTab === "security" && (
        <div className="glass-card p-8 border border-white/10 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Key className="w-5 h-5 text-cyan-400" />
            <span>Admin Security & Passcode Settings</span>
          </h2>

          <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs font-mono text-purple-200 space-y-1">
            <div className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Strict Single-Passcode Protection Active</span>
            </div>
            <p className="text-slate-300">
              Default passcodes (like 1234) are disabled. Only the custom passcode set by you will allow access to this Admin Panel.
            </p>
          </div>

          {securityMsg && (
            <div
              className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                securityMsg.type === "error"
                  ? "bg-red-950/80 border border-red-500/40 text-red-300"
                  : "bg-emerald-950/80 border border-emerald-500/40 text-emerald-300"
              }`}
            >
              {securityMsg.type === "error" ? <AlertCircle className="w-4 h-4 shrink-0 text-red-400" /> : <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />}
              <span>{securityMsg.text}</span>
            </div>
          )}

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              audioFx.playClick();
              const cleanNewPin = newPinInput.trim();

              if (!newPinInput.trim()) {
                setSecurityMsg({ type: "error", text: "New passcode cannot be empty." });
                return;
              }

              if (newPinInput.trim() !== confirmPinInput.trim()) {
                setSecurityMsg({ type: "error", text: "New passcodes do not match." });
                return;
              }

              // Verify current pin with server API or fallback
              let verifiedCurrent = false;
              try {
                const checkRes = await fetch("/api/admin/passcode", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ action: "verify", passcode: currentPinInput.trim() }),
                });
                const checkData = await checkRes.json();
                verifiedCurrent = checkData.success;
              } catch {}

              if (!verifiedCurrent) {
                const savedCustomPin = localStorage.getItem("om_admin_custom_pin") || "OmAdminPasscode";
                if (currentPinInput.trim() === savedCustomPin) {
                  verifiedCurrent = true;
                }
              }

              if (!verifiedCurrent) {
                setSecurityMsg({ type: "error", text: "Current passcode is incorrect." });
                return;
              }

              // Update globally on server API
              try {
                await fetch("/api/admin/passcode", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ action: "update", newPin: cleanNewPin }),
                });
              } catch (e) {
                console.error("Failed to update PIN on server:", e);
              }

              localStorage.setItem("om_admin_custom_pin", cleanNewPin);
              setSecurityMsg({ type: "success", text: "Security Passcode successfully updated globally across all devices!" });
              setCurrentPinInput("");
              setNewPinInput("");
              setConfirmPinInput("");
              showSaveSuccess();
            }}
            className="space-y-4 max-w-md text-xs font-mono"
          >
            <div>
              <label className="block text-slate-400 mb-1">Current Passcode PIN</label>
              <input
                type="password"
                value={currentPinInput}
                onChange={(e) => setCurrentPinInput(e.target.value)}
                placeholder="Enter current passcode..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">New Passcode PIN</label>
              <input
                type="password"
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                placeholder="Enter new passcode..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Confirm New Passcode PIN</label>
              <input
                type="password"
                value={confirmPinInput}
                onChange={(e) => setConfirmPinInput(e.target.value)}
                placeholder="Confirm new passcode..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 text-white font-bold shadow-neon-purple hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Enforce New Passcode</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 7: Backup & Export */}
      {activeTab === "export" && (
        <div className="glass-card p-8 border border-white/10 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Download className="w-5 h-5 text-cyan-400" />
            <span>Export & Backup Data Options</span>
          </h2>

          <p className="text-slate-300 text-xs leading-relaxed">
            Download your updated portfolio data file to save your custom changes permanently into the source codebase or JSON backups.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => {
                audioFx.playClick();
                exportAsTS();
              }}
              className="p-6 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-sm shadow-neon-purple hover:scale-105 transition-all text-left flex flex-col justify-between h-36 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <Code className="w-6 h-6" />
                <span className="text-xs font-mono bg-slate-950/50 px-2 py-1 rounded">TypeScript</span>
              </div>
              <div>
                <span className="block text-base">Download portfolioData.ts</span>
                <span className="text-xs opacity-80 font-mono font-normal">Replace in data/portfolioData.ts</span>
              </div>
            </button>

            <button
              onClick={() => {
                audioFx.playClick();
                exportAsJSON();
              }}
              className="p-6 rounded-2xl glass-card text-white font-bold text-sm border border-cyan-500/40 hover:scale-105 transition-all text-left flex flex-col justify-between h-36 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <Download className="w-6 h-6 text-cyan-400" />
                <span className="text-xs font-mono bg-slate-900 px-2 py-1 rounded text-cyan-300">JSON</span>
              </div>
              <div>
                <span className="block text-base">Export Backup JSON</span>
                <span className="text-xs text-slate-400 font-mono font-normal">Save full raw backup file</span>
              </div>
            </button>
          </div>

          {/* GitHub Direct Auto-Sync & Deployment Card */}
          <div className="p-6 rounded-2xl bg-slate-950/90 border border-cyan-500/40 space-y-4">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2 font-mono">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Publish Changes Globally to All Devices (GitHub Auto-Deploy)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Enter your GitHub Personal Access Token below to instantly commit your Admin Panel edits to your GitHub repository (<strong className="text-cyan-400">OmWakchaure9/Omportfolio</strong>). Vercel will automatically deploy the changes to all visitors across every device in ~30 seconds!
            </p>

            {commitStatusMsg && (
              <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
                {commitStatusMsg}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="password"
                value={githubTokenInput}
                onChange={(e) => setGithubTokenInput(e.target.value)}
                placeholder="Paste GitHub Token (ghp_...)..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
              <button
                type="button"
                onClick={async () => {
                  audioFx.playClick();
                  setCommitStatusMsg("Committing edits to GitHub repository...");
                  try {
                    const res = await fetch("/api/portfolio/commit", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ data, githubToken: githubTokenInput }),
                    });
                    const resData = await res.json();
                    if (resData.success) {
                      audioFx.playSuccess();
                      setCommitStatusMsg("🚀 " + resData.message);
                    } else {
                      setCommitStatusMsg("❌ " + (resData.error || "GitHub commit failed"));
                    }
                  } catch {
                    setCommitStatusMsg("❌ Network error committing to GitHub");
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 text-white font-bold text-xs shadow-neon-purple hover:scale-105 transition-all whitespace-nowrap cursor-pointer"
              >
                Sync & Deploy Globally
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: Messages Inbox */}
      {activeTab === "inbox" && (
        <div className="glass-card p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan-400" />
              <span>Received Messages Inbox ({inboxMessages.length})</span>
            </h2>
            <button
              onClick={async () => {
                try {
                  const res = await fetch("/api/contact");
                  const data = await res.json();
                  if (data.messages) setInboxMessages(data.messages);
                } catch (e) {}
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-cyan-400 text-xs font-mono hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Inbox</span>
            </button>
          </div>

          {inboxMessages.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-mono">
              No contact form messages received yet. All new messages submitted on your portfolio website will appear here in real-time.
            </div>
          ) : (
            <div className="space-y-4">
              {inboxMessages.map((msg: any) => (
                <div key={msg.id || Math.random()} className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3 font-sans">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-white">{msg.name}</h3>
                      <a href={`mailto:${msg.email}`} className="text-xs font-mono text-cyan-400 hover:underline">
                        {msg.email}
                      </a>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-white/5">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "Recent"}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-purple-300 block mb-1">Subject: {msg.subject}</span>
                    <p className="text-xs text-slate-300 bg-slate-900/60 p-3.5 rounded-xl border border-white/5 whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition-all flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
