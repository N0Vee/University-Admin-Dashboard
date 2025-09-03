'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useAuth } from '../context/AuthContext'

// Dynamically import sidebar components
const AdminSidebar = dynamic(() => import('./AdminSidebar'), { ssr: false })
const InstructorSidebar = dynamic(() => import('./InstructorSidebar'), { ssr: false })
const StudentSidebar = dynamic(() => import('./StudentSidebar'), { ssr: false })

export default function Sidebar({ currentPath }) {
    const { role, loading } = useAuth()

    // Show loading placeholder while auth is loading
    if (loading) {
        return (
            <div className="hidden md:flex md:w-64 md:flex-col">
                <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
                    <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                        <nav className="mt-5 flex-1 space-y-1 px-2">
                            <div className="animate-pulse">
                                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        )
    }

    // Return appropriate sidebar component based on role
    switch (role) {
        case 'admin':
            return <AdminSidebar currentPath={currentPath} />
        case 'instructor':
            return <InstructorSidebar currentPath={currentPath} />
        case 'student':
            return <StudentSidebar currentPath={currentPath} />
        default:
            // Fallback to student sidebar
            return <StudentSidebar currentPath={currentPath} />
    }
}
