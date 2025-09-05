'use client'
import Sidebar from '@/app/components/Sidebar'

export default function RegisterLoading() {
    return (
        <div className="min-h-screen bg-zinc-50">
            <div className="flex h-screen">
                <Sidebar currentPath="/register" />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <main className="flex-1 relative overflow-y-auto focus:outline-none">
                        <div className="py-6">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                                <div className="animate-pulse">
                                    {/* Header skeleton */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="h-8 bg-gray-200 rounded w-64"></div>
                                        <div className="h-6 bg-gray-200 rounded w-24"></div>
                                    </div>

                                    {/* Filters skeleton */}
                                    <div className="flex gap-4 mb-6">
                                        <div className="h-10 bg-gray-200 rounded w-32"></div>
                                        <div className="relative flex-1 max-w-md">
                                            <div className="h-10 bg-gray-200 rounded w-full"></div>
                                        </div>
                                    </div>

                                    {/* Student demo section skeleton */}
                                    <div className="mb-6 bg-white shadow rounded-lg">
                                        <div className="px-4 py-5 sm:p-6">
                                            <div className="h-6 bg-gray-200 rounded w-72 mb-4"></div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {[...Array(6)].map((_, i) => (
                                                    <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                                                <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                                                                <div className="h-3 bg-gray-200 rounded w-16"></div>
                                                            </div>
                                                            <div className="h-8 w-20 bg-gray-200 rounded ml-2"></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Table skeleton */}
                                    <div className="overflow-auto rounded-lg shadow bg-white">
                                        {/* Table header skeleton */}
                                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                            <div className="flex gap-8">
                                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                                <div className="h-4 bg-gray-200 rounded w-24 ml-auto"></div>
                                            </div>
                                        </div>
                                        
                                        {/* Table rows skeleton */}
                                        {[...Array(8)].map((_, i) => (
                                            <div key={i} className="px-4 py-3 border-b border-gray-200 last:border-b-0">
                                                <div className="flex items-center gap-8">
                                                    {/* Student name column */}
                                                    <div className="w-24">
                                                        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                                                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                                                    </div>
                                                    
                                                    {/* Course column */}
                                                    <div className="w-32">
                                                        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                                                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                                                    </div>
                                                    
                                                    {/* Credits column */}
                                                    <div className="w-20">
                                                        <div className="h-4 bg-gray-200 rounded w-8"></div>
                                                    </div>
                                                    
                                                    {/* Status column */}
                                                    <div className="w-20">
                                                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                                                    </div>
                                                    
                                                    {/* Date column */}
                                                    <div className="w-32">
                                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                                    </div>
                                                    
                                                    {/* Actions column */}
                                                    <div className="w-24 ml-auto">
                                                        <div className="flex gap-2 justify-end">
                                                            <div className="h-6 bg-gray-200 rounded w-12"></div>
                                                            <div className="h-6 bg-gray-200 rounded w-12"></div>
                                                        </div>
                                                    </div>
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
