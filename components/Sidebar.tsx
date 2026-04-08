"use client";

import FolderList, { type FolderWithCount } from "@/components/FolderList";

type Props = {
  folders: FolderWithCount[];
  selectedFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({
  folders,
  selectedFolderId,
  onSelectFolder,
  isOpen = false,
  onClose,
}: Props) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64 flex flex-col
          bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800
          transition-transform duration-200 ease-in-out
          md:translate-x-0 md:static md:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Branding */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Caddy
          </h1>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close sidebar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Folder list */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Folders
          </p>
          <FolderList
            folders={folders}
            selectedFolderId={selectedFolderId}
            onSelectFolder={(id) => {
              onSelectFolder(id);
              // Auto-close sidebar on mobile after selection
              onClose?.();
            }}
          />
        </div>
      </aside>
    </>
  );
}
