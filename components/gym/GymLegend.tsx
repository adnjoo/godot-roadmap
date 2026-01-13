"use client";

import { useGym } from "@/lib/store/GymContext";
import { gymNodes } from "@/data/godotGym";

const TIER_COLORS = {
  1: "bg-green-500",
  2: "bg-blue-500",
  3: "bg-purple-500",
  4: "bg-yellow-500",
  5: "bg-red-500",
};

const TIER_NAMES = {
  1: "Tier 1",
  2: "Tier 2",
  3: "Tier 3",
  4: "Tier 4",
  5: "Tier 5",
};

export function GymLegend() {
  const { getCompletedCount } = useGym();
  const completed = getCompletedCount();

  return (
    <div className="absolute top-4 left-4 z-10 bg-stone-900/90 backdrop-blur-sm border border-stone-700 rounded-lg p-4 space-y-3">
      <div className="text-sm font-semibold text-stone-200 mb-2">
        Completed: {completed}/200
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((tier) => (
          <div key={tier} className="flex items-center gap-2 text-xs">
            <div
              className={`w-4 h-4 rounded-full ${TIER_COLORS[tier as keyof typeof TIER_COLORS]} border border-stone-600`}
            />
            <span className="text-stone-300">{TIER_NAMES[tier as keyof typeof TIER_NAMES]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
