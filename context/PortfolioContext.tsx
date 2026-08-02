"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PORTFOLIO_DATA, Skill, Project, ExperienceItem, EducationItem, AchievementItem, Certificate } from "@/data/portfolioData";

export type PortfolioDataType = typeof PORTFOLIO_DATA;

interface PortfolioContextType {
  data: PortfolioDataType;
  updatePersonal: (personal: Partial<PortfolioDataType["personal"]>) => void;
  updateSkills: (skills: Skill[]) => void;
  addSkill: (skill: Skill) => void;
  deleteSkill: (skillName: string) => void;
  updateProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  updateExperience: (experience: ExperienceItem[]) => void;
  updateEducation: (education: EducationItem[]) => void;
  updateAchievements: (achievements: AchievementItem[]) => void;
  updateCertificates: (certificates: Certificate[]) => void;
  resetToDefaults: () => void;
  exportAsJSON: () => void;
  exportAsTS: () => void;
  syncDataToServer: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEY = "om_portfolio_data_v2";

export const safeMergePortfolioData = (incoming: any): PortfolioDataType => {
  if (!incoming || typeof incoming !== "object") return PORTFOLIO_DATA;
  return {
    ...PORTFOLIO_DATA,
    ...incoming,
    personal: {
      ...PORTFOLIO_DATA.personal,
      ...(incoming.personal || {}),
    },
    skills: Array.isArray(incoming.skills) ? incoming.skills : PORTFOLIO_DATA.skills,
    projects: Array.isArray(incoming.projects) ? incoming.projects : PORTFOLIO_DATA.projects,
    experience: Array.isArray(incoming.experience) ? incoming.experience : PORTFOLIO_DATA.experience,
    education: Array.isArray(incoming.education) ? incoming.education : PORTFOLIO_DATA.education,
    achievements: Array.isArray(incoming.achievements) ? incoming.achievements : PORTFOLIO_DATA.achievements,
    certificates: Array.isArray(incoming.certificates) ? incoming.certificates : PORTFOLIO_DATA.certificates,
    testimonials: Array.isArray(incoming.testimonials) ? incoming.testimonials : PORTFOLIO_DATA.testimonials,
    stats: Array.isArray(incoming.stats) ? incoming.stats : PORTFOLIO_DATA.stats,
    aboutTimeline: Array.isArray(incoming.aboutTimeline) ? incoming.aboutTimeline : PORTFOLIO_DATA.aboutTimeline,
    githubStats: incoming.githubStats || PORTFOLIO_DATA.githubStats,
  };
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioDataType>(PORTFOLIO_DATA);

  // Load saved state from server API on mount ONLY (never post on load)
  useEffect(() => {
    let isMounted = true;

    const initData = async () => {
      // 1. Quick load from localStorage for fast initial render
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && isMounted) {
          setData(safeMergePortfolioData(JSON.parse(saved)));
        }
      } catch (e) {}

      // 2. Fetch latest global server data so ALL devices get updated content
      try {
        const res = await fetch("/api/portfolio", { cache: "no-store" });
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data && isMounted) {
            const merged = safeMergePortfolioData(result.data);
            setData(merged);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch (e) {}
          }
        }
      } catch (err) {
        console.error("Failed to fetch global portfolio data from server API:", err);
      }
    };

    initData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to persist only explicit user mutations to server and localStorage
  const saveToServerAndLocal = (updatedData: PortfolioDataType) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    } catch (e) {}

    fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    }).catch((err) => {
      console.error("Failed to sync portfolio data to server API:", err);
    });
  };

  const syncDataToServer = async () => {
    saveToServerAndLocal(data);
  };

  const updatePersonal = (personal: Partial<PortfolioDataType["personal"]>) => {
    setData((prev) => {
      const next = {
        ...prev,
        personal: { ...prev.personal, ...personal }
      };
      saveToServerAndLocal(next);
      return next;
    });
  };

  const updateSkills = (skills: Skill[]) => {
    setData((prev) => {
      const next = { ...prev, skills };
      saveToServerAndLocal(next);
      return next;
    });
  };

  const addSkill = (skill: Skill) => {
    setData((prev) => {
      const next = { ...prev, skills: [skill, ...prev.skills] };
      saveToServerAndLocal(next);
      return next;
    });
  };

  const deleteSkill = (skillName: string) => {
    setData((prev) => {
      const next = { ...prev, skills: prev.skills.filter((s) => s.name !== skillName) };
      saveToServerAndLocal(next);
      return next;
    });
  };

  const updateProjects = (projects: Project[]) => {
    setData((prev) => {
      const next = { ...prev, projects };
      saveToServerAndLocal(next);
      return next;
    });
  };

  const addProject = (project: Project) => {
    setData((prev) => {
      const next = { ...prev, projects: [project, ...prev.projects] };
      saveToServerAndLocal(next);
      return next;
    });
  };

  const deleteProject = (projectId: string) => {
    setData((prev) => {
      const next = { ...prev, projects: prev.projects.filter((p) => p.id !== projectId) };
      saveToServerAndLocal(next);
      return next;
    });
  };

  const updateExperience = (experience: ExperienceItem[]) => {
    setData((prev) => {
      const next = { ...prev, experience };
      saveToServerAndLocal(next);
      return next;
    });
  };

  const updateEducation = (education: EducationItem[]) => {
    setData((prev) => {
      const next = { ...prev, education };
      saveToServerAndLocal(next);
      return next;
    });
  };

  const updateAchievements = (achievements: AchievementItem[]) => {
    setData((prev) => {
      const next = { ...prev, achievements };
      saveToServerAndLocal(next);
      return next;
    });
  };

  const updateCertificates = (certificates: Certificate[]) => {
    setData((prev) => {
      const next = { ...prev, certificates };
      saveToServerAndLocal(next);
      return next;
    });
  };

  const resetToDefaults = () => {
    setData(PORTFOLIO_DATA);
    localStorage.removeItem(STORAGE_KEY);
    fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(PORTFOLIO_DATA),
    }).catch(() => {});
  };

  const exportAsJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolioData_backup.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const exportAsTS = () => {
    const tsContent = `export const PORTFOLIO_DATA = ${JSON.stringify(data, null, 2)};\n`;
    const blob = new Blob([tsContent], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolioData.ts";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        updatePersonal,
        updateSkills,
        addSkill,
        deleteSkill,
        updateProjects,
        addProject,
        deleteProject,
        updateExperience,
        updateEducation,
        updateAchievements,
        updateCertificates,
        resetToDefaults,
        exportAsJSON,
        exportAsTS,
        syncDataToServer,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
