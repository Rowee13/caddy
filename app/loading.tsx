export default function Loading() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header skeleton */}
      <header className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
        <div className="hidden md:block h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 max-w-md h-9 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar skeleton (hidden on mobile) */}
        <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
          <div className="px-5 py-5 border-b border-gray-200 dark:border-gray-800">
            <div className="h-7 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="flex-1 px-3 py-4 space-y-2">
            <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-3 mx-3" />
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-9 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
                style={{ width: `${70 - i * 8}%` }}
              />
            ))}
          </div>
        </aside>

        {/* Main content skeleton */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-4 flex justify-end">
            <div className="h-9 w-28 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <div className="h-36 w-full animate-pulse bg-gray-200 dark:bg-gray-700" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-700 px-4 py-2">
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="ml-auto h-3 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
