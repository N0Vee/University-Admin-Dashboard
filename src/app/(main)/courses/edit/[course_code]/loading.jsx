'use client'
import Sidebar from '@/app/components/Sidebar'

export default function LoadingEditCourse() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex h-screen">
        <Sidebar currentPath="/courses" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
              <div className="animate-pulse">
                {/* Page header matching structure */}
                <div className="mb-6">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
                  <div className="md:flex md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="h-8 bg-gray-200 rounded w-36 mt-2 mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-80 mt-1"></div>
                    </div>
                  </div>
                </div>

                {/* Form skeleton matching add course structure */}
                <div className="bg-white shadow-sm rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="space-y-6">
                      {/* Course Information */}
                      <div className="border-b border-gray-200 pb-6">
                        <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div className="h-10 bg-gray-200 rounded"></div>
                          <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                        <div className="mt-6 h-10 bg-gray-200 rounded"></div>
                        <div className="mt-6 h-24 bg-gray-200 rounded"></div>
                      </div>

                      {/* Academic Details */}
                      <div className="border-b border-gray-200 pb-6">
                        <div className="h-5 bg-gray-200 rounded w-28 mb-4"></div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                          <div className="h-10 bg-gray-200 rounded"></div>
                          <div className="h-10 bg-gray-200 rounded"></div>
                          <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div className="h-10 bg-gray-200 rounded"></div>
                          <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                      </div>

                      {/* Instructor & Capacity */}
                      <div className="border-b border-gray-200 pb-6">
                        <div className="h-5 bg-gray-200 rounded w-36 mb-4"></div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                          <div className="h-10 bg-gray-200 rounded"></div>
                          <div className="h-10 bg-gray-200 rounded"></div>
                          <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                      </div>

                      {/* Schedule */}
                      <div className="border-b border-gray-200 pb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="h-5 bg-gray-200 rounded w-24"></div>
                          <div className="h-9 w-20 bg-gray-200 rounded"></div>
                        </div>
                        <div className="space-y-3">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                              <div className="h-10 bg-gray-200 rounded"></div>
                              <div className="h-10 bg-gray-200 rounded"></div>
                              <div className="h-10 bg-gray-200 rounded"></div>
                              <div className="h-10 w-10 bg-gray-200 rounded"></div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Objectives */}
                      <div className="pb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="h-5 bg-gray-200 rounded w-40"></div>
                          <div className="h-9 w-20 bg-gray-200 rounded"></div>
                        </div>
                        <div className="space-y-3">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-3">
                              <div className="flex-1 h-10 bg-gray-200 rounded"></div>
                              <div className="h-10 w-10 bg-gray-200 rounded"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Form Actions */}
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <div className="flex justify-end space-x-3">
                      <div className="h-9 w-20 bg-gray-200 rounded"></div>
                      <div className="h-9 w-28 bg-gray-300 rounded"></div>
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
