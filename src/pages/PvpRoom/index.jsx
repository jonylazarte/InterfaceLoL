import { useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdArrowBackIos } from 'react-icons/md';

import PlayButton from '@/components/playButton/playButton.jsx';
import { setUserState } from '@/redux/slices/userInterfaceSlice.js';

import './styles.css';

export default memo(function PvpRoom({ socket }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { alias, title, profileIcon } = user;

  const [roomUsers, setRoomUsers] = useState([]);
  const [roomId, setRoomId] = useState(null);

  // Volver al menú principal
  const handleBack = () => {
    dispatch(setUserState('Online'));
  };

  // Escuchar eventos del socket
  useEffect(() => {
    if (!socket?.current) return;

    // Cuando un usuario entra a la sala
    const handleUserJoined = ({ room, roomId: id }) => {
      setRoomId(id);
      setRoomUsers(room);
      localStorage.setItem('roomId', id);

      // Determinar si eres Player One o Two
      const playerIndex = room.findIndex((sid) => sid === socket.current.id);
      const currentPlayer = playerIndex === 0 ? 'One' : 'Two';
      localStorage.setItem('currentPlayer', currentPlayer);

      // Si ya hay 2 jugadores → iniciar partida
      if (room.length === 2) {
        dispatch(setUserState('PokemonSelection')); // Cambia a selección de Pokémon
      }
    };

    // Cuando alguien sale de la sala
    const handleUserLeft = ({ newRoom }) => {
      setRoomUsers(newRoom);
    };

    // Cuando el servidor te asigna un oponente
    const handleFindOpponent = ({ roomId: id }) => {
      socket.current.emit('join-room', { roomId: id });
    };

    // Registrar listeners
    socket.current.on('USER JOINED', handleUserJoined);
    socket.current.on('USER-OUT', handleUserLeft);
    socket.current.on('find-opponent', handleFindOpponent);

    // Limpiar listeners al desmontar
    return () => {
      socket.current.off('USER JOINED', handleUserJoined);
      socket.current.off('USER-OUT', handleUserLeft);
      socket.current.off('find-opponent', handleFindOpponent);
    };
  }, [socket, dispatch]);

  // Botón "Buscar partida"
  const handleFindMatch = () => {
    socket?.current?.emit('find-match');
  };

  return (
    <section className="pvp-room">
      {/* Header */}
      <div className="room-header">
        <MdArrowBackIos
          onClick={handleBack}
          className="header-arrow"
          size={28}
        />
        <img
          src="https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/general/mini-sr.png"
          alt="Summoner's Rift"
        />
        <h3>GL · CLASIFICATORIA SOLO · RECLUTAMIENTO</h3>
      </div>

      {/* Jugadores en la sala */}
      <div className="room-users">
        {/* Tú (siempre visible) */}
        <div className="room-user">
          <img className="user-banner" src="/general/banner.png" alt="Banner" />
          <div className="user-banner-info-container">
            <div className="banner-user-icon">
              <img
                className="banner-user-border"
                src="/general/EoG_Border_150_4k.png"
                alt="Border"
              />
              <img
                className="banner-user-icon-img"
                src={`https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/profileicon/${profileIcon}.png`}
                alt="Profile"
              />
            </div>
            <h2 className="banner-user-name">{alias || 'Jugador'}</h2>
            <span>{title || 'Sin título'}</span>
          </div>
        </div>

        {/* Oponente (aparece cuando entra) */}
        {roomUsers.length === 2 ? (
          <div className="room-user">
            <img className="user-banner" src="/general/banner.png" alt="Banner" />
            <div className="user-banner-info-container">
              <div className="banner-user-icon">
                <img
                  className="banner-user-border"
                  src="/general/EoG_Border_150_4k.png"
                  alt="Border"
                />
                <div className="waiting-icon">?</div>
              </div>
              <h2 className="banner-user-name">Buscando rival...</h2>
              <span>En cola...</span>
            </div>
          </div>
        ) : (
          <div className="room-user empty">
            <div className="empty-slot">
              <span>Esperando jugador...</span>
            </div>
          </div>
        )}
      </div>

      {/* Botón de buscar partida */}
      <PlayButton
        type="pvp-room"
        text="BUSCAR PARTIDA"
        okButtonAction={handleFindMatch}
      />
    </section>
  );
});