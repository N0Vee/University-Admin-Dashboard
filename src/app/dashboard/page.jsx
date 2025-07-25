'use client'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import {
    BellIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    Cog6ToothIcon,
    UserCircleIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    EllipsisVerticalIcon
} from '@heroicons/react/24/outline'
import {
    AcademicCapIcon,
    UserGroupIcon,
    BookOpenIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/solid'

export default function DashboardPage() {
    const router = useRouter()
    const [students, setStudents] = useState([]);
    const [studentsCount, setStudentsCount] = useState(0)
    const [sidebarOpen, setSidebarOpen] = useState(false)


    // Mock data
    const stats = [
        {
            name: 'นักศึกษาทั้งหมด',
            value: studentsCount,
            change: '',
            changeType: 'positive',
            icon: UserGroupIcon,
            color: 'bg-indigo-500'
        },
        {
            name: 'นักศึกษาใหม่',
            value: studentsCount,
            change: '',
            changeType: 'positive',
            icon: AcademicCapIcon,
            color: 'bg-emerald-500'
        },
        {
            name: 'วิชาที่เปิดสอน',
            value: '0',
            change: '',
            changeType: '',
            icon: BookOpenIcon,
            color: 'bg-amber-500'
        },
        {
            name: 'งานที่รอตรวจ',
            value: '0',
            change: '',
            changeType: 'negative',
            icon: ClipboardDocumentListIcon,
            color: 'bg-rose-500'
        }
    ]

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch("/api/students")
                const data = await res.json()
                setStudents(data)
                setStudentsCount(data.length)
            } catch (error) {
                throw new Error(error)
            }
        };

        fetchStudents();

    }, []);

    
    const upcomingEvents = [
        { id: 1, title: 'วันลงทะเบียนเรียน', date: '2024-08-15', type: 'registration' },
        { id: 2, title: 'สอบกลางภาค', date: '2024-09-20', type: 'exam' },
        { id: 3, title: 'วันซ้อมรับปริญญา', date: '2024-10-05', type: 'graduation' },
        { id: 4, title: 'วันประเมินอาจารย์', date: '2024-09-30', type: 'evaluation' }
    ]

    const navigation = [
        { name: 'ภาพรวม', href: '/dashboard', icon: ChartBarIcon, current: true },
        { name: 'จัดการนักศึกษา', href: '/students/student_management', icon: UserGroupIcon, current: false },
        { name: 'รายวิชา', href: '/courses', icon: BookOpenIcon, current: false },
        { name: 'การลงทะเบียน', href: '/register', icon: ClipboardDocumentListIcon, current: false },
        { name: 'ปฏิทินกิจกรรม', href: '/calendar', icon: CalendarDaysIcon, current: false },
        { name: 'รายงาน', href: '/report', icon: ChartBarIcon, current: false }
    ]

    return (
        <div className="min-h-screen bg-zinc-50">
            {/* Top Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex flex-shrink-0 items-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600">
                                    <AcademicCapIcon className="h-6 w-6 text-white" />
                                </div>
                                <span className="ml-3 text-xl font-semibold text-gray-900">
                                    Student Management
                                </span>
                            </div>
                        </div>

                        <div className="hidden md:flex md:items-center md:space-x-6">

                            {/* Notifications */}
                            <button className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500">
                                <span className="absolute -inset-1.5" />
                                <BellIcon className="h-6 w-6" />
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                            </button>

                            {/* Profile dropdown */}
                            <div className="relative">
                                <button className="flex max-w-xs items-center rounded-full bg-white text-sm hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2">
                                    <span className="sr-only">Open user menu</span>
                                    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                                        <span className="text-xs font-medium text-white">AD</span>
                                    </div>
                                    <span className="ml-3 text-sm font-medium text-gray-700">Admin</span>
                                    <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex h-screen pt-16">
                {/* Sidebar */}
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

                {/* Main Content */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    <main className="flex-1 relative overflow-y-auto focus:outline-none">
                        <div className="py-6">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                                {/* Page header */}
                                <div className="md:flex md:items-center md:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                                            ภาพรวมระบบ
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-500">
                                            ข้อมูลสรุปและสถิติการจัดการนักศึกษา
                                        </p>
                                    </div>
                                    <div className="mt-4 flex md:ml-4 md:mt-0">
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                        >
                                            ส่งออกรายงาน
                                        </button>
                                        <button
                                            type="button"
                                            className="cursor-pointer ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            onClick={() => router.push('/students/add_student')}
                                        >
                                            เพิ่มนักศึกษา
                                        </button>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="mt-8">
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                        {stats.map((item) => (
                                            <div
                                                key={item.name}
                                                className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 hover:shadow-md transition-shadow duration-200"
                                            >
                                                <dt>
                                                    <div className={`absolute rounded-md p-3 ${item.color}`}>
                                                        <item.icon className="h-6 w-6 text-white" />
                                                    </div>
                                                    <p className="ml-16 truncate text-sm font-medium text-gray-500">
                                                        {item.name}
                                                    </p>
                                                </dt>
                                                <dd className="ml-16 flex items-baseline">
                                                    <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                                                    <p
                                                        className={`ml-2 flex items-baseline text-sm font-semibold ${item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                                            }`}
                                                    >
                                                        {item.changeType === 'positive' ? (
                                                            <ArrowUpIcon className="h-4 w-4 flex-shrink-0 self-center" />
                                                        ) : (
                                                            <ArrowDownIcon className="h-4 w-4 flex-shrink-0 self-center" />
                                                        )}
                                                        <span className="sr-only">
                                                            {item.changeType === 'positive' ? 'Increased' : 'Decreased'} by
                                                        </span>
                                                        {item.change}
                                                    </p>
                                                </dd>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Main grid */}
                                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
                                    {/* Recent Students */}
                                    <div className="lg:col-span-8">
                                        <div className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                                                        นักศึกษาล่าสุด
                                                    </h3>
                                                    <button onClick={() => router.push('/students/student_management')} className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-500">
                                                        ดูทั้งหมด
                                                    </button>
                                                </div>
                                                <div className="mt-6 flow-root">
                                                    <ul className="-my-5 divide-y divide-gray-200">
                                                        {students.map((student) => (
                                                            <li key={student.id} className="py-4">
                                                                <div className="flex items-center space-x-4">
                                                                    <div className="flex-shrink-0">
                                                                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                                                                            <span className="text-sm font-medium text-white ">
                                                                                <img className=' h-10 w-10 rounded-full' src={student.profile_image_url} alt="" />
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="truncate text-sm font-medium text-gray-900">
                                                                            {student.title} {student.first_name} {student.last_name}
                                                                        </p>
                                                                        <p className="truncate text-sm text-gray-500">
                                                                            {student.student_id} • {student.faculty}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex-shrink-0">
                                                                        <button className="text-gray-400 hover:text-gray-500">
                                                                            <EllipsisVerticalIcon className="h-5 w-5" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Upcoming Events */}
                                    <div className="lg:col-span-4">
                                        <div className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <h3 className="text-base font-semibold leading-6 text-gray-900">
                                                    กิจกรรมที่จะมาถึง
                                                </h3>
                                                <div className="mt-6 space-y-4">
                                                    {upcomingEvents.map((event) => (
                                                        <div key={event.id} className="flex items-start space-x-3">
                                                            <div className="flex-shrink-0">
                                                                <div className="h-2 w-2 mt-2 bg-indigo-600 rounded-full"></div>
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {event.title}
                                                                </p>
                                                                <p className="text-sm text-gray-500">{event.date}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-6">
                                                    <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-500">
                                                        ดูปฏิทินทั้งหมด
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <h3 className="text-base font-semibold leading-6 text-gray-900">
                                                    การดำเนินการด่วน
                                                </h3>
                                                <div className="mt-6 space-y-3">
                                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                                        📊 สร้างรายงานประจำเดือน
                                                    </button>
                                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                                        📝 อนุมัติการลงทะเบียน
                                                    </button>
                                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                                        💌 ส่งประกาศสำคัญ
                                                    </button>
                                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                                        ⚙️ ตั้งค่าระบบ
                                                    </button>
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