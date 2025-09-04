import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const useUserRole = (allowedRoles = [], redirectPath = '/login') => {
  const router = useRouter()
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch('/api/auth/get-role')
        
        if (!res.ok) {
          if (res.status === 401) {
            router.replace('/login')
            return
          }
          throw new Error(`Fetch failed: ${res.status} ${res.statusText}`)
        }

        const data = await res.json()
        setRole(data.role)

        // Check if user has required role
        if (allowedRoles.length > 0 && !allowedRoles.includes(data.role)) {
          router.replace(redirectPath)
        }
        
      } catch (error) {
        console.error('Error fetching user role:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [router, allowedRoles, redirectPath])

  return { role, loading, error }
}
