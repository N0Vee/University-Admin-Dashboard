'use client'

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex h-screen">
        {/* Sidebar skeleton */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="px-4">
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <nav className="mt-5 flex-1 space-y-1 px-2">
                <div className="animate-pulse space-y-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="h-9 bg-gray-200 rounded" />
                  ))}
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <div className="animate-pulse">
                  {/* Page header */}
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />

                  {/* Stats grid */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="bg-white p-6 rounded-lg shadow">
                        <div className="h-5 bg-gray-200 rounded w-1/2 mb-3" />
                        <div className="h-8 bg-gray-200 rounded w-1/3" />
                      </div>
                    ))}
                  </div>

                  {/* Content blocks */}
                  <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-white rounded-lg shadow p-6">
                        <div className="h-5 bg-gray-200 rounded w-1/4 mb-4" />
                        <div className="space-y-2">
                          {Array.from({ length: 4 }).map((_, j) => (
                            <div key={j} className="h-4 bg-gray-200 rounded" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
