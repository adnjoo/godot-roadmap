import { Jam } from "@/types/jam-log";

const STORAGE_KEY = "godotRoadmap.jamLog.v1";

export function saveJamLog(jams: Jam[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jams));
  } catch (error) {
    console.error("Failed to save jam log:", error);
  }
}

export function loadJamLog(): Jam[] | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    // Validate that it's an array
    if (!Array.isArray(parsed)) {
      console.error("Invalid jam log data format, resetting to empty array");
      return [];
    }
    return parsed as Jam[];
  } catch (error) {
    console.error("Failed to load jam log:", error);
    return null;
  }
}
