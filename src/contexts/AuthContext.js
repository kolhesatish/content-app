'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    console.log('🔄 Initializing auth...')

    // First, restore user from localStorage immediately for fast UI update
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    console.log('📦 Stored user:', storedUser ? 'Found' : 'Not found')
    console.log('🔑 Token:', token ? 'Found' : 'Not found')
    
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser)
        console.log('✅ Setting user:', userData)
        setUser(userData)
        
        // Verify token is still valid in background
        verifyToken(token)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        clearAuth()
      }
    }
    
    setIsLoading(false)
  }

  const verifyToken = async (token) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
      } else {
        // Token is invalid
        clearAuth()
      }
    } catch (error) {
      // Network error - keep user logged in but don't clear data
      console.error('Token verification failed:', error)
    }
  }

  const login = (userData, token) => {
    console.log('🚀 Login called with:', userData, token ? 'with token' : 'no token')
    setUser(userData)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData))
      if (token) {
        localStorage.setItem('token', token)
      }
    }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  const clearAuth = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  const updateCredits = (newCredits) => {
    if (user) {
      const updatedUser = { ...user, credits: newCredits }
      setUser(updatedUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    }
  }

  const getToken = () => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  const value = {
    user,
    isLoading,
    login,
    logout,
    updateCredits,
    getToken,
    checkAuth: initializeAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}