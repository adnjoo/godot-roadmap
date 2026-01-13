"use client";

import { useGym } from "@/lib/store/GymContext";
import { type GymNode } from "@/data/godotGym";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillNodeProps {
  node: GymNode;
  x: number;
  y: number;
  isSelected: boolean;
  isFiltered: boolean;
  onClick: () => void;
}

const TIER_COLORS = {
  1: {
    border: "border-green-500",
    bg: "bg-green-500/20",
  },
  2: {
    border: "border-blue-500",
    bg: "bg-blue-500/20",
  },
  3: {
    border: "border-purple-500",
    bg: "bg-purple-500/20",
  },
  4: {
    border: "border-yellow-500",
    bg: "bg-yellow-500/20",
  },
  5: {
    border: "border-red-500",
    bg: "bg-red-500/20",
  },
};

export function SkillNode({ node, x, y, isSelected, isFiltered, onClick }: SkillNodeProps) {
  const { isNodeCompleted, isNodeUnlocked } = useGym();
  const completed = isNodeCompleted(node.id);
  const unlocked = isNodeUnlocked(node.id);
  const colors = TIER_COLORS[node.tier];

  return (
    <button
      type="button"
      className={cn(
        "absolute w-12 h-12 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400",
        "transform -translate-x-1/2 -translate-y-1/2",
        colors.border,
        unlocked
          ? completed
            ? cn(colors.bg, "opacity-100")
            : cn("bg-stone-800/50", "hover:scale-105")
          : "opacity-30 bg-stone-900/50 border-stone-600 cursor-not-allowed",
        isSelected && "ring-2 ring-cyan-400 scale-110",
        !isFiltered && "opacity-20"
      )}
      style={{ left: x, top: y }}
      onClick={onClick}
      disabled={!unlocked}
      aria-label={`${node.title}, Tier ${node.tier}, ${unlocked ? (completed ? "Completed" : "Unlocked") : "Locked"}`}
      title={unlocked ? node.title : "Locked"}
    >
      {completed && (
        <Check className="w-6 h-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      )}
      {!completed && unlocked && (
        <div className="w-full h-full rounded-full bg-stone-800/30" />
      )}
    </button>
  );
}
