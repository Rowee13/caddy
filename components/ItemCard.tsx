"use client";

import { useState } from "react";
import { type Item, type Folder, ItemType } from "@/app/generated/prisma/browser";

type ItemWithFolder = Item & { folder: Pick<Folder, "id" | "name"> };

interface ItemCardProps {
  item: ItemWithFolder;
  onClick: (item: ItemWithFolder) => void;
}

function relativeTime(date: Date): string {
  const now = Date.now();
  const seconds = Math.floor((now - new Date(date).getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const TYPE_ICONS: Record<ItemType, string> = {
  LINK: "\u{1F517}",
  SNIPPET: "\u{1F4BB}",
  NOTE: "\u{1F4DD}",
};

function LinkCard({ item }: { item: ItemWithFolder }) {
  return (
    <div className="flex">
      {/* Left: text content */}
      <div className="flex-1 p-4 min-w-0">
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          {item.title}
        </h3>
        {item.content && (
          <p className="mt-1.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
            {item.content.slice(0, 100)}
          </p>
        )}
        {item.url && (
          <p className="mt-2 flex items-center gap-1 truncate text-xs text-blue-600 dark:text-blue-400">
            <span>{"\u{1F517}"}</span>
            <span className="truncate">{getDomain(item.url)}</span>
          </p>
        )}
      </div>
      {/* Right: thumbnail */}
      {item.ogImage ? (
        <div className="relative w-28 shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.ogImage}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex w-28 shrink-0 items-center justify-center bg-gray-100 text-2xl text-gray-400 dark:bg-gray-700 dark:text-gray-500">
          {"\u{1F310}"}
        </div>
      )}
    </div>
  );
}

const LANGUAGE_COLORS: Record<string, string> = {
  typescript: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  javascript: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  python: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  rust: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  go: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  html: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  css: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

const DEFAULT_LANG_COLOR = "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

function SnippetCard({ item, expanded, onToggleExpand }: { item: ItemWithFolder; expanded: boolean; onToggleExpand: () => void }) {
  const langKey = item.language?.toLowerCase() ?? "";
  const langColor = LANGUAGE_COLORS[langKey] ?? DEFAULT_LANG_COLOR;
  const lineCount = item.content.split("\n").length;
  const isLong = lineCount > 4;

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2">
        {item.language && (
          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${langColor}`}>
            {item.language}
          </span>
        )}
      </div>
      <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {item.title}
      </h3>
      <div className="mt-2 overflow-hidden rounded bg-gray-50 dark:bg-gray-900">
        <pre className={`whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-gray-700 dark:text-gray-300 p-2 ${expanded ? "" : "line-clamp-4"}`}>
          {item.content}
        </pre>
        {isLong && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="w-full border-t border-gray-200 dark:border-gray-700 py-1.5 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {expanded ? "Show less" : "View more"}
          </button>
        )}
      </div>
    </div>
  );
}

function NoteCard({ item }: { item: ItemWithFolder }) {
  return (
    <div className="p-4">
      <div className="mb-2 text-lg">{"\u{1F4DD}"}</div>
      <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {item.title}
      </h3>
      {item.content && (
        <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
          {item.content.slice(0, 150)}
        </p>
      )}
    </div>
  );
}

export default function ItemCard({ item, onClick }: ItemCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onClick(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(item);
        }
      }}
      className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      {item.type === ItemType.LINK && <LinkCard item={item} />}
      {item.type === ItemType.SNIPPET && <SnippetCard item={item} expanded={expanded} onToggleExpand={() => setExpanded(!expanded)} />}
      {item.type === ItemType.NOTE && <NoteCard item={item} />}

      {/* Footer: type badge, folder chip, timestamp */}
      <div className="flex items-center gap-2 border-t border-gray-100 px-4 py-2 dark:border-gray-700">
        <span className="text-xs" title={item.type}>
          {TYPE_ICONS[item.type]}
        </span>
        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
          {item.folder.name}
        </span>
        <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-500">
          {relativeTime(item.createdAt)}
        </span>
      </div>
    </article>
  );
}
