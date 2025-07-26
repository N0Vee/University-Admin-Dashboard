'use client'
import { supabase } from '@/lib/supabaseClient'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    BellIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline'
import {
    AcademicCapIcon,
    UserGroupIcon,
    BookOpenIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    CalendarDaysIcon,
    EyeIcon,
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/react/24/solid'

export default function StudentManagementPage() {
    const router = useRouter()
    const [students, setStudents] = useState([])
    const [search, setSearch] = useState('')
    const [selectedFaculty, setSelectedFaculty] = useState('ทุกคณะ')
    const [selectedYear, setSelectedYear] = useState('ทุกชั้นปี')
    const [selectedEnrollmentType, setSelectedEnrollmentType] = useState('ทุกประเภทการศึกษา')

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch("/api/students");

                if (!res.ok) {
                    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
                }

                const data = await res.json();
                setStudents(data);
            } catch (error) {
                console.error("เกิดข้อผิดพลาดขณะดึงข้อมูล:", error);
            }
        };

        fetchStudents();
    }, []);


    const navigation = [
        { name: 'ภาพรวม', href: '/dashboard', icon: ChartBarIcon, current: false },
        { name: 'จัดการนักศึกษา', href: '/students/student_management', icon: UserGroupIcon, current: true },
        { name: 'รายวิชา', href: '/courses', icon: BookOpenIcon, current: false },
        { name: 'การลงทะเบียน', href: '/register', icon: ClipboardDocumentListIcon, current: false },
        { name: 'ปฏิทินกิจกรรม', href: '/calendar', icon: CalendarDaysIcon, current: false },
        { name: 'รายงาน', href: '/report', icon: ChartBarIcon, current: false }
    ]

    const faculties = [
        'วิศวกรรมศาสตร์',
        'ครุศาสตร์',
        'วิทยาศาสตร์',
        'ศิลปศาสตร์',
        'บริหารธุรกิจ',
        'แพทยศาสตร์',
        'พยาบาลศาสตร์',
        'เทคโนโลยีสารสนเทศ'
    ]

    const yearLevels = [1, 2, 3, 4, 5, 6]
    const enrollmentTypes = ['ปกติ', 'กศ.บป.', 'นานาชาติ', 'พิเศษ']

    const filteredStudents = students.filter((student) => {
        const fullName = `${student.title} ${student.first_name} ${student.last_name}`.toLowerCase()
        const matchesSearch = fullName.includes(search.toLowerCase()) || student.student_id.includes(search)

        const matchesFaculty =
            selectedFaculty === 'ทุกคณะ' || student.faculty === selectedFaculty

        const matchesYear =
            selectedYear === 'ทุกชั้นปี' || `ปี ${student.year_level}` === selectedYear

        const matchesEnrollmentType =
            selectedEnrollmentType === 'ทุกประเภทการศึกษา' || student.enrollment_type === selectedEnrollmentType

        return matchesSearch && matchesFaculty && matchesYear && matchesEnrollmentType
    })

    return (
        <div className="min-h-screen bg-zinc-50">

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
                <main className="flex-1 bg-zinc-50 p-6 overflow-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">จัดการนักศึกษา</h1>
                        <button onClick={() => router.push("/students/add_student")} className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700">
                            เพิ่มนักศึกษา
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-4 mb-6">
                        <select
                            value={selectedFaculty}
                            onChange={(e) => setSelectedFaculty(e.target.value)}
                            className="text-black block w-fit rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option>ทุกคณะ</option>
                            {faculties.map((faculty) => (
                                <option key={faculty}>{faculty}</option>
                            ))}
                        </select>

                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="text-black block w-fit rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option>ทุกชั้นปี</option>
                            {yearLevels.map((year) => (
                                <option key={year}>ปี {year}</option>
                            ))}
                        </select>

                        <select
                            value={selectedEnrollmentType}
                            onChange={(e) => setSelectedEnrollmentType(e.target.value)}
                            className="text-black block w-fit rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option>ทุกประเภทการศึกษา</option>
                            {enrollmentTypes.map((type) => (
                                <option key={type}>{type}</option>
                            ))}
                        </select>

                        {/* Search */}
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="ค้นหานักศึกษา..."
                                className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* Student Table */}
                    <div className="overflow-auto rounded-lg shadow bg-white">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">รูปภาพ</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">รหัสนักศึกษา</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">ชื่อ - นามสกุล</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">คณะ</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">ชั้นปี</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">ประเภท</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredStudents.map((student, index) => (
                                    <tr className='cursor-pointer hover:bg-gray-100' key={index} onClick={() => {router.push(`/students/student_profile/${student.id}`)}}>
                                        <td className="px-4 py-3">
                                            <img
                                                src={student.profile_image_url}
                                                alt="profile"
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-gray-900">{student.student_id}</td>
                                        <td className="px-4 py-3 text-gray-900">{student.title} {student.first_name} {student.last_name}</td>
                                        <td className="px-4 py-3 text-gray-900">{student.faculty}</td>
                                        <td className="px-4 py-3 text-gray-900">ปี {student.year_level}</td>
                                        <td className="px-4 py-3 text-gray-900">{student.enrollment_type}</td>
                                        <td className="px-4 py-3 space-x-2">
                                            <button className="text-indigo-600 hover:underline text-xs">
                                                <EyeIcon className="h-5 w-5 text-blue" />
                                            </button>
                                            <button className="text-yellow-500 hover:underline text-xs">
                                                <PencilSquareIcon className="h-5 w-5 text-yellow" />
                                            </button>
                                            <button className="text-red-500 hover:underline text-xs">
                                                <TrashIcon className="h-5 w-5 text-red" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    )
}
