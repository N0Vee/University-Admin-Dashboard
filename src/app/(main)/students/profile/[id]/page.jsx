'use client'
import { supabase } from '@/lib/supabaseClient'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import Sidebar from '@/app/components/Sidebar'

import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import {
  AcademicCapIcon,

  BookOpenIcon,
  ClipboardDocumentListIcon,

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
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [role, setRole] = useState(null)
  const [userID, setUserID] = useState(null)

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch('/api/auth/get-role')
        const data = await response.json()
        setRole(data.role)
        setUserID(data.id)
      } catch (error) {
        console.error('Error fetching user role:', error)
      }
    }
    fetchUserRole()
  }, [])

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/student/${id}`)
        const data = await res.json()

        setStudent(data)
      } catch (error) {
        // Error handled silently - could be logged to monitoring service
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
  }, [id])

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      const res = await fetch(`/api/student/delete/${id}`)
      if (!res.ok) {
        if (res.status === 401) {
          router.replace('/login')
        }
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
      }
      router.push('/students')
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

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex h-screen">
        <Sidebar currentPath={`/students/profile/${userID}`}/>
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                <div className="animate-pulse">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-8 bg-gray-200 rounded w-64"></div>
                      <div className="flex space-x-2">
                        <div className="h-9 w-20 bg-gray-200 rounded"></div>
                        <div className="h-9 w-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Card */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-start space-x-6">
                        <div className="h-32 w-32 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                          <div className="grid grid-cols-2 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <div key={i} className="flex items-center">
                                <div className="h-5 w-5 bg-gray-200 rounded mr-3"></div>
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info Cards */}
                  <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="bg-white shadow rounded-lg p-6">
                      <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                      <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white shadow rounded-lg p-6">
                      <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                      <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                        ))}
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
        <Sidebar currentPath={`/students/profile/${userID}`}/>

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
                    กลับ
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
                      {/* Edit button - only for admin */}
                      {role === 'admin' && student && (
                        <button
                          onClick={() => router.push(`/students/edit/${student.id}`)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <PencilIcon className="h-4 w-4 mr-2" />
                          แก้ไข
                        </button>
                      )}

                      {/* Delete button - only for admin */}
                      {role === 'admin' && student && (
                        <button
                          onClick={handleDelete}
                          className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <TrashIcon className="h-4 w-4 mr-2" />
                          ลบ
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Student Profile Card */}

                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <div className="flex items-center space-x-6">
                    <div className="shrink-0">
                      {student?.profile_image_url ? (
                        <Image
                          width={24}
                          height={24}
                          unoptimized
                          className='h-24 w-24 object-cover rounded-full border-4 border-gray-200'
                          key={student.profile_image_url}
                          src={student.profile_image_url}
                          alt={student.profile_image_url}
                        />

                      ) : (

                        <div className="h-24 w-24 rounded-full bg-indigo-100 border-4 border-gray-200 flex items-center justify-center">
                          <UserIcon className="h-12 w-12 text-indigo-600" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {student?.title}{student?.first_name} {student?.last_name}
                      </h3>
                      <p className="text-lg text-gray-600">
                        {student?.title_eng}{student?.first_name_eng} {student?.last_name_eng}
                      </p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {student?.student_id}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {student?.year_level ? getYearText(student.year_level) : ''}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {student?.enrollment_type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Information Sections */}
                <div className="space-y-6">
                  {/* Contact Information */}
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
                          <p className="text-sm text-gray-900">{student?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">เบอร์โทรศัพท์</p>
                          <p className="text-sm text-gray-900">{student?.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <IdentificationIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">เลขบัตรประชาชน</p>
                          <p className="text-sm text-gray-900">{student?.id_card}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">วันเกิด</p>
                          <p className="text-sm text-gray-900">{student?.birth_date ? formatDate(student.birth_date) : ''}</p>
                        </div>
                      </div>
                    </div>
                    {student?.address && (
                      <div className="mt-6 flex items-start space-x-3">
                        <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">ที่อยู่</p>
                          <p className="text-sm text-gray-900">{student.address}</p>
                        </div>
                      </div>
                    )}
                  </div>



                  {/* Academic Information */}
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
                          <p className="text-sm text-gray-900">{student?.faculty}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <BookOpenIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">สาขาวิชา</p>
                          <p className="text-sm text-gray-900">{student?.major}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">ชั้นปี</p>
                          <p className="text-sm text-gray-900">{student?.year_level ? getYearText(student.year_level) : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <ClipboardDocumentListIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">ประเภทการเรียน</p>
                          <p className="text-sm text-gray-900">{student?.enrollment_type}</p>
                        </div>
                      </div>
                    </div>
                  </div>

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
                  {(student?.emergency_contact || student?.emergency_phone) && (
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


                  {/* System Information */}
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลระบบ</h3>
                    <div className="text-sm text-gray-600">
                      <p>วันที่สร้างบัญชี: {student?.created_at ? formatDate(student.created_at) : ''}</p>
                    </div>
                  </div>

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
                คุณแน่ใจหรือไม่ที่จะลบข้อมูลของ {student?.title}{student?.first_name} {student?.last_name}?
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