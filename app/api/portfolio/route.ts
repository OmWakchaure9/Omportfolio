import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "portfolioData.json");

// In-memory cache for fast server response
let memoryCache: any = null;

function readPortfolioData() {
  if (memoryCache) {
    return memoryCache;
  }
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      memoryCache = JSON.parse(fileContent);
      return memoryCache;
    }
  } catch (error) {
    console.error("Error reading portfolioData.json:", error);
  }
  return PORTFOLIO_DATA;
}

function writePortfolioData(data: any) {
  memoryCache = data;
  try {
    const dirPath = path.join(process.cwd(), "data");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing portfolioData.json:", error);
    return false;
  }
}

export async function GET() {
  const data = readPortfolioData();
  return NextResponse.json({ success: true, data }, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
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

    const saved = writePortfolioData(body);
    return NextResponse.json({
      success: saved,
      message: saved ? "Portfolio data saved globally on server!" : "Saved in server memory cache",
      data: memoryCache,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save portfolio data" },
      { status: 500 }
    );
  }
}
