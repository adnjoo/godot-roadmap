const STORAGE_KEY = "godotRoadmap_v1";

export interface StoredProgress {
  completedItems: string[];
  completedProjects: string[];
}

export function saveProgress(data: StoredProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save progress:", error);
  }
}

export function loadProgress(): StoredProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as StoredProgress;
  } catch (error) {
    console.error("Failed to load progress:", error);
    return null;
  }
}

export function clearProgress(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear progress:", error);
  }
}

const PROJECT_PROGRESS_STORAGE_KEY = "godot-roadmap:project-progress:v1";

export interface ProjectProgressStorage {
  completedChecklistItems: Record<string, number[]>;
}

export function saveProjectProgress(data: ProjectProgressStorage): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROJECT_PROGRESS_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save project progress:", error);
  }
}

export function loadProjectProgress(): ProjectProgressStorage | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(PROJECT_PROGRESS_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as ProjectProgressStorage;
  } catch (error) {
    console.error("Failed to load project progress:", error);
    return null;
  }
}

const GYM_PROGRESS_STORAGE_KEY = "godot-roadmap:gym-progress:v1";

export interface GymProgressStorage {
  completedNodes: string[];
}

export function saveGymProgress(data: GymProgressStorage): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GYM_PROGRESS_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save practice garden progress:", error);
  }
}

export function loadGymProgress(): GymProgressStorage | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(GYM_PROGRESS_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as GymProgressStorage;
  } catch (error) {
    console.error("Failed to load practice garden progress:", error);
    return null;
  }
}
