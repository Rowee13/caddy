"use client";

import { useState } from "react";
import { type Item, type Folder, type ItemType } from "@/app/generated/prisma/browser";
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
    const [typeFilter, setTypeFilter] = useState<ItemType | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        item: ItemWithFolder | null;
    }>({ isOpen: false, item: null });

    // Filter items by folder, type, and search query
    const filteredItems = items.filter((item) => {
        if (selectedFolderId && item.folderId !== selectedFolderId) return false;
        if (typeFilter && item.type !== typeFilter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q);
        }
        return true;
    });

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar — full height */}
            <Sidebar
                folders={folders}
                selectedFolderId={selectedFolderId}
                onSelectFolder={setSelectedFolderId}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Right side: header + main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <header className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-4">
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

                    {/* Search */}
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />

                    {/* Theme toggle */}
                    <ThemeToggle />
                </header>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
                    <ItemGrid
                        items={filteredItems}
                        onItemClick={(item) => setModalState({ isOpen: true, item })}
                        onNewItem={() => setModalState({ isOpen: true, item: null })}
                        hasSearchQuery={searchQuery.length > 0}
                        typeFilter={typeFilter}
                        onTypeFilterChange={setTypeFilter}
                        showTypeFilter={!selectedFolderId}
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
