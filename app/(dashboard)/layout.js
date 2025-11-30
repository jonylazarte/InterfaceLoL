'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import Header from '@/components/header/header.jsx'
import MobileHeader from '@/components/mobileHeader/mobileHeader.jsx'
import RightNav from '@/components/rightNav/rightNav.jsx'
import { useAuth } from '@/hooks/useAuth'
import  Image  from 'next/image'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const { isAuthenticated, loading } = useSelector(state => state.auth)
  const { logout } = useAuth()
  const [showSideNav, setShowSideNav] = useState(true)
  const { actualSection } = useSelector(state => state.userInterface)
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div style={{width: '100vw'}} className="flex items-center content-center justify-center w-screen min-h-screen">
        <div className="text-center">
          <Image
            src='/Lol_Icon_Rendered.png'
            width={250}
            height={250}
          />
        </div>
      </div>
    )
  }

  /*<link rel="preload" href="/images/section1.jpg" as="image" />
  <link rel="preload" href="/images/section2.jpg" as="image" /> */

  if (!isAuthenticated) {
    return <Image
            src='/Lol_Icon_Rendered.png'
            width={250}
            height={250}
          /> // No renderizar nada mientras redirige
  }

  const layoutBackgroundImage = (actualSection) => {
    if(actualSection === 'Home'){
      return '/Jayce_34.jpg'
    } else {
      return '/magic_background.png'
    }

  }

  return (
    <div className="dashboard-layout w-screen min-h-screen bg-gray-0" style={{
      paddingTop: 'var(--dashboard-header-height)',
      paddingRight: `${/*window.innerWidth < 1400 ? '0px' :*/ 'var(--dashboard-sidebar-width)'}`,
      backgroundImage: `url(${layoutBackgroundImage(actualSection)})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover'
    }}>
      
    {window.innerWidth < 767 ? <MobileHeader setShowSideNav={setShowSideNav} logout={logout}/> : <Header setShowSideNav={setShowSideNav} logout={logout} />}
      <RightNav setShowSideNav={setShowSideNav} showSideNav={showSideNav} />
      
          {children}
      
    </div>
  )
}
