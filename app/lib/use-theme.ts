import { useState, useEffect, useCallback } from "react";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "3plit:theme";

function getSystemDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme: Theme) {
  const isDark = theme === "dark" || (theme === "system" && getSystemDark());
  document.documentElement.classList.toggle("dark", isDark);
}

export function useTheme() {
  const [theme, setThemeRaw] = useState<Theme>("system");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial = stored || "system";
    setThemeRaw(initial);
    applyTheme(initial);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const current = (localStorage.getItem(STORAGE_KEY) as Theme | null) || "system";
      if (current === "system") applyTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeRaw(t);
    localStorage.setItem(STORAGE_KEY, t);
    applyTheme(t);
  }, []);

  return { theme, setTheme };
}
