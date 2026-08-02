import { NextResponse } from "next/server";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

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

async function readFromUpstash() {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const res = await fetch(`${UPSTASH_URL}/get/portfolio_data_v1`, {
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
      },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.result) {
        const parsed = typeof data.result === "string" ? JSON.parse(data.result) : data.result;
        return safeMerge(parsed);
      }
    }
  } catch (err) {
    console.error("Upstash GET portfolio error:", err);
  }
  return null;
}

async function writeToUpstash(data: any) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return false;
  try {
    const jsonStr = JSON.stringify(data);
    const res = await fetch(`${UPSTASH_URL}/set/portfolio_data_v1`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "text/plain",
      },
      body: jsonStr,
    });
    return res.ok;
  } catch (err) {
    console.error("Upstash SET portfolio error:", err);
    return false;
  }
}

export async function GET() {
  try {
    // 1. Try Upstash Redis cloud database
    const cloudData = await readFromUpstash();
    if (cloudData) {
      memoryCache = cloudData;
      return NextResponse.json({ success: true, data: cloudData }, {
        headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" },
      });
    }

    // 2. Fallback to memory cache or PORTFOLIO_DATA
    const fallback = memoryCache ? safeMerge(memoryCache) : PORTFOLIO_DATA;
    return NextResponse.json({ success: true, data: fallback }, {
      headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" },
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

    const merged = safeMerge(body);
    memoryCache = merged;

    // Save to Upstash Redis database
    await writeToUpstash(merged);

    return NextResponse.json({
      success: true,
      message: "Portfolio data saved in Upstash Redis database!",
      data: merged,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save portfolio data" },
      { status: 500 }
    );
  }
}
