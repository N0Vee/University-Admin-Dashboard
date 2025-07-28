// 'use client'
// import { useEffect, useState } from 'react'
// import Image from 'next/image'
// import { useRouter } from 'next/navigation'

// import {
//     ArrowLeftIcon,
//     PencilIcon,
//     TrashIcon,
//     UserPlusIcon,
//     DocumentTextIcon,
//     CalendarDaysIcon,
//     ClockIcon,
//     MapPinIcon,
//     AcademicCapIcon,
//     UserGroupIcon,
//     BookOpenIcon,
//     CheckCircleIcon,
//     ExclamationTriangleIcon,
//     EllipsisVerticalIcon,
//     EyeIcon,
//     ChartBarIcon,
//     PrinterIcon,
//     ShareIcon
// } from '@heroicons/react/24/outline'
// import {
//     StarIcon,
//     CheckBadgeIcon
// } from '@heroicons/react/24/solid'

// export default function CourseDetailPage() {
//     const router = useRouter()
//     const [course, setCourse] = useState(null)
//     const [students, setStudents] = useState([])
//     const [assignments, setAssignments] = useState([])
//     const [announcements, setAnnouncements] = useState([])
//     const [activeTab, setActiveTab] = useState('overview')

//     // Mock course data
//     const mockCourse = {
//         id: 1,
//         course_code: 'CS101',
//         course_name: 'การเขียนโปรแกรมเบื้องต้น',
//         course_name_en: 'Introduction to Programming',
//         credits: 3,
//         semester: '1/2567',
//         faculty: 'วิทยาศาสตร์',
//         department: 'วิทยาการคอมพิวเตอร์',
//         instructor: {
//             name: 'ผศ.ดร.สมชาย ใจดี',
//             email: 'somchai@university.ac.th',
//             phone: '02-123-4567',
//             image: '/api/placeholder/64/64'
//         },
//         students_enrolled: 45,
//         max_students: 50,
//         status: 'active',
//         schedule: [
//             { day: 'จันทร์', time: '13:00-15:00', room: 'SC-301' },
//             { day: 'พุธ', time: '13:00-15:00', room: 'SC-301' }
//         ],
//         description: 'วิชานี้เป็นการแนะนำพื้นฐานการเขียนโปรแกรมคอมพิวเตอร์ โดยใช้ภาษา Python ในการสอน ครอบคลุมหัวข้อต่างๆ เช่น ตัวแปร ฟังก์ชัน การควบคุมการทำงาน โครงสร้างข้อมูลพื้นฐาน และการแก้ปัญหาด้วยการเขียนโปรแกรม',
//         objectives: [
//             'เข้าใจหลักการพื้นฐานของการเขียนโปรแกรม',
//             'สามารถเขียนโปรแกรมด้วยภาษา Python ได้',
//             'สามารถแก้ปัญหาต่างๆ ด้วยการเขียนโปรแกรม',
//             'เข้าใจโครงสร้างข้อมูลและอัลกอริทึมเบื้องต้น'
//         ],
//         grading: {
//             attendance: 10,
//             assignments: 30,
//             midterm: 30,
//             final: 30
//         }
//     }

//     // Mock students data
//     const mockStudents = [
//         {
//             id: 1,
//             student_id: '65010001',
//             title: 'นาย',
//             first_name: 'สมศักดิ์',
//             last_name: 'ใจดี',
//             profile_image_url: '/api/placeholder/40/40',
//             email: 'somsak@student.university.ac.th',
//             status: 'active',
//             grade: 'A'
//         },
//         {
//             id: 2,
//             student_id: '65010002',
//             title: 'นางสาว',
//             first_name: 'สมหญิง',
//             last_name: 'รักเรียน',
//             profile_image_url: '/api/placeholder/40/40',
//             email: 'somying@student.university.ac.th',
//             status: 'active',
//             grade: 'B+'
//         },
//         {
//             id: 3,
//             student_id: '65010003',
//             title: 'นาย',
//             first_name: 'สมปอง',
//             last_name: 'ขยันเรียน',
//             profile_image_url: '/api/placeholder/40/40',
//             email: 'sompong@student.university.ac.th',
//             status: 'active',
//             grade: 'A-'
//         }
//     ]

