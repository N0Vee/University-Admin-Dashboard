'use client'
import Sidebar from '@/app/components/Sidebar'

export default function LoadingCourses() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex h-screen">
        <Sidebar currentPath="/courses" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <div className="animate-pulse">
                  {/* Page header matching the real layout */}
                  <div className="md:flex md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="h-8 bg-gray-200 rounded w-56 mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-80 mt-1"></div>
                    </div>
                    <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
                      <div className="h-9 w-32 bg-gray-200 rounded-md"></div>
                      <div className="h-9 w-36 bg-gray-200 rounded-md"></div>
                    </div>
                  </div>

                  {/* Stats matching the exact layout */}
                  <div className="mt-8">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 hover:shadow-md transition-shadow duration-200">
                          <div className="flex items-center">
                            <div className="absolute rounded-md p-3 bg-gray-200">
                              <div className="h-6 w-6 bg-gray-300 rounded"></div>
                            </div>
                            <div className="ml-16 w-full">
                              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                              <div className="h-6 bg-gray-200 rounded w-12"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Filters section with proper styling */}
                  <div className="mt-8 bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="flex flex-1 items-center space-x-4">
                          {/* Search input */}
                          <div className="relative flex-1 max-w-xs">
                            <div className="h-9 bg-gray-200 rounded-md"></div>
                          </div>
                          {/* Semester filter */}
                          <div className="h-9 w-32 bg-gray-200 rounded-md"></div>
                          {/* Status filter */}
                          <div className="h-9 w-28 bg-gray-200 rounded-md"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Table section matching structure */}
                  <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="h-5 bg-gray-200 rounded w-32"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              {Array.from({ length: 6 }).map((_, i) => (
                                <th key={i} className="px-6 py-3">
                                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {Array.from({ length: 8 }).map((_, i) => (
                              <tr key={i} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                  <div className="space-y-1">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                                    <div className="h-3 bg-gray-200 rounded w-28"></div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="space-y-1">
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="space-y-1">
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="space-y-1">
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-end space-x-2">
                                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
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
