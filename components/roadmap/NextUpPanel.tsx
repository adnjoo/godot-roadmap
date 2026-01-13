"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RoadmapItem } from "@/types/roadmap";
import type { Difficulty, Category } from "@/lib/store/RoadmapContext";

interface NextUpPanelProps {
  recommendedItem: RoadmapItem | null;
  reason: string;
  onItemClick: (itemId: string) => void;
}

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

export function NextUpPanel({ recommendedItem, reason, onItemClick }: NextUpPanelProps) {
  if (!recommendedItem) {
    return null;
  }

  const handleStartClick = () => {
    onItemClick(recommendedItem.id);
  };

  return (
    <Card className="mb-6 border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-primary" />
          What should I do next?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-base mb-1">{recommendedItem.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{recommendedItem.summary}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                difficultyColors[recommendedItem.difficulty as Difficulty],
                "border"
              )}
            >
              {recommendedItem.difficulty}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                categoryColors[recommendedItem.category as Category],
                "border"
              )}
            >
              {recommendedItem.category}
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-gray-300 text-gray-700 dark:border-[hsl(var(--cyber-cyan))]/30 dark:text-[hsl(var(--cyber-cyan))]"
            >
              <Clock className="h-3 w-3" />
              {recommendedItem.estHours}h
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground italic">{reason}</p>

          <Button
            onClick={handleStartClick}
            className="w-full"
            aria-label={`Start working on ${recommendedItem.title}`}
          >
            Start This
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
