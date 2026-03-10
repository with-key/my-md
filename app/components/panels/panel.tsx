import { useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { PanelToolbar } from "./panel-toolbar";
import { PanelPlaceholder } from "./panel-placeholder";
import { MarkdownRenderer } from "~/components/markdown/markdown-renderer";
import type { PanelState } from "~/lib/types";
import { cn } from "~/lib/utils";

interface PanelProps {
  panel: PanelState;
  basePath: string;
  onClose: () => void;
  onFileClick: (filePath: string, fileName: string) => void;
}

export function Panel({ panel, basePath, onClose, onFileClick }: PanelProps) {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isOver, setNodeRef } = useDroppable({
    id: panel.id,
  });

  useEffect(() => {
    if (!panel.filePath || !basePath) {
      setContent(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(
      `/api/file-content?filePath=${encodeURIComponent(panel.filePath)}&basePath=${encodeURIComponent(basePath)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setError(data.error);
          setContent(null);
        } else {
          setContent(data.content);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load file");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [panel.filePath, basePath]);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col h-full bg-white dark:bg-gray-950 transition-colors",
        isOver && "ring-2 ring-inset ring-blue-400 dark:ring-blue-500 bg-blue-50/50 dark:bg-blue-950/30"
      )}
    >
      <PanelToolbar fileName={panel.fileName} filePath={panel.filePath} onClose={onClose} />
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 dark:border-gray-700 border-t-blue-500" />
          </div>
        )}
        {error && (
          <div className="p-4 text-sm text-red-600 dark:text-red-400 text-center">
            {error}
          </div>
        )}
        {!isLoading && !error && content && (
          <MarkdownRenderer
            content={content}
            currentFilePath={panel.filePath}
            onLinkClick={onFileClick}
          />
        )}
        {!isLoading && !error && !content && <PanelPlaceholder />}
      </div>
    </div>
  );
}
