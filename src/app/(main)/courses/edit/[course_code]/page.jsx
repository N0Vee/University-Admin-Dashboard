'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/app/components/Sidebar'
import { z } from 'zod'

import {
  ArrowLeftIcon,
  BookOpenIcon,
  ClockIcon,
  AcademicCapIcon,
  UserGroupIcon,
  PlusIcon,
  XMarkIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/solid'

export default function CourseEditPage({ params }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [role, setRole] = useState(null);

  useEffect(() => {
      const fetchUserRole = async () => {
        try {
          const res = await fetch('/api/auth/get-role')
          if (!res.ok) {
            if (res.status === 401) {
              router.replace('/login')
            }
            throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
          }
          const data = await res.json()
          setRole(data.role)
  
          if (data.role !== 'admin' && data.role !== 'instructor') {
            router.replace('/courses')
          }
          
        } catch (error) {
          // Error handled silently - could be logged to monitoring service
        } finally {
          setLoading(false)
        }
  
      }
  
      fetchUserRole()
    }, [role])

  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    courseNameEn: '',
    credits: '',
    semester: '',
    faculty: '',
    department: '',
    instructor: '',
    maxStudents: '',
    status: 'active',
    schedule: [],
    objectives: [''],
    description: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      const { course_code } = await params
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/course/${course_code}`)
        if (!res.ok) {
          throw new Error('Failed to fetch course data')
        }
        const data = await res.json()
        setFormData({
          courseCode: data.course_code || '',
          courseName: data.course_name || '',
          courseNameEn: data.course_name_en || '',
          credits: data.credits || '',
          semester: data.semester || '',
          faculty: data.faculty || '',
          department: data.department || '',
          instructor: data.instructor || '',
          maxStudents: data.max_students || '',
          status: data.status || 'active',
          schedule: data.schedule || [],
          objectives: data.objectives.length > 0 ? data.objectives : [''],
          description: data.description || ''
        })
      } catch (error) {
        console.error('Error fetching course data:', error)
      }
    }

    fetchData()
  }, [])



  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const faculties = [
    'วิศวกรรมศาสตร์',
    'ครุศาสตร์',
    'วิทยาศาสตร์',
    'ศิลปศาสตร์',
    'บริหารธุรกิจ',
    'แพทยศาสตร์',
    'เทคโนโลยีการเกษตร',
    'วิทยาลัยแพทยศาสตร์เขตร้อน'
  ]

  const departments = {
    'วิศวกรรมศาสตร์': ['วิศวกรรมคอมพิวเตอร์', 'วิศวกรรมไฟฟ้า', 'วิศวกรรมเครื่องกล', 'วิศวกรรมโยธา'],
    'วิทยาศาสตร์': ['วิทยาการคอมพิวเตอร์', 'คณิตศาสตร์', 'ฟิสิกส์', 'เคมี', 'ชีววิทยา'],
    'ครุศาสตร์': ['การศึกษาปฐมวัย', 'การศึกษาประถม', 'คณิตศาสตรศึกษา', 'ภาษาไทย'],
    'ศิลปศาสตร์': ['ภาษาอังกฤษ', 'ภาษาไทย', 'ประวัติศาสตร์', 'ปรัชญา'],
    'บริหารธุรกิจ': ['การจัดการ', 'การตลาด', 'การบัญชี', 'การเงิน'],
    'แพทยศาสตร์': ['แพทยศาสตร์', 'พยาบาลศาสตร์', 'เทคนิคการแพทย์'],
    'เทคโนโลยีการเกษตร': ['เกษตรศาสตร์', 'วิทยาศาสตร์การอาหาร'],
    'วิทยาลัยแพทยศาสตร์เขตร้อน': ['แพทยศาสตร์เขตร้อน']
  }

  const statusOptions = [
    { value: 'active', label: 'เปิดรับสมัคร', color: 'bg-green-100 text-green-800' },
    { value: 'upcoming', label: 'กำลังจะเปิด', color: 'bg-yellow-100 text-yellow-800' },
  ]

  const daysOfWeek = [
    { value: 'จันทร์', label: 'จันทร์' },
    { value: 'อังคาร', label: 'อังคาร' },
    { value: 'พุธ', label: 'พุธ' },
    { value: 'พฤหัสบดี', label: 'พฤหัสบดี' },
    { value: 'ศุกร์', label: 'ศุกร์' },
    { value: 'เสาร์', label: 'เสาร์' },
    { value: 'อาทิตย์', label: 'อาทิตย์' }
  ]

  // Zod validation schema
  const courseSchema = z.object({
    courseCode: z.string().min(1, 'กรุณากรอกรหัสวิชา'),
    courseName: z.string().min(1, 'กรุณากรอกชื่อวิชา (ภาษาไทย)'),
    courseNameEn: z.string().min(1, 'กรุณากรอกชื่อวิชา (ภาษาอังกฤษ)'),
    credits: z.string().min(1, 'กรุณากรอกจำนวนหน่วยกิต'),
    semester: z.string().min(1, 'กรุณาเลือกภาคเรียน'),
    faculty: z.string().min(1, 'กรุณาเลือกคณะ'),
    department: z.string().min(1, 'กรุณาเลือกภาควิชา'),
    instructor: z.string().min(1, 'กรุณากรอกชื่ออาจารย์ผู้สอน'),
    maxStudents: z.string().min(1, 'กรุณากรอกจำนวนนักศึกษาสูงสุด'),
    status: z.string().min(1, 'กรุณาเลือกสถานะ'),
    schedule: z.array(z.any()).optional(),
    objectives: z.array(z.string()).optional(),
    description: z.string().optional()
  })

  const validateForm = () => {
    try {
      courseSchema.parse(formData)
      setError('')
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessages = err.issues.map(issue => issue.message)
        setError(errorMessages.join(', '))
      } else {
        setError('เกิดข้อผิดพลาดในการตรวจสอบข้อมูล')
      }
      return false
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const addScheduleSlot = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { day: '', room: '', time: '' }]
    }))
  }

  const removeScheduleSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }))
  }

  const handleScheduleChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.map((slot, i) =>
        i === index
          ? {
            ...slot,
            [field]: value
          }
          : slot
      )
    }))
  }

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }))
  }

  const removeObjective = (index) => {
    if (formData.objectives.length > 1) {
      setFormData(prev => ({
        ...prev,
        objectives: prev.objectives.filter((_, i) => i !== index)
      }))
    }
  }

  const handleObjectiveChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) =>
        i === index ? value : obj
      )
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError('')

    try {
      const { course_code } = await params
      const response = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/courses/update/${course_code}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update course')
      }

      setShowSuccessModal(true)
    } catch (err) {
      console.error('Error updating course:', err)
      setError(err.message || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    setError('')

    try {
      const { course_code } = await params
      const response = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/courses/delete/${course_code}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete course')
      }

      router.push('/courses')

    } catch (err) {
      console.error('Error deleting course:', err)
      setError(err.message || 'เกิดข้อผิดพลาดในการลบรายวิชา')
      setShowDeleteModal(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex h-screen">
        <Sidebar currentPath="/courses" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                <div className="animate-pulse">
                  <div className="mb-6">
                    <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-80"></div>
                  </div>
                  
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div key={i}>
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="h-9 bg-gray-200 rounded w-full"></div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 flex justify-end space-x-3">
                        <div className="h-9 w-20 bg-gray-200 rounded"></div>
                        <div className="h-9 w-28 bg-gray-200 rounded"></div>
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

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar currentPath="/courses" />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
              {/* Page header */}
              <div className="mb-6">
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  กลับไปยังจัดการวิชา
                </button>

                <div className="md:flex md:items-center md:justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:truncate sm:text-3xl">
                      แก้ไขข้อมูลวิชา
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      แก้ไขข้อมูลรายวิชาในระบบการจัดการเรียนการสอน
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        เกิดข้อผิดพลาด
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        {error}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information Section */}
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <BookOpenIcon className="h-5 w-5 text-indigo-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">ข้อมูลพื้นฐานวิชา</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700">
                        รหัสวิชา *
                      </label>
                      <input
                        type="text"
                        name="courseCode"
                        id="courseCode"
                        required
                        value={formData.courseCode}
                        onChange={handleInputChange}
                        placeholder="เช่น CS101"
                        className="text-black py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="credits" className="block text-sm font-medium text-gray-700">
                        หน่วยกิต *
                      </label>
                      <input
                        type="number"
                        name="credits"
                        id="credits"
                        required
                        min="1"
                        max="6"
                        value={formData.credits}
                        onChange={handleInputChange}
                        className="text-black py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">
                        ชื่อวิชา (ภาษาไทย) *
                      </label>
                      <input
                        type="text"
                        name="courseName"
                        id="courseName"
                        required
                        value={formData.courseName}
                        onChange={handleInputChange}
                        placeholder="เช่น การเขียนโปรแกรมเบื้องต้น"
                        className="text-black py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="courseNameEn" className="block text-sm font-medium text-gray-700">
                        ชื่อวิชา (ภาษาอังกฤษ) *
                      </label>
                      <input
                        type="text"
                        name="courseNameEn"
                        id="courseNameEn"
                        required
                        value={formData.courseNameEn}
                        onChange={handleInputChange}
                        placeholder="เช่น Introduction to Programming"
                        className="text-black py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information Section */}
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <AcademicCapIcon className="h-5 w-5 text-indigo-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">ข้อมูลทางวิชาการ</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                        ภาคการศึกษา *
                      </label>
                      <input
                        type="text"
                        name="semester"
                        id="semester"
                        required
                        value={formData.semester}
                        onChange={handleInputChange}
                        placeholder="เช่น 1/2567"
                        className="text-black py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

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
                        className="text-black py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                        ภาควิชา *
                      </label>
                      <select
                        name="department"
                        id="department"
                        required
                        value={formData.department}
                        onChange={handleInputChange}
                        disabled={!formData.faculty}
                        className="text-black py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">เลือกภาควิชา</option>
                        {formData.faculty && departments[formData.faculty]?.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
                        รหัสอาจารย์ *
                      </label>
                      <input
                        type="text"
                        name="instructor"
                        id="instructor"
                        required
                        value={formData.instructor}
                        onChange={handleInputChange}
                        placeholder="เช่น PF120"
                        className="text-black py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="maxStudents" className="block text-sm font-medium text-gray-700">
                        จำนวนนักศึกษาสูงสุด *
                      </label>
                      <input
                        type="number"
                        name="maxStudents"
                        id="maxStudents"
                        required
                        min="1"
                        value={formData.maxStudents}
                        onChange={handleInputChange}
                        className="text-black py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        สถานะ *
                      </label>
                      <select
                        name="status"
                        id="status"
                        required
                        value={formData.status}
                        onChange={handleInputChange}
                        className="text-black py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Schedule Section */}
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-indigo-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">ตารางเรียน</h3>
                    </div>
                    <button
                      type="button"
                      onClick={addScheduleSlot}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      เพิ่มเวลาเรียน
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.schedule.map((slot, index) => (
                      <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-4 p-4 border border-gray-200 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            วัน
                          </label>
                          <select
                            value={slot.day}
                            onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                            className="text-black py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="">เลือกวัน</option>
                            {daysOfWeek.map((day) => (
                              <option key={day.value} value={day.value}>
                                {day.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            เวลา
                          </label>
                          <input
                            type="text"
                            value={slot.time}
                            onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                            placeholder="เช่น 08:00-10:00"
                            className="text-black py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div className="flex items-end space-x-2">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ห้องเรียน
                            </label>
                            <input
                              type="text"
                              value={slot.room}
                              onChange={(e) => handleScheduleChange(index, 'room', e.target.value)}
                              placeholder="เช่น A101"
                              className="text-black py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                          {formData.schedule.length > 0 && (
                            <button
                              type="button"
                              onClick={() => removeScheduleSlot(index)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Objectives Section */}
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <UserGroupIcon className="h-5 w-5 text-indigo-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">วัตถุประสงค์ของรายวิชา</h3>
                    </div>
                    <button
                      type="button"
                      onClick={addObjective}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      เพิ่มวัตถุประสงค์
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={objective}
                            onChange={(e) => handleObjectiveChange(index, e.target.value)}
                            placeholder={`วัตถุประสงค์ที่ ${index + 1}`}
                            className="text-black py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        {formData.objectives.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeObjective(index)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description Section */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">รายละเอียดรายวิชา</h3>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      คำอธิบายรายวิชา
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="อธิบายรายละเอียดของรายวิชา เนื้อหาที่สอน และสิ่งที่นักศึกษาจะได้เรียนรู้"
                      className="text-black py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-between space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    ลบรายวิชา
                  </button>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          กำลังบันทึก...
                        </>
                      ) : (
                        'บันทึกการแก้ไข'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600" />
              <h3 className="text-lg font-medium text-gray-900 mt-4">แก้ไขข้อมูลสำเร็จ!</h3>
              <p className="text-sm text-gray-500 mt-2">
                รายวิชา "{formData.courseName}" ได้ถูกแก้ไขเรียบร้อยแล้ว
              </p>
              <div className="flex justify-center space-x-3 mt-6">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  ปิด
                </button>
                <button
                  onClick={() => router.push('/courses')}
                  className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
                >
                  ไปที่จัดการรายวิชา
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900 mt-4">ยืนยันการลบรายวิชา</h3>
              <p className="text-sm text-gray-500 mt-2">
                คุณแน่ใจหรือไม่ที่จะลบรายวิชา "{formData.courseName}" <br />
                การดำเนินการนี้ไม่สามารถย้อนกลับได้
              </p>
              <div className="flex justify-center space-x-3 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      กำลังลบ...
                    </>
                  ) : (
                    'ลบรายวิชา'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
