'use client'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import Sidebar from '@/app/components/Sidebar'
import Image from 'next/image'

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
    const [coursesCount, setCoursesCount] = useState(0)
    const [sidebarOpen, setSidebarOpen] = useState(false)


    // Mock data
    const stats = [
        {
            name: 'นักศึกษาทั้งหมด',
            value: studentsCount,
            icon: UserGroupIcon,
            color: 'bg-indigo-500'
        },
        {
            name: 'นักศึกษาใหม่',
            value: studentsCount,
            icon: AcademicCapIcon,
            color: 'bg-emerald-500'
        },
        {
            name: 'วิชาที่เปิดสอน',
            value: coursesCount,
            icon: BookOpenIcon,
            color: 'bg-amber-500'
        },
        {
            name: 'งานที่รอตรวจ',
            value: '0',
            icon: ClipboardDocumentListIcon,
            color: 'bg-rose-500'
        }
    ]

    useEffect(() => {

        const fetchStudents = async () => {
            try {
                const res = await fetch("/api/students?orderBy=id&order=asc",);

                if (!res.ok) {
                    if (res.status === 401) {
                        router.replace('/login')
                    }
                    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
                }

                const data = await res.json();
                setStudents(data);
                setStudentsCount(data.length);
            } catch (error) {
                console.error("เกิดข้อผิดพลาดขณะดึงข้อมูล:", error);
            }
        };

        fetchStudents();

    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/courses')
                if (!res.ok) {
                    if (res.status === 401) {
                        router.replace('/login')
                    }
                    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
                }
                const data = await res.json()
                setCoursesCount(data.length)
            } catch (error) {
                console.error(error)
            }
        }

        fetchCourses()
    }, [])



    const upcomingEvents = [
        { id: 1, title: 'วันลงทะเบียนเรียน', date: '2024-08-15', type: 'registration' },
        { id: 2, title: 'สอบกลางภาค', date: '2024-09-20', type: 'exam' },
        { id: 3, title: 'วันซ้อมรับปริญญา', date: '2024-10-05', type: 'graduation' },
        { id: 4, title: 'วันประเมินอาจารย์', date: '2024-09-30', type: 'evaluation' }
    ]

    return (
        <div className="min-h-screen bg-zinc-50">


            <div className="flex h-screen pt-16">
                {/* Sidebar */}
                <Sidebar currentPath="/dashboard" />

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
                                                            <li key={student.id} className="py-4 cursor-pointer hover:bg-gray-100" onClick={() => { router.push(`/students/student_profile/${student.id}`) }}>
                                                                <div className="flex items-center space-x-4">
                                                                    <div className="flex-shrink-0">
                                                                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                                                                            <span className="text-sm font-medium text-white ">
                                                                                <Image
                                                                                    width={10}
                                                                                    height={10}
                                                                                    unoptimized
                                                                                    className='h-10 w-10 rounded-full'
                                                                                    key={student.profile_image_url}
                                                                                    src={student.profile_image_url} 
                                                                                    alt="" 
                                                                                />
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