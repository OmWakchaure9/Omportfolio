import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "portfolioData.json");

let memoryCache: any = null;

function safeMerge(incoming: any) {
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
}

function readPortfolioData() {
  if (memoryCache) {
    return safeMerge(memoryCache);
  }

  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      memoryCache = safeMerge(JSON.parse(fileContent));
      return memoryCache;
    }
  } catch (error) {
    console.error("Error reading portfolioData.json:", error);
  }

  return PORTFOLIO_DATA;
}

function writePortfolioData(data: any) {
  const merged = safeMerge(data);
  memoryCache = merged;

  try {
    const dirPath = path.join(process.cwd(), "data");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(merged, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing portfolioData.json:", error);
  }

  return true;
}

export async function GET() {
  try {
    const data = readPortfolioData();
    return NextResponse.json({ success: true, data }, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch {
    return NextResponse.json({ success: true, data: PORTFOLIO_DATA });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid portfolio data payload" },
        { status: 400 }
      );
    }

    const saved = writePortfolioData(body);
    return NextResponse.json({
      success: saved,
      message: "Portfolio data saved in server memory!",
      data: memoryCache || PORTFOLIO_DATA,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save portfolio data" },
      { status: 500 }
    );
  }
}
