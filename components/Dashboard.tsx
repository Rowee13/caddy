"use client";

import { useState } from "react";
import { type Item, type Folder } from "@/app/generated/prisma/browser";
import { type FolderWithCount } from "@/components/FolderList";
import Sidebar from "@/components/Sidebar";
import ItemGrid from "@/components/ItemGrid";
import ItemModal from "@/components/ItemModal";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";

type ItemWithFolder = Item & { folder: Pick<Folder, "id" | "name"> };

interface DashboardProps {
  folders: FolderWithCount[];
  items: ItemWithFolder[];
}

export default function Dashboard({ folders, items }: DashboardProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    item: ItemWithFolder | null;
  }>({ isOpen: false, item: null });

  // Filter items by folder and search query
  const filteredItems = items.filter((item) => {
    if (selectedFolderId && item.folderId !== selectedFolderId) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
        {/* Mobile hamburger */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Open sidebar"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Logo - hidden on mobile to save space */}
        <span className="hidden md:block text-lg font-bold tracking-tight text-gray-900 dark:text-white shrink-0">
          Caddy
        </span>

        {/* Search */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* Theme toggle */}
        <ThemeToggle />
      </header>

      {/* Body: sidebar + main */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <ItemGrid
            items={filteredItems}
            onItemClick={(item) => setModalState({ isOpen: true, item })}
            onNewItem={() => setModalState({ isOpen: true, item: null })}
            hasSearchQuery={searchQuery.length > 0}
          />
        </main>
      </div>

      {/* Item modal */}
      <ItemModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, item: null })}
        item={modalState.item}
        folders={folders.map((f) => ({ id: f.id, name: f.name }))}
        defaultFolderId={selectedFolderId}
      />
    </div>
  );
}
