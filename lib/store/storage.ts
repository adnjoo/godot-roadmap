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
