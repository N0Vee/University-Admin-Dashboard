'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Sidebar from '@/app/components/Sidebar'

import {
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import {
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  ClockIcon
} from '@heroicons/react/24/solid'

export default function CourseManagementPage() {
  const router = useRouter()
  const [role, setRole] = useState(null)
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSemester, setFilterSemester] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);


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
      } catch (error) {
        console.error('Error fetching user role:', error)
      }

    }

    fetchUserRole()
  }, [role])

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
        setCourses(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchCourses()
  }, [])


  // Statistics calculation
  const activeCourses = courses.filter(course => course.status === 'active').length;
  const completedCourses = courses.filter(course => course.status === 'completed').length;
  const upcomingCourses = courses.filter(course => course.status === 'upcoming').length;
  const totalStudents = courses.reduce((sum, course) => sum + course.students_enrolled, 0);

  const stats = [
    {
      name: 'วิชาที่เปิดสอน',
      value: activeCourses,
      change: '',
      changeType: 'positive',
      icon: BookOpenIcon,
      color: 'bg-indigo-500'
    },
    {
      name: 'วิชาที่เสร็จสิ้น',
      value: completedCourses,
      change: '',
      changeType: 'positive',
      icon: AcademicCapIcon,
      color: 'bg-emerald-500'
    },
    {
      name: 'วิชาที่จะเปิด',
      value: upcomingCourses,
      change: '',
      changeType: '',
      icon: CalendarDaysIcon,
      color: 'bg-amber-500'
    },
    {
      name: 'นักศึกษาทั้งหมด',
      value: totalStudents,
      change: '',
      changeType: 'positive',
      icon: UserGroupIcon,
      color: 'bg-rose-500'
    }
  ];

  // Filter and search functionality
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSemester = filterSemester === 'all' || course.semester === filterSemester;
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;

    return matchesSearch && matchesSemester && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'กำลังเรียน';
      case 'completed':
        return 'เสร็จสิ้น';
      case 'upcoming':
        return 'เตรียมเปิด';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <Sidebar currentPath={('/courses')} />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {/* Page header */}
                <div className="md:flex md:items-center md:justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                      จัดการวิชาเรียน
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      จัดการข้อมูลวิชาเรียน การลงทะเบียน และการเรียนการสอน
                    </p>
                  </div>
                  <div className="mt-4 flex md:ml-4 md:mt-0">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      ส่งออกข้อมูล
                    </button>
                    {/* Only show "Add Course" button for admin and instructor */}
                    {(role === 'admin' || role === 'instructor') && (
                      <button
                        type="button"
                        className="cursor-pointer ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => router.push('/courses/add')}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        เพิ่มวิชาใหม่
                      </button>
                    )}
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

                {/* Filters and Search */}
                <div className="mt-8 bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="sm:flex sm:items-center sm:justify-between">
                      <div className="flex flex-1 items-center space-x-4">
                        {/* Search */}
                        <div className="relative flex-1 max-w-xs">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            placeholder="ค้นหาวิชา..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                          />
                        </div>

                        {/* Semester Filter */}
                        <select
                          value={filterSemester}
                          onChange={(e) => setFilterSemester(e.target.value)}
                          className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                        >
                          <option value="all">ทุกภาคเรียน</option>
                          <option value="1/2567">1/2567</option>
                          <option value="2/2567">2/2567</option>
                          <option value="2/2566">2/2566</option>
                        </select>

                        {/* Status Filter */}
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                        >
                          <option value="all">ทุกสถานะ</option>
                          <option value="active">กำลังเรียน</option>
                          <option value="upcoming">เตรียมเปิด</option>
                          <option value="completed">เสร็จสิ้น</option>
                        </select>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Courses Table */}
                <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        รายการวิชาเรียน
                      </h3>
                      <p className="text-sm text-gray-500">
                        พบ {filteredCourses.length} วิชา
                      </p>
                    </div>

                    <div className="mt-6 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              รหัสวิชา / ชื่อวิชา
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              อาจารย์ผู้สอน
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              นักศึกษา / หน่วยกิต
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ภาคเรียน / ตารางเรียน
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              สถานะ
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              การจัดการ
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentCourses.map((course) => (
                            <tr key={course.id} className="hover:bg-gray-50" onClick={() => router.push(`/courses/${course.course_code}`)}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {course.course_code}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {course.course_name}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {course.course_name_en}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {course.instructor}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {course.department}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {course.students_enrolled}/{course.max_students} คน
                                </div>
                                <div className="text-sm text-gray-500">
                                  {course.credits} หน่วยกิต
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {course.semester}
                                </div>
                                <div className="text-sm text-gray-500 space-y-1">
                                  {course.schedule.map((s, i) => (
                                    <div key={i}>
                                      {s.day} {s.time}
                                      <div className="text-xs text-gray-400">ห้อง {s.room}</div>
                                    </div>
                                  ))}
                                </div>

                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(course.status)}`}>
                                  {getStatusText(course.status)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                  {/* View button - available for all roles */}
                                  <button 
                                    className="text-indigo-600 hover:text-indigo-900"
                                    onClick={() => router.push(`/courses/${course.course_code}`)}
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                  </button>
                                  
                                  {/* Edit button - only for admin and instructor */}
                                  {(role === 'admin' || role === 'instructor') && (
                                    <button 
                                      className="text-gray-600 hover:text-gray-900"
                                      onClick={() => router.push(`/courses/edit/${course.course_code}`)}
                                    >
                                      <PencilIcon className="h-4 w-4" />
                                    </button>
                                  )}
                                  
                                  {/* Delete button - only for admin */}
                                  {role === 'admin' && (
                                    <button className="text-red-600 hover:text-red-900">
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          แสดง {startIndex + 1} ถึง {Math.min(endIndex, filteredCourses.length)} จาก {filteredCourses.length} รายการ
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ก่อนหน้า
                          </button>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 text-sm rounded-md ${currentPage === page
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ถัดไป
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}