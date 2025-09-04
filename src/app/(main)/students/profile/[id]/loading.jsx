'use client'
import Sidebar from '@/app/components/Sidebar'

export default function LoadingStudentProfile() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex h-screen">
        <Sidebar currentPath="/students" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                <div className="animate-pulse">
                  {/* Page header matching exact structure */}
                  <div className="mb-6">
                    <div className="h-4 w-16 bg-gray-200 rounded mb-4"></div>
                    <div className="md:flex md:items-center md:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="h-8 bg-gray-200 rounded w-48 mt-2 mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-56 mt-1"></div>
                      </div>
                      <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                        <div className="h-9 w-20 bg-gray-200 rounded-md"></div>
                        <div className="h-9 w-16 bg-gray-200 rounded-md"></div>
                      </div>
                    </div>
                  </div>

                  {/* Student Profile Card matching layout */}
                  <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <div className="flex items-center space-x-6">
                      <div className="shrink-0">
                        <div className="h-24 w-24 rounded-full bg-gray-200 border-4 border-gray-200"></div>
                      </div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-56 mb-3"></div>
                        <div className="flex items-center space-x-4">
                          <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                          <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                          <div className="h-5 w-14 bg-gray-200 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Information sections */}
                  <div className="space-y-6">
                    {/* Contact Information */}
                    <div className="bg-white shadow rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <div className="h-5 w-5 bg-gray-200 rounded mr-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex items-center space-x-3">
                            <div className="h-5 w-5 bg-gray-200 rounded"></div>
                            <div className="flex-1">
                              <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                              <div className="h-4 bg-gray-200 rounded w-36"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Academic Information */}
                    <div className="bg-white shadow rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <div className="h-5 w-5 bg-gray-200 rounded mr-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-32"></div>
                      </div>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="flex items-center space-x-3">
                            <div className="h-5 w-5 bg-gray-200 rounded"></div>
                            <div className="flex-1">
                              <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                              <div className="h-4 bg-gray-200 rounded w-24"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white shadow rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <div className="h-5 w-5 bg-gray-200 rounded mr-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-28"></div>
                      </div>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex items-center space-x-3">
                            <div className="h-5 w-5 bg-gray-200 rounded"></div>
                            <div className="flex-1">
                              <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                              <div className="h-4 bg-gray-200 rounded w-28"></div>
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
