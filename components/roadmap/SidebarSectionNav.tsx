"use client";

import { useRoadmap } from "@/lib/store/RoadmapContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import roadmapData from "@/data/roadmap.godot-2026.json";
import { cn } from "@/lib/utils";

interface SidebarSectionNavProps {
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
}

export function SidebarSectionNav({ activeSection, onSectionClick }: SidebarSectionNavProps) {
  const { completedItems } = useRoadmap();

  const getSectionProgress = (sectionId: string) => {
    const sectionItems = roadmapData.items.filter((item) => item.sectionId === sectionId);
    const completed = sectionItems.filter((item) => completedItems.has(item.id)).length;
    return { completed, total: sectionItems.length };
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold mb-4">Sections</h2>
      <ScrollArea className="h-[400px] lg:h-[calc(100vh-12rem)]">
        <div className="space-y-1">
          {roadmapData.sections.map((section) => {
            const progress = getSectionProgress(section.id);
            const isActive = activeSection === section.id;
            return (
              <Button
                key={section.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-left h-auto py-3 px-4",
                  isActive && "bg-primary text-primary-foreground"
                )}
                onClick={() => onSectionClick?.(section.id)}
              >
                <div className="flex-1">
                  <div className="font-medium">{section.title}</div>
                  <div className="text-xs opacity-80 mt-1">
                    {progress.completed}/{progress.total} completed
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
