"use client";

import { useState } from "react";
import { ProgressHeader } from "@/components/roadmap/ProgressHeader";
import { FilterBar } from "@/components/roadmap/FilterBar";
import { SidebarSectionNav } from "@/components/roadmap/SidebarSectionNav";
import { RoadmapView } from "@/components/roadmap/RoadmapView";

export default function RoadmapPage() {
  const [activeSection, setActiveSection] = useState<string | undefined>();

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <aside className="lg:col-span-4 space-y-4 order-1">
          <div className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
            <SidebarSectionNav
              activeSection={activeSection}
              onSectionClick={scrollToSection}
            />
            <div className="mt-6">
              <FilterBar />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-8 order-2">
          <ProgressHeader />
          <RoadmapView />
        </main>
      </div>
    </div>
  );
}
