import { useState, type FormEvent, type KeyboardEvent } from "react";

interface IgnorePatternsProps {
  patterns: string[];
  onChange: (patterns: string[]) => void;
}

export function IgnorePatterns({ patterns, onChange }: IgnorePatternsProps) {
  const [value, setValue] = useState("");
  const [expanded, setExpanded] = useState(false);

  function addPattern(e?: FormEvent) {
    e?.preventDefault();
    const trimmed = value.trim();
    if (trimmed && !patterns.includes(trimmed)) {
      onChange([...patterns, trimmed]);
    }
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      addPattern();
    }
  }

  function removePattern(pattern: string) {
    onChange(patterns.filter((p) => p !== pattern));
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center w-full px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <svg
          className={`w-3 h-3 mr-1.5 transition-transform ${expanded ? "rotate-90" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        Ignore Patterns
        {patterns.length > 0 && (
          <span className="ml-1.5 px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-[10px]">
            {patterns.length}
          </span>
        )}
      </button>
      {expanded && (
        <div className="px-3 pb-2.5 space-y-2">
          <div className="flex gap-1.5">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="node_modules, .git, dist"
              className="flex-1 min-w-0 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 text-xs text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => addPattern()}
              disabled={!value.trim()}
              className="rounded-md bg-gray-200 dark:bg-gray-700 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>
          {patterns.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {patterns.map((pattern) => (
                <span
                  key={pattern}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs font-mono"
                >
                  {pattern}
                  <button
                    onClick={() => removePattern(pattern)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-[10px] text-gray-400 dark:text-gray-600">
            Glob patterns to exclude directories (e.g. node_modules, .*, build*)
          </p>
        </div>
      )}
    </div>
  );
}
