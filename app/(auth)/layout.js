'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import  Image  from 'next/image'

export default function AuthLayout({ children }) {
  const router = useRouter()
  const { isAuthenticated, loading } = useSelector(state => state.auth)
  

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/leagueoflegends')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
      localStorage.setItem('token', null)
  }, [])
  /*if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-gold text-lg">Loading...</p>
        </div>
      </div>
    )
  }*/

  if (isAuthenticated) {
    return <div><Image
            src='/Lol_Icon_Rendered.png'
            width={250}
            height={250}
          />
          </div> // No renderizar nada mientras redirige
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="auth-container">
        {children}
      </div>
    </div>
  )
}
