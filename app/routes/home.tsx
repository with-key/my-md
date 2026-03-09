import { useState, useCallback, useEffect, useRef } from "react";
import type { Route } from "./+types/home";
import { Sidebar } from "~/components/sidebar/sidebar";
import { PanelContainer } from "~/components/panels/panel-container";
import { DndProvider } from "~/components/dnd/dnd-provider";
import { usePersistedPanels } from "~/lib/use-persisted-panels";
import type { TreeNode } from "~/lib/types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Markdown Viewer" },
    { name: "description", content: "Local markdown file viewer with split panels" },
  ];
}

export default function Home() {
  const [fileTree, setFileTree] = useState<TreeNode[] | null>(null);
  const { panels, setPanels, panelCount, setPanelCount, basePath, setBasePath, initialized } = usePersistedPanels();
  const [error, setError] = useState<string | null>(null);
  const restoredRef = useRef(false);

  // Restore file tree from persisted basePath on mount
  useEffect(() => {
    if (!initialized || restoredRef.current || !basePath) return;
    restoredRef.current = true;
    fetch(`/api/file-tree?path=${encodeURIComponent(basePath)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setFileTree(data.tree.length > 0 ? data.tree : null);
        }
      })
      .catch(() => {});
  }, [initialized, basePath]);

  const handleTreeLoaded = useCallback((tree: TreeNode[], path: string) => {
    setFileTree(tree.length > 0 ? tree : null);
    setBasePath(path);
  }, [setBasePath]);

  const openFileInPanel = useCallback(
    (panelId: string, filePath: string, fileName: string) => {
      setPanels((prev) =>
        prev.map((p) => (p.id === panelId ? { ...p, filePath, fileName } : p))
      );
    },
    [setPanels]
  );

  const handleFileClick = useCallback(
    (filePath: string, fileName: string) => {
      const visiblePanels = panels.slice(0, panelCount);

      const emptyPanel = visiblePanels.find((p) => !p.filePath);
      if (emptyPanel) {
        openFileInPanel(emptyPanel.id, filePath, fileName);
        return;
      }

      if (panelCount < 3) {
        const newCount = panelCount + 1;
        setPanelCount(newCount);
        openFileInPanel(panels[newCount - 1].id, filePath, fileName);
        return;
      }

      openFileInPanel(visiblePanels[0].id, filePath, fileName);
    },
    [panels, panelCount, openFileInPanel, setPanelCount]
  );

  const handleCloseFile = useCallback((panelId: string) => {
    setPanels((prev) =>
      prev.map((p) =>
        p.id === panelId ? { ...p, filePath: null, fileName: null } : p
      )
    );
  }, [setPanels]);

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
