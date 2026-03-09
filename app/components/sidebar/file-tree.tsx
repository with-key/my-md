import type { TreeNode as TreeNodeType } from "~/lib/types";
import { TreeNode } from "./tree-node";

interface FileTreeProps {
  tree: TreeNodeType[];
  onFileClick: (filePath: string, fileName: string) => void;
}

export function FileTree({ tree, onFileClick }: FileTreeProps) {
  if (tree.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">
        No markdown files found in this directory.
      </div>
    );
  }

  return (
    <div className="py-1">
      {tree.map((node) => (
        <TreeNode key={node.path} node={node} depth={0} onFileClick={onFileClick} />
      ))}
    </div>
  );
}
