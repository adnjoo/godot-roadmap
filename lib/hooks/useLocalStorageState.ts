"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Reusable hook for managing state in localStorage with TypeScript generics.
 * Handles SSR safety, error handling, and automatic persistence.
 */
export function useLocalStorageState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") {
      setIsInitialized(true);
      return;
    }

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored) as T;
        setState(parsed);
      }
      setHasLoaded(true);
    } catch (error) {
      console.error(`Failed to load ${key} from localStorage:`, error);
      // Reset to initial value on error
      setState(initialValue);
      setHasLoaded(true);
    } finally {
      setIsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Save to localStorage whenever state changes (but only after initial load)
  useEffect(() => {
    if (!isInitialized || !hasLoaded || typeof window === "undefined") return;

    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error);
    }
  }, [state, key, isInitialized, hasLoaded]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setState((prev) => {
      return typeof value === "function" ? (value as (prev: T) => T)(prev) : value;
    });
  }, []);

  return [state, setValue];
}
