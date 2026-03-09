import { useState, useCallback } from "react";
import type { Route } from "./+types/home";
import { Sidebar } from "~/components/sidebar/sidebar";
import { PanelContainer } from "~/components/panels/panel-container";
import { DndProvider } from "~/components/dnd/dnd-provider";
import type { TreeNode, PanelState } from "~/lib/types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Markdown Viewer" },
    { name: "description", content: "Local markdown file viewer with split panels" },
  ];
}

const DEFAULT_PANELS: PanelState[] = [
  { id: "panel-1", filePath: null, fileName: null },
  { id: "panel-2", filePath: null, fileName: null },
  { id: "panel-3", filePath: null, fileName: null },
];

export default function Home() {
  const [fileTree, setFileTree] = useState<TreeNode[] | null>(null);
  const [basePath, setBasePath] = useState("");
  const [panels, setPanels] = useState<PanelState[]>(DEFAULT_PANELS);
  const [panelCount, setPanelCount] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleTreeLoaded = useCallback((tree: TreeNode[], path: string) => {
    setFileTree(tree.length > 0 ? tree : null);
    setBasePath(path);
  }, []);

  const openFileInPanel = useCallback(
    (panelId: string, filePath: string, fileName: string) => {
      setPanels((prev) =>
        prev.map((p) => (p.id === panelId ? { ...p, filePath, fileName } : p))
      );
    },
    []
  );

  const handleFileClick = useCallback(
    (filePath: string, fileName: string) => {
      const visiblePanels = panels.slice(0, panelCount);

      // Find first empty panel
      const emptyPanel = visiblePanels.find((p) => !p.filePath);
      if (emptyPanel) {
        openFileInPanel(emptyPanel.id, filePath, fileName);
        return;
      }

      // If we can add a panel, do it
      if (panelCount < 3) {
        const newCount = panelCount + 1;
        setPanelCount(newCount);
        openFileInPanel(panels[newCount - 1].id, filePath, fileName);
        return;
      }

      // All panels full — replace the first one
      openFileInPanel(visiblePanels[0].id, filePath, fileName);
    },
    [panels, panelCount, openFileInPanel]
  );

  const handleCloseFile = useCallback((panelId: string) => {
    setPanels((prev) =>
      prev.map((p) =>
        p.id === panelId ? { ...p, filePath: null, fileName: null } : p
      )
    );
  }, []);

  const handleFileDropped = useCallback(
    (panelId: string, filePath: string, fileName: string) => {
      openFileInPanel(panelId, filePath, fileName);
    },
    [openFileInPanel]
  );

  return (
    <DndProvider onFileDropped={handleFileDropped}>
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar
          fileTree={fileTree}
          onTreeLoaded={handleTreeLoaded}
          onFileClick={handleFileClick}
          error={error}
          onError={setError}
        />
        <PanelContainer
          panels={panels}
          basePath={basePath}
          onCloseFile={handleCloseFile}
          panelCount={panelCount}
          onPanelCountChange={setPanelCount}
        />
      </div>
    </DndProvider>
  );
}
