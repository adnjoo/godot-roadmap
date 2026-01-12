"use client";

import { useRoadmap } from "@/lib/store/RoadmapContext";
import { RoadmapItemCard } from "./RoadmapItemCard";
import roadmapData from "@/data/roadmap.godot-2026.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const canStartItem = (item: (typeof roadmapData.items)[0]) => {
    if (item.prerequisites.length === 0) return true;
    return item.prerequisites.every((prereq) => completedItems.has(prereq));
  };

  return (
    <div className="space-y-8">
      {roadmapData.sections.map((section) => {
        const sectionItems = itemsBySection[section.id] || [];
        if (sectionItems.length === 0) return null;

        return (
          <div key={section.id} id={section.id}>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{section.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                  {sectionItems.map((item) => (
                    <RoadmapItemCard key={item.id} item={item} canStart={canStartItem(item)} />
                  ))}
                </div>
              </CardContent>
            </Card>
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
