import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "portfolioData.json");
const CLOUD_PORTFOLIO_BLOB_URL = "https://jsonblob.com/api/jsonBlob/019fc192-ec7e-7f39-b6f2-1166fc51e047";

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
}

async function readPortfolioData() {
  // 1. Try Cloud Persistent Store
  try {
    const cloudRes = await fetch(CLOUD_PORTFOLIO_BLOB_URL, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (cloudRes.ok) {
      const cloudData = await cloudRes.json();
      if (cloudData && cloudData.personal) {
        memoryCache = safeMerge(cloudData);
        return memoryCache;
      }
    }
  } catch (err) {
    console.error("Cloud portfolio fetch error:", err);
  }

  // 2. Fallback to memory cache
  if (memoryCache) {
    return safeMerge(memoryCache);
  }

  // 3. Fallback to local file
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      memoryCache = safeMerge(JSON.parse(fileContent));
      return memoryCache;
    }
  } catch (error) {}

  return PORTFOLIO_DATA;
}

async function writePortfolioData(data: any) {
  const merged = safeMerge(data);
  memoryCache = merged;

  // 1. Save to Cloud Persistent Blob
  try {
    await fetch(CLOUD_PORTFOLIO_BLOB_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(merged),
    });
  } catch (err) {
    console.error("Cloud portfolio update error:", err);
  }

  // 2. Save to local disk file
  try {
    const dirPath = path.join(process.cwd(), "data");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(merged, null, 2), "utf-8");
  } catch (error) {}

  return true;
}

export async function GET() {
  try {
    const data = await readPortfolioData();
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

    const saved = await writePortfolioData(body);
    return NextResponse.json({
      success: saved,
      message: "Portfolio data saved globally on cloud server!",
      data: memoryCache || PORTFOLIO_DATA,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save portfolio data" },
      { status: 500 }
    );
  }
}
