"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { saveGymProgress, loadGymProgress } from "./storage";
import { gymNodes, type GymNode } from "@/data/godotGym";

interface GymContextType {
  completedNodes: Set<string>;
  toggleNode: (nodeId: string) => void;
  isNodeCompleted: (nodeId: string) => boolean;
  isNodeUnlocked: (nodeId: string) => boolean;
  getCompletedCount: () => number;
  getCompletedByTier: (tier: number) => number;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

export function GymProvider({ children }: { children: React.ReactNode }) {
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadGymProgress();
    if (stored) {
      setCompletedNodes(new Set(stored.completedNodes));
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isInitialized) return;
    saveGymProgress({
      completedNodes: Array.from(completedNodes),
    });
  }, [completedNodes, isInitialized]);

  const toggleNode = useCallback((nodeId: string) => {
    setCompletedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const isNodeCompleted = useCallback(
    (nodeId: string) => {
      return completedNodes.has(nodeId);
    },
    [completedNodes]
  );

  // Unlock logic:
  // - Center hub: always unlocked (not a node, just visual)
  // - Tier 1: all unlocked by default
  // - Tier 2: unlock when 8+ Tier 1 nodes completed
  // - Tier 3: unlock when 15+ total nodes completed
  // - Tier 4: unlock when 30+ total nodes completed
  // - Tier 5: unlock when 50+ total nodes completed
  // - Within tier: node locked if prerequisites not met
  const isNodeUnlocked = useCallback(
    (nodeId: string) => {
      const node = gymNodes.find((n) => n.id === nodeId);
      if (!node) return false;

      // Tier 1: all unlocked by default
      if (node.tier === 1) {
        // Check prerequisites within tier
        if (node.prereqIds.length === 0) return true;
        return node.prereqIds.every((prereqId) => {
          const prereq = gymNodes.find((n) => n.id === prereqId);
          if (!prereq) return false;
          // If prereq is in tier 1, it's unlocked by default, but still check if completed
          if (prereq.tier === 1) {
            return completedNodes.has(prereqId);
          }
          return completedNodes.has(prereqId);
        });
      }

      // Check tier unlock requirements
      const totalCompleted = completedNodes.size;
      const tier1Completed = Array.from(completedNodes).filter((id) => {
        const n = gymNodes.find((n) => n.id === id);
        return n?.tier === 1;
      }).length;

      if (node.tier === 2 && tier1Completed < 8) {
        return false;
      }
      if (node.tier === 3 && totalCompleted < 15) {
        return false;
      }
      if (node.tier === 4 && totalCompleted < 30) {
        return false;
      }
      if (node.tier === 5 && totalCompleted < 50) {
        return false;
      }

      // Check prerequisites
      if (node.prereqIds.length === 0) return true;
      return node.prereqIds.every((prereqId) => completedNodes.has(prereqId));
    },
    [completedNodes]
  );

  const getCompletedCount = useCallback(() => {
    return completedNodes.size;
  }, [completedNodes]);

  const getCompletedByTier = useCallback(
    (tier: number) => {
      return Array.from(completedNodes).filter((id) => {
        const node = gymNodes.find((n) => n.id === id);
        return node?.tier === tier;
      }).length;
    },
    [completedNodes]
  );

  return (
    <GymContext.Provider
      value={{
        completedNodes,
        toggleNode,
        isNodeCompleted,
        isNodeUnlocked,
        getCompletedCount,
        getCompletedByTier,
      }}
    >
      {children}
    </GymContext.Provider>
  );
}

export function useGym() {
  const context = useContext(GymContext);
  if (context === undefined) {
    throw new Error("useGym must be used within a PracticeGardenProvider");
  }
  return context;
}
