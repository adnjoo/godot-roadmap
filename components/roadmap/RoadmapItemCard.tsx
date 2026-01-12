"use client";

import { useRoadmap } from "@/lib/store/RoadmapContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ExternalLink, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
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

  const difficultyColors = {
    Beginner: "bg-green-500/10 text-green-700 dark:text-green-400",
    Intermediate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    Advanced: "bg-red-500/10 text-red-700 dark:text-red-400",
  };

  const categoryColors = {
    "2D": "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    "3D": "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    UI: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
    Systems: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    Tools: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
  };

  return (
    <Card
      className={cn(
        "transition-all",
        isCompleted && "opacity-75 border-primary/50",
        !canStart && !isCompleted && "opacity-50"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={() => toggleItem(item.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <h3 className={cn("font-semibold text-base", isCompleted && "line-through")}>
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{item.summary}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge className={difficultyColors[item.difficulty]}>{item.difficulty}</Badge>
          <Badge className={categoryColors[item.category]}>{item.category}</Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {item.estHours}h
          </Badge>
        </div>

        {!canStart && item.prerequisites.length > 0 && (
          <div className="text-xs text-muted-foreground mb-3">
            Requires: {item.prerequisites.length} prerequisite(s)
          </div>
        )}

        <Accordion type="single" collapsible>
          <AccordionItem value="details" className="border-none">
            <AccordionTrigger className="text-sm py-2">View details</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm">
                {item.resources.length > 0 && (
                  <div>
                    <div className="font-medium mb-2">Resources:</div>
                    <div className="space-y-1">
                      {item.resources.map((resource, idx) => (
                        <a
                          key={idx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
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
