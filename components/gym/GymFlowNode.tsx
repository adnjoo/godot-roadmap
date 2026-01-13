"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { type GymNode } from "@/data/godotGym";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface GymFlowNodeData {
  node: GymNode;
  isCompleted: boolean;
  isUnlocked: boolean;
  isSelected: boolean;
  isFiltered: boolean;
  onNodeClick: (nodeId: string) => void;
}

const TIER_COLORS = {
  1: {
    border: "border-green-500",
    bg: "bg-green-500/20",
    text: "text-green-400",
    badge: "bg-green-500/20 text-green-400 border-green-500",
  },
  2: {
    border: "border-blue-500",
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500",
  },
  3: {
    border: "border-purple-500",
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    badge: "bg-purple-500/20 text-purple-400 border-purple-500",
  },
  4: {
    border: "border-yellow-500",
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
  },
  5: {
    border: "border-red-500",
    bg: "bg-red-500/20",
    text: "text-red-400",
    badge: "bg-red-500/20 text-red-400 border-red-500",
  },
};

function GymFlowNodeComponent({ data }: NodeProps<GymFlowNodeData>) {
  const { node, isCompleted, isUnlocked, isSelected, isFiltered, onNodeClick } = data;
  const colors = TIER_COLORS[node.tier];

  return (
    <div
      className={cn(
        "rounded-lg border-2 px-3 py-2 min-w-[180px] max-w-[220px] transition-all cursor-pointer",
        "bg-stone-800/90 backdrop-blur-sm",
        colors.border,
        isUnlocked
          ? isCompleted
            ? cn(colors.bg, "opacity-100")
            : "opacity-100 hover:scale-105"
          : "opacity-30 bg-stone-900/50 border-stone-600 cursor-not-allowed",
        isSelected && "ring-2 ring-cyan-400 ring-offset-2 ring-offset-stone-900 scale-105",
        isFiltered && "opacity-20"
      )}
      onClick={() => isUnlocked && onNodeClick(node.id)}
    >
      {/* Input handle (for edges coming into this node) */}
      <Handle type="target" position={Position.Left} className="w-2 h-2" />

      {/* Tier badge */}
      <div className="flex items-center justify-between mb-1">
        <span
          className={cn(
            "text-xs font-semibold px-1.5 py-0.5 rounded border",
            colors.badge
          )}
        >
          T{node.tier}
        </span>
        {isCompleted && (
          <Check className={cn("w-4 h-4", colors.text)} />
        )}
        {!isUnlocked && (
          <Lock className="w-4 h-4 text-stone-500" />
        )}
      </div>

      {/* Title */}
      <div className="text-sm font-medium text-stone-100 line-clamp-2">
        {node.title}
      </div>

      {/* Category (small text) */}
      <div className="text-xs text-stone-400 mt-1 truncate">
        {node.category}
      </div>

      {/* Output handle (for edges going out from this node) */}
      <Handle type="source" position={Position.Right} className="w-2 h-2" />
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export const GymFlowNode = memo(GymFlowNodeComponent);
