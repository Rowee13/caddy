"use client";

import { type Item, type Folder } from "@/app/generated/prisma/client";
import ItemCard from "@/components/ItemCard";

type ItemWithFolder = Item & { folder: Pick<Folder, "id" | "name"> };

interface ItemGridProps {
  items: ItemWithFolder[];
  onItemClick: (item: ItemWithFolder) => void;
  onNewItem: () => void;
}

function EmptyState({ onNewItem }: { onNewItem: () => void }) {
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
}: ItemGridProps) {
  if (items.length === 0) {
    return <EmptyState onNewItem={onNewItem} />;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex items-center justify-end">
        <button
          onClick={onNewItem}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          + New Item
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onClick={onItemClick} />
        ))}
      </div>
    </div>
  );
}
