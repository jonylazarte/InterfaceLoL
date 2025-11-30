'use client'

import '@/pages/Index/index.css'
import { lazy, Suspense } from 'react';
const  PokemonSelection = lazy(() => import('../../../src/pages/PokemonSelection/index.jsx'));
const  ModeSelection = lazy(() => import('../../../src/pages/ModeSelection/modeSelection.jsx'));
const  Bag = lazy(() => import('../bag/page'));
const  Store = lazy(() => import('../store/page'));
import Chat from '../../../src/components/chat/chat.jsx'
import react, {useState, useEffect, useRef} from 'react'
import {io} from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid';
import {useRouter} from 'next/navigation'
import { setUser, setUserMessages } from '../../../src/redux/slices/userSlice.js'
import { selectUserInterfaceData, setActualSection, setUserState } from '../../../src/redux/slices/userInterfaceSlice.js'
import { getUserPokemon, selectUserPokemonData } from '@/redux/slices/userPokemonSlice.js'
import { getUserSkins, selectUserSkinsData } from '@/redux/slices/userSkinsSlice.js'
import { setFriendsOnline } from '@/redux/slices/connectedUsersSlice.ts'
import { useSelector, useDispatch } from 'react-redux'
import {Riple} from 'react-loading-indicators'
import { useAuth } from '../../../src/hooks/useAuth'

export default function Dashboard(){
	  const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [showSideNav, setShowSideNav] = useState(true)
    const [battleRequest, setBattleRequest] = useState([])
    const router = useRouter()
    const [battleVisible, setBattleVisible] = useState(false)
    const socket = useRef(null)
    const newRoom = uuidv4()
    const { token } = useAuth()
    const [roomId, setRoomId] = useState()
    const [globalRoom, setGlobalRoom] = useState()
    const [roomUsers, setRoomUsers] = useState([])
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const { actualSection, userState } = useSelector(selectUserInterfaceData)
    const {loading : userPokemonLoading, userPokemon, error : userPokemonError} = useSelector(selectUserPokemonData);
    const {loading : userSkinsLoading, userSkins, error : userSkinsError} = useSelector(selectUserSkinsData);

    /*const indexElementStyle = {
      paddingRight: !showSideNav || userState === 'In explore match' ? `0px` : null,
      paddingTop: (userState === 'In explore match' || userState === 'In normal match') ? '0px' : null 
    };*/

    useEffect(()=>{
      if (typeof window !== 'undefined') {
        setShowSideNav(window.innerWidth > 1200)
      }
    }, [])

    useEffect(()=>{
      dispatch(getUserPokemon(token))
      dispatch(getUserSkins(token))
      !user.id ? fetch(`${API_URL}pokemons/users/getUserData`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ token })
      })
      .then(response => response.json())
      .then(data => {
        if(data.message !== "Usuario no encontrado"){
          dispatch(setUser(data))
        } else {
          // Token inválido, redirigir al login
          router.push('/login')
        }
      }) : null
    },[])

    useEffect(()=>{
      socket.current = io(`${API_URL}`,{ auth: {token}})
      return () => {
        socket.current.disconnect();
      };
    },[])

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

    return (
        <div 
          style={{
                height:  `${window.innerWidth < 1400 ? 'var(--dashboard-content-height-mobile)' : 'var(--dashboard-content-height)'}`,
                width: 'var(--dashboard-content-width)'
              }}
          className="main-content flex align-center justify-center items-center content-center"
            >
          <Suspense >
            {actualSection === "ModeSelection" && <ModeSelection />}
            {actualSection === "Pokemon Selection" && <PokemonSelection />}
            {actualSection === "Match vs IA" && <MatchVsIa />}
            {actualSection === "Colección" && <Bag />}
            {actualSection === "Tienda" && <Store />}
          </Suspense>
          <Chat 
           
          />
        </div>

          

    )
}
