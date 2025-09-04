'use client'
import Sidebar from '@/app/components/Sidebar'

export default function LoadingCourseDetail() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex h-screen">
        <Sidebar currentPath="/courses" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <div className="animate-pulse">
                  {/* Back button */}
                  <div className="mb-6">
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  </div>

                  {/* Header matching the exact structure */}
                  <div className="md:flex md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center">
                        <div>
                          <div className="flex items-center">
                            <div className="h-8 bg-gray-200 rounded w-80 mr-3"></div>
                            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                          </div>
                          <div className="h-4 bg-gray-200 rounded w-64 mt-1"></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
                      <div className="h-9 w-20 bg-gray-200 rounded-md"></div>
                      <div className="h-9 w-20 bg-gray-200 rounded-md"></div>
                      <div className="h-9 w-24 bg-gray-200 rounded-md"></div>
                    </div>
                  </div>

                  {/* Tabs section */}
                  <div className="mt-8">
                    <div className="border-b border-gray-200">
                      <nav className="-mb-px flex space-x-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex items-center py-2 px-1 border-b-2 border-transparent">
                            <div className="h-5 w-5 bg-gray-200 rounded mr-2"></div>
                            <div className="h-4 w-16 bg-gray-200 rounded"></div>
                          </div>
                        ))}
                      </nav>
                    </div>
                  </div>

                  {/* Content grid matching the real layout */}
                  <div className="mt-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                      {/* Left Column - Main Content */}
                      <div className="lg:col-span-2">
                        <div className="bg-white shadow rounded-lg">
                          <div className="px-4 py-5 sm:p-6">
                            <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
                            <div className="space-y-2 mb-6">
                              {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-4 bg-gray-200 rounded"></div>
                              ))}
                            </div>

                            <div className="h-4 bg-gray-200 rounded w-40 mb-3"></div>
                            <div className="space-y-2 mb-6">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-4 bg-gray-200 rounded"></div>
                              ))}
                            </div>

                            <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                            <div className="grid grid-cols-2 gap-4">
                              {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-4 bg-gray-200 rounded"></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Instructor & Schedule */}
                      <div className="space-y-6">
                        {/* Instructor card */}
                        <div className="bg-white shadow rounded-lg">
                          <div className="px-4 py-5 sm:p-6">
                            <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
                            <div className="flex items-center">
                              <div className="h-12 w-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                              <div className="ml-4 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                <div className="h-3 bg-gray-200 rounded w-32"></div>
                                <div className="h-3 bg-gray-200 rounded w-28"></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Schedule card */}
                        <div className="bg-white shadow rounded-lg">
                          <div className="px-4 py-5 sm:p-6">
                            <div className="h-5 bg-gray-200 rounded w-24 mb-4"></div>
                            <div className="space-y-3">
                              {Array.from({ length: 2 }).map((_, i) => (
                                <div key={i} className="flex items-center text-sm">
                                  <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
                                  <div className="h-4 bg-gray-200 rounded w-16 mr-2"></div>
                                  <div className="h-4 w-4 bg-gray-200 rounded mr-1 ml-2"></div>
                                  <div className="h-4 bg-gray-200 rounded w-20 mr-2"></div>
                                  <div className="h-4 w-4 bg-gray-200 rounded mr-1 ml-2"></div>
                                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
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
