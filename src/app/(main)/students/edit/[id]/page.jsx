'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Sidebar from '@/app/components/Sidebar'

import {
  ArrowLeftIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'
import {
  CheckCircleIcon
} from '@heroicons/react/24/solid'

export default function EditStudentPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params;
  const [title, setTitle] = useState("")
  const [studentData, setStudentData] = useState(null)
  const [role, setRole] = useState(null)

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
          router.replace('/students')
        }

      } catch (error) {
        console.error('Error fetching user role:', error)
      }

    }

    fetchUserRole()
  }, [role])
  
  const [formData, setFormData] = useState({
    title: '',
    titleEng: '',
    firstName: '',
    lastName: '',
    firstNameEng: '',
    lastNameEng: '',
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
    profileImage: '',
  })

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`/api/student/${id}`)
        if (!res.ok) {
          if (res.status === 401) {
            router.replace('/login')
          }
          throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
        }
        const data = await res.json()
        setStudentData(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchStudent()

  }, [id])


  useEffect(() => {
    if (studentData) {
      setFormData({
        title: studentData.title || '',
        titleEng: studentData.title_eng || '',
        firstName: studentData.first_name || '',
        lastName: studentData.last_name || '',
        firstNameEng: studentData.first_name_eng || '',
        lastNameEng: studentData.last_name_eng || '',
        studentId: studentData.student_id || '',
        email: studentData.email || '',
        phone: studentData.phone || '',
        birthDate: studentData.birth_date || '',
        idCard: studentData.id_card || '',
        faculty: studentData.faculty || '',
        major: studentData.major || '',
        yearLevel: studentData.year_level || '',
        enrollmentType: studentData.enrollment_type || '',
        address: studentData.address || '',
        emergencyContact: studentData.emergency_contact || '',
        emergencyPhone: studentData.emergency_phone || '',
        profileImage: studentData.profile_image_url || '',
      })
    }
  }, [studentData])

  const [showSuccessModal, setShowSuccessModal] = useState(false)

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

  useEffect(() => {
    if (formData.title == "นาย") {
      setTitle("Mr.")
    }
    else if (formData.title == "นางสาว") {
      setTitle("Mrs.")
    }
  }, [formData.title])

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const form = new FormData()
      for (const key in formData) {
        if (formData[key] !== undefined && formData[key] !== null) {
          form.append(key, formData[key])
        }
      }

      // ใส่ existing image URL กรณีไม่ได้อัปโหลดใหม่
      if (typeof formData.profileImage === 'string') {
        form.append('existingImageUrl', formData.profileImage)
      }

      const res = await fetch(`/api/student/update/${id}`, {
        method: 'PUT',
        body: form,
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'เกิดข้อผิดพลาดในการอัปเดต')
      }

      setShowSuccessModal(true)

    } catch (err) {
      console.error('เกิดข้อผิดพลาด:', err.message || err)
    }
  }



  return (
    <div className="min-h-screen bg-zinc-50">

      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <Sidebar currentPath="/students/student_management" />

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
                    กลับไปยังหน้านักศึกษา
                  </button>

                  <div className="md:flex md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                      <h2 className="mt-2 text-2xl font-bold  text-gray-900 sm:truncate sm:text-3xl">
                        แก้ไขข้อมูลนักศึกษา
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        กรอกข้อมูลนักศึกษาใหม่เพื่อแก้ไข
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
                            src={
                              typeof formData.profileImage === 'string'
                                ? formData.profileImage
                                : URL.createObjectURL(formData.profileImage)
                            }
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
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          คำหน้าชื่อ (ภาษาไทย)*
                        </label>
                        <select
                          name="title"
                          id="title"
                          required
                          value={formData.title}
                          onChange={handleInputChange}
                          className="text-black py-2 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="">เลือกคำหน้าชื่อ</option>
                          <option value="นาย">นาย</option>
                          <option value="นางสาว">นางสาว</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="titleEng" className="block text-sm font-medium text-gray-700">
                          คำหน้าชื่อ (ภาษาอังกฤษ)*
                        </label>
                        <select
                          name="titleEng"
                          id="titleEng"
                          required
                          value={title}
                          disabled
                          className="text-black py-2 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="">Choose title</option>
                          <option value="Mr.">Mr.</option>
                          <option value="Mrs.">Mrs.</option>
                        </select>
                      </div>


                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          ชื่อ (ภาษาไทย)*
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="text-black py-2 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          นามสกุล (ภาษาไทย)*
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="text-black py-2 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="firstNameEng" className="block text-sm font-medium text-gray-700">
                          ชื่อ (ภาษาอังกฤษ)*
                        </label>
                        <input
                          type="text"
                          name="firstNameEng"
                          id="firstNameEng"
                          required
                          value={formData.firstNameEng}
                          onChange={handleInputChange}
                          className="text-black py-2 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="lastNameEng" className="block text-sm font-medium text-gray-700">
                          นามสกุล (ภาษาอังกฤษ)*
                        </label>
                        <input
                          type="text"
                          name="lastNameEng"
                          id="lastNameEng"
                          required
                          value={formData.lastNameEng}
                          onChange={handleInputChange}
                          className="text-black py-2 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                          className="text-black py-2 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                          className="text-black py-2 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                          className="text-black py-2 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                          className="text-black py-2 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                          className="text-black py-2 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                        className="text-black py-2 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                          className="text-black py-2 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                          className="text-black py-2 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                          className="text-black py-2 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                          className="text-black py-2 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                          className="text-black py-2 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                          className="text-black py-2 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-6">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      แก้ไขข้อมูลนักศึกษา
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">แก้ไขข้อมูลนักศึกษาสำเร็จ!</h3>
              <p className="text-sm text-gray-500 mb-6">
                ข้อมูลนักศึกษาได้รับการแก้ไขเรียบร้อยแล้ว
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  แก้ไขข้อมูลนักศึกษาต่อ
                </button>
                <button
                  onClick={() => router.back()}
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