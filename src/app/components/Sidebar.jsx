'use client'
import { useState, useEffect } from 'react'
import {
    UserGroupIcon,
    BookOpenIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    CalendarDaysIcon,
    UserIcon,
} from '@heroicons/react/24/solid'

export default function Sidebar({ currentPath }) {
    const [userRole, setUserRole] = useState(null)

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await fetch('/api/auth/get-role')
                const data = await response.json()
                setUserRole(data.role)
            } catch (error) {
                console.error('Error fetching user role:', error)
            }
        }
        fetchUserRole()
    }, [])

    // Define navigation items based on role
    const getNavigationItems = () => {
        const baseItems = []

        if (userRole === 'admin') {
            // Admin can see everything
            baseItems.push(
                { name: 'ภาพรวม', href: '/dashboard', icon: ChartBarIcon },
                { name: 'จัดการนักศึกษา', href: '/students', icon: UserGroupIcon },
                { name: 'รายวิชา', href: '/courses', icon: BookOpenIcon },
                { name: 'การลงทะเบียน', href: '/register', icon: ClipboardDocumentListIcon },
                { name: 'ปฏิทินกิจกรรม', href: '/calendar', icon: CalendarDaysIcon },
                { name: 'รายงาน', href: '/report', icon: ChartBarIcon }
            )
        } else if (userRole === 'instructor') {
            // Instructor can only manage courses
            baseItems.push(
                { name: 'ภาพรวม', href: '/dashboard', icon: ChartBarIcon },
                { name: 'รายวิชา', href: '/courses', icon: BookOpenIcon }
            )
        } else if (userRole === 'student') {
            // Student can only view courses and profile
            baseItems.push(
                { name: 'ภาพรวม', href: '/dashboard', icon: ChartBarIcon },
                { name: 'รายวิชา', href: '/courses', icon: BookOpenIcon },
                { name: 'โปรไฟล์', href: '/profile', icon: UserIcon }
            )
        }

        return baseItems.map(item => ({
            ...item,
            current: item.href === currentPath,
        }))
    }

    const navigation = getNavigationItems()

    return (
        <div className="hidden md:flex md:w-64 md:flex-col">
            <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
                <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                    <nav className="mt-5 flex-1 space-y-1 px-2">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${item.current
                                        ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon
                                    className={`mr-3 flex-shrink-0 h-5 w-5 ${item.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
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
