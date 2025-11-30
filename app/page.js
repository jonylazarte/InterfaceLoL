'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import Image from 'next/image'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, loading } = useSelector(state => state.auth)

  useEffect(() => {
    if (!loading) {
              if (isAuthenticated) {
          router.push('/dashboard')
        } else {
        router.push('/login')
      }
    }
  }, [isAuthenticated, loading, router])

  return (
    <div className="app-page flex items-center content-center align-center justify-center w-screen min-h-screen">
     <Image
            src='/riot_offwhite.png'
            width={120}
            height={120}
          />
    </div>
  )
}
