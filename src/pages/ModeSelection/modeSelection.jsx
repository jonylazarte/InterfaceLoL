import { useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserState } from '@/redux/slices/userInterfaceSlice.js';

import ConfirmButton from '@/components/playButton/playButton.jsx';
import Pvp from '../PvpRoom/index.jsx';
import Explore from '../Explore/explore.jsx';

import './modeSelection.css';

const API_URL = 'https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/general';

const PVP_MODE = {
  name: 'arena',
  hoverImg: 'sr-hover.png',
  enabledImg: 'sr-enabled.png',
  disabledImg: 'sr-desabled.png',
  subTitle: '1v1',
  title: 'ARENA',
  description:
    'Arrasa a tus oponentes, sumérgete en peleas de uno contra uno y destruye los pokémon del enemigo en el modo de juego más importante de LoP.',
  queue: 'CLASIFICATORIA SOLO',
};

const EXPLORE_MODE = {
  name: 'explorar',
  hoverImg: 'sr-hover.png',
  enabledImg: 'sr-enabled.png',
  disabledImg: 'sr-desabled.png',
  subTitle: '1v1',
  title: 'EXPLORAR',
  description:
    'Sube de nivel a tus Pokémon, aprende nuevas habilidades y desbloquea su verdadero potencial a medida que avanzas en la liga.',
  queue: 'INTERMEDIO',
};

const SOUNDS = {
  'menu-click': '/general/menu-click.mp3',
  'confirm-button-hover': '/general/confirm-button-hover.mp3',
};

const playSound = (soundKey) => {
  if (!SOUNDS[soundKey]) return;
  const audio = new Audio(SOUNDS[soundKey]);
  audio.volume = 0.4;
  audio.play().catch(() => {});
};

export default memo(function ModeSelection({
  socket,
  connectedUsers,
  roomUsers,
  setRoomUsers,
}) {
  const dispatch = useDispatch();
  const { userState } = useSelector((state) => state.userInterface);

  const [modeSelected, setModeSelected] = useState('Pvp');
  const [mapSelected, setMapSelected] = useState('arena');
  const [queueSelected, setQueueSelected] = useState('CLASIFICATORIA SOLO');
  const [hoveredMode, setHoveredMode] = useState('');

  const handleModeChange = (mode, map, queue) => {
    playSound('menu-click');
    setModeSelected(mode);
    setMapSelected(map);
    setQueueSelected(queue);
  };

  const currentMode = modeSelected === 'Pvp' ? PVP_MODE : EXPLORE_MODE;

  const handleConfirm = () => {
    dispatch(setUserState(modeSelected === 'Pvp' ? 'Pvp' : 'Exploración'));
  };

  // Si ya eligió modo → mostrar sala o exploración
  if (userState === 'Pvp') {
    return (
      <Pvp
        socket={socket}
        connectedUsers={connectedUsers}
        roomUsers={roomUsers}
        setRoomUsers={setRoomUsers}
      />
    );
  }

  if (userState === 'Exploración') {
    return <Explore />;
  }

  return (
    <section className="mode-selection">
      <header className="mode-selection-header">
        <div
          className={`subheader-item ${modeSelected === 'Pvp' ? 'active-subheader-item' : ''}`}
          onClick={() => handleModeChange('Pvp', 'arena', 'CLASIFICATORIA SOLO')}
          onMouseEnter={() => playSound('confirm-button-hover')}
        >
          PVP
        </div>
        <div
          className={`subheader-item ${modeSelected === 'Exploración' ? 'active-subheader-item' : ''}`}
          onClick={() => handleModeChange('Exploración', 'explorar', 'INTERMEDIO')}
          onMouseEnter={() => playSound('confirm-button-hover')}
        >
          EXPLORAR
        </div>
      </header>

      <div className="gamemode-content">
        <div className="gamemode-icons">
          <div
            className="gamemode-icon"
            onMouseEnter={() => setHoveredMode(currentMode.name)}
            onMouseLeave={() => setHoveredMode('')}
          >
            <img
              src={`${API_URL}/${
                hoveredMode === currentMode.name
                  ? currentMode.hoverImg
                  : mapSelected === currentMode.name
                  ? currentMode.enabledImg
                  : currentMode.disabledImg
              }`}
              alt={currentMode.title}
            />
            <h3 className="mode-subtitle">{currentMode.subTitle}</h3>
            <h1 className="mode-title">{currentMode.title}</h1>
          </div>
        </div>

        <div className="description-and-queues">
          <div className="gamemode-description">
            <p>{currentMode.description}</p>
          </div>

          <div
            className="queue-option"
            style={{
              color: queueSelected === currentMode.queue ? 'var(--gold-one)' : 'inherit',
            }}
          >
            <div className="custom-checkbox">
              {queueSelected === currentMode.queue && <div className="checkboxMark" />}
            </div>
            <h3>{currentMode.queue}</h3>
          </div>
        </div>
      </div>

      <ConfirmButton
        text="CONFIRMAR"
        type="modeSelection"
        modeSelected={modeSelected}
        okButtonAction={handleConfirm}
      />
    </section>
  );
});