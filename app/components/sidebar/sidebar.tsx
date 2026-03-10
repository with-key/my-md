import { useState, useCallback } from "react";
import { DirectoryInput } from "./directory-input";
import { FileTree } from "./file-tree";
import { RecentPaths } from "./recent-paths";
import { IgnorePatterns } from "./ignore-patterns";
import { ThemeToggle } from "~/components/theme-toggle";
import { useRecentPaths } from "~/lib/use-recent-paths";
import type { TreeNode } from "~/lib/types";
import type { Theme } from "~/lib/use-theme";

interface SidebarProps {
  fileTree: TreeNode[] | null;
  onTreeLoaded: (tree: TreeNode[], basePath: string) => void;
  onFileClick: (filePath: string, fileName: string) => void;
  error: string | null;
  onError: (error: string | null) => void;
  ignorePatterns: string[];
  onIgnorePatternsChange: (patterns: string[]) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function Sidebar({ fileTree, onTreeLoaded, onFileClick, error, onError, ignorePatterns, onIgnorePatternsChange, theme, onThemeChange }: SidebarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { paths: recentPaths, addPath, removePath } = useRecentPaths();

  const loadDirectory = useCallback(
    async (path: string) => {
      setIsLoading(true);
      onError(null);
      try {
        const params = new URLSearchParams({ path });
        if (ignorePatterns.length > 0) {
          params.set("ignore", ignorePatterns.join(","));
        }
        const res = await fetch(`/api/file-tree?${params}`);
        const data = await res.json();
        if (data.error) {
          onError(data.error);
          onTreeLoaded([], "");
        } else {
          onTreeLoaded(data.tree, data.basePath);
          addPath(data.basePath);
        }
      } catch {
        onError("Failed to connect to server.");
        onTreeLoaded([], "");
      } finally {
        setIsLoading(false);
      }
    },
    [onTreeLoaded, onError, addPath, ignorePatterns]
  );

  return (
    <aside className="w-72 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          3plit
        </h1>
        <ThemeToggle theme={theme} onChange={onThemeChange} />
      </div>
      <DirectoryInput onSubmit={loadDirectory} isLoading={isLoading} />
      <IgnorePatterns patterns={ignorePatterns} onChange={onIgnorePatternsChange} />
      <RecentPaths paths={recentPaths} onSelect={loadDirectory} onRemove={removePath} />
      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="p-3 m-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-md">
            {error}
          </div>
        )}
        {fileTree && <FileTree tree={fileTree} onFileClick={onFileClick} />}
        {!fileTree && !error && !recentPaths.length && (
          <div className="p-4 text-sm text-gray-400 dark:text-gray-600 text-center">
            Enter a directory path to browse markdown files.
          </div>
        )}
      </div>
    </aside>
  );
}
