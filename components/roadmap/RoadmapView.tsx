"use client";

import { useRoadmap } from "@/lib/store/RoadmapContext";
import { RoadmapItemCard } from "./RoadmapItemCard";
import roadmapDataRaw from "@/data/roadmap.godot-2026.json";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RoadmapData, RoadmapItem } from "@/types/roadmap";

const roadmapData = roadmapDataRaw as RoadmapData;

export function RoadmapView() {
  const { completedItems, filters } = useRoadmap();

  // Filter items
  let filteredItems = roadmapData.items;

  if (filters.difficulty !== "All") {
    filteredItems = filteredItems.filter((item) => item.difficulty === filters.difficulty);
  }

  if (filters.category !== "All") {
    filteredItems = filteredItems.filter((item) => item.category === filters.category);
  }

  if (filters.showOnlyRemaining) {
    filteredItems = filteredItems.filter((item) => !completedItems.has(item.id));
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredItems = filteredItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        item.summary.toLowerCase().includes(searchLower) ||
        item.keywords.some((kw) => kw.toLowerCase().includes(searchLower))
    );
  }

  // Group by section
  const itemsBySection = filteredItems.reduce(
    (acc, item) => {
      if (!acc[item.sectionId]) {
        acc[item.sectionId] = [];
      }
      acc[item.sectionId].push(item);
      return acc;
    },
    {} as Record<string, typeof filteredItems>
  );

  // Check if prerequisites are met
  const canStartItem = (item: RoadmapItem) => {
    if (item.prerequisites.length === 0) return true;
    return item.prerequisites.every((prereq) => completedItems.has(prereq));
  };

  return (
    <div className="space-y-12">
      {roadmapData.sections.map((section) => {
        const sectionItems = itemsBySection[section.id] || [];
        if (sectionItems.length === 0) return null;

        return (
          <div key={section.id} id={section.id} className="space-y-6">
            {/* Section Header */}
            <div className="space-y-1">
              <h2 className="text-2xl font-bold dark:text-[hsl(var(--cyber-cyan))] text-gray-900">
                {section.title}
              </h2>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </div>

            {/* Metro Line Items */}
            <div className="space-y-0">
              {sectionItems.map((item, index) => (
                <RoadmapItemCard
                  key={item.id}
                  item={item}
                  canStart={canStartItem(item)}
                  isFirst={index === 0}
                  isLast={index === sectionItems.length - 1}
                />
              ))}
            </div>
          </div>
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
