import type { RoadmapItem } from "@/types/roadmap";
import type { Difficulty } from "@/lib/store/RoadmapContext";

interface RecommendationResult {
  item: RoadmapItem;
  reason: string;
}

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

/**
 * Recommends the next item to work on based on:
 * 1. Prerequisites are met (canStart === true)
 * 2. Item is not completed
 * 3. Priority: Beginner > Intermediate > Advanced
 * 4. Fewer prerequisites (easier to start)
 * 5. Lower estHours (quicker wins)
 */
export function getNextRecommendation(
  items: RoadmapItem[],
  completedItems: Set<string>,
  canStartItem: (item: RoadmapItem) => boolean
): RecommendationResult | null {
  // Filter to items that can be started and aren't completed
  const availableItems = items.filter(
    (item) => !completedItems.has(item.id) && canStartItem(item)
  );

  if (availableItems.length === 0) {
    return null;
  }

  // Sort by priority
  const sorted = [...availableItems].sort((a, b) => {
    // Priority 1: Difficulty (Beginner first)
    const diffA = DIFFICULTY_ORDER[a.difficulty];
    const diffB = DIFFICULTY_ORDER[b.difficulty];
    if (diffA !== diffB) {
      return diffA - diffB;
    }

    // Priority 2: Fewer prerequisites
    const prereqA = a.prerequisites.length;
    const prereqB = b.prerequisites.length;
    if (prereqA !== prereqB) {
      return prereqA - prereqB;
    }

    // Priority 3: Lower estHours
    return a.estHours - b.estHours;
  });

  const recommended = sorted[0];
  const reason = generateReason(recommended, completedItems);

  return {
    item: recommended,
    reason,
  };
}

function generateReason(item: RoadmapItem, completedItems: Set<string>): string {
  if (item.prerequisites.length === 0) {
    return "Ready to start - no prerequisites required";
  }

  const completedPrereqs = item.prerequisites.filter((id) => completedItems.has(id)).length;
  if (completedPrereqs === item.prerequisites.length) {
    return "All prerequisites completed";
  }

  return `Ready to start - ${completedPrereqs} of ${item.prerequisites.length} prerequisites completed`;
}
