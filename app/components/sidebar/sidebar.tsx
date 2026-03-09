import { useState, useCallback } from "react";
import { DirectoryInput } from "./directory-input";
import { FileTree } from "./file-tree";
import type { TreeNode } from "~/lib/types";

interface SidebarProps {
  fileTree: TreeNode[] | null;
  onTreeLoaded: (tree: TreeNode[], basePath: string) => void;
  onFileClick: (filePath: string, fileName: string) => void;
  error: string | null;
  onError: (error: string | null) => void;
}

export function Sidebar({ fileTree, onTreeLoaded, onFileClick, error, onError }: SidebarProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (path: string) => {
      setIsLoading(true);
      onError(null);
      try {
        const res = await fetch(
          `/api/file-tree?path=${encodeURIComponent(path)}`
        );
        const data = await res.json();
        if (data.error) {
          onError(data.error);
          onTreeLoaded([], "");
        } else {
          onTreeLoaded(data.tree, data.basePath);
        }
      } catch {
        onError("Failed to connect to server.");
        onTreeLoaded([], "");
      } finally {
        setIsLoading(false);
      }
    },
    [onTreeLoaded, onError]
  );

  return (
    <aside className="w-72 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Markdown Viewer
        </h1>
      </div>
      <DirectoryInput onSubmit={handleSubmit} isLoading={isLoading} />
      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="p-3 m-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-md">
            {error}
          </div>
        )}
        {fileTree && <FileTree tree={fileTree} onFileClick={onFileClick} />}
        {!fileTree && !error && (
          <div className="p-4 text-sm text-gray-400 dark:text-gray-600 text-center">
            Enter a directory path to browse markdown files.
          </div>
        )}
      </div>
    </aside>
  );
}
