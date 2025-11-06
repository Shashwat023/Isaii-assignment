import axios from "axios"
import { toast } from 'react-toastify';

// Create a base axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 30000, // Increased timeout for file uploads
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error
    
    // Handle network errors
    if (!response) {
      toast.error('Network error. Please check your connection.')
      return Promise.reject({ message: 'Network error. Please check your connection.' })
    }

    // Handle different HTTP status codes
    switch (response.status) {
      case 401:
        // Handle unauthorized access (e.g., token expired)
        if (window.location.pathname !== '/login') {
          localStorage.removeItem('token')
          window.location.href = '/login?sessionExpired=true'
        }
        break
      case 403:
        toast.error('You do not have permission to perform this action.')
        break
      case 404:
        toast.error('The requested resource was not found.')
        break
      case 500:
        toast.error('Server error. Please try again later.')
        break
      default:
        // Handle custom error messages from the server
        const errorMessage = response.data?.message || 'An error occurred. Please try again.'
        if (errorMessage) {
          toast.error(errorMessage)
        }
    }

    return Promise.reject(error.response?.data || { message: 'An error occurred' })
  }
)

// Helper function for file uploads
export const uploadFile = async (url, formData, onUploadProgress) => {
  try {
    const response = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onUploadProgress(progress)
        }
      },
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'File upload failed' }
  }
}

// Export the configured axios instance
export default api