//     // Mock assignments data
//     const mockAssignments = [
//         {
//             id: 1,
//             title: 'งานที่ 1: Hello World Program',
//             description: 'เขียนโปรแกรม Hello World ด้วยภาษา Python',
//             due_date: '2024-09-15',
//             status: 'active',
//             submitted: 42,
//             total: 45
//         },
//         {
//             id: 2,
//             title: 'งานที่ 2: การคำนวณพื้นฐาน',
//             description: 'สร้างโปรแกรมคำนวณทางคณิตศาสตร์',
//             due_date: '2024-09-25',
//             status: 'upcoming',
//             submitted: 0,
//             total: 45
//         }
//     ]

//     // Mock announcements data
//     const mockAnnouncements = [
//         {
//             id: 1,
//             title: 'เลื่อนการสอบกลางภาค',
//             content: 'เนื่องจากวันหยุดนักขัตฤกษ์ จึงขอเลื่อนการสอบกลางภาคไปวันที่ 25 ตุลาคม 2567',
//             created_at: '2024-08-20',
//             type: 'important'
//         },
//         {
//             id: 2,
//             title: 'อัพเดทเนื้อหาการเรียน',
//             content: 'ได้อัพเดทเนื้อหาบทที่ 3 เกี่ยวกับ Functions แล้ว กรุณาดาวน์โหลดใหม่',
//             created_at: '2024-08-18',
//             type: 'info'
//         }
//     ]

//     useEffect(() => {
//         setCourse(mockCourse)
//         setStudents(mockStudents)
//         setAssignments(mockAssignments)
//         setAnnouncements(mockAnnouncements)
//     }, [])

//     const getStatusBadge = (status) => {
//         switch (status) {
//             case 'active':
//                 return 'bg-green-100 text-green-800'
//             case 'completed':
//                 return 'bg-gray-100 text-gray-800'
//             case 'upcoming':
//                 return 'bg-blue-100 text-blue-800'
//             default:
//                 return 'bg-gray-100 text-gray-800'
//         }
//     }

//     const getStatusText = (status) => {
//         switch (status) {
//             case 'active':
//                 return 'กำลังเรียน'
//             case 'completed':
//                 return 'เสร็จสิ้น'
//             case 'upcoming':
//                 return 'เตรียมเปิด'
//             default:
//                 return status
//         }
//     }

//     const tabs = [
//         { id: 'overview', name: 'ภาพรวม', icon: BookOpenIcon },
//         { id: 'students', name: 'นักศึกษา', icon: UserGroupIcon },
//         { id: 'assignments', name: 'งานที่มอบหมาย', icon: DocumentTextIcon },
//         { id: 'announcements', name: 'ประกาศ', icon: CalendarDaysIcon }
//     ]

//     if (!course) {
//         return <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
//             <div className="text-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//                 <p className="mt-4 text-gray-500">กำลังโหลดข้อมูล...</p>
//             </div>
//         </div>
//     }

//     return (
//         <div className="min-h-screen bg-zinc-50">
//             <div className="flex h-screen pt-16">
//                 {/* Main Content */}
//                 <div className="flex flex-1 flex-col overflow-hidden">
//                     <main className="flex-1 relative overflow-y-auto focus:outline-none">
//                         <div className="py-6">
//                             <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
//                                 {/* Back button and page header */}
//                                 <div className="mb-6">
//                                     <button
//                                         onClick={() => router.back()}
//                                         className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
//                                     >
//                                         <ArrowLeftIcon className="h-4 w-4 mr-2" />
//                                         กลับไปหน้าจัดการวิชาเรียน
//                                     </button>
//                                 </div>

