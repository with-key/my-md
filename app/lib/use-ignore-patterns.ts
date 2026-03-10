import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "3plit:ignore-patterns";

function loadPatterns(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

export function useIgnorePatterns() {
  const [patterns, setPatternsRaw] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setPatternsRaw(loadPatterns());
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patterns));
    } catch {
      // ignore
    }
  }, [patterns, initialized]);

  const setPatterns = useCallback((value: string[]) => {
    setPatternsRaw(value);
  }, []);

  return { patterns, setPatterns, initialized };
}
