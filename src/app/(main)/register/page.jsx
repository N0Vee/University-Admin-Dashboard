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
} from '@heroicons/react/24/outline'

export default function RegisterPage() {
	const router = useRouter()
	const { role, userId, loading } = useAuth()
	
	const [pendingCourses, setPendingCourses] = useState([])
	const [courses, setCourses] = useState([])
	const [allEnrollments, setAllEnrollments] = useState([]) // สำหรับ admin/instructor
	const [dataLoading, setDataLoading] = useState(true)

	// Modal states
	const [showModal, setShowModal] = useState(false)
	const [modalAction, setModalAction] = useState(null)
	const [selectedEnrollment, setSelectedEnrollment] = useState(null)

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
					// เก็บเฉพาะ pending courses สำหรับ student
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
				console.error('Error fetching data:', err)
			} finally {
				setDataLoading(false)
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
				console.error('API Error:', errorData)
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
			console.error('Error updating enrollment:', err)
			alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ')
		}
	}

	const handleEnroll = async (courseCode) => {
		console.log('🎯 Debug - handleEnroll called with:', { courseCode, userId })
		
		// Use userId from AuthContext
		if (!userId) {
			console.log('❌ Debug - No userId found')
			alert('ไม่พบรหัสนักศึกษา')
			return
		}
		
		const enrollData = { course_code: courseCode, student_id: userId, status: 'pending' }
		console.log('📝 Debug - Enrollment data to send:', enrollData)
		
		try {
			const res = await fetch('/api/enrollments', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(enrollData),
			})
			
			console.log('📡 Debug - Enroll response status:', res.status)
			
			if (!res.ok) {
				const err = await res.json().catch(() => ({}))
				console.log('❌ Debug - Enroll error:', err)
				alert(err?.error || 'ลงทะเบียนไม่สำเร็จ')
				return
			}
			
			const responseData = await res.json()
			console.log('✅ Debug - Enroll success response:', responseData)
			
			// Refresh pending courses
			console.log('🔄 Debug - Refreshing pending courses after enroll')
			const enrollRes = await fetch(`/api/enrollments?user_id=${userId}`)
			if (enrollRes.ok) {
				const enrollData = await enrollRes.json()
				console.log('📊 Debug - Refreshed enrollments:', enrollData)
				const pending = Array.isArray(enrollData) 
					? enrollData.filter(item => item.status === 'pending')
					: []
				setPendingCourses(pending)
			}
			
			alert('ส่งคำขอลงทะเบียนแล้ว (รออนุมัติ)')
		} catch (e) {
			console.error('❌ Debug - Network error:', e)
			alert('เกิดข้อผิดพลาดในการลงทะเบียน')
		}
	}

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

	return (
		<div className="min-h-screen bg-zinc-50">
			<div className="flex h-screen">
				<Sidebar currentPath="/register" />
				<div className="flex flex-1 flex-col overflow-hidden">
					<main className="flex-1 relative overflow-y-auto focus:outline-none">
						<div className="py-6">
							<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
							<div className="flex items-center justify-between mb-6">
								<h1 className="text-2xl font-semibold text-gray-900">
									{role === 'student' ? 'ลงทะเบียนเรียน' : 'จัดการการลงทะเบียน'}
								</h1>
								{role === 'student' && (
									<div className="flex items-center gap-3">
										<span className="text-sm text-gray-600">
											รายวิชาที่กำลังลงทะเบียน: {pendingCourses.length} รายการ
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
													<ClockIcon className="h-6 w-6 mr-2 text-yellow-600" />
													วิชาที่กำลังลงทะเบียน (รอการอนุมัติ)
												</h2>
												{dataLoading ? (
													<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
														{[...Array(3)].map((_, i) => (
															<div key={i} className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 animate-pulse">
																<div className="h-4 bg-yellow-200 rounded w-full mb-2"></div>
																<div className="h-3 bg-yellow-200 rounded w-20 mb-1"></div>
																<div className="h-3 bg-yellow-200 rounded w-16"></div>
																<div className="h-6 bg-yellow-200 rounded w-24 mt-2"></div>
															</div>
														))}
													</div>
												) : (
													<>
														{pendingCourses.length > 0 ? (
															<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
																{pendingCourses.map((enr) => (
																	<div key={enr.id} className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
																		<div>
																			<h3 className="font-medium text-gray-900 text-sm">{enr.courses?.course_name}</h3>
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
														) : (
															<div className="text-center py-8">
																<ClockIcon className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
																<p className="text-gray-500">ไม่มีรายวิชาที่กำลังรอการอนุมัติ</p>
															</div>
														)}
													</>
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
																	const availableCourses = courses.filter(c => !pendingCourses.some(e => e.course_code === c.course_code))
																	console.log('📚 Debug - Available courses for enrollment:', {
																		totalCourses: courses.length,
																		pendingCourseCodes: pendingCourses.map(e => e.course_code),
																		availableCount: availableCourses.length,
																		userId
																	})
																	
																	if (availableCourses.length === 0) {
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
																	
																	return availableCourses.map((c) => (
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
																						onClick={() => handleEnroll(c.course_code)}
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

								{/* Admin/Instructor view: Student Demo: available courses */}
								{role !== 'student' && (
									<div className="mb-6 bg-white shadow rounded-lg">
										<div className="px-4 py-5 sm:p-6">
											<h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
												<AcademicCapIcon className="h-6 w-6 mr-2 text-indigo-600" />
												รายวิชาทั้งหมด
											</h2>
											{dataLoading ? (
												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
													{[...Array(6)].map((_, i) => (
														<div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-pulse">
															<div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
															<div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
															<div className="h-3 bg-gray-200 rounded w-16"></div>
														</div>
													))}
												</div>
											) : (
												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
													{courses.slice(0, 9).map((c) => (
														<div key={c.course_code} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
															<div>
																<h3 className="font-medium text-gray-900 text-sm">{c.course_name}</h3>
																<p className="text-xs text-gray-500 mt-1">{c.course_code}</p>
																<p className="text-xs text-gray-600 mt-1">หน่วยกิต: {c.credits}</p>
															</div>
														</div>
													))}
												</div>
											)}
										</div>
									</div>
								)}

								{/* Enrollments table - Admin/Instructor only */}
								{role !== 'student' && (
									<div className="overflow-auto rounded-lg shadow bg-white">
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
												{(role === 'student' ? pendingCourses : allEnrollments).length === 0 ? (
													<tr>
														<td colSpan={role === 'student' ? 5 : 6} className="px-4 py-8 text-center text-gray-500">
															<div className="flex flex-col items-center">
																<AcademicCapIcon className="h-12 w-12 text-gray-300 mb-4" />
																<p>ไม่พบรายการลงทะเบียน</p>
															</div>
														</td>
													</tr>
												) : (
													(role === 'student' ? pendingCourses : allEnrollments).map((enr) => (
														<tr key={enr.id} className="hover:bg-gray-50">
															{role !== 'student' && (
																<td className="px-4 py-3">
																	<div className="text-sm font-medium text-gray-900">
																		{enr.students?.first_name} {enr.students?.last_name}
																	</div>
																	<div className="text-sm text-gray-500">{enr.students?.student_id}</div>
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
									<strong>นักศึกษา:</strong> {selectedEnrollment?.students?.first_name} {selectedEnrollment?.students?.last_name}
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
		</div>
	)
}

