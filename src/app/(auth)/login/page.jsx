'use client'

import { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { AcademicCapIcon, ShieldCheckIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        const { email, password } = formData

        let data = null

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            data = await res.json()

        } catch (error) {
            console.error(error)
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์')
            setIsLoading(false)
            return
        }

        setIsLoading(false)

        if (data?.role === 'admin') {
            router.push('/dashboard')
        } else if (data?.role === 'student') {
            router.push('/student')
        } else {
            setError('บทบาทผู้ใช้ไม่ถูกต้อง')
        }

    }


    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-indigo-100/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-purple-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/25">
                            <AcademicCapIcon className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        ระบบจัดการนักศึกษา
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        เข้าสู่ระบบเพื่อจัดการข้อมูลนักศึกษา
                    </p>
                </div>

                {/* Login Form */}
                <div className="mt-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                อีเมล
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm transition-all duration-200 hover:ring-gray-400"
                                    placeholder="admin@university.ac.th"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                รหัสผ่าน
                            </label>
                            <div className="mt-2 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border-0 py-2.5 px-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm transition-all duration-200 hover:ring-gray-400"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="rememberMe"
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-0"
                                />
                                <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-700">
                                    จดจำการเข้าสู่ระบบ
                                </label>
                            </div>

                            <div className="text-sm leading-6">
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                                    ลืมรหัสผ่าน?
                                </a>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        กำลังเข้าสู่ระบบ...
                                    </div>
                                ) : (
                                    'เข้าสู่ระบบ'
                                )}
                            </button>
                        </div>
                    </form>


                </div>
            </div>
        </div>
    )
}