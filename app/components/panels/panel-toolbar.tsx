interface PanelToolbarProps {
  fileName: string | null;
  filePath: string | null;
  onClose: () => void;
}

export function PanelToolbar({ fileName, filePath, onClose }: PanelToolbarProps) {
  if (!fileName) return null;

  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <svg
          className="w-3.5 h-3.5 text-blue-400 shrink-0"
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
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
          {fileName}
        </span>
        {filePath && (
          <span className="text-xs text-gray-400 dark:text-gray-600 truncate hidden sm:inline">
            {filePath}
          </span>
        )}
      </div>
      <button
        onClick={onClose}
        className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors shrink-0"
        title="Close file"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
