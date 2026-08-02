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
    skills: Array.isArray(incoming.skills) && incoming.skills.length > 0 ? incoming.skills : PORTFOLIO_DATA.skills,
    projects: Array.isArray(incoming.projects) && incoming.projects.length > 0 ? incoming.projects : PORTFOLIO_DATA.projects,
    experience: Array.isArray(incoming.experience) && incoming.experience.length > 0 ? incoming.experience : PORTFOLIO_DATA.experience,
    education: Array.isArray(incoming.education) && incoming.education.length > 0 ? incoming.education : PORTFOLIO_DATA.education,
    achievements: Array.isArray(incoming.achievements) && incoming.achievements.length > 0 ? incoming.achievements : PORTFOLIO_DATA.achievements,
    certificates: Array.isArray(incoming.certificates) && incoming.certificates.length > 0 ? incoming.certificates : PORTFOLIO_DATA.certificates,
    testimonials: Array.isArray(incoming.testimonials) && incoming.testimonials.length > 0 ? incoming.testimonials : PORTFOLIO_DATA.testimonials,
    stats: Array.isArray(incoming.stats) && incoming.stats.length > 0 ? incoming.stats : PORTFOLIO_DATA.stats,
    aboutTimeline: Array.isArray(incoming.aboutTimeline) && incoming.aboutTimeline.length > 0 ? incoming.aboutTimeline : PORTFOLIO_DATA.aboutTimeline,
    githubStats: incoming.githubStats || PORTFOLIO_DATA.githubStats,
  };
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioDataType>(PORTFOLIO_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state from server API first (falls back to localStorage / default data)
  useEffect(() => {
    let isMounted = true;

    const initData = async () => {
      // 1. Quick load from localStorage for fast initial render
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && isMounted) {
          setData(safeMergePortfolioData(JSON.parse(saved)));
        }
      } catch (e) {
        // Fallback
      }

      // 2. Fetch latest global server data so ALL devices get updated content
      try {
        const res = await fetch("/api/portfolio", { cache: "no-store" });
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data && isMounted) {
            const merged = safeMergePortfolioData(result.data);
            setData(merged);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          }
        }
      } catch (err) {
        console.error("Failed to fetch global portfolio data from server API:", err);
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    };

    initData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save changes to localStorage AND server API whenever data mutates after initial load
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        // Quota error
      }

      // Sync data to backend server API so all devices receive the updated data
      fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch((err) => {
        console.error("Failed to sync portfolio data to server API:", err);
      });
    }
  }, [data, isLoaded]);

  const syncDataToServer = async () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.error("Error manual sync to server:", e);
    }
  };

  const updatePersonal = (personal: Partial<PortfolioDataType["personal"]>) => {
    setData((prev) => ({
      ...prev,
      personal: { ...prev.personal, ...personal }
    }));
  };

  const updateSkills = (skills: Skill[]) => {
    setData((prev) => ({ ...prev, skills }));
  };

  const addSkill = (skill: Skill) => {
    setData((prev) => ({
      ...prev,
      skills: [skill, ...prev.skills]
    }));
  };

  const deleteSkill = (skillName: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.name !== skillName)
    }));
  };

  const updateProjects = (projects: Project[]) => {
    setData((prev) => ({ ...prev, projects }));
  };

  const addProject = (project: Project) => {
    setData((prev) => ({
      ...prev,
      projects: [project, ...prev.projects]
    }));
  };

  const deleteProject = (projectId: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== projectId)
    }));
  };

  const updateExperience = (experience: ExperienceItem[]) => {
    setData((prev) => ({ ...prev, experience }));
  };

  const updateEducation = (education: EducationItem[]) => {
    setData((prev) => ({ ...prev, education }));
  };

  const updateAchievements = (achievements: AchievementItem[]) => {
    setData((prev) => ({ ...prev, achievements }));
  };

  const updateCertificates = (certificates: Certificate[]) => {
    setData((prev) => ({ ...prev, certificates }));
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
