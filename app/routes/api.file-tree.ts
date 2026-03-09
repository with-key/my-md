import { readDirectoryTree } from "~/server/file-system.server";
import { validateDirectoryPath } from "~/server/path-validator.server";
import type { Route } from "./+types/api.file-tree";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const dirPath = url.searchParams.get("path");

  if (!dirPath) {
    return Response.json(
      { error: "path parameter is required" },
      { status: 400 }
    );
  }

  const validated = validateDirectoryPath(dirPath);
  if (!validated) {
    return Response.json(
      { error: "Invalid directory path" },
      { status: 400 }
    );
  }

  try {
    const tree = await readDirectoryTree(validated);
    return Response.json({ tree, basePath: validated });
  } catch {
    return Response.json(
      { error: "Failed to read directory" },
      { status: 500 }
    );
  }
}
