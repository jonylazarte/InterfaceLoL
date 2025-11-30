'use client';

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { Riple } from 'react-loading-indicators';

import Header from '@/components/header/header.jsx';
import RightNav from '@/components/rightNav/rightNav.jsx';
import Chat from '@/components/chat/chat.jsx';
import MinimizedChats from '@/components/chat/MinimizedChats.jsx';
import { useChatSocket } from '@/hooks/useChatSocket';

import {
  setUser,
  setUserMessages,
} from '@/redux/slices/userSlice.js';
import {
  selectUserInterfaceData,
  setActualSection,
  setUserState,
} from '@/redux/slices/userInterfaceSlice.js';
import {
  getUserPokemon,
} from '@/redux/slices/userPokemonSlice.js';
import {
  getUserItems,
} from '@/redux/slices/userItemsSlice.js';

import './index.css';

const PokemonSelection = lazy(() => import('@/pages/PokemonSelection/index.jsx'));
const ModeSelection = lazy(() => import('@/pages/ModeSelection/modeSelection.jsx'));
const MatchVsIa = lazy(() => import('@/pages/IaMatch/IaMatch.jsx'));
const Bag = lazy(() => import('@/pages/Bag/bag.jsx'));
const Store = lazy(() => import('@/pages/Store/store.jsx'));

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Index({ setToken }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const socket = useRef(null);

  const [showSideNav, setShowSideNav] = useState(window.innerWidth > 1200);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [battleRequest, setBattleRequest] = useState([]);

  const user = useSelector((state) => state.user);
  const { actualSection, userState } = useSelector(selectUserInterfaceData);

  // Inicializar socket y datos del usuario
  useEffect(() => {
    // Cargar datos del usuario
    const token = localStorage.getItem('token');
    if (!user.id && token) {
      fetch(`${API_URL}pokemons/users/getUserData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message !== 'Usuario no encontrado') {
            dispatch(setUser(data));
          } else {
            setToken();
          }
        });
    }

    dispatch(getUserPokemon(token));
    dispatch(getUserItems(token));
  }, [dispatch, setToken, user.id]);

  // Conectar socket
  useEffect(() => {
    const token = localStorage.getItem('token');
    socket.current = io(API_URL, { auth: { token } });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  // Autenticar usuario cuando ya está cargado
  useEffect(() => {
    if (user.id) {
      socket.current.emit('authenticate', { userName: user.userName });
    }
  }, [user.id, user.userName]);

  // Hook del chat (maneja todo lo relacionado con mensajes)
  useChatSocket(socket);

  // Recepción de solicitudes de batalla
  useEffect(() => {
    socket.current.on('battle-mailbox', (msg) => {
      setBattleRequest([{ roomId: msg.roomId, from: msg.from }]);
      setTimeout(() => setBattleRequest([]), 7000);
    });

    return () => socket.current.off('battle-mailbox');
  }, []);

  // Lista de usuarios conectados
  useEffect(() => {
    socket.current.on('user-list', (users) => {
      const withoutSelf = users.filter((u) => u.userName !== user.userName);
      setConnectedUsers([{ name: 'general', users: withoutSelf }]);
    });

    return () => socket.current.off('user-list');
  }, [user.userName]);

  // Mensajes del chat (se manejan en el hook, pero dejamos por si necesitas algo extra)
  useEffect(() => {
    socket.current.on('chat-message', (msg) => {
      dispatch(setUserMessages(msg));
    });

    return () => socket.current.off('chat-message');
  }, [dispatch]);

  // Iniciar partida normal
  useEffect(() => {
    socket.current.on('start-match', () => {
      dispatch(setUserState('In normal match'));
      dispatch(setActualSection('PokemonSelection'));
    });

    return () => socket.current.off('start-match');
  }, [dispatch]);

  // Aceptar solicitud de batalla
  const handleEmitAcceptBattleRequest = (roomId) => {
    localStorage.setItem('roomId', roomId);
    socket.current.emit('join-room', { roomId });
    dispatch(setActualSection('ModeSelection'));
  };

  const handleEmitBattleRequest = (selectedUser) => {
    const roomId = uuidv4();
    localStorage.setItem('roomId', roomId);
    socket.current.emit('battle-request', {
      to: selectedUser,
      from: user.userName,
      roomId,
    });
  };

  // Controlar visibilidad del RightNav en pantallas grandes
  useEffect(() => {
    if (userState === 'In explore match' || userState === 'In normal match') {
      setShowSideNav(false);
    } else if (window.innerWidth > 1200) {
      setShowSideNav(true);
    }
  }, [userState]);

  const containerStyle = {
    paddingRight: !showSideNav || userState === 'In explore match' ? '0px' : null,
    paddingTop:
      userState === 'In explore match' || userState === 'In normal match' ? '0px' : null,
  };

  if (!user.id) {
    return (
      <div className="loadingScreen">
        <div className="wrapper">
          <div className="pokeball"></div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="index">
      <Header
        globalRoom={localStorage.getItem('roomId')}
        showSideNav={showSideNav}
        setShowSideNav={setShowSideNav}
      />

      <RightNav
        socket={socket}
        setToken={setToken}
        showSideNav={showSideNav}
        setShowSideNav={setShowSideNav}
        battleRequest={battleRequest}
        handleEmitBattleRequest={handleEmitBattleRequest}
        handleEmitAcceptBattleRequest={handleEmitAcceptBattleRequest}
      />

      <Chat socket={socket} connectedUsers={connectedUsers} />
      <MinimizedChats />

      {actualSection === 'Home' && <section className="inicio"></section>}

      {actualSection === 'Bag' && (
        <Suspense fallback={<div className="loading"><Riple color="var(--gold-one)" size="medium" /></div>}>
          <Bag />
        </Suspense>
      )}

      {actualSection === 'Store' && (
        <Suspense fallback={<div className="loading"><Riple color="var(--gold-one)" size="medium" /></div>}>
          <Store />
        </Suspense>
      )}

      {actualSection === 'ModeSelection' && (
        <Suspense fallback={<div className="loading"><Riple color="var(--gold-one)" size="medium" /></div>}>
          <ModeSelection socket={socket} />
        </Suspense>
      )}

      {actualSection === 'PokemonSelection' && (
        <Suspense fallback={<div className="loading"><Riple color="var(--gold-one)" size="medium" /></div>}>
          <PokemonSelection
            roomId={localStorage.getItem('roomId')}
            socket={socket}
          />
        </Suspense>
      )}

      {actualSection === 'IaMatch' && (
        <Suspense fallback={<div className="loading"><Riple color="var(--gold-one)" size="medium" /></div>}>
          <MatchVsIa socket={socket} />
        </Suspense>
      )}
    </div>
  );
}