//                                 <div className="md:flex md:items-center md:justify-between">
//                                     <div className="min-w-0 flex-1">
//                                         <div className="flex items-center">
//                                             <div>
//                                                 <div className="flex items-center">
//                                                     <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
//                                                         {course.course_code} - {course.course_name}
//                                                     </h1>
//                                                     <span className={`ml-3 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(course.status)}`}>
//                                                         {getStatusText(course.status)}
//                                                     </span>
//                                                 </div>
//                                                 <p className="mt-1 text-sm text-gray-500">
//                                                     {course.course_name_en} • {course.credits} หน่วยกิต • {course.semester}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
//                                         <button className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
//                                             <PrinterIcon className="h-4 w-4 mr-2" />
//                                             พิมพ์
//                                         </button>
//                                         <button className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
//                                             <ShareIcon className="h-4 w-4 mr-2" />
//                                             แชร์
//                                         </button>
//                                         <button className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
//                                             <PencilIcon className="h-4 w-4 mr-2" />
//                                             แก้ไข
//                                         </button>
//                                     </div>
//                                 </div>

//                                 {/* Course Info Cards */}
//                                 <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//                                     <div className="bg-white overflow-hidden shadow rounded-lg">
//                                         <div className="p-5">
//                                             <div className="flex items-center">
//                                                 <div className="flex-shrink-0">
//                                                     <UserGroupIcon className="h-6 w-6 text-indigo-600" />
//                                                 </div>
//                                                 <div className="ml-5 w-0 flex-1">
//                                                     <dl>
//                                                         <dt className="text-sm font-medium text-gray-500 truncate">
//                                                             นักศึกษาลงทะเบียน
//                                                         </dt>
//                                                         <dd className="text-lg font-medium text-gray-900">
//                                                             {course.students_enrolled}/{course.max_students}
//                                                         </dd>
//                                                     </dl>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="bg-white overflow-hidden shadow rounded-lg">
//                                         <div className="p-5">
//                                             <div className="flex items-center">
//                                                 <div className="flex-shrink-0">
//                                                     <DocumentTextIcon className="h-6 w-6 text-emerald-600" />
//                                                 </div>
//                                                 <div className="ml-5 w-0 flex-1">
//                                                     <dl>
//                                                         <dt className="text-sm font-medium text-gray-500 truncate">
//                                                             งานที่มอบหมาย
//                                                         </dt>
//                                                         <dd className="text-lg font-medium text-gray-900">
//                                                             {assignments.length}
//                                                         </dd>
//                                                     </dl>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="bg-white overflow-hidden shadow rounded-lg">
//                                         <div className="p-5">
//                                             <div className="flex items-center">
//                                                 <div className="flex-shrink-0">
//                                                     <ChartBarIcon className="h-6 w-6 text-amber-600" />
//                                                 </div>
//                                                 <div className="ml-5 w-0 flex-1">
//                                                     <dl>
//                                                         <dt className="text-sm font-medium text-gray-500 truncate">
//                                                             คะแนนเฉลี่ย
//                                                         </dt>
//                                                         <dd className="text-lg font-medium text-gray-900">
//                                                             85.5
//                                                         </dd>
//                                                     </dl>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="bg-white overflow-hidden shadow rounded-lg">
//                                         <div className="p-5">
//                                             <div className="flex items-center">
//                                                 <div className="flex-shrink-0">
//                                                     <CalendarDaysIcon className="h-6 w-6 text-rose-600" />
//                                                 </div>
//                                                 <div className="ml-5 w-0 flex-1">
//                                                     <dl>
//                                                         <dt className="text-sm font-medium text-gray-500 truncate">
//                                                             สัปดาห์การเรียน
//                                                         </dt>
//                                                         <dd className="text-lg font-medium text-gray-900">
//                                                             8/16
//                                                         </dd>
//                                                     </dl>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Tabs */}
//                                 <div className="mt-8">
//                                     <div className="border-b border-gray-200">
//                                         <nav className="-mb-px flex space-x-8">
//                                             {tabs.map((tab) => (
//                                                 <button
//                                                     key={tab.id}
//                                                     onClick={() => setActiveTab(tab.id)}
//                                                     className={`${activeTab === tab.id
//                                                         ? 'border-indigo-500 text-indigo-600'
//                                                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                                         } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
//                                                 >
//                                                     <tab.icon className="h-5 w-5 mr-2" />
//                                                     {tab.name}
//                                                 </button>
//                                             ))}
//                                         </nav>
//                                     </div>
//                                 </div>

