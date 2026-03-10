import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "3plit:recent-paths";
const MAX_ITEMS = 5;

export function useRecentPaths() {
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPaths(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const addPath = useCallback((path: string) => {
    setPaths((prev) => {
      const next = [path, ...prev.filter((p) => p !== path)].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removePath = useCallback((path: string) => {
    setPaths((prev) => {
      const next = prev.filter((p) => p !== path);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { paths, addPath, removePath };
}
