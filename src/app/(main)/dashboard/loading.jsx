'use client'
import Sidebar from '@/app/components/Sidebar'

export default function LoadingDashboard() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex h-screen">
        <Sidebar currentPath="/dashboard" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <div className="animate-pulse">
                  {/* Page header matching the real structure */}
                  <div className="mb-6">
                    <div className="md:flex md:items-center md:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="h-8 bg-gray-200 rounded w-64 mt-2 mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-96 mt-1"></div>
                      </div>
                      <div className="mt-4 md:mt-0 flex space-x-3">
                        <div className="h-9 w-28 bg-gray-200 rounded-md"></div>
                        <div className="h-9 w-32 bg-gray-200 rounded-md"></div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Cards with proper spacing */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
                          <div className="p-5">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="rounded-md p-3 bg-gray-200">
                                  <div className="h-6 w-6 bg-gray-300 rounded"></div>
                                </div>
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                                <div className="h-6 bg-gray-200 rounded w-12"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Main Content Grid matching layout */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                      {/* Left Column - Main Content */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white shadow rounded-lg">
                          <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center justify-between mb-6">
                              <div className="h-5 bg-gray-200 rounded w-32"></div>
                              <div className="h-4 bg-gray-200 rounded w-16"></div>
                            </div>
                            <div className="flow-root">
                              <div className="-my-3 divide-y divide-gray-200">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <div key={i} className="py-3">
                                    <div className="flex items-center space-x-4">
                                      <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                                      <div className="min-w-0 flex-1 space-y-1">
                                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                                      </div>
                                      <div className="h-5 w-5 bg-gray-200 rounded flex-shrink-0"></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Sidebar content */}
                      <div className="space-y-6">
                        {Array.from({ length: 2 }).map((_, i) => (
                          <div key={i} className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                              <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
                              <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, j) => (
                                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
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
