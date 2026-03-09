export interface TreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: TreeNode[];
}

export interface PanelState {
  id: string;
  filePath: string | null;
  fileName: string | null;
}
