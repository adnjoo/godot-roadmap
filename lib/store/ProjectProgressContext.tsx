"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loadProjectProgress, saveProjectProgress } from "./storage";

interface ProjectProgressContextType {
  completedChecklistItems: Record<string, Set<number>>;
  toggleChecklistItem: (projectId: string, index: number) => void;
  isChecklistItemCompleted: (projectId: string, index: number) => boolean;
  isProjectCompleted: (projectId: string, checklistLength: number) => boolean;
  markProjectComplete: (projectId: string, checklistLength: number) => void;
}

const ProjectProgressContext = createContext<ProjectProgressContextType | undefined>(undefined);

export function ProjectProgressProvider({ children }: { children: React.ReactNode }) {
  const [completedChecklistItems, setCompletedChecklistItems] = useState<Record<string, Set<number>>>(
    {}
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadProjectProgress();
    if (stored) {
      const loaded: Record<string, Set<number>> = {};
      for (const [projectId, indices] of Object.entries(stored.completedChecklistItems)) {
        loaded[projectId] = new Set(indices);
      }
      setCompletedChecklistItems(loaded);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isInitialized) return;
    const serialized: Record<string, number[]> = {};
    for (const [projectId, indices] of Object.entries(completedChecklistItems)) {
      serialized[projectId] = Array.from(indices);
    }
    saveProjectProgress({ completedChecklistItems: serialized });
  }, [completedChecklistItems, isInitialized]);

  const toggleChecklistItem = useCallback((projectId: string, index: number) => {
    setCompletedChecklistItems((prev) => {
      const next = { ...prev };
      if (!next[projectId]) {
        next[projectId] = new Set<number>();
      }
      const projectSet = new Set(next[projectId]);
      if (projectSet.has(index)) {
        projectSet.delete(index);
      } else {
        projectSet.add(index);
      }
      next[projectId] = projectSet;
      return next;
    });
  }, []);

  const isChecklistItemCompleted = useCallback(
    (projectId: string, index: number): boolean => {
      return completedChecklistItems[projectId]?.has(index) ?? false;
    },
    [completedChecklistItems]
  );

  const isProjectCompleted = useCallback(
    (projectId: string, checklistLength: number): boolean => {
      const completed = completedChecklistItems[projectId];
      if (!completed || completed.size === 0) return false;
      return completed.size === checklistLength;
    },
    [completedChecklistItems]
  );

  const markProjectComplete = useCallback(
    (projectId: string, checklistLength: number) => {
      setCompletedChecklistItems((prev) => {
        const next = { ...prev };
        const allIndices = new Set<number>();
        for (let i = 0; i < checklistLength; i++) {
          allIndices.add(i);
        }
        next[projectId] = allIndices;
        return next;
      });
    },
    []
  );

  return (
    <ProjectProgressContext.Provider
      value={{
        completedChecklistItems,
        toggleChecklistItem,
        isChecklistItemCompleted,
        isProjectCompleted,
        markProjectComplete,
      }}
    >
      {children}
    </ProjectProgressContext.Provider>
  );
}

export function useProjectProgress() {
  const context = useContext(ProjectProgressContext);
  if (context === undefined) {
    throw new Error("useProjectProgress must be used within a ProjectProgressProvider");
  }
  return context;
}
