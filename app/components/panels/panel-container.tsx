import { useState, useEffect, lazy, Suspense } from "react";
import { Panel } from "./panel";
import type { PanelState } from "~/lib/types";

interface PanelContainerProps {
  panels: PanelState[];
  basePath: string;
  onCloseFile: (panelId: string) => void;
  onFileClick: (filePath: string, fileName: string) => void;
  panelCount: number;
  onPanelCountChange: (count: number) => void;
}

interface AllotmentWrapperProps {
  panels: PanelState[];
  basePath: string;
  onCloseFile: (panelId: string) => void;
  onFileClick: (filePath: string, fileName: string) => void;
}

const AllotmentWrapper = lazy(() =>
  import("allotment").then((mod) => ({
    default: function AllotmentPanels({
      panels,
      basePath,
      onCloseFile,
      onFileClick,
    }: AllotmentWrapperProps) {
      return (
        <mod.Allotment>
          {panels.map((panel) => (
            <mod.Allotment.Pane key={panel.id} minSize={200}>
              <Panel
                panel={panel}
                basePath={basePath}
                onClose={() => onCloseFile(panel.id)}
                onFileClick={onFileClick}
              />
            </mod.Allotment.Pane>
          ))}
        </mod.Allotment>
      );
    },
  }))
);

export function PanelContainer({
  panels,
  basePath,
  onCloseFile,
  onFileClick,
  panelCount,
  onPanelCountChange,
}: PanelContainerProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const visiblePanels = panels.slice(0, panelCount);

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <span className="text-xs text-gray-500 dark:text-gray-400">Panels</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => onPanelCountChange(n)}
              className={`px-2 py-0.5 text-xs rounded transition-colors ${
                panelCount === n
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        {isClient ? (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full text-gray-400">
                Loading panels...
              </div>
            }
          >
            <AllotmentWrapper
              panels={visiblePanels}
              basePath={basePath}
              onCloseFile={onCloseFile}
              onFileClick={onFileClick}
            />
          </Suspense>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Loading panels...
          </div>
        )}
      </div>
    </div>
  );
}
