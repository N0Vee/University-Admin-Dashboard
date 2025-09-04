'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import Sidebar from '@/app/components/Sidebar'

import {
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'

export default function StudentManagementPage() {
  const router = useRouter()
  const { role, loading } = useAuth()
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState('ทุกคณะ')
  const [selectedYear, setSelectedYear] = useState('ทุกชั้นปี')
  const [selectedEnrollmentType, setSelectedEnrollmentType] = useState('ทุกประเภทการศึกษา')

  // Redirect non-admin/instructor users
  useEffect(() => {
    if (!loading && role && role !== 'admin' && role !== 'instructor') {
      router.replace('/dashboard')
    }
  }, [role, loading, router])

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/students?order=asc");

        if (!res.ok) {
          if (res.status === 401) {
            router.replace('/login')
          }
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

  // Show loading state while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="flex h-screen pt-16">
          <Sidebar currentPath="/students" />
          <main className="flex-1 bg-zinc-50 p-6 overflow-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">

      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <Sidebar currentPath="/students" />

        {/* Main Content */}
        <main className="flex-1 bg-zinc-50 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">จัดการนักศึกษา</h1>
            {/* Only show "Add Student" button for admin */}
            {role === 'admin' && (
              <button onClick={() => router.push("/students/add")} className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700">
                เพิ่มนักศึกษา
              </button>
            )}
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredStudents.map((student, index) => (
                  <tr className='cursor-pointer hover:bg-gray-100' key={index} onClick={() => { router.push(`/students/profile/${student.id}`) }}>
                    <td className="px-4 py-3">
                      <Image
                        width={10}
                        height={10}
                        unoptimized
                        className='h-10 w-10 rounded-full'
                        key={student.profile_image_url}
                        src={student.profile_image_url}
                        alt=""
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-900">{student.student_id}</td>
                    <td className="px-4 py-3 text-gray-900">{student.title} {student.first_name} {student.last_name}</td>
                    <td className="px-4 py-3 text-gray-900">{student.faculty}</td>
                    <td className="px-4 py-3 text-gray-900">ปี {student.year_level}</td>
                    <td className="px-4 py-3 text-gray-900">{student.enrollment_type}</td>

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
