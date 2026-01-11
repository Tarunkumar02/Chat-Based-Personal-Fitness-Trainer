import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await api.get('/auth/me')
        if (response.data.ok) {
          setUser(response.data.data)
        }
      } catch (error) {
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    if (response.data.ok) {
      localStorage.setItem('token', response.data.data.token)
      setUser(response.data.data.user)
      return { success: true }
    }
    return { success: false, error: response.data.error?.message }
  }

  const register = async (email, password) => {
    const response = await api.post('/auth/register', { email, password })
    if (response.data.ok) {
      localStorage.setItem('token', response.data.data.token)
      setUser({ id: response.data.data.id, email: response.data.data.email })
      return { success: true }
    }
    return { success: false, error: response.data.error?.message }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
