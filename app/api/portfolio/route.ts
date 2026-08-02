import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "portfolioData.json");
const CLOUD_PORTFOLIO_BLOB_URL = "https://jsonblob.com/api/jsonBlob/019fc192-ec7e-7f39-b6f2-1166fc51e047";

let memoryCache: any = null;

async function readPortfolioData() {
  // 1. Fetch from Cloud Persistent Blob for cross-device sync on serverless (Vercel/Netlify)
  try {
    const cloudRes = await fetch(CLOUD_PORTFOLIO_BLOB_URL, { cache: "no-store" });
    if (cloudRes.ok) {
      const cloudData = await cloudRes.json();
      if (cloudData && cloudData.personal) {
        memoryCache = cloudData;
        return cloudData;
      }
    }
  } catch (err) {
    console.error("Cloud portfolio fetch error:", err);
  }

  // 2. Fallback to memory cache
  if (memoryCache) {
    return memoryCache;
  }

  // 3. Fallback to local file
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      memoryCache = JSON.parse(fileContent);
      return memoryCache;
    }
  } catch (error) {}

  return PORTFOLIO_DATA;
}

async function writePortfolioData(data: any) {
  memoryCache = data;

  // 1. Save to Cloud Persistent Blob
  try {
    await fetch(CLOUD_PORTFOLIO_BLOB_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {}

  return true;
}

export async function GET() {
  const data = await readPortfolioData();
  return NextResponse.json({ success: true, data }, {
    headers: {
      "Cache-Control": "no-store, max-age=0, must-revalidate",
    },
  });
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
      data: memoryCache,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save portfolio data" },
      { status: 500 }
    );
  }
}
