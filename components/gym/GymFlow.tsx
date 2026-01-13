"use client";

import { useMemo, useCallback } from "react";
import ReactFlow, {
  type Node,
  type Edge,
  Controls,
  Background,
  useReactFlow,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { gymNodes, type GymNode } from "@/data/godotGym";
import { useGym } from "@/lib/store/GymContext";
import { GymFlowNode } from "./GymFlowNode";
import { computeLayoutPositions, computeEdges, computeHighlightedPrereqChain } from "@/lib/utils/gymLayout";
import { type GymFilters } from "./GymFilters";
import { cn } from "@/lib/utils";

interface GymFlowProps {
  filters: GymFilters;
  searchQuery: string;
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string | null) => void;
  isMobile: boolean;
}

const nodeTypes = {
  gymNode: GymFlowNode,
};

function FitViewButton({ isMobile, onFitView }: { isMobile: boolean; onFitView: () => void }) {
  if (!isMobile) return null;

  return (
    <Panel position="bottom-left">
      <button
        onClick={onFitView}
        className="bg-stone-800/90 backdrop-blur-sm border border-stone-700 rounded-lg px-4 py-2 text-sm text-stone-200 hover:bg-stone-700 transition-colors"
      >
        Fit View
      </button>
    </Panel>
  );
}

export function GymFlow({
  filters,
  searchQuery,
  selectedNodeId,
  onNodeSelect,
  isMobile,
}: GymFlowProps) {
  const { isNodeCompleted, isNodeUnlocked } = useGym();

  // Compute layout positions once
  const positions = useMemo(() => computeLayoutPositions(gymNodes), []);

  // Compute all edges once
  const allEdges = useMemo(() => computeEdges(gymNodes), []);

  // Compute highlighted prereq chain
  const highlightedEdgeIds = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    return computeHighlightedPrereqChain(selectedNodeId, allEdges);
  }, [selectedNodeId, allEdges]);

  // Check if node matches filters
  const isNodeFiltered = useCallback(
    (node: GymNode) => {
      const completed = isNodeCompleted(node.id);

      // Tier filter
      if (filters.tiers.size > 0 && !filters.tiers.has(node.tier)) {
        return true;
      }

      // Category filter
      if (filters.category && node.category !== filters.category) {
        return true;
      }

      // Show completed only
      if (filters.showCompletedOnly && !completed) {
        return true;
      }

      return false;
    },
    [filters, isNodeCompleted]
  );

  // Check if node matches search
  const isNodeSearchMatch = useCallback(
    (node: GymNode) => {
      if (!searchQuery.trim()) return true;
      return node.title.toLowerCase().includes(searchQuery.toLowerCase());
    },
    [searchQuery]
  );

  // Create React Flow nodes
  const nodes = useMemo<Node[]>(() => {
    return gymNodes.map((node) => {
      const position = positions.get(node.id) || { x: 0, y: 0 };
      const isFiltered = isNodeFiltered(node);
      const isSearchMatch = isNodeSearchMatch(node);
      const isCompleted = isNodeCompleted(node.id);
      const isUnlocked = isNodeUnlocked(node.id);
      const isSelected = selectedNodeId === node.id;

      // Determine opacity based on filters and search
      let opacity = 1;
      if (isFiltered || !isSearchMatch) {
        opacity = 0.2;
      } else if (!isUnlocked) {
        opacity = 0.3;
      }

      return {
        id: node.id,
        type: "gymNode",
        position,
        data: {
          node,
          isCompleted,
          isUnlocked,
          isSelected,
          isFiltered: isFiltered || !isSearchMatch,
          onNodeClick: onNodeSelect,
        },
        style: {
          opacity,
        },
      };
    });
  }, [
    positions,
    isNodeFiltered,
    isNodeSearchMatch,
    isNodeCompleted,
    isNodeUnlocked,
    selectedNodeId,
    onNodeSelect,
  ]);

  // Create React Flow edges with conditional styling
  const edges = useMemo<Edge[]>(() => {
    return allEdges.map((edge) => {
      const sourceNode = gymNodes.find((n) => n.id === edge.source);
      const targetNode = gymNodes.find((n) => n.id === edge.target);

      if (!sourceNode || !targetNode) return edge;

      const sourceUnlocked = isNodeUnlocked(edge.source);
      const targetUnlocked = isNodeUnlocked(edge.target);
      const sourceFiltered = isNodeFiltered(sourceNode);
      const targetFiltered = isNodeFiltered(targetNode);
      const sourceSearchMatch = isNodeSearchMatch(sourceNode);
      const targetSearchMatch = isNodeSearchMatch(targetNode);

      const isHighlighted = highlightedEdgeIds.has(edge.id);
      const isDimmed = sourceFiltered || targetFiltered || !sourceSearchMatch || !targetSearchMatch;

      // Determine edge style
      let stroke = "#6b7280"; // Default gray
      let strokeWidth = 1;
      let opacity = 0.4;

      if (isHighlighted) {
        stroke = "#22d3ee"; // Cyan for highlighted
        strokeWidth = 2.5;
        opacity = 1;
      } else if (sourceUnlocked && targetUnlocked && !isDimmed) {
        // Use tier color of target node
        const tierColors: Record<number, string> = {
          1: "#22c55e", // green
          2: "#3b82f6", // blue
          3: "#a855f7", // purple
          4: "#eab308", // yellow
          5: "#ef4444", // red
        };
        stroke = tierColors[targetNode.tier] || "#6b7280";
        strokeWidth = 1.5;
        opacity = 0.6;
      } else if (isDimmed) {
        opacity = 0.1;
      } else {
        opacity = 0.3;
      }

      return {
        ...edge,
        style: {
          stroke,
          strokeWidth,
          opacity,
        },
        animated: isHighlighted,
      };
    });
  }, [
    allEdges,
    isNodeUnlocked,
    isNodeFiltered,
    isNodeSearchMatch,
    highlightedEdgeIds,
  ]);

  // Handle node click
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (selectedNodeId === node.id) {
        onNodeSelect(null);
      } else {
        onNodeSelect(node.id);
      }
    },
    [selectedNodeId, onNodeSelect]
  );

  return (
    <div className="w-full h-full bg-stone-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onPaneClick={() => onNodeSelect(null)}
        fitView
        minZoom={0.1}
        maxZoom={2}
        panOnDrag
        zoomOnScroll
        zoomOnPinch
        defaultEdgeOptions={{
          type: "smoothstep",
        }}
      >
        <Background color="#374151" gap={16} />
        <Controls className="bg-stone-800/90 border-stone-700" />
        <FitViewButtonInner isMobile={isMobile} />
      </ReactFlow>
    </div>
  );
}

function FitViewButtonInner({ isMobile }: { isMobile: boolean }) {
  const { fitView } = useReactFlow();

  if (!isMobile) return null;

  return (
    <Panel position="bottom-left">
      <button
        onClick={() => fitView({ duration: 400, padding: 0.2 })}
        className="bg-stone-800/90 backdrop-blur-sm border border-stone-700 rounded-lg px-4 py-2 text-sm text-stone-200 hover:bg-stone-700 transition-colors"
      >
        Fit View
      </button>
    </Panel>
  );
}
