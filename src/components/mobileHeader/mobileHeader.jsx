'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TiThMenu } from 'react-icons/ti';
import { RiSidebarFoldFill } from 'react-icons/ri';

import HeaderMainButton from '@/components/playButton/HeaderMainButton/HeaderMainButton.jsx';
import { setActualSection, selectUserInterfaceData } from '@/redux/slices/userInterfaceSlice.js';

import './mobileHeader.css';

export default function MobileHeader({ setShowSideNav }) {
  const dispatch = useDispatch();
  const { actualSection, userState } = useSelector(selectUserInterfaceData);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  // Sonidos (optimizados)
  const playSound = (type) => {
    const sounds = {
      click: '/general/menu-click.mp3',
      hover: '/general/button-play-hover.mp3',
    };
    const audio = new Audio(sounds[type]);
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const handleSectionClick = (section) => {
    playSound('click');
    dispatch(setActualSection(section));
    setIsNavigationOpen(false); // Cerrar menú al seleccionar
  };

  const toggleNavigation = () => {
    playSound('click');
    setIsNavigationOpen(prev => !prev);
  };

  const toggleSidebar = () => {
    playSound('click');
    setShowSideNav(prev => !prev);
  };

  const isInMatch = ['In explore match', 'In normal match', 'In ranked match'].includes(userState);

  return (
    <header className={`mobile-header ${isInMatch ? 'in-match' : ''}`}>
      {/* Botón principal JUEGA */}
      <HeaderMainButton text="JUEGA" />

      {/* Iconos derecha */}
      <div className="mobile-header-tabs">
        <button
          className="icon-button"
          onClick={toggleNavigation}
          aria-label="Menú de navegación"
        >
          <TiThMenu size={24} />
        </button>

        <button
          className="icon-button"
          onClick={toggleSidebar}
          aria-label="Abrir sidebar"
        >
          <RiSidebarFoldFill size={22} />
        </button>
      </div>

      {/* Menú desplegable */}
      <div className={`mobile-navigation-window ${isNavigationOpen ? 'open' : ''}`}>
        <div className="nav-items">
          <button
            className={`nav-item ${actualSection === 'Colección' ? 'active' : ''}`}
            onClick={() => handleSectionClick('Colección')}
          >
            <svg width="22" height="22">
              <use href="/icons.svg#collection" />
            </svg>
            <span>Colección</span>
          </button>

          {/* <button
            className={`nav-item ${actualSection === 'Botín' ? 'active' : ''}`}
            onClick={() => handleSectionClick('Botín')}
          >
            <GiStoneCrafting size={22} />
            <span>Botín</span>
          </button> */}

          <button
            className={`nav-item ${actualSection === 'Tienda' ? 'active' : ''}`}
            onClick={() => handleSectionClick('Tienda')}
          >
            <svg width="22" height="22">
              <use href="/icons.svg#store" />
            </svg>
            <span>Tienda</span>
          </button>
        </div>
      </div>

      {/* Overlay para cerrar al tocar fuera */}
      {isNavigationOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsNavigationOpen(false)}
        />
      )}
    </header>
  );
}