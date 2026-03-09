import path from "node:path";
import fs from "node:fs";

export function validateDirectoryPath(dirPath: string): string | null {
  try {
    const resolved = path.resolve(dirPath);
    const stat = fs.lstatSync(resolved);
    if (!stat.isDirectory()) return null;
    if (stat.isSymbolicLink()) return null;
    return resolved;
  } catch {
    return null;
  }
}

export function validateFilePath(filePath: string, basePath: string): boolean {
  try {
    const resolvedFile = path.resolve(filePath);
    const resolvedBase = path.resolve(basePath);
    if (!resolvedFile.startsWith(resolvedBase + path.sep) && resolvedFile !== resolvedBase) {
      return false;
    }
    const ext = path.extname(resolvedFile).toLowerCase();
    if (ext !== ".md" && ext !== ".markdown") {
      return false;
    }
    const stat = fs.lstatSync(resolvedFile);
    if (!stat.isFile() || stat.isSymbolicLink()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
