'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setActualSection,
  selectUserInterfaceData,
} from '@/redux/slices/userInterfaceSlice.js';

import './HeaderMainButton.css';

export default function PlayButton({ okButtonAction, socket, setRoomId }) {
  const dispatch = useDispatch();
  const { actualSection, userState } = useSelector(selectUserInterfaceData);

  // Texto dinámico del botón
  const getButtonText = () => {
    if (userState === 'Explore' || userState === 'Pvp') return 'GRUPO';
    if (userState.includes('match') || userState === 'In match') return 'EN PARTIDA';
    return 'JUEGA';
  };

  // Sonidos (se crean una sola vez fuera del componente si querés, pero así está perfecto)
  const playSound = (type) => {
    const sounds = {
      hover: '/general/find-match-button-hover.mp3',
      click: '/general/find-match-button-click.mp3',
    };

    const audio = new Audio(sounds[type]);
    audio.volume = 0.4;
    audio.play().catch(() => {}); // Evita errores de autoplay
  };

  const handleClick = () => {
    playSound('click');

    // Si hay acción personalizada (por ejemplo desde el lobby PvP), usarla
    if (okButtonAction) {
      okButtonAction();
      return;
    }

    // Comportamiento por defecto: abrir selección de modos
    if (actualSection !== 'ModeSelection') {
      dispatch(setActualSection('ModeSelection'));
    }
  };

  const isActive = actualSection === 'ModeSelection' || userState !== 'Online';

  return (
    <div className="lol-main-button">
      {/* Logo circular izquierdo */}
      <div className="lol-main-button__logo-container">
        <div className="lol-main-button__logo" />
      </div>

      {/* Botón principal */}
      <div
        className={`lol-main-button__action-box ${isActive ? 'selected' : ''}`}
        onMouseEnter={() => playSound('hover')}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Abrir selección de modo"
      >
        <div className={`lol-main-button__action-border ${isActive ? 'selected' : ''}`}>
          <div className={`lol-main-button__action ${isActive ? 'selected' : ''}`}>
            <div className={`lol-main-button__text ${isActive ? 'selected' : ''}`}>
              {getButtonText()}
            </div>
          </div>
          <div className="header-circunferense" />
        </div>
      </div>
    </div>
  );
}