'use client'

import { useState } from 'react'
import {
    BellIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    ArrowLeftIcon,
    PhotoIcon,
    XMarkIcon
} from '@heroicons/react/24/outline'
import {
    AcademicCapIcon,
    UserGroupIcon,
    BookOpenIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    CalendarDaysIcon,
    CheckCircleIcon
} from '@heroicons/react/24/solid'

export default function AddStudentPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        studentId: '',
        email: '',
        phone: '',
        birthDate: '',
        idCard: '',
        faculty: '',
        major: '',
        yearLevel: '',
        enrollmentType: '',
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
        profileImage: null
    })

    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const navigation = [
        { name: 'ภาพรวม', href: '#', icon: ChartBarIcon, current: false },
        { name: 'จัดการนักศึกษา', href: '#', icon: UserGroupIcon, current: true },
        { name: 'รายวิชา', href: '#', icon: BookOpenIcon, current: false },
        { name: 'การลงทะเบียน', href: '#', icon: ClipboardDocumentListIcon, current: false },
        { name: 'ปฏิทินกิจกรรม', href: '#', icon: CalendarDaysIcon, current: false },
        { name: 'รายงาน', href: '#', icon: ChartBarIcon, current: false }
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

    const yearLevels = ['ปี 1', 'ปี 2', 'ปี 3', 'ปี 4', 'ปี 5', 'ปี 6']
    const enrollmentTypes = ['ปกติ', 'กศ.บป.', 'นานาชาติ', 'พิเศษ']

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData(prev => ({
                ...prev,
                profileImage: file
            }))
        }
    }

    const handleSubmit = (e) => {
        // Simulate form submission
        setShowSuccessModal(true)
    }

    const handleGoBack = () => {
        // Navigate back to student management
        console.log('Go back to student management')
    }

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
                            {/* Search */}
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="ค้นหานักศึกษา..."
                                    className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                                />
                            </div>

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
                            <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                                {/* Page header */}
                                <div className="mb-6">
                                    <button
                                        onClick={handleGoBack}
                                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
                                    >
                                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                        กลับไปยังจัดการนักศึกษา
                                    </button>

                                    <div className="md:flex md:items-center md:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                                                เพิ่มนักศึกษาใหม่
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-500">
                                                กรอกข้อมูลนักศึกษาใหม่เพื่อเพิ่มเข้าสู่ระบบ
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form */}
                                <div className="space-y-6">
                                    {/* Profile Image Section */}
                                    <div className="bg-white shadow rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">รูปโปรไฟล์</h3>
                                        <div className="flex items-center space-x-6">
                                            <div className="shrink-0">
                                                {formData.profileImage ? (
                                                    <img
                                                        className="h-20 w-20 object-cover rounded-full"
                                                        src={URL.createObjectURL(formData.profileImage)}
                                                        alt="Profile preview"
                                                    />
                                                ) : (
                                                    <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <PhotoIcon className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <label htmlFor="profileImage" className="cursor-pointer">
                                                    <span className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                        เลือกรูปภาพ
                                                    </span>
                                                    <input
                                                        id="profileImage"
                                                        name="profileImage"
                                                        type="file"
                                                        accept="image/*"
                                                        className="sr-only"
                                                        onChange={handleImageUpload}
                                                    />
                                                </label>
                                                <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF ขนาดไม่เกิน 10MB</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Personal Information */}
                                    <div className="bg-white shadow rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลส่วนตัว</h3>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                                    ชื่อ *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    id="firstName"
                                                    required
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                                    นามสกุล *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    id="lastName"
                                                    required
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                                                    รหัสนักศึกษา *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="studentId"
                                                    id="studentId"
                                                    required
                                                    value={formData.studentId}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="idCard" className="block text-sm font-medium text-gray-700">
                                                    เลขบัตรประชาชน *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="idCard"
                                                    id="idCard"
                                                    required
                                                    value={formData.idCard}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                                                    วันเกิด *
                                                </label>
                                                <input
                                                    type="date"
                                                    name="birthDate"
                                                    id="birthDate"
                                                    required
                                                    value={formData.birthDate}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                    อีเมล *
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                    เบอร์โทรศัพท์ *
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    id="phone"
                                                    required
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                                ที่อยู่
                                            </label>
                                            <textarea
                                                name="address"
                                                id="address"
                                                rows={3}
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Academic Information */}
                                    <div className="bg-white shadow rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลการศึกษา</h3>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">
                                                    คณะ *
                                                </label>
                                                <select
                                                    name="faculty"
                                                    id="faculty"
                                                    required
                                                    value={formData.faculty}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                >
                                                    <option value="">เลือกคณะ</option>
                                                    {faculties.map((faculty) => (
                                                        <option key={faculty} value={faculty}>
                                                            {faculty}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="major" className="block text-sm font-medium text-gray-700">
                                                    สาขาวิชา *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="major"
                                                    id="major"
                                                    required
                                                    value={formData.major}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="yearLevel" className="block text-sm font-medium text-gray-700">
                                                    ชั้นปี *
                                                </label>
                                                <select
                                                    name="yearLevel"
                                                    id="yearLevel"
                                                    required
                                                    value={formData.yearLevel}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                >
                                                    <option value="">เลือกชั้นปี</option>
                                                    {yearLevels.map((year) => (
                                                        <option key={year} value={year}>
                                                            {year}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="enrollmentType" className="block text-sm font-medium text-gray-700">
                                                    ประเภทการเรียน *
                                                </label>
                                                <select
                                                    name="enrollmentType"
                                                    id="enrollmentType"
                                                    required
                                                    value={formData.enrollmentType}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                >
                                                    <option value="">เลือกประเภทการเรียน</option>
                                                    {enrollmentTypes.map((type) => (
                                                        <option key={type} value={type}>
                                                            {type}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Emergency Contact */}
                                    <div className="bg-white shadow rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">ผู้ติดต่อฉุกเฉิน</h3>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
                                                    ชื่อผู้ติดต่อฉุกเฉิน
                                                </label>
                                                <input
                                                    type="text"
                                                    name="emergencyContact"
                                                    id="emergencyContact"
                                                    value={formData.emergencyContact}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700">
                                                    เบอร์โทรศัพท์ฉุกเฉิน
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="emergencyPhone"
                                                    id="emergencyPhone"
                                                    value={formData.emergencyPhone}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-6">
                                        <button
                                            type="button"
                                            onClick={handleGoBack}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            ยกเลิก
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            เพิ่มนักศึกษา
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircleIcon className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">เพิ่มนักศึกษาสำเร็จ!</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                ข้อมูลนักศึกษาได้ถูกเพิ่มเข้าสู่ระบบเรียบร้อยแล้ว
                            </p>
                            <div className="flex justify-center space-x-3">
                                <button
                                    onClick={() => setShowSuccessModal(false)}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    เพิ่มนักศึกษาคนต่อไป
                                </button>
                                <button
                                    onClick={handleGoBack}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                                >
                                    กลับไปหน้าจัดการ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}