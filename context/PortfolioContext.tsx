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
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEY = "om_portfolio_data_v2";

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioDataType>(PORTFOLIO_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData(parsed);
      }
    } catch {
      // Fallback to default PORTFOLIO_DATA
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage whenever data mutates
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        // Handle quota or storage disabled
      }
    }
  }, [data, isLoaded]);

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
