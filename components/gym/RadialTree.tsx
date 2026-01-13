"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { calculateRadialLayout, type NodePosition } from "@/lib/utils/radialLayout";
import { gymNodes, type GymNode } from "@/data/godotGym";
import { SkillNode } from "./SkillNode";
import { Connectors } from "./Connectors";
import { NodeDetailsPanel } from "./NodeDetailsPanel";
import { type GymFilters } from "./GymFilters";
import { useGym } from "@/lib/store/GymContext";

interface RadialTreeProps {
  filters: GymFilters;
  isMobile: boolean;
}

export function RadialTree({ filters, isMobile }: RadialTreeProps) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const { isNodeCompleted, isNodeUnlocked } = useGym();

  // Calculate layout based on container size
  const layout = useMemo(() => {
    if (containerSize.width === 0 || containerSize.height === 0) {
      return null;
    }
    return calculateRadialLayout(containerSize.width, containerSize.height, 120);
  }, [containerSize]);

  // Handle window resize
  useEffect(() => {
    const updateSize = () => {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Filter nodes based on filters
  const filteredNodePositions = useMemo(() => {
    if (!layout) return [];

    return layout.nodePositions.filter((pos) => {
      const node = pos.node;
      const completed = isNodeCompleted(node.id);

      // Tier filter
      if (filters.tiers.size > 0 && !filters.tiers.has(node.tier)) {
        return false;
      }

      // Category filter
      if (filters.category && node.category !== filters.category) {
        return false;
      }

      // Show completed only
      if (filters.showCompletedOnly && !completed) {
        return false;
      }

      return true;
    });
  }, [layout, filters, isNodeCompleted]);

  // Check if node should be dimmed by filters (but still visible)
  const isNodeFiltered = useCallback(
    (node: GymNode) => {
      // If node matches all filters, it's not filtered
      const tierMatch = filters.tiers.size === 0 || filters.tiers.has(node.tier);
      const categoryMatch = !filters.category || node.category === filters.category;
      const completedMatch = !filters.showCompletedOnly || isNodeCompleted(node.id);

      return !(tierMatch && categoryMatch && completedMatch);
    },
    [filters, isNodeCompleted]
  );

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!layout) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedNodeId(null);
        return;
      }

      if (!selectedNodeId) return;

      const currentIndex = layout.nodePositions.findIndex(
        (pos) => pos.node.id === selectedNodeId
      );
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        nextIndex = (currentIndex + 1) % layout.nodePositions.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        nextIndex = (currentIndex - 1 + layout.nodePositions.length) % layout.nodePositions.length;
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        // Already handled by click
        return;
      } else {
        return;
      }

      e.preventDefault();
      setSelectedNodeId(layout.nodePositions[nextIndex].node.id);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [layout, selectedNodeId]);

  if (!layout) {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-900">
        <div className="text-stone-400">Loading...</div>
      </div>
    );
  }

  const selectedNode = selectedNodeId
    ? gymNodes.find((n) => n.id === selectedNodeId)
    : null;

  return (
    <div className="relative w-full h-screen bg-stone-900 overflow-hidden">
      {/* Center hub */}
      <div
        className="absolute w-16 h-16 rounded-full border-2 border-cyan-500 bg-cyan-500/10 flex items-center justify-center text-stone-100 font-bold text-sm z-10"
        style={{
          left: layout.centerX - 32,
          top: layout.centerY - 32,
        }}
        aria-label="Godot Gym - Center Hub"
      >
        GYM
      </div>

      <TransformWrapper
        initialScale={isMobile ? 0.8 : 1}
        minScale={0.3}
        maxScale={2}
        centerOnInit
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent
          wrapperClass="w-full h-full"
          contentClass="w-full h-full"
        >
          <div className="relative w-full h-full">
            {/* Connector layer */}
            <Connectors
              nodePositions={layout.nodePositions}
              selectedNodeId={selectedNodeId}
            />

            {/* Node layer */}
            {layout.nodePositions.map((pos) => {
              const isFiltered = isNodeFiltered(pos.node);
              return (
                <SkillNode
                  key={pos.node.id}
                  node={pos.node}
                  x={pos.x}
                  y={pos.y}
                  isSelected={selectedNodeId === pos.node.id}
                  isFiltered={isFiltered}
                  onClick={() => handleNodeClick(pos.node.id)}
                />
              );
            })}
          </div>
        </TransformComponent>
      </TransformWrapper>

      {/* Details panel */}
      <NodeDetailsPanel
        node={selectedNode ?? null}
        isOpen={selectedNode !== null}
        onClose={handleClosePanel}
        isMobile={isMobile}
      />
    </div>
  );
}
