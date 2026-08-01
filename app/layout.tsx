import type { Metadata } from "next";
import "./globals.css";
import { PortfolioProvider } from "@/context/PortfolioContext";

export const metadata: Metadata = {
  title: "Om Santosh Wakchaure | AI & Data Science Engineer Portfolio",
  description:
    "World-class personal portfolio website of Om Santosh Wakchaure, AI & Data Science Engineering Specialist, Machine Learning Enthusiast, and Data Analyst.",
  keywords: [
    "Om Santosh Wakchaure",
    "Om Wakchaure",
    "AI Engineer",
    "Data Science Engineer",
    "Machine Learning",
    "Data Analyst",
    "AutoViz AI",
    "Deep Learning",
    "Python",
    "React",
    "Next.js"
  ],
  authors: [{ name: "Om Santosh Wakchaure" }],
  openGraph: {
    title: "Om Santosh Wakchaure | AI & Data Science Engineer",
    description:
      "World-class personal portfolio website showcasing AI & Data Science projects, Machine Learning models, and Data Analytics.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-[#030712] text-slate-100 antialiased selection:bg-purple-600 selection:text-white relative min-h-screen" suppressHydrationWarning>
        <PortfolioProvider>{children}</PortfolioProvider>
      </body>
    </html>
  );
}
