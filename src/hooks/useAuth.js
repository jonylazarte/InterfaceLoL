'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { logout, verifyToken, clearError } from '@/redux/slices/authSlice'

export function useAuth() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { isAuthenticated, user, token, loading, error } = useSelector(state => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    router.push('/login')
  }

  const clearAuthError = () => {
    dispatch(clearError())
  }

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && !isAuthenticated) {
      dispatch(verifyToken())
    }
  }, [dispatch, isAuthenticated])

  // Verificar si el usuario está autenticado en cada render
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token && isAuthenticated) {
      dispatch(logout())
    }
  }, [dispatch, isAuthenticated])

  return {
    isAuthenticated,
    user,
    token,
    loading,
    error,
    logout: handleLogout,
    clearError: clearAuthError
  }
}
