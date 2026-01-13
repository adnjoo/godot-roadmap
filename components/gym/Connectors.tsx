"use client";

import { useMemo } from "react";
import { useGym } from "@/lib/store/GymContext";
import { gymNodes, type GymNode } from "@/data/godotGym";
import { getNodesInCategory, getCurvedPath } from "@/lib/utils/radialLayout";
import { type NodePosition } from "@/lib/utils/radialLayout";
import { cn } from "@/lib/utils";

interface ConnectorsProps {
  nodePositions: NodePosition[];
  selectedNodeId: string | null;
}

const TIER_COLORS = {
  1: "stroke-green-500",
  2: "stroke-blue-500",
  3: "stroke-purple-500",
  4: "stroke-yellow-500",
  5: "stroke-red-500",
};

export function Connectors({ nodePositions, selectedNodeId }: ConnectorsProps) {
  const { isNodeUnlocked, isNodeCompleted } = useGym();

  // Build position map for quick lookup
  const positionMap = useMemo(() => {
    const map = new Map<string, NodePosition>();
    nodePositions.forEach((pos) => {
      map.set(pos.node.id, pos);
    });
    return map;
  }, [nodePositions]);

  // Calculate all connector paths
  const connectors = useMemo(() => {
    const paths: Array<{
      path: string;
      fromId: string;
      toId: string;
      isDimmed: boolean;
      isHighlighted: boolean;
      tier: number;
    }> = [];

    // Prerequisite connections
    gymNodes.forEach((node) => {
      node.prereqIds.forEach((prereqId) => {
        const fromPos = positionMap.get(prereqId);
        const toPos = positionMap.get(node.id);
        if (fromPos && toPos) {
          const fromUnlocked = isNodeUnlocked(prereqId);
          const toUnlocked = isNodeUnlocked(node.id);
          const isDimmed = !fromUnlocked || !toUnlocked;
          const isHighlighted =
            selectedNodeId === node.id || selectedNodeId === prereqId;

          paths.push({
            path: getCurvedPath(fromPos.x, fromPos.y, toPos.x, toPos.y),
            fromId: prereqId,
            toId: node.id,
            isDimmed,
            isHighlighted,
            tier: node.tier,
          });
        }
      });
    });

    // Intra-cluster connections (nodes in same category and tier)
    gymNodes.forEach((node) => {
      const clusterNodes = getNodesInCategory(node.category, node.tier);
      clusterNodes.forEach((otherNode) => {
        if (otherNode.id === node.id) return;

        const fromPos = positionMap.get(node.id);
        const toPos = positionMap.get(otherNode.id);
        if (fromPos && toPos) {
          // Only connect if both are unlocked
          const fromUnlocked = isNodeUnlocked(node.id);
          const toUnlocked = isNodeUnlocked(otherNode.id);
          if (!fromUnlocked || !toUnlocked) return;

          // Avoid duplicate connections
          const exists = paths.some(
            (p) =>
              (p.fromId === node.id && p.toId === otherNode.id) ||
              (p.fromId === otherNode.id && p.toId === node.id)
          );
          if (exists) return;

          const isHighlighted =
            selectedNodeId === node.id || selectedNodeId === otherNode.id;

          paths.push({
            path: getCurvedPath(fromPos.x, fromPos.y, toPos.x, toPos.y),
            fromId: node.id,
            toId: otherNode.id,
            isDimmed: false,
            isHighlighted,
            tier: node.tier,
          });
        }
      });
    });

    return paths;
  }, [positionMap, isNodeUnlocked, selectedNodeId]);

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-0"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
      preserveAspectRatio="none"
    >
      {connectors.map((connector, idx) => (
        <path
          key={`${connector.fromId}-${connector.toId}-${idx}`}
          d={connector.path}
          fill="none"
          strokeWidth={connector.isHighlighted ? 2 : 1}
          className={cn(
            TIER_COLORS[connector.tier as keyof typeof TIER_COLORS],
            connector.isDimmed
              ? "opacity-40"
              : connector.isHighlighted
              ? "opacity-100"
              : "opacity-50"
          )}
        />
      ))}
    </svg>
  );
}
