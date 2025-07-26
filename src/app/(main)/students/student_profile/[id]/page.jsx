'use client'
import { supabase } from '@/lib/supabaseClient'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

import {
    BellIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    ArrowLeftIcon,
    PhotoIcon,
    XMarkIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon
} from '@heroicons/react/24/outline'
import {
    AcademicCapIcon,
    UserGroupIcon,
    BookOpenIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    CalendarDaysIcon,
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    IdentificationIcon,
    BuildingLibraryIcon
} from '@heroicons/react/24/solid'

export default function StudentDetailPage() {
    const router = useRouter()
    const params = useParams()
    const { id } = params;
    const [student, setStudent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const navigation = [
        { name: 'ภาพรวม', href: '/dashboard', icon: ChartBarIcon, current: false },
        { name: 'จัดการนักศึกษา', href: '/students/student_management', icon: UserGroupIcon, current: true },
        { name: 'รายวิชา', href: '/courses', icon: BookOpenIcon, current: false },
        { name: 'การลงทะเบียน', href: '/register', icon: ClipboardDocumentListIcon, current: false },
        { name: 'ปฏิทินกิจกรรม', href: '/calendar', icon: CalendarDaysIcon, current: false },
        { name: 'รายงาน', href: '/report', icon: ChartBarIcon, current: false }
    ]


    useEffect(() => {
        const fetchStudent = async () => {
            try {

                const res = await fetch(`/api/student/${id}`)
                const data = await res.json()

                setStudent(data)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching student:', error)
                setLoading(false)
            }
        }

        fetchStudent()
    }, [id])

    const handleEdit = () => {
        router.push(`/students/edit_student/${student.id}`)
    }

    const handleDelete = () => {
        setShowDeleteModal(true)
    }

    const confirmDelete = async () => {
        try {
            // Add delete logic here
            // const { error } = await supabase
            //     .from('students')
            //     .delete()
            //     .eq('id', student.id)

            console.log('Student deleted')
            router.push('/students/student_management')
        } catch (error) {
            console.error('Error deleting student:', error)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getYearText = (year) => {
        const yearTexts = {
            1: 'ปี 1',
            2: 'ปี 2',
            3: 'ปี 3',
            4: 'ปี 4',
            5: 'ปี 5',
            6: 'ปี 6'
        }
        return yearTexts[year] || `ปี ${year}`
    }

    // if (loading) {
    //     return (
    //         <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
    //             <div className="text-center">
    //                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
    //                 <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
    //             </div>
    //         </div>
    //     )
    // }

    // if (!student) {
    //     return (
    //         <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
    //             <div className="text-center">
    //                 <p className="text-gray-600">ไม่พบข้อมูลนักศึกษา</p>
    //             </div>
    //         </div>
    //     )
    // }

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
                <div className="flex flex-1 flex-col overflow-hidden">
                    <main className="flex-1 relative overflow-y-auto focus:outline-none">
                        <div className="py-6">
                            <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                                {/* Page header */}
                                <div className="mb-6">
                                    <button
                                        onClick={() => router.push("/students/student_management")}
                                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
                                    >
                                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                        กลับไปยังจัดการนักศึกษา
                                    </button>

                                    <div className="md:flex md:items-center md:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:truncate sm:text-3xl">
                                                ข้อมูลนักศึกษา
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-500">
                                                รายละเอียดข้อมูลของนักศึกษา
                                            </p>
                                        </div>
                                        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                                            <button
                                                onClick={handleEdit}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                <PencilIcon className="h-4 w-4 mr-2" />
                                                แก้ไข
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                <TrashIcon className="h-4 w-4 mr-2" />
                                                ลบ
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Student Profile Card */}

                                <div className="bg-white shadow rounded-lg p-6 mb-6">
                                    <div className="flex items-center space-x-6">
                                        <div className="shrink-0">
                                            {loading ? (
                                                // Skeleton for profile image
                                                <div className="h-24 w-24 rounded-full bg-gray-200 border-4 border-gray-200 animate-pulse"></div>
                                            ) : (
                                                student.profile_image_url ? (
                                                    <img
                                                        className="h-24 w-24 object-cover rounded-full border-4 border-gray-200"
                                                        src={student.profile_image_url}
                                                        alt="Profile"
                                                    />
                                                ) : (
                                                    <div className="h-24 w-24 rounded-full bg-indigo-100 border-4 border-gray-200 flex items-center justify-center">
                                                        <UserIcon className="h-12 w-12 text-indigo-600" />
                                                    </div>
                                                )
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            {loading ? (

                                                <>
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-56 mb-3"></div>
                                                    <div className="flex items-center space-x-4">
                                                        <div className="h-4 bg-gray-200 rounded-full animate-pulse w-20"></div>
                                                        <div className="h-4 bg-gray-200 rounded-full animate-pulse w-16"></div>
                                                        <div className="h-4 bg-gray-200 rounded-full animate-pulse w-14"></div>
                                                    </div>
                                                </>
                                            ) : (

                                                <>
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        {student.title}{student.first_name} {student.last_name}
                                                    </h3>
                                                    <p className="text-lg text-gray-600">
                                                        {student.title_eng}{student.first_name_eng} {student.last_name_eng}
                                                    </p>
                                                    <div className="mt-2 flex items-center space-x-4">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                            {student.student_id}
                                                        </span>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            {getYearText(student.year_level)}
                                                        </span>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {student.enrollment_type}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Student Information Sections */}
                                <div className="space-y-6">
                                    {/* Contact Information */}
                                    {loading ? (
                                        <>
                                            <div className="bg-white shadow rounded-lg p-6">
                                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                                    <EnvelopeIcon className="h-5 w-5 mr-2 text-indigo-600" />
                                                    ข้อมูลติดต่อ
                                                </h3>
                                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                                    <div className="flex items-center space-x-3">
                                                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">อีเมล</p>
                                                            <p className="mt-1 h-4 bg-gray-200 rounded-full animate-pulse w-[190px]"></p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">เบอร์โทรศัพท์</p>
                                                            <p className="mt-1 h-4 bg-gray-200 rounded-full animate-pulse w-[90px]"></p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <IdentificationIcon className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">เลขบัตรประชาชน</p>
                                                            <p className="mt-1 h-4 bg-gray-200 rounded-full animate-pulse w-[100px]"></p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">วันเกิด</p>
                                                            <p className="mt-1 h-4 bg-gray-200 rounded-full animate-pulse w-[120px]"></p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-6 flex items-start space-x-3">
                                                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">ที่อยู่</p>
                                                        <p className="mt-1 h-4 bg-gray-200 rounded-full animate-pulse w-[300px]"></p>
                                                        <p className="mt-1 h-4 bg-gray-200 rounded-full animate-pulse w-[250px]"></p>
                                                        <p className="mt-1 h-4 bg-gray-200 rounded-full animate-pulse w-[200px]"></p>
                                                    </div>
                                                </div>

                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="bg-white shadow rounded-lg p-6">
                                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                                    <EnvelopeIcon className="h-5 w-5 mr-2 text-indigo-600" />
                                                    ข้อมูลติดต่อ
                                                </h3>
                                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                                    <div className="flex items-center space-x-3">
                                                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">อีเมล</p>
                                                            <p className="text-sm text-gray-900">{student.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">เบอร์โทรศัพท์</p>
                                                            <p className="text-sm text-gray-900">{student.phone}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <IdentificationIcon className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">เลขบัตรประชาชน</p>
                                                            <p className="text-sm text-gray-900">{student.id_card}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">วันเกิด</p>
                                                            <p className="text-sm text-gray-900">{formatDate(student.birth_date)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {student.address && (
                                                    <div className="mt-6 flex items-start space-x-3">
                                                        <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">ที่อยู่</p>
                                                            <p className="text-sm text-gray-900">{student.address}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}



                                    {/* Academic Information */}
                                    {loading ? (
                                        <>
                                            <div className="bg-white shadow rounded-lg p-6">
                                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                                    <AcademicCapIcon className="h-5 w-5 mr-2 text-indigo-600" />
                                                    ข้อมูลการศึกษา
                                                </h3>
                                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                                    <div className="flex items-center space-x-3">
                                                        <BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">คณะ</p>
                                                            <p className="mt-1 h-4 bg-gray-200 rounded-full animate-pulse w-20"></p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <BookOpenIcon className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">สาขาวิชา</p>
                                                            <p className="mt-1 h-4 bg-gray-200 rounded-full animate-pulse w-10"></p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">ชั้นปี</p>
                                                            <p className="mt-1 h-4 bg-gray-200 rounded-full animate-pulse w-10"></p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <ClipboardDocumentListIcon className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">ประเภทการเรียน</p>
                                                            <p className="mt-1 h-4 bg-gray-200 rounded-full animate-pulse w-15"></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="bg-white shadow rounded-lg p-6">
                                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                                    <AcademicCapIcon className="h-5 w-5 mr-2 text-indigo-600" />
                                                    ข้อมูลการศึกษา
                                                </h3>
                                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                                    <div className="flex items-center space-x-3">
                                                        <BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">คณะ</p>
                                                            <p className="text-sm text-gray-900">{student.faculty}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <BookOpenIcon className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">สาขาวิชา</p>
                                                            <p className="text-sm text-gray-900">{student.major}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">ชั้นปี</p>
                                                            <p className="text-sm text-gray-900">{getYearText(student.year_level)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <ClipboardDocumentListIcon className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">ประเภทการเรียน</p>
                                                            <p className="text-sm text-gray-900">{student.enrollment_type}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Academic Progress */}
                                    {/* <div className="bg-white shadow rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                            <ChartBarIcon className="h-5 w-5 mr-2 text-indigo-600" />
                                            ความก้าวหน้าการศึกษา
                                        </h3>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                            <div className="text-center p-4 bg-indigo-50 rounded-lg">
                                                <p className="text-2xl font-bold text-indigo-600"> TEST </p>
                                                <p className="text-sm text-gray-600">เกรดเฉลี่ย</p>
                                            </div>
                                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                                <p className="text-2xl font-bold text-green-600"> TEST </p>
                                                <p className="text-sm text-gray-600">หน่วยกิตที่ผ่าน</p>
                                            </div>
                                            <div className="text-center p-4 bg-orange-50 rounded-lg">
                                                <p className="text-2xl font-bold text-orange-600"> TEST </p>
                                                <p className="text-sm text-gray-600">หน่วยกิตที่เหลือ</p>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>ความคืบหน้า</span>
                                                <span>{Math.round((student.credits_completed / student.credits_required) * 100)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-indigo-600 h-2 rounded-full"
                                                    style={{ width: `${(student.credits_completed / student.credits_required) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div> */}

                                    {/* Emergency Contact */}
                                    {loading ? (
                                        <>

                                            <div className="bg-white shadow rounded-lg p-6">
                                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                                    <PhoneIcon className="h-5 w-5 mr-2 text-indigo-600" />
                                                    ผู้ติดต่อฉุกเฉิน
                                                </h3>
                                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                                                    <div className="flex items-center space-x-3">
                                                        <UserIcon className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">ชื่อผู้ติดต่อ</p>
                                                            <p className="mt-1 h-4 bg-gray-200 rounded-full animate-pulse w-30"></p>
                                                        </div>
                                                    </div>


                                                    <div className="flex items-center space-x-3">
                                                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">เบอร์โทรศัพท์</p>
                                                            <p className="mt-1 h-4 bg-gray-200 rounded-full animate-pulse w-30"></p>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                        </>
                                    ) : (
                                        <>
                                            {(student.emergency_contact || student.emergency_phone) && (
                                                <div className="bg-white shadow rounded-lg p-6">
                                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                                        <PhoneIcon className="h-5 w-5 mr-2 text-indigo-600" />
                                                        ผู้ติดต่อฉุกเฉิน
                                                    </h3>
                                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                                        {student.emergency_contact && (
                                                            <div className="flex items-center space-x-3">
                                                                <UserIcon className="h-5 w-5 text-gray-400" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-500">ชื่อผู้ติดต่อ</p>
                                                                    <p className="text-sm text-gray-900">{student.emergency_contact}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {student.emergency_phone && (
                                                            <div className="flex items-center space-x-3">
                                                                <PhoneIcon className="h-5 w-5 text-gray-400" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-500">เบอร์โทรศัพท์</p>
                                                                    <p className="text-sm text-gray-900">{student.emergency_phone}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}


                                    {/* System Information */}
                                    {loading ? (
                                        <>
                                            <div className="bg-white shadow rounded-lg p-6">
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลระบบ</h3>
                                                <div className="text-sm text-gray-600">
                                                    <p className="mt-1 h-4 bg-gray-200 rounded-full animate-pulse w-40"></p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="bg-white shadow rounded-lg p-6">
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลระบบ</h3>
                                                <div className="text-sm text-gray-600">
                                                    <p>วันที่สร้างบัญชี: {formatDate(student.created_at)}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                <TrashIcon className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">ยืนยันการลบนักศึกษา</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                คุณแน่ใจหรือไม่ที่จะลบข้อมูลของ {student.title}{student.first_name} {student.last_name}?
                                การดำเนินการนี้ไม่สามารถย้อนกลับได้
                            </p>
                            <div className="flex justify-center space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                                >
                                    ลบนักศึกษา
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}