import { useState, type ReactNode } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { DragOverlayContent } from "./drag-overlay-content";
import type { PanelState } from "~/lib/types";

interface DndProviderProps {
  children: ReactNode;
  onFileDropped: (panelId: string, filePath: string, fileName: string) => void;
}

export function DndProvider({ children, onFileDropped }: DndProviderProps) {
  const [activeFile, setActiveFile] = useState<{
    filePath: string;
    fileName: string;
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { filePath, fileName } = event.active.data.current as {
      filePath: string;
      fileName: string;
    };
    setActiveFile({ filePath, fileName });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveFile(null);

    if (!over) return;

    const { filePath, fileName } = active.data.current as {
      filePath: string;
      fileName: string;
    };

    onFileDropped(over.id as string, filePath, fileName);
  }

  function handleDragCancel() {
    setActiveFile(null);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {activeFile && <DragOverlayContent fileName={activeFile.fileName} />}
      </DragOverlay>
    </DndContext>
  );
}
