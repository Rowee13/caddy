"use client";

import { type Item, type Folder, type ItemType } from "@/app/generated/prisma/browser";
import ItemCard from "@/components/ItemCard";

type ItemWithFolder = Item & { folder: Pick<Folder, "id" | "name"> };

const TYPE_FILTER_OPTIONS: { value: ItemType | null; label: string; icon: string }[] = [
  { value: null, label: "All", icon: "" },
  { value: "LINK" as ItemType, label: "Links", icon: "\u{1F517}" },
  { value: "SNIPPET" as ItemType, label: "Snippets", icon: "\u{1F4BB}" },
  { value: "NOTE" as ItemType, label: "Notes", icon: "\u{1F4DD}" },
];

interface ItemGridProps {
  items: ItemWithFolder[];
  onItemClick: (item: ItemWithFolder) => void;
  onNewItem: () => void;
  hasSearchQuery?: boolean;
  typeFilter?: ItemType | null;
  onTypeFilterChange?: (type: ItemType | null) => void;
  showTypeFilter?: boolean;
}

function EmptyState({ onNewItem, hasSearchQuery }: { onNewItem: () => void; hasSearchQuery?: boolean }) {
  if (hasSearchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-5xl">🔍</div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          No items match your search
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Try a different query or clear the search.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-5xl">📦</div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        No items yet
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Create your first one!
      </p>
      <button
        onClick={onNewItem}
        className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        + New Item
      </button>
    </div>
  );
}

export default function ItemGrid({
  items,
  onItemClick,
  onNewItem,
  hasSearchQuery,
  typeFilter,
  onTypeFilterChange,
  showTypeFilter,
}: ItemGridProps) {
  if (items.length === 0 && !showTypeFilter) {
    return <EmptyState onNewItem={onNewItem} hasSearchQuery={hasSearchQuery} />;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        {/* Type filter pills — only in All view */}
        {showTypeFilter ? (
          <div className="flex items-center gap-1.5">
            {TYPE_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => onTypeFilterChange?.(opt.value)}
                className={`rounded-full px-2 py-1 text-[10px] md:px-3 md:py-1.5 md:text-xs font-medium transition-colors ${
                  typeFilter === opt.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {opt.icon ? `${opt.icon} ` : ""}{opt.label}
              </button>
            ))}
          </div>
        ) : <div />}
        <button
          onClick={onNewItem}
          className="shrink-0 rounded-lg bg-blue-600 text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 p-2 md:px-4 md:py-2"
          aria-label="New Item"
        >
          <svg className="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden md:inline text-sm font-medium">+ New Item</span>
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState onNewItem={onNewItem} hasSearchQuery={hasSearchQuery || !!typeFilter} />
      ) : null}

      <div className="columns-1 gap-4 lg:columns-2 xl:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onClick={onItemClick} />
        ))}
      </div>
    </div>
  );
}
