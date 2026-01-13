"use client";

import { useRoadmap } from "@/lib/store/RoadmapContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";
import roadmapData from "@/data/roadmap.godot-2026.json";
import { cn } from "@/lib/utils";

interface SidebarSectionNavProps {
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
}

export function SidebarSectionNav({ activeSection, onSectionClick }: SidebarSectionNavProps) {
  const { completedItems } = useRoadmap();

  // Calculate overall progress
  const totalItems = roadmapData.items.length;
  const completedCount = completedItems.size;
  const overallPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const getSectionProgress = (sectionId: string) => {
    const sectionItems = roadmapData.items.filter((item) => item.sectionId === sectionId);
    const completed = sectionItems.filter((item) => completedItems.has(item.id)).length;
    const total = sectionItems.length;
    const percent = total > 0 ? (completed / total) * 100 : 0;
    const isComplete = completed === total && total > 0;
    return { completed, total, percent, isComplete };
  };

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Overall Progress</h3>
          <span className="text-sm font-semibold">{overallPercent}%</span>
        </div>
        <Progress 
          value={overallPercent} 
          className="h-1 bg-muted"
        />
      </div>

      {/* Sections */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Sections</h2>
        <ScrollArea className="h-[400px] lg:h-[calc(100vh-12rem)]">
          <div className="space-y-1">
            {roadmapData.sections.map((section) => {
              const progress = getSectionProgress(section.id);
              const isActive = activeSection === section.id;
              return (
                <Button
                  key={section.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left h-auto py-3 px-4 relative",
                    isActive && [
                      "text-primary font-semibold",
                      "border-l-2 border-primary",
                      "bg-primary/5 dark:bg-primary/10"
                    ],
                    !isActive && "font-medium"
                  )}
                  onClick={() => onSectionClick?.(section.id)}
                >
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2">
                      <span>{section.title}</span>
                      {progress.isComplete && (
                        <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      )}
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-2 mb-1">
                      <div className="relative h-[3px] w-full rounded-full bg-muted/60 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full bg-primary transition-all duration-300"
                          )}
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {progress.completed} / {progress.total}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
