'use client'

import { useState, useEffect } from 'react'
import {
  BellIcon,
  ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline'
import {
  AcademicCapIcon,
} from '@heroicons/react/24/solid'

import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const router = useRouter()
  const { role, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const getRoleDisplay = () => {
    switch (role) {
      case 'admin': return { label: 'Admin', initials: 'AD', color: 'bg-red-500' }
      case 'instructor': return { label: 'Instructor', initials: 'IN', color: 'bg-blue-500' }
      case 'student': return { label: 'Student', initials: 'ST', color: 'bg-green-500' }
      default: return { label: 'User', initials: 'US', color: 'bg-gray-500' }
    }
  }

  const roleInfo = getRoleDisplay()

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600">
                  <AcademicCapIcon className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-semibold text-gray-900">
                  University Management
                </span>
              </div>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-6">

              {/* Notifications */}
              <button className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500">
                <span className="absolute -inset-1.5" />
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <div className="flex max-w-xs items-center rounded-full bg-white text-sm">
                  <span className="sr-only">Open user menu</span>
                  <div className={`h-8 w-8 rounded-full ${roleInfo.color} flex items-center justify-center`}>
                    <span className="text-xs font-medium text-white">{roleInfo.initials}</span>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">{user?.email || 'Loading...'}</span>
                  <button className='hover:bg-gray-100 p-1 rounded-full cursor-pointer' onClick={() => handleLogout()}>
                    <ArrowRightStartOnRectangleIcon className="ml-2 h-4 w-4 text-red-800" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}