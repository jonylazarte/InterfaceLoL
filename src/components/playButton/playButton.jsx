'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUserInterfaceData,
  setActualSection,
  setUserState,
} from '@/redux/slices/userInterfaceSlice.js';
import './playButton.css';

export default function PlayButton({
  setRoomId,
  socket,
  type,
  text,
  modeSelected,
  okButtonAction,
}) {
  const dispatch = useDispatch();
  const { actualSection, userState } = useSelector(selectUserInterfaceData);

  const [inQueue, setInQueue] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);

  // Contador solo cuando está en cola
  useEffect(() => {
    if (!inQueue) {
      setSeconds(0);
      setMinutes(0);
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => (prev >= 59 ? 0 : prev + 1));
      if (seconds >= 59) {
        setMinutes((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [inQueue, seconds]);

  // Sonidos simplificados
  const playSound = (sound) => {
    const sounds = {
      hover: '/general/find-match-button-hover.mp3',
      click: '/general/find-match-button-click.mp3',
      cancel: '/general/confirm-button-cancel-click.mp3',
      confirm: '/general/confirm-button-click.mp3',
    };

    const audio = new Audio(sounds[sound] || sounds.click);
    audio.play().catch(() => {});
  };

  // Cancelar / Salir
  const handleCancel = () => {
    playSound('cancel');

    if (type === 'pvp-room') {
      socket?.current?.emit('leave-room');
      setRoomId?.(null);
      dispatch(setUserState('Online'));
      dispatch(setActualSection('Home'));
    }

    if (type === 'explore-room' || type === 'modeSelection') {
      dispatch(setActualSection('Home'));
      dispatch(setUserState('Online'));
    }

    setInQueue(false);
  };

  // Acción principal del botón
  const handleConfirm = () => {
    if (type === 'pvp-room') {
      playSound('click');
      socket?.current?.emit('find-opponent');
      setInQueue(true);
    }

    if (type === 'explore-room') {
      dispatch(setActualSection('IaMatch'));
      dispatch(setUserState('Exprolación'));
    }

    if (type === 'modeSelection') {
      playSound('confirm');
      dispatch(setUserState(modeSelected));
    }

    if (type === 'arenaPokemonSelection') {
      okButtonAction?.();
    }
  };

  const displayText = inQueue
    ? `En cola: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : text;

  return (
    <div className="play-and-out-button">
      {/* Botón de cancelar/salir */}
      <div className="out-button-border">
        <div translate="no" onClick={handleCancel} className="out-button">
          X
        </div>
      </div>

      {/* Botón principal */}
      <div className="box-play-button">
        <div className="border-play-button">
          <div className="circunferense" />
          <h3
            onMouseEnter={() => playSound('hover')}
            onClick={handleConfirm}
            className="play-button"
          >
            {displayText}
          </h3>
        </div>
      </div>
    </div>
  );
}