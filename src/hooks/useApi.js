import { useState, useCallback } from 'react'

/**
 * Custom hook for handling API calls with loading states and error handling
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiCall = useCallback(async (url, options = {}) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const get = useCallback((url, options = {}) => {
    return apiCall(url, { ...options, method: 'GET' })
  }, [apiCall])

  const post = useCallback((url, data, options = {}) => {
    return apiCall(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }, [apiCall])

  const put = useCallback((url, data, options = {}) => {
    return apiCall(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }, [apiCall])

  const patch = useCallback((url, data, options = {}) => {
    return apiCall(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }, [apiCall])

  const del = useCallback((url, options = {}) => {
    return apiCall(url, { ...options, method: 'DELETE' })
  }, [apiCall])

  return {
    loading,
    error,
    setError,
    get,
    post,
    put,
    patch,
    delete: del,
    apiCall,
  }
}

/**
 * Hook for managing enrollment-related API calls
 */
export const useEnrollmentApi = () => {
  const { loading, error, setError, get, post, patch, del } = useApi()

  const getEnrollments = useCallback(async (params = {}) => {
    const searchParams = new URLSearchParams(params)
    return get(`/api/enrollments?${searchParams}`)
  }, [get])

  const createEnrollment = useCallback(async (enrollmentData) => {
    return post('/api/enrollments', enrollmentData)
  }, [post])

  const updateEnrollmentStatus = useCallback(async (id, status) => {
    return patch(`/api/enrollments/${id}`, { status })
  }, [patch])

  const deleteEnrollment = useCallback(async (id) => {
    return del(`/api/enrollments/${id}`)
  }, [del])

  return {
    loading,
    error,
    setError,
    getEnrollments,
    createEnrollment,
    updateEnrollmentStatus,
    deleteEnrollment,
  }
}

/**
 * Hook for managing course-related API calls
 */
export const useCourseApi = () => {
  const { loading, error, setError, get, post, put, del } = useApi()

  const getCourses = useCallback(async (params = {}) => {
    const searchParams = new URLSearchParams(params)
    return get(`/api/courses?${searchParams}`)
  }, [get])

  const getCourse = useCallback(async (courseCode) => {
    return get(`/api/course/${courseCode}`)
  }, [get])

  const createCourse = useCallback(async (courseData) => {
    return post('/api/courses/add', courseData)
  }, [post])

  const updateCourse = useCallback(async (courseCode, courseData) => {
    return put(`/api/courses/update/${courseCode}`, courseData)
  }, [put])

  const deleteCourse = useCallback(async (courseCode) => {
    return del(`/api/courses/delete/${courseCode}`)
  }, [del])

  return {
    loading,
    error,
    setError,
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
  }
}

/**
 * Hook for managing student-related API calls
 */
export const useStudentApi = () => {
  const { loading, error, setError, get, post, put, del } = useApi()

  const getStudents = useCallback(async (params = {}) => {
    const searchParams = new URLSearchParams(params)
    return get(`/api/students?${searchParams}`)
  }, [get])

  const getStudent = useCallback(async (id) => {
    return get(`/api/student/${id}`)
  }, [get])

  const getStudentByStudentId = useCallback(async (studentId) => {
    return get(`/api/studentByStudentId/${studentId}`)
  }, [get])

  const createStudent = useCallback(async (studentData) => {
    return post('/api/students/add', studentData)
  }, [post])

  const updateStudent = useCallback(async (id, studentData) => {
    return put(`/api/student/update/${id}`, studentData)
  }, [put])

  const deleteStudent = useCallback(async (id) => {
    return del(`/api/student/delete/${id}`)
  }, [del])

  const generateStudentId = useCallback(async () => {
    return get('/api/students/generate-id')
  }, [get])

  return {
    loading,
    error,
    setError,
    getStudents,
    getStudent,
    getStudentByStudentId,
    createStudent,
    updateStudent,
    deleteStudent,
    generateStudentId,
  }
}
