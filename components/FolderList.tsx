"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import {
  createFolder,
  updateFolder,
  deleteFolder,
} from "@/app/actions/folders";

export type FolderWithCount = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  _count: { items: number };
};

type Props = {
  folders: FolderWithCount[];
  selectedFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
};

export default function FolderList({
  folders,
  selectedFolderId,
  onSelectFolder,
}: Props) {
  const [newFolderName, setNewFolderName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const editInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const totalItems = folders.reduce((sum, f) => sum + f._count.items, 0);

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    }
    if (menuOpenId) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [menuOpenId]);

  function handleCreate() {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    startTransition(async () => {
      await createFolder(trimmed);
      setNewFolderName("");
    });
  }

  function handleUpdate(id: string) {
    const trimmed = editingName.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }
    startTransition(async () => {
      await updateFolder(id, trimmed);
      setEditingId(null);
    });
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this folder and all its items?")) return;
    startTransition(async () => {
      await deleteFolder(id);
      if (selectedFolderId === id) {
        onSelectFolder(null);
      }
    });
  }

  function startEditing(folder: FolderWithCount) {
    setEditingId(folder.id);
    setEditingName(folder.name);
    setMenuOpenId(null);
  }

  const baseItemClass =
    "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm";
  const selectedClass =
    "bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 font-medium";
  const unselectedClass =
    "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800";

  return (
    <nav className="flex flex-col gap-1">
      {/* All pseudo-folder */}
      <button
        onClick={() => onSelectFolder(null)}
        className={`${baseItemClass} ${selectedFolderId === null ? selectedClass : unselectedClass}`}
      >
        <span>All</span>
        <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5 min-w-[1.5rem] text-center">
          {totalItems}
        </span>
      </button>

      {/* Folder list */}
      {folders.map((folder) => (
        <div key={folder.id} className="relative group">
          {editingId === folder.id ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(folder.id);
              }}
              className="flex items-center gap-1 px-3 py-1.5"
            >
              <input
                ref={editInputRef}
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => handleUpdate(folder.id)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setEditingId(null);
                }}
                disabled={isPending}
                className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>
          ) : (
            <button
              onClick={() => onSelectFolder(folder.id)}
              className={`w-full ${baseItemClass} ${selectedFolderId === folder.id ? selectedClass : unselectedClass}`}
            >
              <span className="truncate mr-2">{folder.name}</span>
              <span className="flex items-center gap-1 shrink-0">
                <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5 min-w-[1.5rem] text-center">
                  {folder._count.items}
                </span>
                {/* Kebab menu button */}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === folder.id ? null : folder.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      setMenuOpenId(
                        menuOpenId === folder.id ? null : folder.id
                      );
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-opacity"
                >
                  ⋮
                </span>
              </span>
            </button>
          )}

          {/* Dropdown menu */}
          {menuOpenId === folder.id && (
            <div
              ref={menuRef}
              className="absolute right-2 top-full z-20 mt-1 w-32 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1"
            >
              <button
                onClick={() => startEditing(folder)}
                className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setMenuOpenId(null);
                  handleDelete(folder.id);
                }}
                className="w-full text-left px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      {/* New folder input */}
      <div className="mt-2 px-1">
        <input
          type="text"
          placeholder="New folder..."
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCreate();
          }}
          disabled={isPending}
          className="w-full bg-transparent border border-dashed border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
      </div>
    </nav>
  );
}
