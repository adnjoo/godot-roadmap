import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RoadmapProvider } from "@/lib/store/RoadmapContext";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Godot Game Developer Roadmap (2026)",
  description: "A comprehensive roadmap for learning Godot game development",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RoadmapProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </RoadmapProvider>
      </body>
    </html>
  );
}
