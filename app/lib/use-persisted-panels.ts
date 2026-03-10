import { useState, useCallback, useEffect } from "react";
import type { PanelState } from "~/lib/types";

const STORAGE_KEY = "3plit:panel-state";

interface PersistedState {
  panels: PanelState[];
  panelCount: number;
  basePath: string;
}

const DEFAULT_PANELS: PanelState[] = [
  { id: "panel-1", filePath: null, fileName: null },
  { id: "panel-2", filePath: null, fileName: null },
  { id: "panel-3", filePath: null, fileName: null },
];

function loadState(): PersistedState {
  if (typeof window === "undefined") {
    return { panels: DEFAULT_PANELS, panelCount: 1, basePath: "" };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as PersistedState;
      if (Array.isArray(parsed.panels) && parsed.panels.length === 3) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return { panels: DEFAULT_PANELS, panelCount: 1, basePath: "" };
}

function saveState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function usePersistedPanels() {
  const [initialized, setInitialized] = useState(false);
  const [panels, setPanelsRaw] = useState<PanelState[]>(DEFAULT_PANELS);
  const [panelCount, setPanelCountRaw] = useState(1);
  const [basePath, setBasePathRaw] = useState("");

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    const saved = loadState();
    setPanelsRaw(saved.panels);
    setPanelCountRaw(saved.panelCount);
    setBasePathRaw(saved.basePath);
    setInitialized(true);
  }, []);

  // Persist whenever state changes (skip initial render)
  useEffect(() => {
    if (!initialized) return;
    saveState({ panels, panelCount, basePath });
  }, [panels, panelCount, basePath, initialized]);

  const setPanels = useCallback((updater: PanelState[] | ((prev: PanelState[]) => PanelState[])) => {
    setPanelsRaw(updater);
  }, []);

  const setPanelCount = useCallback((value: number | ((prev: number) => number)) => {
    setPanelCountRaw(value);
  }, []);

  const setBasePath = useCallback((value: string) => {
    setBasePathRaw(value);
  }, []);

  return {
    panels,
    setPanels,
    panelCount,
    setPanelCount,
    basePath,
    setBasePath,
    initialized,
  };
}
