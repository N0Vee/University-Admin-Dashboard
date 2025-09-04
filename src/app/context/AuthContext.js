'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({
  user: null,
  role: null,
  userId: null,
  loading: true,
  refreshAuth: () => {},
  logout: () => {}
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/auth/get-role')
        
        if (!response.ok) {
          if (response.status === 401) {
            // Redirect to login if unauthorized
            router.replace('/login')
            return
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        setRole(data.role)
        setUserId(data.id)
        setUser(data)
        
      } catch (error) {
        console.error('Error fetching user data:', error)
        // Set default role as fallback, but don't redirect automatically
        setRole('student')
        setUser(null)
        setUserId(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const refreshAuth = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/get-role')
      
      if (!response.ok) {
        if (response.status === 401) {
          router.replace('/login')
          return
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setRole(data.role)
      setUserId(data.id)
      setUser(data)
      
    } catch (error) {
      console.error('Error refreshing user data:', error)
      setRole('student')
      setUser(null)
      setUserId(null)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setRole(null)
      setUserId(null)
      router.replace('/login')
    }
  }

  const value = {
    user,
    role,
    userId,
    loading,
    refreshAuth,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext