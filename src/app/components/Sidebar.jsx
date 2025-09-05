'use client'
import { useAuth } from '../context/AuthContext'
import {
    UserGroupIcon,
    BookOpenIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    CalendarDaysIcon,
    UserIcon,
} from '@heroicons/react/24/solid'

export default function Sidebar({ currentPath }) {
    const { role, loading, userId } = useAuth()

    // Navigation items based on role
    const getNavigationItems = (userRole, userId) => {
        switch (userRole) {
            case 'admin':
                return [
                    { name: 'ภาพรวม', href: '/dashboard', icon: ChartBarIcon },
                    { name: 'จัดการนักศึกษา', href: '/students', icon: UserGroupIcon },
                    { name: 'รายวิชา', href: '/courses', icon: BookOpenIcon },
                    { name: 'การลงทะเบียน', href: '/register', icon: ClipboardDocumentListIcon },
                    { name: 'ปฏิทินกิจกรรม', href: '/calendar', icon: CalendarDaysIcon },
                    { name: 'รายงาน', href: '/report', icon: ChartBarIcon }
                ]
            case 'instructor':
                return [
                    { name: 'ภาพรวม', href: '/dashboard', icon: ChartBarIcon },
                    { name: 'รายวิชา', href: '/courses', icon: BookOpenIcon },
                    { name: 'การลงทะเบียน', href: '/register', icon: ClipboardDocumentListIcon }
                ]
            case 'student':
            default:
                return [
                    { name: 'โปรไฟล์', href: `/students/profile/${userId || 'loading'}`, icon: UserIcon },
                    { name: 'รายวิชา', href: '/courses', icon: BookOpenIcon },
                    { name: 'ลงทะเบียนเรียน', href: '/register', icon: ClipboardDocumentListIcon },
                ]
        }
    }

    // Show loading placeholder while auth is loading
    if (loading) {
        return (
            <div className="hidden md:flex md:w-64 md:flex-col transition-all duration-300 ease-in-out">
                <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
                    <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">                        
                        {/* Navigation skeleton */}
                        <nav className="mt-5 flex-1 space-y-1 px-2">
                            <div className="animate-pulse space-y-1">
                                {/* Main navigation items - matching typical sidebar structure */}
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                        <div className="h-5 w-5 bg-gray-200 rounded mr-3 flex-shrink-0"></div>
                                        <div className={`h-4 bg-gray-200 rounded transition-all duration-300 ${
                                            i === 0 ? 'w-16' : // ภาพรวม
                                            i === 1 ? 'w-28' : // จัดการนักศึกษา  
                                            i === 2 ? 'w-20' : // รายวิชา
                                            i === 3 ? 'w-24' : // การลงทะเบียน
                                            i === 4 ? 'w-32' : // ปฏิทินกิจกรรม
                                            'w-18'              // รายงาน
                                        }`}></div>
                                    </div>
                                ))}
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        )
    }

    // Get navigation items for current role
    const navigationItems = getNavigationItems(role, userId).map(item => ({
        ...item,
        current: item.href === currentPath,
    }))

    return (
        <div className="hidden md:flex md:w-64 md:flex-col transition-all duration-300 ease-in-out">
            <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
                <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                    <nav className="mt-5 flex-1 space-y-1 px-2">
                        {navigationItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    item.current
                                        ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <item.icon
                                    className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200 ${
                                        item.current 
                                            ? 'text-indigo-500' 
                                            : 'text-gray-400 group-hover:text-gray-500'
                                    }`}
                                />
                                {item.name}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}
