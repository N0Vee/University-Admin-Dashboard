import {
    BellIcon,
    ChevronDownIcon,

} from '@heroicons/react/24/outline'
import {
    AcademicCapIcon,
} from '@heroicons/react/24/solid'

export default function Navbar() {
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
                                    Student Management
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
                                <button className="flex max-w-xs items-center rounded-full bg-white text-sm hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2">
                                    <span className="sr-only">Open user menu</span>
                                    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                                        <span className="text-xs font-medium text-white">AD</span>
                                    </div>
                                    <span className="ml-3 text-sm font-medium text-gray-700">Admin</span>
                                    <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}