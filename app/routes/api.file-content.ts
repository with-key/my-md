import { readFileContent } from "~/server/file-system.server";
import { validateFilePath } from "~/server/path-validator.server";
import type { Route } from "./+types/api.file-content";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const filePath = url.searchParams.get("filePath");
  const basePath = url.searchParams.get("basePath");

  if (!filePath || !basePath) {
    return Response.json(
      { error: "filePath and basePath parameters are required" },
      { status: 400 }
    );
  }

  if (!validateFilePath(filePath, basePath)) {
    return Response.json(
      { error: "Invalid file path" },
      { status: 400 }
    );
  }

  try {
    const content = await readFileContent(filePath);
    return Response.json({ content, filePath });
  } catch {
    return Response.json(
      { error: "Failed to read file" },
      { status: 500 }
    );
  }
}
