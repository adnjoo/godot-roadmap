"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RoadmapSection } from "@/types/roadmap";

interface SectionProgress {
  completed: number;
  total: number;
  percent: number;
}

interface SectionNavProps {
  sections: RoadmapSection[];
  activeSection?: string;
  onSectionClick: (sectionId: string) => void;
  sectionProgress: Map<string, SectionProgress>;
}

export function SectionNav({
  sections,
  activeSection,
  onSectionClick,
  sectionProgress,
}: SectionNavProps) {
  return (
    <nav className="space-y-4" aria-label="Roadmap sections navigation">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Sections</h2>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-1 pr-4">
            {sections.map((section) => {
              const progress = sectionProgress.get(section.id) || {
                completed: 0,
                total: 0,
                percent: 0,
              };
              const isActive = activeSection === section.id;
              const isComplete = progress.completed === progress.total && progress.total > 0;

              return (
                <Button
                  key={section.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left h-auto py-3 px-4 relative",
                    isActive && [
                      "text-primary font-semibold",
                      "border-l-2 border-primary",
                      "bg-primary/5 dark:bg-primary/10",
                    ],
                    !isActive && "font-medium"
                  )}
                  onClick={() => onSectionClick(section.id)}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={`Navigate to ${section.title} section`}
                >
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2">
                      <span>{section.title}</span>
                      {isComplete && (
                        <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      )}
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-2 mb-1">
                      <div className="relative h-[3px] w-full rounded-full bg-muted/60 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full bg-primary transition-all duration-500 ease-out"
                          )}
                          style={{ width: `${progress.percent}%` }}
                          role="progressbar"
                          aria-valuenow={progress.percent}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${section.title} progress: ${progress.percent}%`}
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
    </nav>
  );
}
