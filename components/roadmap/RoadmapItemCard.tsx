"use client";

import { useState } from "react";
import { useRoadmap } from "@/lib/store/RoadmapContext";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { ExternalLink, Clock, Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Difficulty, Category } from "@/lib/store/RoadmapContext";
import roadmapDataRaw from "@/data/roadmap.godot-2026.json";
import type { RoadmapData } from "@/types/roadmap";

interface RoadmapItem {
  id: string;
  title: string;
  summary: string;
  difficulty: Difficulty;
  category: Category;
  estHours: number;
  prerequisites: string[];
  resources: Array<{ label: string; url: string }>;
  keywords: string[];
}

interface RoadmapItemCardProps {
  item: RoadmapItem;
  canStart: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

const roadmapData = roadmapDataRaw as RoadmapData;

export function RoadmapItemCard({ item, canStart, isFirst = false, isLast = false }: RoadmapItemCardProps) {
  const { completedItems, toggleItem } = useRoadmap();
  const isCompleted = completedItems.has(item.id);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const isActive = isAccordionOpen && canStart && !isCompleted;

  // Get prerequisite titles from IDs
  const getPrerequisiteTitles = (prerequisiteIds: string[]): string[] => {
    return prerequisiteIds
      .map((id) => roadmapData.items.find((item) => item.id === id)?.title)
      .filter((title): title is string => title !== undefined);
  };

  const difficultyColors = {
    Beginner: "bg-[hsl(var(--cyber-green))]/10 text-[hsl(var(--cyber-green))] border-[hsl(var(--cyber-green))]/30",
    Intermediate: "bg-[hsl(var(--cyber-amber))]/10 text-[hsl(var(--cyber-amber))] border-[hsl(var(--cyber-amber))]/30",
    Advanced: "bg-[hsl(var(--cyber-magenta))]/10 text-[hsl(var(--cyber-magenta))] border-[hsl(var(--cyber-magenta))]/30",
  };

  const categoryColors = {
    "2D": "bg-[hsl(var(--cyber-cyan))]/10 text-[hsl(var(--cyber-cyan))] border-[hsl(var(--cyber-cyan))]/30",
    "3D": "bg-[hsl(var(--cyber-magenta))]/10 text-[hsl(var(--cyber-magenta))] border-[hsl(var(--cyber-magenta))]/30",
    UI: "bg-[hsl(var(--cyber-magenta))]/10 text-[hsl(var(--cyber-magenta))] border-[hsl(var(--cyber-magenta))]/30",
    Systems: "bg-[hsl(var(--cyber-amber))]/10 text-[hsl(var(--cyber-amber))] border-[hsl(var(--cyber-amber))]/30",
    Tools: "bg-[hsl(var(--cyber-cyan))]/10 text-[hsl(var(--cyber-cyan))] border-[hsl(var(--cyber-cyan))]/30",
  };

  const scrollToPrerequisite = (prerequisiteId: string) => {
    const element = document.getElementById(`roadmap-item-${prerequisiteId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      // Add a highlight effect
      element.classList.add("ring-2", "ring-[hsl(var(--cyber-cyan))]", "ring-offset-2");
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-[hsl(var(--cyber-cyan))]", "ring-offset-2");
      }, 2000);
    }
  };

  const getNodeStyle = () => {
    const baseSize = isActive ? "w-5 h-5" : "w-4 h-4";
    
    if (isCompleted) {
      return cn(
        baseSize,
        "rounded-full bg-[hsl(var(--cyber-green))] border-2 border-[hsl(var(--cyber-green))]",
        "flex items-center justify-center transition-all"
      );
    }
    if (!canStart && !isCompleted) {
      return cn(
        baseSize,
        "rounded-full border-2 border-dashed border-[hsl(var(--cyber-amber))]/60",
        "bg-transparent flex items-center justify-center transition-all"
      );
    }
    if (isActive) {
      return cn(
        baseSize,
        "rounded-full border-2 border-[hsl(var(--cyber-cyan))]",
        "bg-gradient-to-br from-[hsl(var(--cyber-cyan))]/20 to-[hsl(var(--cyber-magenta))]/20",
        "ring-2 ring-[hsl(var(--cyber-cyan))]/50 ring-offset-2 ring-offset-background",
        "flex items-center justify-center transition-all"
      );
    }
    return cn(
      baseSize,
      "rounded-full border-2 border-gray-400 dark:border-gray-500",
      "bg-transparent flex items-center justify-center transition-all"
    );
  };

  return (
    <div
      id={`roadmap-item-${item.id}`}
      className={cn(
        "relative flex transition-all duration-300",
        "hover:bg-gray-50/50 dark:hover:bg-[hsl(var(--cyber-dark))]/30",
        isActive && "bg-[hsl(var(--cyber-dark))]/20 dark:bg-[hsl(var(--cyber-dark))]/40"
      )}
    >
      {/* Left Rail Column */}
      <div className="relative flex-shrink-0 w-12 flex flex-col items-center">
        {/* Connector Line Above (if not first) */}
        {!isFirst && (
          <div
            className={cn(
              "w-0.5 min-h-[2rem] flex-1 transition-colors",
              isCompleted && "bg-[hsl(var(--cyber-green))]",
              !canStart && !isCompleted && "bg-[hsl(var(--cyber-amber))]/40",
              isActive && "bg-[hsl(var(--cyber-cyan))]",
              !isCompleted && canStart && !isActive && "bg-gray-300 dark:bg-gray-600"
            )}
          />
        )}

        {/* Station Node */}
        <div className="relative z-10 flex items-center justify-center py-2">
          <button
            onClick={() => toggleItem(item.id)}
            className={getNodeStyle()}
            aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
          >
            {isCompleted ? (
              <Check className="w-3 h-3 text-white" />
            ) : !canStart ? (
              <Lock className="w-2.5 h-2.5 text-[hsl(var(--cyber-amber))]/80" />
            ) : null}
          </button>
        </div>

        {/* Connector Line Below (if not last) */}
        {!isLast && (
          <div
            className={cn(
              "w-0.5 min-h-[2rem] flex-1 transition-colors",
              isCompleted && "bg-[hsl(var(--cyber-green))]",
              !canStart && !isCompleted && "bg-[hsl(var(--cyber-amber))]/40",
              isActive && "bg-[hsl(var(--cyber-cyan))]",
              !isCompleted && canStart && !isActive && "bg-gray-300 dark:bg-gray-600"
            )}
          />
        )}
      </div>

      {/* Right Content Column */}
      <div className="flex-1 py-4 pl-4 pr-6">
        {/* Clickable Header */}
        <button
          onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          className="w-full text-left cursor-pointer"
        >
          <div className="flex items-start gap-2 flex-wrap mb-2">
            <h3
              className={cn(
                "font-semibold text-base transition-colors",
                isCompleted && "line-through opacity-60",
                isActive && "dark:text-[hsl(var(--cyber-cyan))]",
                !isCompleted && !isActive && "dark:text-gray-200 text-gray-900"
              )}
            >
              {item.title}
            </h3>
            {isCompleted && (
              <Badge
                variant="outline"
                className="text-xs px-2 py-0 border-[hsl(var(--cyber-green))] text-[hsl(var(--cyber-green))] bg-transparent"
              >
                DONE
              </Badge>
            )}
          </div>
          <p
            className={cn(
              "text-sm transition-colors",
              isCompleted ? "text-muted-foreground opacity-50" : "text-muted-foreground",
              isActive && "dark:text-gray-300"
            )}
          >
            {item.summary}
          </p>
        </button>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2 mt-3 mb-3">
          <Badge
            variant="outline"
            className={cn(difficultyColors[item.difficulty], "border transition-all")}
          >
            {item.difficulty}
          </Badge>
          <Badge
            variant="outline"
            className={cn(categoryColors[item.category], "border transition-all")}
          >
            {item.category}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-1 transition-all",
              "dark:border-[hsl(var(--cyber-cyan))]/30 dark:text-[hsl(var(--cyber-cyan))]",
              "border-gray-300 text-gray-700"
            )}
          >
            <Clock className="h-3 w-3" />
            {item.estHours}h
          </Badge>
        </div>

        {/* Prerequisites */}
        {!canStart && item.prerequisites.length > 0 && (
          <div
            className={cn(
              "text-xs mb-3 transition-colors",
              "dark:text-[hsl(var(--cyber-amber))]",
              "text-amber-700"
            )}
          >
            Requires:{" "}
            {item.prerequisites.map((prerequisiteId, index) => {
              const prerequisiteItem = roadmapData.items.find((item) => item.id === prerequisiteId);
              if (!prerequisiteItem) return null;
              return (
                <span key={prerequisiteId}>
                  {index > 0 && ", "}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToPrerequisite(prerequisiteId);
                    }}
                    className={cn(
                      "underline underline-offset-2 hover:underline-offset-4 transition-all",
                      "hover:dark:text-[hsl(var(--cyber-cyan))]",
                      "hover:text-blue-600",
                      "cursor-pointer"
                    )}
                  >
                    {prerequisiteItem.title}
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* Accordion Details */}
        <Accordion
          type="single"
          collapsible
          value={isAccordionOpen ? "details" : undefined}
          onValueChange={(value) => setIsAccordionOpen(value === "details")}
        >
          <AccordionItem value="details" className="border-none">
            <AccordionContent>
              <div className="space-y-3 text-sm">
                {item.resources.length > 0 && (
                  <div>
                    <div
                      className={cn(
                        "font-medium mb-2 transition-colors",
                        isActive && "dark:text-[hsl(var(--cyber-cyan))]"
                      )}
                    >
                      Resources:
                    </div>
                    <div className="space-y-1">
                      {item.resources.map((resource, idx) => (
                        <a
                          key={idx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "flex items-center gap-1 transition-all",
                            "dark:text-[hsl(var(--cyber-cyan))] hover:dark:text-[hsl(var(--cyber-magenta))]",
                            "text-blue-600 hover:text-blue-800",
                            "hover:underline hover:underline-offset-2"
                          )}
                        >
                          {resource.label}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
