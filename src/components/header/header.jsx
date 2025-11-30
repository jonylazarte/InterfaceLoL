import './header.css';
import '../playButton/playButton.css';
import HeaderMainButton from '@/components/playButton/HeaderMainButton/HeaderMainButton.jsx';
import { useState, memo } from 'react';
import { GiDoubled, GiDividedSquare, GiStoneCrafting } from 'react-icons/gi';
import { useSelector, useDispatch } from 'react-redux';
import { RiSidebarFoldFill } from 'react-icons/ri';
import { selectUserInterfaceData, setActualSection } from '../../redux/slices/userInterfaceSlice.js';
import MiniTooltip from '@/components/Tooltip/miniToolTip/miniToolTip.jsx';

// Hook personalizado para el tooltip (ESLint feliz)
export const useTooltip = () => {
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0, width: 0 });
  const [showWindow, setShowWindow] = useState(false);
  const [textInElement, setTextInElement] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);

  const ToolTipElement = () =>
    showWindow ? (
      <div
        style={{
          position: 'fixed',
          left: windowPosition.x - windowPosition.width * 1.5,
          top: windowPosition.y,
          width: windowPosition.width * 4,
          display: 'flex',
          justifyContent: 'center',
          overflow: 'visible',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      >
        <div className="header-tooltip">{textInElement}</div>
      </div>
    ) : null;

  const handleToolTip = (e, text) => {
    if (timeoutId) clearTimeout(timeoutId);

    const nuevoTimeOutId = setTimeout(() => {
      const rect = e.target.getBoundingClientRect();
      setWindowPosition({ x: rect.left, y: rect.top + rect.height + 20, width: rect.width });
      setTextInElement(text);
      setShowWindow(true);
    }, 550);

    setTimeoutId(nuevoTimeOutId);
  };

  const offToolTip = () => {
    setShowWindow(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  return { ToolTipElement, handleToolTip, offToolTip };
};

export default memo(function Header({ globalRoom, showSideNav, setShowSideNav, logout }) {
  const user = useSelector((state) => state.user);
  const { ToolTipElement, handleToolTip, offToolTip } = useTooltip();
  const dispatch = useDispatch();
  const { actualSection, userState } = useSelector(selectUserInterfaceData);

  const selectedStyle = {
    background: 'linear-gradient(rgb(9, 17, 30) 50%, rgb(47, 50, 52))',
    color: '#F0E6D2',
  };

  const handleSound = (sound) => {
    const menuClick = new Audio('/general/menu-click.mp3');
    const buttonPlayClick = new Audio('/general/button-play-click.mp3');
    const buttonPlayHover = new Audio('/general/button-play-hover.mp3');

    if (sound === 'menu-click') menuClick.play();
    if (sound === 'button-play-click') buttonPlayClick.play();
    if (sound === 'button-play-hover') buttonPlayHover.play();
  };

  const handleClick = (section) => {
    handleSound('menu-click');
    dispatch(setActualSection(section));
  };

  const Tab = ({ section }) => (
    <MiniTooltip delay={100} position="bottom" content={section}>
      <div
        className="item"
        style={actualSection === section ? selectedStyle : null}
        onClick={() => handleClick(section)}
      >
        <svg width="22" height="22" fill="currentColor">
          <use href={`/icon.svg#${section}`} />
          {section === 'Botín' && <GiStoneCrafting fontSize="1.4rem" />}
        </svg>
      </div>
    </MiniTooltip>
  );

  return (
    <>
      <header
        style={{
          marginRight: !showSideNav ? '0px' : null,
          marginTop:
            userState === 'In explore match' || userState === 'In normal match' ? '-110px' : '0px',
        }}
        className="index-header"
      >
        <HeaderMainButton text="JUEGA" />
        <div onClick={() => handleClick('Home')} className="item-lol">
          LOL
        </div>

        <div className="header-sections">
          <Tab section="Colección" />
          <Tab section="Botín" />
          <div className="icon-separator" />
          <Tab section="Tienda" />
          <div className="icon-separator" />

          <div className="account-coins">
            <div className="riot-points">
              <img src="/general/RP_icon.png" alt="RP" />
              <div className="RP">{user.RP}</div>
              <div className="header-buy-rp-button">
                <div className="buy-rp-icon">+</div>
              </div>
            </div>
            <div className="blue-essences">
              <img src="/general/BE_icon.png" alt="BE" />
              <div className="BE">{(user.BE / 1000).toFixed(1)} K</div>
            </div>
          </div>
        </div>
      </header>

      <ToolTipElement />
    </>
  );
});