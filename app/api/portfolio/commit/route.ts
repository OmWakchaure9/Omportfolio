import { NextResponse } from "next/server";

const REPO_OWNER = "OmWakchaure9";
const REPO_NAME = "Omportfolio";
const FILE_PATH = "data/portfolioData.json";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data, githubToken } = body;

    const token = githubToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

    if (!token) {
      return NextResponse.json({
        success: false,
        error: "GitHub Access Token not configured. Please provide GitHub Personal Access Token to commit directly to GitHub repository.",
      }, { status: 400 });
    }

    const contentStr = JSON.stringify(data, null, 2);
    const contentBase64 = Buffer.from(contentStr).toString("base64");

    // 1. Get current file sha from GitHub
    const getFileRes = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Om-Portfolio-App",
        },
      }
    );

    let sha: string | undefined = undefined;
    if (getFileRes.ok) {
      const fileData = await getFileRes.json();
      sha = fileData.sha;
    }

    // 2. Commit updated data file to GitHub
    const putRes = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "Om-Portfolio-App",
        },
        body: JSON.stringify({
          message: "Admin Panel Live Data Update",
          content: contentBase64,
          sha: sha,
          branch: "main",
        }),
      }
    );

    if (!putRes.ok) {
      const errText = await putRes.text();
      return NextResponse.json(
        { success: false, error: `GitHub API error: ${errText}` },
        { status: putRes.status }
      );
    }

    const commitData = await putRes.json();
    return NextResponse.json({
      success: true,
      message: "Changes committed directly to GitHub repository! Vercel is now deploying the updates globally to all devices in ~30 seconds.",
      commitUrl: commitData.commit?.html_url,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to commit changes to GitHub" },
      { status: 500 }
    );
  }
}
