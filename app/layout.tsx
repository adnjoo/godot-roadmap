import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RoadmapProvider } from "@/lib/store/RoadmapContext";
import { ProjectProgressProvider } from "@/lib/store/ProjectProgressContext";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Godot Game Developer Roadmap (2026) - Unofficial",
  description:
    "An unofficial, community-made learning roadmap for Godot game development. Track your progress and build projects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <RoadmapProvider>
            <ProjectProgressProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </ProjectProgressProvider>
          </RoadmapProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
