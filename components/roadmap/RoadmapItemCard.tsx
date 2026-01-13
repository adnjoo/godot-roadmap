"use client";

import { useState } from "react";
import { useRoadmap } from "@/lib/store/RoadmapContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ExternalLink, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import type { Difficulty, Category } from "@/lib/store/RoadmapContext";

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
}

export function RoadmapItemCard({ item, canStart }: RoadmapItemCardProps) {
  const { completedItems, toggleItem } = useRoadmap();
  const isCompleted = completedItems.has(item.id);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const isActive = isAccordionOpen && canStart && !isCompleted;

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

  return (
    <Card
      className={cn(
        "relative transition-all duration-300 cyber-scanline",
        "dark:bg-[hsl(var(--cyber-dark))] dark:border-[hsl(var(--cyber-cyan))]/20",
        "bg-white border-gray-200",
        // Hover state
        "hover:-translate-y-0.5 hover:shadow-lg",
        "dark:hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]",
        // Active state (accordion open + can start)
        isActive && [
          "scale-[1.01] cyber-glow-active",
          "dark:bg-[hsl(var(--cyber-dark))] dark:bg-gradient-to-r dark:from-cyan-950/20 dark:to-transparent",
          "border-[hsl(var(--cyber-cyan))]/50",
        ],
        // Completed state
        isCompleted && [
          "opacity-75 dark:border-[hsl(var(--cyber-green))]/30",
          "dark:bg-[hsl(var(--cyber-dark))]/50",
        ],
        // Locked state
        !canStart && !isCompleted && [
          "opacity-50 dark:border-[hsl(var(--cyber-amber))]/20",
        ]
      )}
    >
      {/* Glowing effect - enabled when card is active or can be started */}
      <GlowingEffect
        disabled={!canStart || isCompleted}
        glow={isActive}
        proximity={50}
        spread={30}
        movementDuration={1.5}
        borderWidth={1}
        variant="default"
      />
      
      {/* Neon left accent bar - only for active items */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[hsl(var(--cyber-cyan))] to-[hsl(var(--cyber-magenta))] rounded-l-lg shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
      )}
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1">
            <div className="relative mt-1">
              <Checkbox
                checked={isCompleted}
                onCheckedChange={() => toggleItem(item.id)}
                className={cn(
                  "transition-all",
                  isCompleted && [
                    "cyber-glow-green",
                    "outline outline-2 outline-[hsl(var(--cyber-green))] outline-offset-0 rounded-sm"
                  ]
                )}
                style={isCompleted ? { outlineOpacity: 0.5 } : undefined}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={cn(
                  "font-semibold text-base transition-colors",
                  isCompleted && "line-through opacity-60",
                  isActive && "dark:text-[hsl(var(--cyber-cyan))]",
                  !isCompleted && !isActive && "dark:text-gray-200"
                )}>
                  {item.title}
                </h3>
                {isActive && (
                  <Badge 
                    variant="outline" 
                    className="text-xs px-2 py-0 border-[hsl(var(--cyber-cyan))] text-[hsl(var(--cyber-cyan))] bg-transparent shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                  >
                    ACTIVE
                  </Badge>
                )}
                {isCompleted && (
                  <Badge 
                    variant="outline" 
                    className="text-xs px-2 py-0 border-[hsl(var(--cyber-green))] text-[hsl(var(--cyber-green))] bg-transparent shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                  >
                    DONE
                  </Badge>
                )}
              </div>
              <p className={cn(
                "text-sm mt-1 transition-colors",
                isCompleted ? "text-muted-foreground opacity-50" : "text-muted-foreground",
                isActive && "dark:text-gray-300"
              )}>
                {item.summary}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge 
            variant="outline"
            className={cn(
              difficultyColors[item.difficulty],
              "border transition-all"
            )}
          >
            {item.difficulty}
          </Badge>
          <Badge 
            variant="outline"
            className={cn(
              categoryColors[item.category],
              "border transition-all"
            )}
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

        {!canStart && item.prerequisites.length > 0 && (
          <div className={cn(
            "text-xs mb-3 transition-colors",
            "dark:text-[hsl(var(--cyber-amber))]",
            "text-amber-700"
          )}>
            Requires: {item.prerequisites.length} prerequisite(s)
          </div>
        )}

        <Accordion 
          type="single" 
          collapsible
          value={isAccordionOpen ? "details" : undefined}
          onValueChange={(value) => setIsAccordionOpen(value === "details")}
        >
          <AccordionItem value="details" className="border-none">
            <AccordionTrigger 
              className={cn(
                "text-sm py-2 transition-colors",
                isActive && "dark:text-[hsl(var(--cyber-cyan))]",
                "hover:dark:text-[hsl(var(--cyber-cyan))]"
              )}
            >
              View details
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm">
                {item.resources.length > 0 && (
                  <div>
                    <div className={cn(
                      "font-medium mb-2 transition-colors",
                      isActive && "dark:text-[hsl(var(--cyber-cyan))]"
                    )}>
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
      </CardContent>
    </Card>
  );
}
