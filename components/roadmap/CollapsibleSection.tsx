"use client";

import { useState, useEffect, useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RoadmapItemCard } from "./RoadmapItemCard";
import { cn } from "@/lib/utils";
import type { RoadmapSection, RoadmapItem } from "@/types/roadmap";

interface CollapsibleSectionProps {
  section: RoadmapSection;
  items: RoadmapItem[];
  completedItems: Set<string>;
  isCollapsed: boolean;
  onToggle: () => void;
  autoCollapse?: boolean;
  searchQuery?: string;
  canStartItem: (item: RoadmapItem) => boolean;
}

const STORAGE_KEY_PREFIX = "roadmap-section-collapsed-";

export function CollapsibleSection({
  section,
  items,
  completedItems,
  isCollapsed: controlledCollapsed,
  onToggle,
  autoCollapse = true,
  searchQuery = "",
  canStartItem,
}: CollapsibleSectionProps) {
  const [localCollapsed, setLocalCollapsed] = useState<boolean | null>(null);
  const storageKey = `${STORAGE_KEY_PREFIX}${section.id}`;

  // Calculate section progress
  const progress = useMemo(() => {
    const completed = items.filter((item) => completedItems.has(item.id)).length;
    const total = items.length;
    const percent = total > 0 ? (completed / total) * 100 : 0;
    const isComplete = completed === total && total > 0;
    return { completed, total, percent, isComplete };
  }, [items, completedItems]);

  // Load initial collapse state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) {
      setLocalCollapsed(stored === "true");
    }
  }, [storageKey]);

  // Determine if section should be collapsed
  const shouldCollapse = useMemo(() => {
    // If user has manually set a preference, use that
    if (localCollapsed !== null) {
      return localCollapsed;
    }
    // Otherwise, use controlled prop or auto-collapse logic
    if (controlledCollapsed !== undefined) {
      return controlledCollapsed;
    }
    // Auto-collapse if all items completed
    return autoCollapse && progress.isComplete;
  }, [localCollapsed, controlledCollapsed, autoCollapse, progress.isComplete]);

  // Save collapse state to localStorage
  const handleToggle = () => {
    const newState = !shouldCollapse;
    setLocalCollapsed(newState);
    localStorage.setItem(storageKey, String(newState));
    onToggle();
  };

  return (
    <div id={section.id} className="space-y-6 scroll-mt-24">
      <Accordion type="single" collapsible value={shouldCollapse ? undefined : section.id}>
        <AccordionItem value={section.id} className="border-none">
          <AccordionTrigger
            onClick={handleToggle}
            className="hover:no-underline py-4"
            aria-expanded={!shouldCollapse}
            aria-controls={`section-${section.id}-content`}
            id={`section-${section.id}-header`}
            aria-label={`${section.title} section, ${progress.completed} of ${progress.total} items completed`}
          >
            <div className="flex items-center justify-between w-full pr-4">
              <div className="text-left">
                <h2 className="text-2xl font-bold dark:text-[hsl(var(--cyber-cyan))] text-gray-900">
                  {section.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>
                  {progress.completed} / {progress.total} completed
                </span>
                {progress.isComplete && (
                  <span className="text-amber-500 dark:text-amber-400">✓</span>
                )}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent
            id={`section-${section.id}-content`}
            className="pt-2"
            role="region"
            aria-labelledby={`section-${section.id}-header`}
          >
            <div className="space-y-0">
              {items.map((item, index) => (
                <RoadmapItemCard
                  key={item.id}
                  item={item}
                  isCompleted={completedItems.has(item.id)}
                  canStart={canStartItem(item)}
                  isFirst={index === 0}
                  isLast={index === items.length - 1}
                  searchQuery={searchQuery}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
