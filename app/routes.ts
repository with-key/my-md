import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/file-tree", "routes/api.file-tree.ts"),
  route("api/file-content", "routes/api.file-content.ts"),
] satisfies RouteConfig;
