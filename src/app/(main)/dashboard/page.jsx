'use client'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
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
  const { role, loading } = useAuth()
  const [students, setStudents] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0)
  const [coursesCount, setCoursesCount] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)


  // Role-specific stats data
  const getStats = () => {
    if (role === 'admin') {
      return [
        {
          name: 'นักศึกษาทั้งหมด',
          value: studentsCount,
          icon: UserGroupIcon,
          color: 'bg-indigo-500'
        },
        {
          name: 'นักศึกษาใหม่',
          value: Math.floor(studentsCount * 0.3), // Mock new students (30% of total)
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
          name: 'อาจารย์ผู้สอน',
          value: Math.floor(coursesCount * 0.6), // Mock instructors
          icon: UserGroupIcon,
          color: 'bg-purple-500'
        }
      ]
    } else if (role === 'instructor') {
      return [
        {
          name: 'วิชาที่สอน',
          value: Math.floor(coursesCount * 0.2), // Mock instructor's courses
          icon: BookOpenIcon,
          color: 'bg-amber-500'
        },
        {
          name: 'นักศึกษาในวิชา',
          value: Math.floor(studentsCount * 0.4), // Mock students in instructor's courses
          icon: AcademicCapIcon,
          color: 'bg-indigo-500'
        },
        {
          name: 'งานที่มอบหมาย',
          value: 15, // Mock assignments
          icon: ClipboardDocumentListIcon,
          color: 'bg-emerald-500'
        }
      ]
    } else if (role === 'student') {
      return [
        {
          name: 'วิชาที่ลงทะเบียน',
          value: 6, // Mock enrolled courses
          icon: BookOpenIcon,
          color: 'bg-amber-500'
        },
        {
          name: 'งานที่ค้างส่ง',
          value: 3, // Mock pending assignments
          icon: ClipboardDocumentListIcon,
          color: 'bg-red-500'
        },
        {
          name: 'เกรดเฉลี่ย',
          value: '3.25', // Mock GPA
          icon: ChartBarIcon,
          color: 'bg-emerald-500'
        }
      ]
    }
    return []
  }

  useEffect(() => {

    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/students?orderBy=id&order=desc",);

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
        const res = await fetch('/api/courses/count')
        if (!res.ok) {
          if (res.status === 401) {
            router.replace('/login')
          }
          throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
        }
        const data = await res.json()
        setCoursesCount(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchCourses()
  }, [])

  // Show loading state while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="flex h-screen pt-16">
          <Sidebar currentPath="/dashboard" />
          <div className="flex flex-1 flex-col overflow-hidden">
            <main className="flex-1 relative overflow-y-auto focus:outline-none">
              <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-lg shadow">
                          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
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
                      {role === 'admin' ? 'ภาพรวมระบบ' : role === 'instructor' ? 'ภาพรวมการสอน' : 'ภาพรวมการเรียน'}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {role === 'admin' 
                        ? 'ข้อมูลสรุปและสถิติการจัดการนักศึกษา'
                        : role === 'instructor'
                        ? 'ข้อมูลสรุปการสอนและการจัดการรายวิชา'
                        : 'ข้อมูลสรุปการเรียนและกิจกรรมของคุณ'
                      }
                    </p>
                  </div>
                  <div className="mt-4 flex md:ml-4 md:mt-0">
                    {/* Admin actions */}
                    {role === 'admin' && (
                      <>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          ส่งออกรายงาน
                        </button>
                        <button
                          type="button"
                          className="cursor-pointer ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          onClick={() => router.push('/students/add')}
                        >
                          เพิ่มนักศึกษา
                        </button>
                      </>
                    )}
                    
                    {/* Instructor actions */}
                    {role === 'instructor' && (
                      <>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          ส่งออกคะแนน
                        </button>
                        <button
                          type="button"
                          className="cursor-pointer ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          onClick={() => router.push('/courses/add')}
                        >
                          เพิ่มรายวิชา
                        </button>
                      </>
                    )}
                    
                    {/* Student actions */}
                    {role === 'student' && (
                      <button
                        type="button"
                        className="cursor-pointer inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => router.push('/courses')}
                      >
                        ดูรายวิชา
                      </button>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-8">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {getStats().map((item) => (
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
                  {/* Left column - Different content for each role */}
                  <div className="lg:col-span-8">
                    
                    {/* Admin: Recent Students */}
                    {role === 'admin' && (
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">
                              นักศึกษาล่าสุด
                            </h3>
                            <button onClick={() => router.push('/students')} className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-500">
                              ดูทั้งหมด
                            </button>
                          </div>
                          <div className="mt-6 flow-root">
                            <ul className="-my-5 divide-y divide-gray-200">
                              {students.slice(0, 5).map((student) => (
                                <li key={student.id} className="py-4 cursor-pointer hover:bg-gray-100" onClick={() => router.push(`/students/profile/${student.id}`)}>
                                  <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                      <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                                        <Image
                                          width={40}
                                          height={40}
                                          unoptimized
                                          className='h-10 w-10 rounded-full'
                                          key={student.profile_image_url}
                                          src={student.profile_image_url}
                                          alt=""
                                        />
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
                    )}

                    {/* Instructor: My Courses */}
                    {role === 'instructor' && (
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">
                              รายวิชาที่สอน
                            </h3>
                            <button onClick={() => router.push('/courses')} className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-500">
                              ดูทั้งหมด
                            </button>
                          </div>
                          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* Mock instructor courses */}
                            {[
                              { code: 'CS101', name: 'Computer Programming', students: 45, section: '001' },
                              { code: 'CS201', name: 'Data Structures', students: 38, section: '002' },
                              { code: 'CS301', name: 'Database Systems', students: 32, section: '001' },
                              { code: 'CS401', name: 'Software Engineering', students: 28, section: '001' }
                            ].map((course) => (
                              <div key={course.code} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900">{course.code}</h4>
                                    <p className="text-sm text-gray-600">{course.name}</p>
                                    <p className="text-xs text-gray-500">Section {course.section}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">{course.students}</p>
                                    <p className="text-xs text-gray-500">นักศึกษา</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Student: My Enrolled Courses */}
                    {role === 'student' && (
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">
                              รายวิชาที่ลงทะเบียน
                            </h3>
                            <button onClick={() => router.push('/courses')} className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-500">
                              ดูทั้งหมด
                            </button>
                          </div>
                          <div className="mt-6 space-y-4">
                            {/* Mock student enrolled courses */}
                            {[
                              { code: 'CS101', name: 'Computer Programming', instructor: 'อ.สมชาย', time: 'จันทร์ 09:00-12:00', grade: 'A' },
                              { code: 'MATH201', name: 'Calculus II', instructor: 'อ.สมหญิง', time: 'อังคาร 13:00-16:00', grade: 'B+' },
                              { code: 'ENG102', name: 'English for Communication', instructor: 'อ.จอห์น', time: 'พุธ 10:00-12:00', grade: 'A-' },
                              { code: 'PHY101', name: 'General Physics', instructor: 'อ.สมศรี', time: 'พฤหัส 14:00-17:00', grade: 'B' }
                            ].map((course) => (
                              <div key={course.code} className="border rounded-lg p-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-gray-900">{course.code} - {course.name}</h4>
                                    <p className="text-sm text-gray-600">{course.instructor}</p>
                                    <p className="text-xs text-gray-500">{course.time}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      course.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                                      course.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {course.grade}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right column - Role-specific events and actions */}
                  <div className="lg:col-span-4">
                    {/* Upcoming Events - Different for each role */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                          {role === 'admin' ? 'กิจกรรมสำคัญ' : role === 'instructor' ? 'กิจกรรมการสอน' : 'กิจกรรมการเรียน'}
                        </h3>
                        <div className="mt-6 space-y-4">
                          {/* Admin events */}
                          {role === 'admin' && [
                            { id: 1, title: 'วันลงทะเบียนเรียน', date: '2024-08-15', type: 'registration' },
                            { id: 2, title: 'ประชุมคณะกรรมการบริหาร', date: '2024-08-20', type: 'meeting' },
                            { id: 3, title: 'สอบกลางภาค', date: '2024-09-20', type: 'exam' },
                            { id: 4, title: 'วันซ้อมรับปริญญา', date: '2024-10-05', type: 'graduation' }
                          ].map((event) => (
                            <div key={event.id} className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className="h-2 w-2 mt-2 bg-indigo-600 rounded-full"></div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                <p className="text-sm text-gray-500">{event.date}</p>
                              </div>
                            </div>
                          ))}

                          {/* Instructor events */}
                          {role === 'instructor' && [
                            { id: 1, title: 'ส่งเกรดกลางภาค', date: '2024-09-25', type: 'deadline' },
                            { id: 2, title: 'ประชุมคณะ', date: '2024-09-30', type: 'meeting' },
                            { id: 3, title: 'สอบปลายภาค CS101', date: '2024-12-10', type: 'exam' },
                            { id: 4, title: 'ประเมินการสอน', date: '2024-12-15', type: 'evaluation' }
                          ].map((event) => (
                            <div key={event.id} className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className="h-2 w-2 mt-2 bg-amber-600 rounded-full"></div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                <p className="text-sm text-gray-500">{event.date}</p>
                              </div>
                            </div>
                          ))}

                          {/* Student events */}
                          {role === 'student' && [
                            { id: 1, title: 'ส่งงาน CS101', date: '2024-09-15', type: 'assignment' },
                            { id: 2, title: 'สอบกลางภาค MATH201', date: '2024-09-20', type: 'exam' },
                            { id: 3, title: 'นำเสนอโปรเจค CS301', date: '2024-10-05', type: 'presentation' },
                            { id: 4, title: 'ลงทะเบียนภาคต่อไป', date: '2024-11-01', type: 'registration' }
                          ].map((event) => (
                            <div key={event.id} className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className="h-2 w-2 mt-2 bg-emerald-600 rounded-full"></div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                <p className="text-sm text-gray-500">{event.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6">
                          <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-500">
                            {role === 'admin' ? 'ดูปฏิทินทั้งหมด' : role === 'instructor' ? 'ดูตารางสอน' : 'ดูตารางเรียน'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions - Show different actions based on role */}
                    <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                          การดำเนินการด่วน
                        </h3>
                        <div className="mt-6 space-y-3">
                          {/* Admin actions */}
                          {role === 'admin' && (
                            <>
                              <button 
                                onClick={() => router.push('/students/add')}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                              >
                                👤 เพิ่มนักศึกษาใหม่
                              </button>
                              <button 
                                onClick={() => router.push('/courses/add')}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                              >
                                📚 เพิ่มรายวิชาใหม่
                              </button>
                              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                📊 สร้างรายงานประจำเดือน
                              </button>
                              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                � ส่งประกาศสำคัญ
                              </button>
                              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                ⚙️ ตั้งค่าระบบ
                              </button>
                            </>
                          )}
                          
                          {/* Instructor actions */}
                          {role === 'instructor' && (
                            <>
                              <button 
                                onClick={() => router.push('/courses/add')}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                              >
                                📚 เพิ่มรายวิชาใหม่
                              </button>
                              <button 
                                onClick={() => router.push('/courses')}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                              >
                                📝 จัดการรายวิชา
                              </button>
                              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                📊 ป้อนคะแนน
                              </button>
                              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                📋 สร้างแบบทดสอบ
                              </button>
                              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                💌 ส่งประกาศให้นักศึกษา
                              </button>
                            </>
                          )}
                          
                          {/* Student actions */}
                          {role === 'student' && (
                            <>
                              <button 
                                onClick={() => router.push('/courses')}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                              >
                                📚 ดูรายวิชาทั้งหมด
                              </button>
                              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                📝 ลงทะเบียนเรียน
                              </button>
                              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                📊 ดูผลการเรียน
                              </button>
                              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                📅 ดูตารางสอบ
                              </button>
                              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                👤 แก้ไขโปรไฟล์
                              </button>
                            </>
                          )}
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