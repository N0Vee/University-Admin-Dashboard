'use client'
import Sidebar from '@/app/components/Sidebar'

export default function LoadingStudents() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex h-screen">
        <Sidebar currentPath="/students" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <div className="animate-pulse">
                  {/* Header matching real layout */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-8 bg-gray-200 rounded w-48"></div>
                    <div className="h-9 w-32 bg-gray-200 rounded-md"></div>
                  </div>

                  {/* Filters matching the real structure */}
                  <div className="flex gap-4 mb-6">
                    <div className="h-9 w-32 bg-gray-200 rounded-md"></div>
                    <div className="h-9 w-28 bg-gray-200 rounded-md"></div>
                    <div className="h-9 w-48 bg-gray-200 rounded-md"></div>
                    <div className="relative h-9 w-64 bg-gray-200 rounded-lg"></div>
                  </div>

                  {/* Table skeleton matching structure */}
                  <div className="overflow-auto rounded-lg shadow bg-white">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16"></div></th>
                          <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24"></div></th>
                          <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-28"></div></th>
                          <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16"></div></th>
                          <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-12"></div></th>
                          <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16"></div></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <tr key={i} className="hover:bg-gray-100">
                            <td className="px-4 py-3">
                              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="h-4 bg-gray-200 rounded w-24"></div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="h-4 bg-gray-200 rounded w-32"></div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="h-4 bg-gray-200 rounded w-24"></div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="h-4 bg-gray-200 rounded w-8"></div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="h-4 bg-gray-200 rounded w-12"></div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
