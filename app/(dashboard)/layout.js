'use client'



import Header from '@/components/header/header.jsx'
import MobileHeader from '@/components/mobileHeader/mobileHeader.jsx'
import RightNav from '@/components/rightNav/rightNav.jsx'
/*import Chat from '@/components/chat/chat.jsx'*/
import  Image  from 'next/image'
import './index.css'




import {useState, useEffect, useRef} from 'react'
import {io} from 'socket.io-client'
import {useRouter} from 'next/navigation'
import { setUser/*, setUserMessages*/ } from '@/redux/slices/userSlice.js'
import { selectUserInterfaceData /*, setActualSection, setUserState*/ } from '@/redux/slices/userInterfaceSlice.js'
import { getUserPokemon/*, selectUserPokemonData*/ } from '@/redux/slices/userPokemonSlice.js'
import { getUserSkins/*, selectUserSkinsData*/ } from '@/redux/slices/userSkinsSlice.js'
import { setFriendsOnline } from '@/redux/slices/connectedUsersSlice.ts'
import { useSelector, useDispatch } from 'react-redux'
/*import {Riple} from 'react-loading-indicators'*/
import { useAuth } from '@/hooks/useAuth'
import { /*logout,*/ verifyToken/*, clearError*/ } from '@/redux/slices/authSlice'



export default function DashboardLayout({ children }) {
  const router = useRouter()
  const { isAuthenticated, loading } = useSelector(state => state.auth)
  const { logout } = useAuth()
  const [showSideNav, setShowSideNav] = useState(true)
  /*const { actualSection } = useSelector(state => state.userInterface)*/

  /*useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])*/

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [/*battleRequest,*/ setBattleRequest] = useState([])
/*    const [battleVisible, setBattleVisible] = useState(false)*/
    const socket = useRef(null)
    /*const newRoom = uuidv4()*/
    const { token } = useAuth()
    /*const [roomId, setRoomId] = useState()*/
    /*const [globalRoom, setGlobalRoom] = useState()*/
    /*const [roomUsers, setRoomUsers] = useState([])*/
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const { actualSection/*, userState*/ } = useSelector(selectUserInterfaceData)
    /*const {loading : userPokemonLoading, userPokemon, error : userPokemonError} = useSelector(selectUserPokemonData);*/
    /*const {loading : userSkinsLoading, userSkins, error : userSkinsError} = useSelector(selectUserSkinsData);*/

    /*const indexElementStyle = {
      paddingRight: !showSideNav || userState === 'In explore match' ? `0px` : null,
      paddingTop: (userState === 'In explore match' || userState === 'In normal match') ? '0px' : null 
    };*/
    const [localStoreToken, setLocalStoreToken] = useState()

    useEffect(()=>{
      setLocalStoreToken(localStorage.getItem('token'))
      if (typeof window !== 'undefined') {
        setShowSideNav(window.innerWidth > 1200)
      }
    }, [])

    useEffect(()=>{
      dispatch(getUserPokemon(token))
      dispatch(getUserSkins(token))
       fetch(`${API_URL}pokemons/users/getUserData`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ token: localStoreToken })
      })
      .then(response => response.json())
      .then(data => {
        if(data.message !== "Usuario no encontrado"){
          dispatch(setUser(data))
        } else {
          // Token inválido, redirigir al login
          
        }
      }) 
    },[])

    useEffect(()=>{
      socket.current = io(`${API_URL}`,{ auth: {token}})
      return () => {
        socket.current.disconnect();
      };
    },[])
//--------------------------------------------------------------------------------
      useEffect(() => {
        if (!loading) {
            if (isAuthenticated) {
              console.log("nothing to do")
            } else if (localStoreToken) {
              // autentificar
              console.log("punto de verificacion correcto")
              dispatch(verifyToken)
            } else {
              router.push('/login')
            }
        }
      }, [isAuthenticated, loading, router, dispatch])
//----------------------------------------------------------------------------------

useEffect(()=>{
user.id && socket.current.emit('authenticate',({userName: user.userName}))
return ()=> socket.current.off('authenticate')
},[user])

useEffect(()=>{
socket.current.on('battle-mailbox', (msg)=>{
const request =  [{roomId : msg.roomId , from : msg.from, to : msg.from}] ;
setBattleRequest(request)
setTimeout(()=>{setBattleRequest([])}, 7000)
})
      return ()=> socket.current.off(token)
    },[])

useEffect(()=>{
socket.current.on('user-list',(msg)=>{
const actualUserIndex = msg.findIndex(u => u.userName == user.userName);
msg.splice(actualUserIndex, 1);
const friendFolders = [
{
name : "general",
users: msg
}
] 
dispatch(setFriendsOnline(friendFolders))
})
return ()=> socket.current.off('user-list')
},[])






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
