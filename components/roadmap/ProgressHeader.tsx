"use client";

import { useRoadmap } from "@/lib/store/RoadmapContext";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import roadmapData from "@/data/roadmap.godot-2026.json";

export function ProgressHeader() {
  const { completedItems } = useRoadmap();
  const totalItems = roadmapData.items.length;
  const completedCount = completedItems.size;
  const percentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              {completedCount} of {totalItems} items completed
            </span>
            <span className="text-muted-foreground">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
