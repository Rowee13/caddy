"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { type Item, type Folder, ItemType } from "@/app/generated/prisma/browser";
import { createItem, updateItem, deleteItem } from "@/app/actions/items";
import toast from "react-hot-toast";

type ItemForEdit = Item & { folder: Pick<Folder, "id" | "name"> };

type FolderOption = { id: string; name: string };

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItemForEdit | null;
  folders: FolderOption[];
  defaultFolderId?: string | null;
}

const LANGUAGES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "C#",
  "HTML",
  "CSS",
  "SQL",
  "Bash",
  "Other",
];

const TYPE_OPTIONS: { type: ItemType; label: string; icon: string }[] = [
  { type: ItemType.LINK, label: "Link", icon: "\u{1F517}" },
  { type: ItemType.SNIPPET, label: "Snippet", icon: "\u{1F4BB}" },
  { type: ItemType.NOTE, label: "Note", icon: "\u{1F4DD}" },
];

export default function ItemModal({
  isOpen,
  onClose,
  item,
  folders,
  defaultFolderId,
}: ItemModalProps) {
  const isEdit = item !== null;

  const [selectedType, setSelectedType] = useState<ItemType | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [folderId, setFolderId] = useState("");
  const [url, setUrl] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [language, setLanguage] = useState("TypeScript");
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [metaError, setMetaError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Reset form when modal opens or item changes
  useEffect(() => {
    if (!isOpen) return;

    if (item) {
      setSelectedType(item.type);
      setTitle(item.title);
      setContent(item.content);
      setFolderId(item.folderId);
      setUrl(item.url ?? "");
      setOgImage(item.ogImage ?? "");
      setLanguage(item.language ?? "TypeScript");
    } else {
      setSelectedType(null);
      setTitle("");
      setContent("");
      setFolderId(defaultFolderId ?? folders[0]?.id ?? "");
      setUrl("");
      setOgImage("");
      setLanguage("TypeScript");
    }
    setMetaError("");
    setShowDeleteConfirm(false);
  }, [isOpen, item, defaultFolderId, folders]);

  const fetchMetadata = useCallback(
    async (inputUrl: string) => {
      if (!inputUrl.trim()) return;
      try {
        new URL(inputUrl);
      } catch {
        return;
      }

      setFetchingMeta(true);
      setMetaError("");
      try {
        const res = await fetch("/api/metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: inputUrl }),
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (data.title && !title) {
          setTitle(data.title);
        }
        if (data.ogImage) {
          setOgImage(data.ogImage);
        }
      } catch {
        setMetaError("Could not fetch metadata. You can fill in details manually.");
      } finally {
        setFetchingMeta(false);
      }
    },
    [title]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedType || !title.trim() || !folderId) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (selectedType === ItemType.LINK && !url.trim()) {
      toast.error("URL is required for link items.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          type: selectedType,
          title: title.trim(),
          content: content.trim(),
          folderId,
          ...(selectedType === ItemType.LINK
            ? { url: url.trim(), ogImage: ogImage || undefined }
            : {}),
          ...(selectedType === ItemType.SNIPPET
            ? { language }
            : {}),
        };

        if (isEdit && item) {
          await updateItem(item.id, payload);
          toast.success("Item updated.");
        } else {
          await createItem(payload);
          toast.success("Item created.");
        }
        onClose();
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    });
  }

  function handleDelete() {
    if (!item) return;
    startTransition(async () => {
      try {
        await deleteItem(item.id);
        toast.success("Item deleted.");
        onClose();
      } catch {
        toast.error("Failed to delete item.");
      }
    });
  }

  if (!isOpen) return null;

  const showForm = isEdit || selectedType !== null;

  const inputClass =
    "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
  const labelClass =
    "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal card */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4 rounded-t-xl">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {isEdit ? "Edit Item" : "New Item"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
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

        <div className="px-6 py-5">
          {/* Type selector (create mode only, before form) */}
          {!isEdit && !selectedType && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                What would you like to save?
              </p>
              <div className="grid grid-cols-3 gap-3">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => setSelectedType(opt.type)}
                    className="flex flex-col items-center gap-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 p-4 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="text-sm font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type badge (shown in create after selection and in edit) */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {TYPE_OPTIONS.find((o) => o.type === selectedType)?.icon}{" "}
                  {TYPE_OPTIONS.find((o) => o.type === selectedType)?.label}
                </span>
                {!isEdit && (
                  <button
                    type="button"
                    onClick={() => setSelectedType(null)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Change
                  </button>
                )}
              </div>

              {/* Folder dropdown */}
              <div>
                <label htmlFor="modal-folder" className={labelClass}>
                  Folder <span className="text-red-500">*</span>
                </label>
                <select
                  id="modal-folder"
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="" disabled>
                    Select a folder
                  </option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* URL input (LINK type) */}
              {selectedType === ItemType.LINK && (
                <div>
                  <label htmlFor="modal-url" className={labelClass}>
                    URL <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="modal-url"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onBlur={() => fetchMetadata(url)}
                      onPaste={(e) => {
                        const pasted = e.clipboardData.getData("text");
                        // Delay to let the value update
                        setTimeout(() => fetchMetadata(pasted), 0);
                      }}
                      placeholder="https://example.com"
                      className={inputClass}
                      required
                    />
                    {fetchingMeta && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                      </div>
                    )}
                  </div>
                  {metaError && (
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                      {metaError}
                    </p>
                  )}
                  {ogImage && (
                    <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ogImage}
                        alt="Preview"
                        className="h-32 w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Title input */}
              <div>
                <label htmlFor="modal-title" className={labelClass}>
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="modal-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give it a title"
                  className={inputClass}
                  required
                />
              </div>

              {/* Language dropdown (SNIPPET type) */}
              {selectedType === ItemType.SNIPPET && (
                <div>
                  <label htmlFor="modal-language" className={labelClass}>
                    Language
                  </label>
                  <select
                    id="modal-language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className={inputClass}
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Content textarea */}
              <div>
                <label htmlFor="modal-content" className={labelClass}>
                  Content
                </label>
                <textarea
                  id="modal-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    selectedType === ItemType.SNIPPET
                      ? "Paste your code here..."
                      : selectedType === ItemType.LINK
                        ? "Add a description (optional)..."
                        : "Write your note..."
                  }
                  rows={selectedType === ItemType.SNIPPET ? 8 : 4}
                  className={`${inputClass} resize-y ${
                    selectedType === ItemType.SNIPPET ? "font-mono text-xs" : ""
                  }`}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isPending
                    ? "Saving..."
                    : isEdit
                      ? "Update"
                      : "Create"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
              </div>

              {/* Delete button (edit mode only) */}
              {isEdit && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  {!showDeleteConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:underline transition-colors"
                    >
                      Delete this item
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-red-600 dark:text-red-400">
                        Are you sure?
                      </span>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isPending}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        {isPending ? "Deleting..." : "Yes, delete"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