//                                 {/* Tab Content */}
//                                 <div className="mt-8">
//                                     {activeTab === 'overview' && (
//                                         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//                                             {/* Course Details */}
//                                             <div className="lg:col-span-2">
//                                                 <div className="bg-white shadow rounded-lg">
//                                                     <div className="px-4 py-5 sm:p-6">
//                                                         <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
//                                                             รายละเอียดวิชา
//                                                         </h3>
//                                                         <p className="text-sm text-gray-700 mb-6">
//                                                             {course.description}
//                                                         </p>

//                                                         <h4 className="text-md font-medium text-gray-900 mb-3">
//                                                             วัตถุประสงค์การเรียนรู้
//                                                         </h4>
//                                                         <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 mb-6">
//                                                             {course.objectives.map((objective, index) => (
//                                                                 <li key={index}>{objective}</li>
//                                                             ))}
//                                                         </ul>

//                                                         <h4 className="text-md font-medium text-gray-900 mb-3">
//                                                             การประเมินผล
//                                                         </h4>
//                                                         <div className="grid grid-cols-2 gap-4">
//                                                             <div className="text-sm text-gray-700">
//                                                                 <span className="font-medium">การเข้าเรียน:</span> {course.grading.attendance}%
//                                                             </div>
//                                                             <div className="text-sm text-gray-700">
//                                                                 <span className="font-medium">งานที่มอบหมาย:</span> {course.grading.assignments}%
//                                                             </div>
//                                                             <div className="text-sm text-gray-700">
//                                                                 <span className="font-medium">สอบกลางภาค:</span> {course.grading.midterm}%
//                                                             </div>
//                                                             <div className="text-sm text-gray-700">
//                                                                 <span className="font-medium">สอบปลายภาค:</span> {course.grading.final}%
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             {/* Instructor & Schedule */}
//                                             <div className="space-y-6">
//                                                 {/* Instructor */}
//                                                 <div className="bg-white shadow rounded-lg">
//                                                     <div className="px-4 py-5 sm:p-6">
//                                                         <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
//                                                             อาจารย์ผู้สอน
//                                                         </h3>
//                                                         <div className="flex items-center">
//                                                             <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center">
//                                                                 <span className="text-sm font-medium text-white">
//                                                                     <Image
//                                                                         width={48}
//                                                                         height={48}
//                                                                         className="h-12 w-12 rounded-full"
//                                                                         src={course.instructor.image}
//                                                                         alt=""
//                                                                     />
//                                                                 </span>
//                                                             </div>
//                                                             <div className="ml-4">
//                                                                 <p className="text-sm font-medium text-gray-900">
//                                                                     {course.instructor.name}
//                                                                 </p>
//                                                                 <p className="text-sm text-gray-500">
//                                                                     {course.instructor.email}
//                                                                 </p>
//                                                                 <p className="text-sm text-gray-500">
//                                                                     {course.instructor.phone}
//                                                                 </p>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 {/* Schedule */}
//                                                 <div className="bg-white shadow rounded-lg">
//                                                     <div className="px-4 py-5 sm:p-6">
//                                                         <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
//                                                             ตารางเรียน
//                                                         </h3>
//                                                         <div className="space-y-3">
//                                                             {course.schedule.map((schedule, index) => (
//                                                                 <div key={index} className="flex items-center text-sm text-gray-700">
//                                                                     <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
//                                                                     <span className="font-medium mr-2">{schedule.day}</span>
//                                                                     <ClockIcon className="h-4 w-4 text-gray-400 mr-1 ml-2" />
//                                                                     <span className="mr-2">{schedule.time}</span>
//                                                                     <MapPinIcon className="h-4 w-4 text-gray-400 mr-1 ml-2" />
//                                                                     <span>{schedule.room}</span>
//                                                                 </div>
//                                                             ))}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {activeTab === 'students' && (
//                                         <div className="bg-white shadow rounded-lg">
//                                             <div className="px-4 py-5 sm:p-6">
//                                                 <div className="flex items-center justify-between mb-6">
//                                                     <h3 className="text-lg font-medium leading-6 text-gray-900">
//                                                         รายชื่อนักศึกษา ({students.length} คน)
//                                                     </h3>
//                                                     <button className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
//                                                         <UserPlusIcon className="h-4 w-4 mr-2" />
//                                                         เพิ่มนักศึกษา
//                                                     </button>
//                                                 </div>
//                                                 <div className="overflow-x-auto">
//                                                     <table className="min-w-full divide-y divide-gray-200">
//                                                         <thead className="bg-gray-50">
//                                                             <tr>
//                                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                                     นักศึกษา
//                                                                 </th>
//                                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                                     รหัสนักศึกษา
//                                                                 </th>
//                                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                                     อีเมล
//                                                                 </th>
//                                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                                     เกรด
//                                                                 </th>
//                                                                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                                     การจัดการ
//                                                                 </th>
//                                                             </tr>
//                                                         </thead>
//                                                         <tbody className="bg-white divide-y divide-gray-200">
//                                                             {students.map((student) => (
//                                                                 <tr key={student.id} className="hover:bg-gray-50">
//                                                                     <td className="px-6 py-4 whitespace-nowrap">
//                                                                         <div className="flex items-center">
//                                                                             <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
//                                                                                 <Image
//                                                                                     width={40}
//                                                                                     height={40}
//                                                                                     className="h-10 w-10 rounded-full"
//                                                                                     src={student.profile_image_url}
//                                                                                     alt=""
//                                                                                 />
//                                                                             </div>
//                                                                             <div className="ml-4">
//                                                                                 <div className="text-sm font-medium text-gray-900">
//                                                                                     {student.title} {student.first_name} {student.last_name}
//                                                                                 </div>
//                                                                             </div>
//                                                                         </div>
//                                                                     </td>
//                                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                                                         {student.student_id}
//                                                                     </td>
//                                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                                         {student.email}
//                                                                     </td>
//                                                                     <td className="px-6 py-4 whitespace-nowrap">
//                                                                         <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
//                                                                             {student.grade}
//                                                                         </span>
//                                                                     </td>
//                                                                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                                                         <button className="text-indigo-600 hover:text-indigo-900 mr-3">
//                                                                             <EyeIcon className="h-4 w-4" />
//                                                                         </button>
//                                                                         <button className="text-gray-600 hover:text-gray-900">
//                                                                             <EllipsisVerticalIcon className="h-4 w-4" />
//                                                                         </button>
//                                                                     </td>
//                                                                 </tr>
//                                                             ))}
//                                                         </tbody>
//                                                     </table>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {activeTab === 'assignments' && (
//                                         <div className="space-y-6">
//                                             <div className="flex items-center justify-between">
//                                                 <h3 className="text-lg font-medium leading-6 text-gray-900">
//                                                     งานที่มอบหมาย
//                                                 </h3>
//                                                 <button className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
//                                                     <PlusIcon className="h-4 w-4 mr-2" />
//                                                     เพิ่มงานใหม่
//                                                 </button>
//                                             </div>
//                                             {assignments.map((assignment) => (
//                                                 <div key={assignment.id} className="bg-white shadow rounded-lg">
//                                                     <div className="px-4 py-5 sm:p-6">
//                                                         <div className="flex items-center justify-between">
//                                                             <div className="flex-1">
//                                                                 <h4 className="text-lg font-medium text-gray-900">
//                                                                     {assignment.title}
//                                                                 </h4>
//                                                                 <p className="mt-1 text-sm text-gray-500">
//                                                                     {assignment.description}
//                                                                 </p>
//                                                                 <div className="mt-2 flex items-center text-sm text-gray-500">
//                                                                     <CalendarDaysIcon className="h-4 w-4 mr-1" />
//                                                                     กำหนดส่ง: {assignment.due_date}
//                                                                     <span className="ml-4">
//                                                                         ส่งแล้ว: {assignment.submitted}/{assignment.total} คน
//                                                                     </span>
//                                                                 </div>
//                                                             </div>                                                
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))}