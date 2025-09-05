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
  const { role, loading: authLoading } = useAuth()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState('ทุกคณะ')
  const [selectedYear, setSelectedYear] = useState('ทุกชั้นปี')
  const [selectedEnrollmentType, setSelectedEnrollmentType] = useState('ทุกประเภทการศึกษา')

  // Redirect non-admin/instructor users
  useEffect(() => {
    if (!authLoading && role && role !== 'admin' && role !== 'instructor') {
      router.replace('/dashboard')
    }
  }, [role, authLoading, router])

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
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
        // Error handled silently - could be logged to monitoring service
      } finally {
        setLoading(false)
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

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      {/* Header matching real layout */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="h-9 w-32 bg-gray-200 rounded-md"></div>
      </div>

      {/* Filters matching the real structure */}
      <div className="flex gap-4 mb-6">
        <div className="h-9 w-32 bg-gray-200 rounded-md"></div>
        <div className="h-9 w-28 bg-gray-200 rounded-md"></div>
        <div className="h-9 w-48 bg-gray-200 rounded-md"></div>
        <div className="relative h-9 w-64 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Table skeleton matching structure */}
      <div className="overflow-auto rounded-lg shadow bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16"></div></th>
              <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24"></div></th>
              <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-28"></div></th>
              <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16"></div></th>
              <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-12"></div></th>
              <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16"></div></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i} className="hover:bg-gray-100">
                <td className="px-4 py-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="h-6 w-6 bg-gray-200 rounded"></div>
                    <div className="h-6 w-6 bg-gray-200 rounded"></div>
                    <div className="h-6 w-6 bg-gray-200 rounded"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar currentPath="/students" />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {loading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
