'use client'
import {
  BookOpenIcon,
  UserIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/solid'
import { useAuth } from '../context/AuthContext'

export default function StudentSidebar({ currentPath }) {
  const { userId } = useAuth()

  const navigation = [
    { name: 'โปรไฟล์', href: `/students/profile/${userId}`, icon: UserIcon },
    { name: 'รายวิชา', href: '/courses', icon: BookOpenIcon },
    { name: 'ลงทะเบียนเรียน', href: '/register', icon: ClipboardDocumentListIcon },
  ].map(item => ({
    ...item,
    current: item.href === currentPath,
  }))

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
