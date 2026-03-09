import fs from "node:fs/promises";
import path from "node:path";
import type { TreeNode } from "~/lib/types";

const MAX_DEPTH = 5;

function isMarkdownFile(name: string): boolean {
  const ext = path.extname(name).toLowerCase();
  return ext === ".md" || ext === ".markdown";
}

export async function readDirectoryTree(
  dirPath: string,
  depth = 0
): Promise<TreeNode[]> {
  if (depth >= MAX_DEPTH) return [];

  let entries;
  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }

  const nodes: TreeNode[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory() && !entry.isSymbolicLink()) {
      const children = await readDirectoryTree(fullPath, depth + 1);
      if (children.length > 0) {
        nodes.push({
          name: entry.name,
          path: fullPath,
          type: "directory",
          children,
        });
      }
    } else if (entry.isFile() && !entry.isSymbolicLink() && isMarkdownFile(entry.name)) {
      nodes.push({
        name: entry.name,
        path: fullPath,
        type: "file",
      });
    }
  }

  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export async function readFileContent(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf-8");
}
