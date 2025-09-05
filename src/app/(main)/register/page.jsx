'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import Sidebar from '@/app/components/Sidebar'
import {
	MagnifyingGlassIcon,
	CheckCircleIcon,
	XCircleIcon,
	ClockIcon,
	AcademicCapIcon,
	PlusIcon,
} from '@heroicons/react/24/outline'

export default function RegisterPage() {
	const router = useRouter()
	const { role, loading } = useAuth()

	const [enrollments, setEnrollments] = useState([])
	const [courses, setCourses] = useState([])
	const [userInfo, setUserInfo] = useState({ id: null, role: null })
	const [dataLoading, setDataLoading] = useState(true)

	// UI filters
	const [search, setSearch] = useState('')
	const [selectedStatus, setSelectedStatus] = useState('ทุกสถานะ')

	// Modal states
	const [showModal, setShowModal] = useState(false)
	const [modalAction, setModalAction] = useState(null)
	const [selectedEnrollment, setSelectedEnrollment] = useState(null)

	// Fetch minimal user info (id, role) from token
	useEffect(() => {
		const fetchRole = async () => {
			try {
				const res = await fetch('/api/auth/get-role')
				if (!res.ok) return
				const data = await res.json()
				setUserInfo({ id: data.id ?? null, role: data.role ?? null })
			} catch {}
		}
		fetchRole()
	}, [])

	// Fetch enrollments and courses once
	useEffect(() => {
		const fetchData = async () => {
			if (!role) return
			
			setDataLoading(true)
			try {
				// Fetch enrollments
				const enrollRes = await fetch('/api/enrollments')
				if (!enrollRes.ok) {
					if (enrollRes.status === 401) router.replace('/login')
					return
				}
				const enrollData = await enrollRes.json()
				setEnrollments(Array.isArray(enrollData) ? enrollData : [])

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
	}, [router, role])

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
			const enrollRes = await fetch('/api/enrollments')
			if (enrollRes.ok) {
				const enrollData = await enrollRes.json()
				setEnrollments(Array.isArray(enrollData) ? enrollData : [])
			}
			
			setShowModal(false)
			setSelectedEnrollment(null)
			setModalAction(null)
			
			alert(`${modalAction === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}การลงทะเบียนเรียบร้อยแล้ว`)
		} catch (e) {
			console.error('Network Error:', e)
			alert('เกิดข้อผิดพลาดในการเชื่อมต่อ')
		}
	}

	const handleEnroll = async (courseCode) => {
		// Demo: ใช้ id จาก token เป็น student_id ถ้าไม่มีจะแจ้งเตือน
		if (!userInfo?.id) {
			alert('ไม่พบรหัสนักศึกษา (Demo)')
			return
		}
		try {
			const res = await fetch('/api/enrollments', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ course_code: courseCode, student_id: userInfo.id, status: 'pending' }),
			})
			if (!res.ok) {
				const err = await res.json().catch(() => ({}))
				alert(err?.error || 'ลงทะเบียนไม่สำเร็จ')
				return
			}
			
			// Refresh enrollments
			const enrollRes = await fetch('/api/enrollments')
			if (enrollRes.ok) {
				const enrollData = await enrollRes.json()
				setEnrollments(Array.isArray(enrollData) ? enrollData : [])
			}
			
			alert('ส่งคำขอลงทะเบียนแล้ว (รออนุมัติ)')
		} catch (e) {
			console.error(e)
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

	// Apply search/status filters and role visibility
	const filtered = useMemo(() => {
		const term = search.toLowerCase()
		const withinSearch = (e) => {
			const s1 = e?.courses?.course_name?.toLowerCase() || ''
			const s2 = e?.courses?.course_code?.toLowerCase() || ''
			const s3 = `${e?.students?.first_name || ''} ${e?.students?.last_name || ''}`.toLowerCase()
			const s4 = e?.students?.student_id?.toLowerCase() || ''
			return s1.includes(term) || s2.includes(term) || s3.includes(term) || s4.includes(term)
		}

		const byStatus = (e) => selectedStatus === 'ทุกสถานะ' || e.status === selectedStatus

		const byRole = (e) => {
			if (role === 'admin') return true
			if (role === 'instructor') {
				// สมมติ userInfo.id คือ instructor_code
				if (!userInfo?.id) return false
				return e?.courses?.instructor_code === userInfo.id
			}
			if (role === 'student') {
				// สมมติ userInfo.id คือ student_id
				if (!userInfo?.id) return false
				return e?.student_id === userInfo.id
			}
			return true
		}

		return enrollments.filter((e) => withinSearch(e) && byStatus(e) && byRole(e))
	}, [enrollments, role, search, selectedStatus, userInfo])

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
									{role === 'admin' && (
										<div className="flex items-center gap-3">
											<span className="text-sm text-gray-600">รวม {filtered.length} รายการ</span>
										</div>
									)}
								</div>

								{/* Filters */}
								<div className="flex gap-4 mb-6">
									<select
										value={selectedStatus}
										onChange={(e) => setSelectedStatus(e.target.value)}
										className="text-black block w-fit rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
									>
										<option value="ทุกสถานะ">ทุกสถานะ</option>
										<option value="pending">รอการอนุมัติ</option>
										<option value="approved">อนุมัติแล้ว</option>
										<option value="rejected">ปฏิเสธ</option>
									</select>

									<div className="relative">
										<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
											<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
										</div>
										<input
											type="text"
											value={search}
											onChange={(e) => setSearch(e.target.value)}
											placeholder="ค้นหารายวิชาหรือนักศึกษา..."
											className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
										/>
									</div>
								</div>

								{/* Student Demo: available courses */}
								{role === 'student' && (
									<div className="mb-6 bg-white shadow rounded-lg">
										<div className="px-4 py-5 sm:p-6">
											<h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
												<AcademicCapIcon className="h-6 w-6 mr-2 text-indigo-600" />
												รายวิชาที่เปิดให้ลงทะเบียน
											</h2>
											{dataLoading ? (
												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
													{[...Array(6)].map((_, i) => (
														<div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-pulse">
															<div className="flex justify-between items-start">
																<div className="flex-1">
																	<div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
																	<div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
																	<div className="h-3 bg-gray-200 rounded w-16"></div>
																</div>
																<div className="h-8 w-20 bg-gray-200 rounded ml-2"></div>
															</div>
														</div>
													))}
												</div>
											) : (
												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
													{courses.slice(0, 9).map((c) => {
														const already = enrollments.some((e) => e.course_code === c.course_code && e.student_id === userInfo?.id)
														return (
															<div key={c.course_code} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-indigo-300 transition-colors">
																<div className="flex justify-between items-start">
																	<div className="flex-1">
																		<h3 className="font-medium text-gray-900 text-sm">{c.course_name}</h3>
																		<p className="text-xs text-gray-500 mt-1">{c.course_code}</p>
																		<p className="text-xs text-gray-600 mt-1">หน่วยกิต: {c.credits}</p>
																	</div>
																	<button
																		onClick={() => handleEnroll(c.course_code)}
																		disabled={already}
																		className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
																	>
																		{already ? 'ลงทะเบียนแล้ว' : 'ลงทะเบียน'}
																	</button>
																</div>
															</div>
														)
													})}
												</div>
											)}
										</div>
									</div>
								)}

								{/* Enrollments table */}
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
												{filtered.length === 0 ? (
													<tr>
														<td colSpan={role === 'student' ? 5 : 6} className="px-4 py-8 text-center text-gray-500">
															<div className="flex flex-col items-center">
																<AcademicCapIcon className="h-12 w-12 text-gray-300 mb-4" />
																<p>ไม่พบรายการลงทะเบียน</p>
															</div>
														</td>
													</tr>
												) : (
													filtered.map((enr) => (
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

