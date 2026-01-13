"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StickyProgressBarProps {
  completedCount: number;
  totalCount: number;
  percentage: number;
}

export function StickyProgressBar({
  completedCount,
  totalCount,
  percentage,
}: StickyProgressBarProps) {
  return (
    <div
      className={cn(
        "sticky top-16 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "transition-all duration-200"
      )}
      role="region"
      aria-label="Overall progress"
    >
      <div className="container py-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-sm font-medium whitespace-nowrap" aria-live="polite">
              Overall Progress: {percentage}%
            </span>
            <div className="flex-1 min-w-0" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`Overall progress: ${percentage} percent`}>
              <Progress value={percentage} className="h-2 transition-all duration-500 ease-out" />
            </div>
          </div>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {completedCount} / {totalCount} items
          </span>
        </div>
      </div>
    </div>
  );
}
