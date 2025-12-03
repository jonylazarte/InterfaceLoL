'use client';

import { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import {
  BsFillPersonPlusFill,
  BsClipboardPlusFill,
  BsSearch,
  BsTextRight,
} from 'react-icons/bs';
import { RiFilePaper2Fill } from 'react-icons/ri';
import { PiChatCenteredFill, PiXBold } from 'react-icons/pi';
import { MdBugReport, MdMinimize, MdOutlineQuestionMark } from 'react-icons/md';
import { FaMicrophone } from 'react-icons/fa6';
import { VscTriangleRight } from 'react-icons/vsc';
import { IoIosSettings } from 'react-icons/io';
import { useSelector, useDispatch } from 'react-redux';
/*import { selectUserInterfaceData } from '@/redux/slices/userInterfaceSlice.js';*/
import {
  openChat,
  updateChatUser,
  toggleChatVisibility,
} from '@/redux/slices/chatSlice';
import { logout } from '@/redux/slices/authSlice.js';
import './rightNav.css';

export default memo(function RightNav({
  socket,
  battleRequest,
  handleEmitBattleRequest,
  showSideNav,
  setShowSideNav,
  /*setToken,*/
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  console.log(router)

  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipTimeout, setTooltipTimeout] = useState(null);

  const user = useSelector((state) => state.user);
  /*const { userState } = useSelector(selectUserInterfaceData);*/
  const { friendsOnline } = useSelector((state) => state.connectedUsers || {});
  const { chatUsers, unreadCount } = useSelector((state) => state.chat);

  // Tooltip personalizado
  const handleTooltipEnter = (e, data) => {
    if (tooltipTimeout) clearTimeout(tooltipTimeout);
    const id = setTimeout(() => {
      /*const rect = e.target.getBoundingClientRect();*/
      setTooltipData(data);
      setShowTooltip(true);
    }, 550);
    setTooltipTimeout(id);
  };

  const handleTooltipLeave = () => {
    setShowTooltip(false);
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      setTooltipTimeout(null);
    }
  };

  // Contexto menú derecho
  const handleContextMenu = (e) => {
    e.preventDefault();
    /*dexterity(selectChat(userName));*/
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
  };

  // Logout
  const handleLogout = () => {
    socket?.current?.disconnect();
    dispatch(logout());
  };

  // Abrir chat con amigo
  const handleUserClick = (userName, profileIcon) => {
    dispatch(
      openChat({
        userId: userName,
        userName,
        profileIcon,
      })
    );
  };

  // Actualizar usuarios del chat cuando cambian los amigos online
  useEffect(() => {
    if (!friendsOnline) return;

    friendsOnline.forEach((folder) => {
      folder.users.forEach((u) => {
        if (u.userName !== user.userName) {
          dispatch(
            updateChatUser({
              userId: u.userName,
              userName: u.userName,
              profileIcon: u.profileIcon,
              status: 'online',
              unreadCount: 0,
            })
          );
        }
      });
    });
  }, [friendsOnline, user.userName, dispatch]);

  // Caja de invitación a batalla
  const InviteBox = ({ userName }) => {
    const request = battleRequest?.find((r) => r.from === userName);
    if (!request) return null;

    return (
      <div className="invitation-box">
        <span>{userName} te ha invitado a un enfrentamiento</span>
        <div>
          <button /*onClick={() => handleEmitAcceptBattleRequest?.(request.roomId)}*/>
            Aceptar
          </button>
          <button>Rechazar</button>
        </div>
      </div>
    );
  };

  // Lista de amigos
  const FriendsList = () => {
    const [openFolders, setOpenFolders] = useState({});

    const toggleFolder = (folderName) => {
      setOpenFolders((prev) => ({ ...prev, [folderName]: !prev[folderName] }));
    };

    return friendsOnline?.map((folder) => {
      const isOpen = openFolders[folder.name] ?? true;

      return (
        <ul className="general-user-list" key={folder.name}>
          <div
            className="user-folder-name"
            onClick={() => toggleFolder(folder.name)}
          >
            <VscTriangleRight
              style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
              className="triangle"
            />
            {folder.name.toUpperCase()} ({folder.users.length})
          </div>

          <div style={{ display: isOpen ? 'block' : 'none' }}>
            {folder.users.map((u) => {
              if (u.userName === user.userName) return null;

              const hasInvite = battleRequest?.some((r) => r.from === u.userName);

              return hasInvite ? (
                <InviteBox key={u.userName} userName={u.userName} />
              ) : (
                <li
                  key={u.userName}
                  className="user-box"
                  onMouseEnter={(e) => handleTooltipEnter(e, u)}
                  onMouseLeave={handleTooltipLeave}
                  onClick={() => handleUserClick(u.userName, u.profileIcon)}
                  onContextMenu={(e) => handleContextMenu(e, u.userName)}
                >
                  <div className="icon-border mini">
                    <img
                      className="user-icon mini"
                      src={`https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/profileicon/${u.profileIcon}.png`}
                      alt={u.userName}
                    />
                    <div className="box-status-icon" />
                  </div>
                  <div className="user-box-data">
                    <h5>{u.userName}</h5>
                    <h5 className="right-nav-status">En línea</h5>
                    {chatUsers[u.userName]?.unreadCount > 0 && (
                      <span className="unread-badge">
                        {chatUsers[u.userName].unreadCount}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </div>
        </ul>
      );
    });
  };

  // Perfil del usuario
  const ProfileBox = () => {
    const [iconHovered, setIconHovered] = useState(false);

    return (
      <div style={{ position: 'relative' }} className="user-info">
        <div
          onMouseEnter={() => setIconHovered(true)}
          onMouseLeave={() => setIconHovered(false)}
          className="userLevelBarContainer"
        >
          <div className="userLevelBar">
            <div className="icon-border">
              <img
                className="user-icon"
                src={`https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/profileicon/${user.profileIcon}.png`}
                alt={user.userName}
              />
            </div>
          </div>
          <div className="user-level">{user.level}</div>
        </div>

        <div className="user-state">
          <div className="user-options">
            <MdOutlineQuestionMark className="accountOptionIcon" />
            <MdMinimize
              onClick={() => {
                dispatch(toggleChatVisibility());
                if (window.innerWidth < 1200) setShowSideNav(false);
              }}
              className="accountOptionIcon"
            />
            <IoIosSettings className="accountOptionIcon" />
            <PiXBold onClick={handleLogout} className="accountOptionIcon" />
          </div>

          {!iconHovered && (
            <>
              <h3 className="right-nav-username">{user.userName}</h3>
              <div className="user-status">
                <div className="status-icon" />
                En línea
              </div>
            </>
          )}
        </div>

        <span
          className="showPerfilSpan"
          style={iconHovered ? { marginLeft: '100px', visibility: 'visible' } : null}
        >
          Ver perfil
        </span>
      </div>
    );
  };

  if (!showSideNav) return null;

  return (
    <div className="right-nav" onClick={() => setShowMenu(false)}>
      {/* Tooltip personalizado */}
      {showTooltip && tooltipData && (
        <div
          className="out-box"
          style={{
            position: 'fixed',
            right: 310,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundImage: `url('https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/centered/${tooltipData.background || 'default'}.jpg')`,
          }}
        >
          <div className="right-nav-user-tooltip">
            <div className="tooltip-user-container">
              <div className="tooltip-user-level">
                <img src="https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/general/7201_Precision.png" alt="Level border" />
                <h3>24</h3>
              </div>
              <div className="tooltip-user-info">
                <div className="tooltip-user-icon">
                  <img
                    className="tooltip-user-border"
                    src="https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/general/EoG_Border_150_4k.png"
                    alt="Border"
                  />
                  <img
                    className="tooltip-user-icon-img"
                    src={`https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/profileicon/${tooltipData.profileIcon}.png`}
                    alt={tooltipData.userName}
                  />
                </div>
                <div className="tooltip-user-info-text">
                  <h4>{tooltipData.userName}</h4>
                  <h6 className="subname">#{tooltipData.tag || '0000'}</h6>
                  <span>{tooltipData.title || 'Sin título'}</span>
                  <div className="separator" />
                  <span className="rank-and-points">
                    {tooltipData.rank?.name || 'Sin rango'} (
                    {tooltipData.rank?.points || 0} pts)
                  </span>
                </div>
              </div>
              <div className="tooltip-user-status">
                <div className="user-status">
                  <div className="status-icon" />
                  En línea
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ProfileBox />

      <div className="online-users">
        {showMenu && (
          <div
            className="custom-menu"
            style={{ position: 'fixed', left: menuPosition.x, top: menuPosition.y }}
          >
            <h5
              onClick={() => {
                setShowMenu(false);
                handleEmitBattleRequest?.();
              }}
            >
              Invitar a una partida
            </h5>
            <h5 onClick={() => setShowMenu(false)}>Ver perfil</h5>
          </div>
        )}

        <div className="social-menu">
          SOCIAL
          <div className="social-icons">
            <BsFillPersonPlusFill className="social-icon" />
            <BsClipboardPlusFill className="social-icon" />
            <BsTextRight className="social-icon" />
            <BsSearch className="social-icon" />
          </div>
        </div>

        <FriendsList />
      </div>

      <div className="right-nav-buttom-buttons">
        <button onClick={() => dispatch(toggleChatVisibility())} className="right-nav-buttom-button">
          <PiChatCenteredFill />
          {unreadCount > 0 && <span className="unread-count-badge">{unreadCount}</span>}
        </button>
        <button className="right-nav-buttom-button">
          <RiFilePaper2Fill />
        </button>
        <button className="right-nav-buttom-button">
          <FaMicrophone />
        </button>
        <span className="actual-version">25.51.2</span>
        <button className="right-nav-buttom-button">
          <MdBugReport />
        </button>
      </div>
    </div>
  );
});