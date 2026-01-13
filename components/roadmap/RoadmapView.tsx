"use client";

import { useMemo } from "react";
import { useRoadmap } from "@/lib/store/RoadmapContext";
import { CollapsibleSection } from "./CollapsibleSection";
import roadmapDataRaw from "@/data/roadmap.godot-2026.json";
import { Card, CardContent } from "@/components/ui/card";
import type { RoadmapData, RoadmapItem } from "@/types/roadmap";

const roadmapData = roadmapDataRaw as RoadmapData;

export function RoadmapView() {
  const { completedItems, filters } = useRoadmap();

  // Filter items with useMemo for performance
  const filteredItems = useMemo(() => {
    let items = roadmapData.items;

    if (filters.difficulty !== "All") {
      items = items.filter((item) => item.difficulty === filters.difficulty);
    }

    if (filters.category !== "All") {
      items = items.filter((item) => item.category === filters.category);
    }

    if (filters.showOnlyRemaining) {
      items = items.filter((item) => !completedItems.has(item.id));
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.summary.toLowerCase().includes(searchLower) ||
          item.keywords.some((kw) => kw.toLowerCase().includes(searchLower))
      );
    }

    return items;
  }, [filters, completedItems]);

  // Group by section
  const itemsBySection = useMemo(
    () =>
      filteredItems.reduce(
        (acc, item) => {
          if (!acc[item.sectionId]) {
            acc[item.sectionId] = [];
          }
          acc[item.sectionId].push(item);
          return acc;
        },
        {} as Record<string, typeof filteredItems>
      ),
    [filteredItems]
  );

  // Check if prerequisites are met
  const canStartItem = useMemo(
    () => (item: RoadmapItem) => {
      if (item.prerequisites.length === 0) return true;
      return item.prerequisites.every((prereq) => completedItems.has(prereq));
    },
    [completedItems]
  );

  return (
    <div className="space-y-12">
      {roadmapData.sections.map((section) => {
        const sectionItems = itemsBySection[section.id] || [];
        if (sectionItems.length === 0) return null;

        return (
          <CollapsibleSection
            key={section.id}
            section={section}
            items={sectionItems}
            completedItems={completedItems}
            isCollapsed={false}
            onToggle={() => {}}
            autoCollapse={true}
            searchQuery={filters.search}
            canStartItem={canStartItem}
          />
        );
      })}

      {Object.keys(itemsBySection).length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No items match your current filters. Try adjusting your search or filters.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
