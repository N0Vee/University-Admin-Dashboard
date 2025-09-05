'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import Sidebar from '@/app/components/Sidebar'
import {
	CheckCircleIcon,
	XCircleIcon,
	ClockIcon,
	AcademicCapIcon,
	PlusIcon,
	MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'

export default function RegisterPage() {
	const router = useRouter()
	const { role, userId, loading: authLoading } = useAuth()
	
	const [loading, setLoading] = useState(true)
	const [pendingCourses, setPendingCourses] = useState([])
	const [allStudentEnrollments, setAllStudentEnrollments] = useState([]) // เก็บ enrollment ทั้งหมดของ student
	const [courses, setCourses] = useState([])
	const [allEnrollments, setAllEnrollments] = useState([]) // สำหรับ admin/instructor
	const [dataLoading, setDataLoading] = useState(true)

	// Search and filter states
	const [pendingSearch, setPendingSearch] = useState('')
	const [availableSearch, setAvailableSearch] = useState('')
	const [pendingStatusFilter, setPendingStatusFilter] = useState('ทั้งหมด')
	const [availableCreditFilter, setAvailableCreditFilter] = useState('ทั้งหมด')

	// Admin/Instructor search and filter states
	const [adminSearch, setAdminSearch] = useState('')
	const [adminStatusFilter, setAdminStatusFilter] = useState('ทั้งหมด')

	// Modal states
	const [showModal, setShowModal] = useState(false)
	const [modalAction, setModalAction] = useState(null)
	const [selectedEnrollment, setSelectedEnrollment] = useState(null)
	
	// Enrollment modal states
	const [showEnrollModal, setShowEnrollModal] = useState(false)
	const [selectedCourse, setSelectedCourse] = useState(null)

	// Fetch pendingCourses and courses
	useEffect(() => {
		const fetchData = async () => {
			if (!role || !userId) return
			
			setDataLoading(true)
			try {
				// Fetch enrollments
				let enrollRes;
				if (role === 'student') {
					// Student เรียกด้วย user_id
					enrollRes = await fetch(`/api/enrollments?user_id=${userId}`)
				} else {
					// Admin/Instructor เรียกทั้งหมด
					enrollRes = await fetch('/api/enrollments')
				}
				
				if (!enrollRes.ok) {
					if (enrollRes.status === 401) router.replace('/login')
					return
				}
				const enrollData = await enrollRes.json()
				
				if (role === 'student') {
					// เก็บทั้งหมดสำหรับตรวจสอบการลงทะเบียนซ้ำ
					setAllStudentEnrollments(Array.isArray(enrollData) ? enrollData : [])
					// เก็บเฉพาะ pending courses สำหรับแสดงผล
					const pending = Array.isArray(enrollData) 
						? enrollData.filter(item => item.status === 'pending')
						: []
					setPendingCourses(pending)
				} else {
					// เก็บทั้งหมดสำหรับ admin/instructor
					setAllEnrollments(Array.isArray(enrollData) ? enrollData : [])
				}

				// Fetch courses
				const coursesRes = await fetch('/api/courses')
				if (coursesRes.ok) {
					const coursesData = await coursesRes.json()
					setCourses(Array.isArray(coursesData) ? coursesData : [])
				}
			} catch (err) {
				// Error handled silently - could be logged to monitoring service
			} finally {
				setDataLoading(false)
				setLoading(false)
			}
		}

		fetchData()
	}, [router, role, userId])

	// Actions
	const openConfirmModal = (enrollment, action) => {
		setSelectedEnrollment(enrollment)
		setModalAction(action)
		setShowModal(true)
	}

	const handleDecision = async () => {
		if (!selectedEnrollment || !modalAction) return

		try {
			const res = await fetch(`/api/enrollments/${selectedEnrollment.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: modalAction }),
			})
			
			if (!res.ok) {
				const errorData = await res.json().catch(() => ({}))
				alert(`อัปเดตสถานะไม่สำเร็จ: ${errorData.error || 'Unknown error'}`)
				return
			}

			// Refresh enrollments
			let enrollRes;
			if (role === 'student') {
				enrollRes = await fetch(`/api/enrollments?user_id=${userId}`)
			} else {
				enrollRes = await fetch('/api/enrollments')
			}
			
			if (enrollRes.ok) {
				const enrollData = await enrollRes.json()
				if (role === 'student') {
					// อัปเดตทั้งสอง state
					setAllStudentEnrollments(Array.isArray(enrollData) ? enrollData : [])
					const pending = Array.isArray(enrollData) 
						? enrollData.filter(item => item.status === 'pending')
						: []
					setPendingCourses(pending)
				} else {
					setAllEnrollments(Array.isArray(enrollData) ? enrollData : [])
				}
			}
			
			setShowModal(false)
			setSelectedEnrollment(null)
			setModalAction(null)
			
			alert(`${modalAction === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}การลงทะเบียนเรียบร้อยแล้ว`)
		} catch (err) {
			alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ')
		}
	}

	const handleEnroll = async (courseCode) => {
		// Use userId from AuthContext
		if (!userId) {
			alert('ไม่พบรหัสนักศึกษา')
			return
		}
		
		try {
			// ดึง student_id จาก API ก่อน
			const studentRes = await fetch(`/api/student/${userId}`)
			
			if (!studentRes.ok) {
				alert('ไม่พบข้อมูลนักศึกษา')
				return
			}
			
			const studentData = await studentRes.json()
			
			if (!studentData.student_id) {
				alert('ไม่พบรหัสนักศึกษา')
				return
			}
			
			// ใช้ทั้ง user_id และ student_id พร้อม updated_at
			const enrollData = { 
				course_code: courseCode, 
				user_id: userId,
				student_id: studentData.student_id,
				updated_at: new Date().toISOString().split('T')[0], // วันที่ในรูปแบบ YYYY-MM-DD
				status: 'pending' 
			}
			
			const res = await fetch('/api/enrollments', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(enrollData),
			})
			
			if (!res.ok) {
				const err = await res.json().catch(() => ({}))
				alert(err?.error || 'ลงทะเบียนไม่สำเร็จ')
				return
			}
			
			// Refresh pending courses
			const enrollRes = await fetch(`/api/enrollments?user_id=${userId}`)
			if (enrollRes.ok) {
				const enrollData = await enrollRes.json()
				// อัปเดตทั้งสอง state
				setAllStudentEnrollments(Array.isArray(enrollData) ? enrollData : [])
				const pending = Array.isArray(enrollData) 
					? enrollData.filter(item => item.status === 'pending')
					: []
				setPendingCourses(pending)
			}
			
			// Close modal and show success message
			setShowEnrollModal(false)
			setSelectedCourse(null)
			alert('ส่งคำขอลงทะเบียนเรียบร้อยแล้ว รอการอนุมัติ')
		} catch (e) {
			alert('เกิดข้อผิดพลาดในการลงทะเบียน')
		}
	}

	const openEnrollModal = (course) => {
		setSelectedCourse(course)
		setShowEnrollModal(true)
	}

	// Filter functions
	const filteredPendingCourses = allStudentEnrollments.filter(enr => {
		const searchTerm = pendingSearch.toLowerCase()
		const courseMatch = enr.courses?.course_name?.toLowerCase().includes(searchTerm) ||
			enr.courses?.course_code?.toLowerCase().includes(searchTerm)
		
		const statusMatch = pendingStatusFilter === 'ทั้งหมด' || enr.status === pendingStatusFilter
		
		return courseMatch && statusMatch
	})

	// แยกตามสถานะสำหรับการแสดงผล
	const pendingEnrollments = filteredPendingCourses.filter(enr => enr.status === 'pending')
	const rejectedEnrollments = filteredPendingCourses.filter(enr => enr.status === 'rejected')
	const approvedEnrollments = filteredPendingCourses.filter(enr => enr.status === 'approved')

	const filteredAvailableCourses = courses.filter(course => {
		// ไม่แสดงวิชาที่ลงทะเบียนแล้ว (ทุกสถานะ)
		const notEnrolled = !allStudentEnrollments.some(e => e.course_code === course.course_code)
		
		const searchTerm = availableSearch.toLowerCase()
		const courseMatch = course.course_name?.toLowerCase().includes(searchTerm) ||
			course.course_code?.toLowerCase().includes(searchTerm) ||
			course.instructor_name?.toLowerCase().includes(searchTerm)
		
		const creditMatch = availableCreditFilter === 'ทั้งหมด' || 
			course.credits?.toString() === availableCreditFilter
		
		return notEnrolled && courseMatch && creditMatch
	})

	// Filter for admin/instructor enrollments
	const filteredAllEnrollments = allEnrollments.filter(enr => {
		const searchTerm = adminSearch.toLowerCase()
		const studentMatch = (enr.students || enr.student_user)?.first_name?.toLowerCase().includes(searchTerm) ||
			(enr.students || enr.student_user)?.last_name?.toLowerCase().includes(searchTerm) ||
			(enr.students || enr.student_user)?.student_id?.toLowerCase().includes(searchTerm)
		const courseMatch = enr.courses?.course_name?.toLowerCase().includes(searchTerm) ||
			enr.courses?.course_code?.toLowerCase().includes(searchTerm)
		
		const statusMatch = adminStatusFilter === 'ทั้งหมด' || enr.status === adminStatusFilter
		
		return (studentMatch || courseMatch) && statusMatch
	})

	// Helpers
	const statusPill = (s) => {
		const map = {
			approved: { text: 'อนุมัติแล้ว', cls: 'text-green-700 bg-green-100' },
			rejected: { text: 'ปฏิเสธ', cls: 'text-red-700 bg-red-100' },
			pending: { text: 'รอการอนุมัติ', cls: 'text-yellow-700 bg-yellow-100' },
		}
		const v = map[s] || { text: s, cls: 'text-gray-700 bg-gray-100' }
		const Icon = s === 'approved' ? CheckCircleIcon : s === 'rejected' ? XCircleIcon : s === 'pending' ? ClockIcon : null
		return (
			<span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${v.cls}`}>
				{Icon ? <Icon className="h-4 w-4" /> : null}
				{v.text}
			</span>
		)
	}

	// Show skeleton loading while auth is loading
	if (loading) {
		return (
			<div className="min-h-screen bg-zinc-50">
				<div className="flex h-screen">
					<Sidebar currentPath="/register" />
					<div className="flex flex-1 flex-col overflow-hidden">
						<main className="flex-1 relative overflow-y-auto focus:outline-none">
							<div className="py-6">
								<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
									<div className="animate-pulse">
										{/* Header skeleton */}
										<div className="flex items-center justify-between mb-6">
											<div className="h-8 bg-gray-200 rounded w-64"></div>
										</div>

										{/* Filters skeleton */}
										<div className="flex gap-4 mb-6">
											<div className="h-10 bg-gray-200 rounded w-32"></div>
											<div className="h-10 bg-gray-200 rounded w-64"></div>
										</div>

										{/* Table skeleton */}
										<div className="overflow-auto rounded-lg shadow bg-white">
											<div className="px-4 py-3 bg-gray-50">
												<div className="h-4 bg-gray-200 rounded w-48"></div>
											</div>
											{[...Array(5)].map((_, i) => (
												<div key={i} className="px-4 py-3 border-b border-gray-200">
													<div className="flex items-center space-x-4">
														<div className="h-4 bg-gray-200 rounded w-32"></div>
														<div className="h-4 bg-gray-200 rounded w-40"></div>
														<div className="h-4 bg-gray-200 rounded w-24"></div>
														<div className="h-4 bg-gray-200 rounded w-28"></div>
													</div>
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

	// Loading skeleton component
	const LoadingSkeleton = () => (
		<div className="animate-pulse">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="h-8 bg-gray-200 rounded w-48"></div>
				<div className="h-6 bg-gray-200 rounded w-64"></div>
			</div>

			{/* Student View - Tabs */}
			{role === 'student' && (
				<div className="mb-6">
					<div className="border-b border-gray-200">
						<nav className="-mb-px flex space-x-8">
							<div className="h-10 bg-gray-200 rounded w-32"></div>
							<div className="h-10 bg-gray-200 rounded w-36"></div>
						</nav>
					</div>
				</div>
			)}

			{/* Search and Filter */}
			<div className="mb-6 flex flex-col sm:flex-row gap-4">
				<div className="flex-1">
					<div className="h-9 bg-gray-200 rounded-md w-full"></div>
				</div>
				<div className="h-9 bg-gray-200 rounded-md w-32"></div>
			</div>

			{/* Table/Cards */}
			<div className="bg-white shadow rounded-lg">
				<div className="px-4 py-5 sm:p-6">
					<div className="space-y-4">
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="border border-gray-200 rounded-lg p-4">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
										<div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
										<div className="h-4 bg-gray-200 rounded w-1/3"></div>
									</div>
									<div className="flex space-x-2">
										<div className="h-8 w-16 bg-gray-200 rounded"></div>
										<div className="h-8 w-16 bg-gray-200 rounded"></div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)

	return (
		<div className="min-h-screen bg-zinc-50">
			<div className="flex h-screen">
				<Sidebar currentPath="/register" />
				<div className="flex flex-1 flex-col overflow-hidden">
					<main className="flex-1 relative overflow-y-auto focus:outline-none">
						<div className="py-6">
							<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
								{loading ? (
									<LoadingSkeleton />
								) : (
									<>
										<div className="flex items-center justify-between mb-6">
											<h1 className="text-2xl font-semibold text-gray-900">
												{role === 'student' ? 'ลงทะเบียนเรียน' : 'จัดการการลงทะเบียน'}
											</h1>
											{role === 'student' && (
												<div className="flex items-center gap-3">
													<span className="text-sm text-gray-600">
														รายวิชาที่ลงทะเบียน: {filteredPendingCourses.length} จาก {allStudentEnrollments.length} รายการ
													</span>
												</div>
								)}
							</div>
								
								{/* Student section */}
								{role === 'student' && (
									<>
										{/* Pending enrollments - วิชาที่กำลังลงทะเบียน */}
										<div className="mb-6 bg-white shadow rounded-lg">
											<div className="px-4 py-5 sm:p-6">
												<h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
													<ClockIcon className="h-6 w-6 mr-2 text-indigo-600" />
													รายวิชาที่ลงทะเบียนทั้งหมด
												</h2>

												{/* Search and Filter for All Enrollments */}
												<div className="mb-4 flex gap-4">
													<div className="relative flex-1">
														<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
															<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
														</div>
														<input
															type="text"
															value={pendingSearch}
															onChange={(e) => setPendingSearch(e.target.value)}
															placeholder="ค้นหาวิชาที่ลงทะเบียน..."
															className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
														/>
													</div>
													<select
														value={pendingStatusFilter}
														onChange={(e) => setPendingStatusFilter(e.target.value)}
														className="text-black block w-fit rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
													>
														<option value="ทั้งหมด">ทุกสถานะ</option>
														<option value="pending">รอการอนุมัติ</option>
														<option value="approved">อนุมัติแล้ว</option>
														<option value="rejected">ปฏิเสธ</option>
													</select>
													{(pendingSearch || pendingStatusFilter !== 'ทั้งหมด') && (
														<button
															onClick={() => {
																setPendingSearch('')
																setPendingStatusFilter('ทั้งหมด')
															}}
															className="px-3 py-2 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
														>
															ล้างตัวกรอง
														</button>
													)}
												</div>

												<div className="mb-2 text-sm text-gray-600">
													แสดง {filteredPendingCourses.length} จาก {allStudentEnrollments.length} รายการ
												</div>

												{dataLoading ? (
													<div className="space-y-6">
														{/* Pending skeleton */}
														<div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
															<div className="h-4 bg-yellow-200 rounded w-32 mb-3"></div>
															<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
																{[...Array(2)].map((_, i) => (
																	<div key={i} className="bg-white rounded-lg p-4 border border-yellow-300 animate-pulse">
																		<div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
																		<div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
																		<div className="h-3 bg-gray-200 rounded w-16"></div>
																		<div className="h-6 bg-gray-200 rounded w-24 mt-2"></div>
																	</div>
																))}
															</div>
														</div>
													</div>
												) : (
													<div className="space-y-6">
														{/* Pending Section */}
														{pendingEnrollments.length > 0 && (
															<div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
																<h3 className="text-md font-semibold text-yellow-800 mb-3 flex items-center">
																	<ClockIcon className="h-5 w-5 mr-2" />
																	รอการอนุมัติ ({pendingEnrollments.length} รายการ)
																</h3>
																<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
																	{pendingEnrollments.map((enr) => (
																		<div key={enr.id} className="bg-white rounded-lg p-4 border border-yellow-300 shadow-sm">
																			<div>
																				<h4 className="font-medium text-gray-900 text-sm">{enr.courses?.course_name}</h4>
																				<p className="text-xs text-gray-500 mt-1">{enr.courses?.course_code}</p>
																				<p className="text-xs text-gray-600 mt-1">หน่วยกิต: {enr.courses?.credits}</p>
																				<div className="mt-2">
																					{statusPill(enr.status)}
																				</div>
																				<p className="text-xs text-gray-500 mt-2">
																					วันที่ส่งคำขอ: {new Date(enr.enrolled_at || enr.created_at).toLocaleDateString('th-TH')}
																				</p>
																			</div>
																		</div>
																	))}
																</div>
															</div>
														)}

														{/* Rejected Section */}
														{rejectedEnrollments.length > 0 && (
															<div className="bg-red-50 rounded-lg p-4 border border-red-200">
																<h3 className="text-md font-semibold text-red-800 mb-3 flex items-center">
																	<XCircleIcon className="h-5 w-5 mr-2" />
																	ปฏิเสธแล้ว ({rejectedEnrollments.length} รายการ)
																</h3>
																<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
																	{rejectedEnrollments.map((enr) => (
																		<div key={enr.id} className="bg-white rounded-lg p-4 border border-red-300 shadow-sm">
																			<div>
																				<h4 className="font-medium text-gray-900 text-sm">{enr.courses?.course_name}</h4>
																				<p className="text-xs text-gray-500 mt-1">{enr.courses?.course_code}</p>
																				<p className="text-xs text-gray-600 mt-1">หน่วยกิต: {enr.courses?.credits}</p>
																				<div className="mt-2">
																					{statusPill(enr.status)}
																				</div>
																				<p className="text-xs text-gray-500 mt-2">
																					วันที่ส่งคำขอ: {new Date(enr.enrolled_at || enr.created_at).toLocaleDateString('th-TH')}
																				</p>
																			</div>
																		</div>
																	))}
																</div>
															</div>
														)}

														{/* Approved Section */}
														{approvedEnrollments.length > 0 && (
															<div className="bg-green-50 rounded-lg p-4 border border-green-200">
																<h3 className="text-md font-semibold text-green-800 mb-3 flex items-center">
																	<CheckCircleIcon className="h-5 w-5 mr-2" />
																	อนุมัติแล้ว ({approvedEnrollments.length} รายการ)
																</h3>
																<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
																	{approvedEnrollments.map((enr) => (
																		<div key={enr.id} className="bg-white rounded-lg p-4 border border-green-300 shadow-sm">
																			<div>
																				<h4 className="font-medium text-gray-900 text-sm">{enr.courses?.course_name}</h4>
																				<p className="text-xs text-gray-500 mt-1">{enr.courses?.course_code}</p>
																				<p className="text-xs text-gray-600 mt-1">หน่วยกิต: {enr.courses?.credits}</p>
																				<div className="mt-2">
																					{statusPill(enr.status)}
																				</div>
																				<p className="text-xs text-gray-500 mt-2">
																					วันที่ลงทะเบียน: {new Date(enr.enrolled_at || enr.created_at).toLocaleDateString('th-TH')}
																				</p>
																			</div>
																		</div>
																	))}
																</div>
															</div>
														)}

														{/* Empty state */}
														{filteredPendingCourses.length === 0 && (
															<div className="text-center py-8">
																<AcademicCapIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
																<p className="text-gray-500">ไม่มีรายวิชาที่ลงทะเบียน</p>
															</div>
														)}
													</div>
												)}
											</div>
										</div>

										{/* Available courses for enrollment */}
										<div className="mb-6 bg-white shadow rounded-lg">
											<div className="px-4 py-5 sm:p-6">
												<h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
													<AcademicCapIcon className="h-6 w-6 mr-2 text-indigo-600" />
													รายวิชาทั้งหมดที่สามารถลงทะเบียนได้
												</h2>

												{/* Search and Filter for Available Courses */}
												<div className="mb-4 flex gap-4">
													<div className="relative flex-1">
														<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
															<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
														</div>
														<input
															type="text"
															value={availableSearch}
															onChange={(e) => setAvailableSearch(e.target.value)}
															placeholder="ค้นหารายวิชา, รหัสวิชา, หรืออาจารย์..."
															className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
														/>
													</div>
													<select
														value={availableCreditFilter}
														onChange={(e) => setAvailableCreditFilter(e.target.value)}
														className="block w-fit rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
													>
														<option value="ทั้งหมด">ทุกหน่วยกิต</option>
														<option value="1">1 หน่วยกิต</option>
														<option value="2">2 หน่วยกิต</option>
														<option value="3">3 หน่วยกิต</option>
														<option value="4">4 หน่วยกิต</option>
													</select>
													{(availableSearch || availableCreditFilter !== 'ทั้งหมด') && (
														<button
															onClick={() => {
																setAvailableSearch('')
																setAvailableCreditFilter('ทั้งหมด')
															}}
															className="px-3 py-2 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
														>
															ล้างตัวกรอง
														</button>
													)}
												</div>

												<div className="mb-2 text-sm text-gray-600">
													แสดง {filteredAvailableCourses.length} รายการ ที่สามารถลงทะเบียนได้
												</div>

												{dataLoading ? (
													<div className="animate-pulse">
														<div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
															<div className="h-4 bg-gray-200 rounded w-48"></div>
														</div>
														{[...Array(5)].map((_, i) => (
															<div key={i} className="px-4 py-3 border-b border-gray-200">
																<div className="flex items-center space-x-4">
																	<div className="h-4 bg-gray-200 rounded w-40"></div>
																	<div className="h-4 bg-gray-200 rounded w-24"></div>
																	<div className="h-4 bg-gray-200 rounded w-32"></div>
																	<div className="h-6 bg-gray-200 rounded w-20 ml-auto"></div>
																</div>
															</div>
														))}
													</div>
												) : (
													<div className="overflow-auto rounded-lg border border-gray-200">
														<table className="min-w-full divide-y divide-gray-200 text-sm">
															<thead className="bg-gray-50">
																<tr>
																	<th className="px-4 py-3 text-left font-medium text-gray-500">รายวิชา</th>
																	<th className="px-4 py-3 text-left font-medium text-gray-500">หน่วยกิต</th>
																	<th className="px-4 py-3 text-left font-medium text-gray-500">อาจารย์</th>
																	<th className="px-4 py-3 text-right font-medium text-gray-500">การดำเนินการ</th>
																</tr>
															</thead>
															<tbody className="divide-y divide-gray-200 bg-white">
																{(() => {
																	if (filteredAvailableCourses.length === 0) {
																		return (
																			<tr>
																				<td colSpan={4} className="px-4 py-8 text-center text-gray-500">
																					<div className="flex flex-col items-center">
																						<AcademicCapIcon className="h-12 w-12 text-gray-300 mb-4" />
																						<p>ไม่มีรายวิชาที่สามารถลงทะเบียนได้เพิ่มเติม</p>
																					</div>
																				</td>
																			</tr>
																		)
																	}
																	
																	return filteredAvailableCourses.map((c) => (
																		<tr key={c.course_code} className="hover:bg-gray-50">
																			<td className="px-4 py-3">
																				<div className="text-sm font-medium text-gray-900">{c.course_name}</div>
																				<div className="text-xs text-gray-500">{c.course_code}</div>
																			</td>
																			<td className="px-4 py-3 text-gray-900">{c.credits || '-'}</td>
																			<td className="px-4 py-3 text-gray-900">{c.instructors.name || '-'}</td>
																			<td className="px-4 py-3">
																				<div className="flex justify-end">
																					<button
																						onClick={() => openEnrollModal(c)}
																						className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
																					>
																						<PlusIcon className="h-3 w-3 mr-1" />
																						ลงทะเบียน
																					</button>
																				</div>
																			</td>
																		</tr>
																	))
																})()}
															</tbody>
														</table>
													</div>
												)}
											</div>
										</div>
									</>
								)}

								{/* Enrollments table - Admin/Instructor only */}
								{role !== 'student' && (
									<div className="overflow-auto rounded-lg shadow bg-white">
										{/* Search and Filter for Admin/Instructor */}
										<div className="px-4 py-4 bg-gray-50 border-b border-gray-200">
											<div className="flex items-center justify-between mb-4">
												<h2 className="text-lg font-medium text-gray-900">จัดการการลงทะเบียน</h2>
												<div className="text-sm text-gray-600">
													แสดง {filteredAllEnrollments.length} จาก {allEnrollments.length} รายการ
												</div>
											</div>
											<div className="flex gap-4">
												<div className="relative flex-1">
													<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
														<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
													</div>
													<input
														type="text"
														value={adminSearch}
														onChange={(e) => setAdminSearch(e.target.value)}
														placeholder="ค้นหานักศึกษา, รหัสนักศึกษา, รายวิชา..."
														className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
													/>
												</div>
												<select
													value={adminStatusFilter}
													onChange={(e) => setAdminStatusFilter(e.target.value)}
													className="text-black block w-fit rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
												>
													<option value="ทั้งหมด">ทุกสถานะ</option>
													<option value="pending">รอการอนุมัติ</option>
													<option value="approved">อนุมัติแล้ว</option>
													<option value="rejected">ปฏิเสธ</option>
												</select>
												{(adminSearch || adminStatusFilter !== 'ทั้งหมด') && (
													<button
														onClick={() => {
															setAdminSearch('')
															setAdminStatusFilter('ทั้งหมด')
														}}
														className="px-3 py-2 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
													>
														ล้างตัวกรอง
													</button>
												)}
											</div>
										</div>

									{dataLoading ? (
										<div className="animate-pulse">
											<div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
												<div className="h-4 bg-gray-200 rounded w-48"></div>
											</div>
											{[...Array(5)].map((_, i) => (
												<div key={i} className="px-4 py-3 border-b border-gray-200">
													<div className="flex items-center space-x-4">
														{role !== 'student' && <div className="h-4 bg-gray-200 rounded w-32"></div>}
														<div className="h-4 bg-gray-200 rounded w-40"></div>
														<div className="h-4 bg-gray-200 rounded w-24"></div>
														<div className="h-4 bg-gray-200 rounded w-28"></div>
														{(role === 'admin' || role === 'instructor') && (
															<div className="flex gap-2 ml-auto">
																<div className="h-6 bg-gray-200 rounded w-16"></div>
																<div className="h-6 bg-gray-200 rounded w-16"></div>
															</div>
														)}
													</div>
												</div>
											))}
										</div>
									) : (
										<table className="min-w-full divide-y divide-gray-200 text-sm">
											<thead className="bg-gray-50">
												<tr>
													{role !== 'student' && (
														<th className="px-4 py-3 text-left font-medium text-gray-500">นักศึกษา</th>
													)}
													<th className="px-4 py-3 text-left font-medium text-gray-500">รายวิชา</th>
													<th className="px-4 py-3 text-left font-medium text-gray-500">หน่วยกิต</th>
													<th className="px-4 py-3 text-left font-medium text-gray-500">สถานะ</th>
													<th className="px-4 py-3 text-left font-medium text-gray-500">วันที่ลงทะเบียน</th>
													{(role === 'admin' || role === 'instructor') && (
														<th className="px-4 py-3 text-right font-medium text-gray-500">การดำเนินการ</th>
													)}
												</tr>
											</thead>
											<tbody className="divide-y divide-gray-200 bg-white">
												{filteredAllEnrollments.length === 0 ? (
													<tr>
														<td colSpan={6} className="px-4 py-8 text-center text-gray-500">
															<div className="flex flex-col items-center">
																<AcademicCapIcon className="h-12 w-12 text-gray-300 mb-4" />
																<p>{adminSearch || adminStatusFilter !== 'ทั้งหมด' ? 'ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา' : 'ไม่พบรายการลงทะเบียน'}</p>
															</div>
														</td>
													</tr>
												) : (
													filteredAllEnrollments.map((enr) => (
														<tr key={enr.id} className="hover:bg-gray-50">
															{role !== 'student' && (
																<td className="px-4 py-3">
																	<div className="text-sm font-medium text-gray-900">
																		{(enr.students || enr.student_user)?.first_name} {(enr.students || enr.student_user)?.last_name}
																	</div>
																	<div className="text-sm text-gray-500">{(enr.students || enr.student_user)?.student_id}</div>
																</td>
															)}
															<td className="px-4 py-3">
																<div className="text-sm font-medium text-gray-900">{enr.courses?.course_name}</div>
																<div className="text-xs text-gray-500">{enr.courses?.course_code}</div>
															</td>
															<td className="px-4 py-3 text-gray-900">{enr.courses?.credits || '-'}</td>
															<td className="px-4 py-3">{statusPill(enr.status)}</td>
															<td className="px-4 py-3 text-gray-900">{new Date(enr.enrolled_at || enr.created_at).toLocaleDateString('th-TH')}</td>
															{(role === 'admin' || role === 'instructor') && (
																<td className="px-4 py-3">
																	{enr.status === 'pending' ? (
																		<div className="flex justify-end gap-2">
																			<button 
																				onClick={() => openConfirmModal(enr, 'approved')} 
																				className="inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
																			>
																				<CheckCircleIcon className="h-3 w-3 mr-1" />
																				อนุมัติ
																			</button>
																			<button 
																				onClick={() => openConfirmModal(enr, 'rejected')} 
																				className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
																			>
																				<XCircleIcon className="h-3 w-3 mr-1" />
																				ปฏิเสธ
																			</button>
																		</div>
																	) : (
																		<div className="text-right text-gray-500 text-xs">ดำเนินการแล้ว</div>
																	)}
																</td>
															)}
														</tr>
													))
												)}
											</tbody>
										</table>
									)}
									</div>
								)}
									</>
								)}
							</div>
						</div>
					</main>
				</div>
			</div>

			{/* Confirmation Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
					<div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
						<div className="mt-3 text-center">
							<div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
								modalAction === 'approved' ? 'bg-green-100' : 'bg-red-100'
							}`}>
								{modalAction === 'approved' ? (
									<CheckCircleIcon className={`h-6 w-6 text-green-600`} />
								) : (
									<XCircleIcon className={`h-6 w-6 text-red-600`} />
								)}
							</div>
							<h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
								{modalAction === 'approved' ? 'อนุมัติการลงทะเบียน' : 'ปฏิเสธการลงทะเบียน'}
							</h3>
							<div className="mt-4 px-4 py-3 bg-gray-50 rounded-lg">
								<p className="text-sm text-gray-600">
									<strong>นักศึกษา:</strong> {(selectedEnrollment?.students || selectedEnrollment?.student_user)?.first_name} {(selectedEnrollment?.students || selectedEnrollment?.student_user)?.last_name}
								</p>
								<p className="text-sm text-gray-600 mt-1">
									<strong>รายวิชา:</strong> {selectedEnrollment?.courses?.course_name}
								</p>
								<p className="text-sm text-gray-600 mt-1">
									<strong>รหัสวิชา:</strong> {selectedEnrollment?.courses?.course_code}
								</p>
							</div>
							<p className="text-sm text-gray-500 mt-4">
								{modalAction === 'approved' 
									? 'คุณต้องการอนุมัติการลงทะเบียนนี้หรือไม่?' 
									: 'คุณต้องการปฏิเสธการลงทะเบียนนี้หรือไม่?'
								}
							</p>
						</div>
						<div className="items-center px-4 py-3">
							<div className="flex gap-3 justify-center">
								<button
									onClick={() => setShowModal(false)}
									className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-24 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
								>
									ยกเลิก
								</button>
								<button
									onClick={handleDecision}
									className={`px-4 py-2 text-white text-base font-medium rounded-md w-24 focus:outline-none focus:ring-2 ${
										modalAction === 'approved'
											? 'bg-green-600 hover:bg-green-700 focus:ring-green-300'
											: 'bg-red-600 hover:bg-red-700 focus:ring-red-300'
									}`}
								>
									{modalAction === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Enrollment Confirmation Modal */}
			{showEnrollModal && selectedCourse && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
					<div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
						<div className="mt-3 text-center">
							<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
								<PlusIcon className="h-6 w-6 text-indigo-600" />
							</div>
							<h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
								ยืนยันการลงทะเบียนเรียน
							</h3>
							<div className="mt-4 px-4 py-3 bg-gray-50 rounded-lg">
								<p className="text-sm text-gray-600">
									<strong>รายวิชา:</strong> {selectedCourse.course_name}
								</p>
								<p className="text-sm text-gray-600 mt-1">
									<strong>รหัสวิชา:</strong> {selectedCourse.course_code}
								</p>
								<p className="text-sm text-gray-600 mt-1">
									<strong>หน่วยกิต:</strong> {selectedCourse.credits}
								</p>
								<p className="text-sm text-gray-600 mt-1">
									<strong>อาจารย์:</strong> {selectedCourse.instructors?.name || '-'}
								</p>
							</div>
							<p className="text-sm text-gray-500 mt-4">
								คุณต้องการลงทะเบียนรายวิชานี้หรือไม่?
							</p>
							<p className="text-xs text-gray-400 mt-2">
								คำขอของคุณจะถูกส่งไปรออนุมัติจากอาจารย์หรือผู้ดูแลระบบ
							</p>
						</div>
						<div className="items-center px-4 py-3">
							<div className="flex gap-3 justify-center">
								<button
									onClick={() => {
										setShowEnrollModal(false)
										setSelectedCourse(null)
									}}
									className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-24 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
								>
									ยกเลิก
								</button>
								<button
									onClick={() => handleEnroll(selectedCourse.course_code)}
									className="px-4 py-2 text-white text-base font-medium rounded-md w-24 focus:outline-none focus:ring-2 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300"
								>
									ลงทะเบียน
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

