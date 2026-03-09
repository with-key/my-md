interface RecentPathsProps {
  paths: string[];
  onSelect: (path: string) => void;
  onRemove: (path: string) => void;
}

function getDirectoryName(fullPath: string): string {
  const parts = fullPath.replace(/\/+$/, "").split("/");
  return parts[parts.length - 1] || fullPath;
}

function getParentPath(fullPath: string): string {
  const parts = fullPath.replace(/\/+$/, "").split("/");
  if (parts.length <= 1) return "";
  return parts.slice(0, -1).join("/");
}

export function RecentPaths({ paths, onSelect, onRemove }: RecentPathsProps) {
  if (paths.length === 0) return null;

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <div className="px-3 pt-2.5 pb-1">
        <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Recent
        </span>
      </div>
      <ul className="pb-1.5">
        {paths.map((path) => (
          <li key={path} className="group flex items-center">
            <button
              type="button"
              onClick={() => onSelect(path)}
              className="flex-1 min-w-0 px-3 py-1.5 text-left hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            >
              <span className="block text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {getDirectoryName(path)}
              </span>
              <span className="block text-[11px] text-gray-400 dark:text-gray-500 truncate">
                {getParentPath(path)}
              </span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(path);
              }}
              className="opacity-0 group-hover:opacity-100 px-2 py-1 mr-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-opacity text-xs"
              title="Remove"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
