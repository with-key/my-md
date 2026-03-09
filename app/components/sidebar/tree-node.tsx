import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { TreeNode as TreeNodeType } from "~/lib/types";
import { cn } from "~/lib/utils";

interface TreeNodeProps {
  node: TreeNodeType;
  depth: number;
  onFileClick: (filePath: string, fileName: string) => void;
}

export function TreeNode({ node, depth, onFileClick }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: node.path,
    data: { filePath: node.path, fileName: node.name },
    disabled: node.type === "directory",
  });

  if (node.type === "directory") {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-sm transition-colors"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <svg
            className={cn(
              "w-3.5 h-3.5 mr-1.5 text-gray-400 transition-transform shrink-0",
              expanded && "rotate-90"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <svg
            className="w-4 h-4 mr-1.5 text-yellow-500 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300 truncate">{node.name}</span>
        </button>
        {expanded && node.children && (
          <div>
            {node.children.map((child) => (
              <TreeNode
                key={child.path}
                node={child}
                depth={depth + 1}
                onFileClick={onFileClick}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onFileClick(node.path, node.name)}
      className={cn(
        "flex items-center w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-sm transition-colors cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50"
      )}
      style={{ paddingLeft: `${depth * 12 + 8}px` }}
    >
      <svg
        className="w-4 h-4 mr-1.5 text-blue-400 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
      <span className="text-gray-700 dark:text-gray-300 truncate">{node.name}</span>
    </button>
  );
}
