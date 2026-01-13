"use client";

import { Suspense, useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useRoadmap } from "@/lib/store/RoadmapContext";
import { StickyProgressBar } from "@/components/roadmap/StickyProgressBar";
import { FiltersBar } from "@/components/roadmap/FiltersBar";
import { SectionNav } from "@/components/roadmap/SectionNav";
import { NextUpPanel } from "@/components/roadmap/NextUpPanel";
import { RoadmapView } from "@/components/roadmap/RoadmapView";
import roadmapDataRaw from "@/data/roadmap.godot-2026.json";
import { getNextRecommendation } from "@/lib/utils/recommendations";
import type { RoadmapData, RoadmapItem } from "@/types/roadmap";
import type { Difficulty, Category } from "@/lib/store/RoadmapContext";

const roadmapData = roadmapDataRaw as RoadmapData;

// Component that handles URL sync logic (needs Suspense)
function RoadmapPageContent() {
  const { completedItems, filters, updateFilters } = useRoadmap();
  const [activeSection, setActiveSection] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Sync URL params to filters on mount
  useEffect(() => {
    const urlDifficulty = searchParams.get("difficulty");
    const urlCategory = searchParams.get("category");
    const urlSearch = searchParams.get("search");
    const urlShowOnlyRemaining = searchParams.get("showOnlyRemaining");

    const updates: Partial<typeof filters> = {};

    if (urlDifficulty && ["All", "Beginner", "Intermediate", "Advanced"].includes(urlDifficulty)) {
      updates.difficulty = urlDifficulty as Difficulty | "All";
    }
    if (urlCategory && ["All", "2D", "3D", "UI", "Systems", "Tools"].includes(urlCategory)) {
      updates.category = urlCategory as Category | "All";
    }
    if (urlSearch !== null) {
      updates.search = urlSearch;
    }
    if (urlShowOnlyRemaining !== null) {
      updates.showOnlyRemaining = urlShowOnlyRemaining === "true";
    }

    if (Object.keys(updates).length > 0) {
      updateFilters(updates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount - searchParams and updateFilters are stable

  // Sync filters to URL params
  const handleFiltersChange = useCallback(
    (newFilters: Partial<typeof filters>) => {
      updateFilters(newFilters);

      // Update URL params
      const params = new URLSearchParams(searchParams.toString());
      
      if (newFilters.difficulty !== undefined) {
        if (newFilters.difficulty === "All") {
          params.delete("difficulty");
        } else {
          params.set("difficulty", newFilters.difficulty);
        }
      }

      if (newFilters.category !== undefined) {
        if (newFilters.category === "All") {
          params.delete("category");
        } else {
          params.set("category", newFilters.category);
        }
      }

      if (newFilters.search !== undefined) {
        if (newFilters.search === "") {
          params.delete("search");
        } else {
          params.set("search", newFilters.search);
        }
      }

      if (newFilters.showOnlyRemaining !== undefined) {
        if (!newFilters.showOnlyRemaining) {
          params.delete("showOnlyRemaining");
        } else {
          params.set("showOnlyRemaining", "true");
        }
      }

      // Update URL without causing a page reload
      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      router.replace(newUrl, { scroll: false });
    },
    [searchParams, router, updateFilters]
  );

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const totalItems = roadmapData.items.length;
    const completedCount = completedItems.size;
    const percentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
    return { completedCount, totalItems, percentage };
  }, [completedItems]);

  // Calculate section progress
  const sectionProgress = useMemo(() => {
    const progressMap = new Map<
      string,
      { completed: number; total: number; percent: number }
    >();

    roadmapData.sections.forEach((section) => {
      const sectionItems = roadmapData.items.filter((item) => item.sectionId === section.id);
      const completed = sectionItems.filter((item) => completedItems.has(item.id)).length;
      const total = sectionItems.length;
      const percent = total > 0 ? (completed / total) * 100 : 0;
      progressMap.set(section.id, { completed, total, percent });
    });

    return progressMap;
  }, [completedItems]);

  // Check if prerequisites are met
  const canStartItem = useCallback(
    (item: RoadmapItem) => {
      if (item.prerequisites.length === 0) return true;
      return item.prerequisites.every((prereq) => completedItems.has(prereq));
    },
    [completedItems]
  );

  // Get next recommendation
  const recommendation = useMemo(() => {
    return getNextRecommendation(roadmapData.items, completedItems, canStartItem);
  }, [completedItems, canStartItem]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.difficulty !== "All") count++;
    if (filters.category !== "All") count++;
    if (filters.showOnlyRemaining) count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToItem = (itemId: string) => {
    const element = document.getElementById(`roadmap-item-${itemId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      // Highlight the item briefly
      element.classList.add("ring-2", "ring-[hsl(var(--cyber-cyan))]", "ring-offset-2");
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-[hsl(var(--cyber-cyan))]", "ring-offset-2");
      }, 2000);
    }
  };

  return (
    <div>
      {/* Sticky Progress Bar */}
      <StickyProgressBar
        completedCount={overallProgress.completedCount}
        totalCount={overallProgress.totalItems}
        percentage={overallProgress.percentage}
      />

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Navigation Only */}
          <aside className="lg:col-span-3 space-y-4 order-1 hidden lg:block">
            <div className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
              <SectionNav
                sections={roadmapData.sections}
                activeSection={activeSection}
                onSectionClick={scrollToSection}
                sectionProgress={sectionProgress}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 order-2 w-full">
            {/* Sticky Filters Bar */}
            <FiltersBar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              activeFilterCount={activeFilterCount}
            />

            {/* Next Up Panel */}
            {recommendation && (
              <NextUpPanel
                recommendedItem={recommendation.item}
                reason={recommendation.reason}
                onItemClick={scrollToItem}
              />
            )}

            {/* Roadmap Content */}
            <RoadmapView />
          </main>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function RoadmapPage() {
  return (
    <Suspense fallback={
      <div className="container py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground">Loading roadmap...</div>
        </div>
      </div>
    }>
      <RoadmapPageContent />
    </Suspense>
  );
}
