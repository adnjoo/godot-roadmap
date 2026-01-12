"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loadProgress, saveProgress, clearProgress as clearStorage } from "./storage";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type Category = "2D" | "3D" | "UI" | "Systems" | "Tools";

export interface Filters {
  difficulty: Difficulty | "All";
  category: Category | "All";
  showOnlyRemaining: boolean;
  search: string;
}

interface RoadmapContextType {
  completedItems: Set<string>;
  completedProjects: Set<string>;
  filters: Filters;
  toggleItem: (itemId: string) => void;
  toggleProject: (projectId: string) => void;
  updateFilters: (filters: Partial<Filters>) => void;
  resetProgress: () => void;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export function RoadmapProvider({ children }: { children: React.ReactNode }) {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [completedProjects, setCompletedProjects] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<Filters>({
    difficulty: "All",
    category: "All",
    showOnlyRemaining: false,
    search: "",
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadProgress();
    if (stored) {
      setCompletedItems(new Set(stored.completedItems));
      setCompletedProjects(new Set(stored.completedProjects));
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isInitialized) return;
    saveProgress({
      completedItems: Array.from(completedItems),
      completedProjects: Array.from(completedProjects),
    });
  }, [completedItems, completedProjects, isInitialized]);

  const toggleItem = useCallback((itemId: string) => {
    setCompletedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const toggleProject = useCallback((projectId: string) => {
    setCompletedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  }, []);

  const updateFilters = useCallback((newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetProgress = useCallback(() => {
    setCompletedItems(new Set());
    setCompletedProjects(new Set());
    clearStorage();
  }, []);

  return (
    <RoadmapContext.Provider
      value={{
        completedItems,
        completedProjects,
        filters,
        toggleItem,
        toggleProject,
        updateFilters,
        resetProgress,
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
}

export function useRoadmap() {
  const context = useContext(RoadmapContext);
  if (context === undefined) {
    throw new Error("useRoadmap must be used within a RoadmapProvider");
  }
  return context;
}
