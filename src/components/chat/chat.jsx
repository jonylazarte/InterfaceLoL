'use client';

import { useState, useEffect, useRef, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addMessage,
  markAllAsRead,
  closeChat,
  minimizeChat,
} from '@/redux/slices/chatSlice';
import { PiXBold, PiMinus } from 'react-icons/pi';
import './chat.css';

export default memo(function Chat({ socket, connectedUsers }) {
  const dispatch = useDispatch();

  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { userName } = useSelector((state) => state.user);
  const {
    selectedChat,
    isChatVisible,
    messagesByRoom,
    chatUsers,
    isTyping: typingUsers,
    showTimestamps,
    autoScroll,
  } = useSelector((state) => state.chat);

  const selectedChatUser = selectedChat ? chatUsers[selectedChat] : null;
  const messages = selectedChat ? messagesByRoom[selectedChat] || [] : [];
  const isUserTyping = selectedChat ? typingUsers[selectedChat] || false : false;

  // Auto-scroll al fondo cuando llegan mensajes nuevos
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  // Marcar mensajes como leídos al abrir el chat
  useEffect(() => {
    if (selectedChat && isChatVisible) {
      dispatch(markAllAsRead(selectedChat));
    }
  }, [selectedChat, isChatVisible, dispatch]);

  // Sonido al abrir el chat
  useEffect(() => {
    if (isChatVisible && selectedChat) {
      const sound = new Audio(
        'https://github.com/jonylazarte/resources/raw/refs/heads/main/general/menu-click.mp3'
      );
      sound.play().catch(() => {}); // Ignorar errores de autoplay
    }
  }, [isChatVisible, selectedChat]);

  // Manejar indicador de escritura
  const handleTyping = (e) => {
    const value = e.target.value;
    setChatInput(value);

    if (value.trim() && !isTyping) {
      setIsTyping(true);
      socket?.current?.emit('typing', { to: selectedChat, isTyping: true });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        socket?.current?.emit('typing', { to: selectedChat, isTyping: false });
      }
    }, 1000);
  };

  // Enviar mensaje
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedChat) return;

    const message = {
      id: Date.now().toString(),
      from: userName,
      to: selectedChat,
      content: chatInput.trim(),
      timestamp: Date.now(),
      type: 'text',
      isRead: false,
      isDelivered: false,
    };

    socket?.current?.emit('chat-message', {
      to: selectedChat,
      from: userName,
      message: chatInput.trim(),
    });

    dispatch(addMessage(message));
    setChatInput('');

    if (isTyping) {
      setIsTyping(false);
      socket?.current?.emit('typing', { to: selectedChat, isTyping: false });
    }
  };

  // Cerrar / Minimizar chat
  const handleCloseChat = () => selectedChat && dispatch(closeChat(selectedChat));
  const handleMinimizeChat = () => selectedChat && dispatch(minimizeChat(selectedChat));

  // Formatear hora
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Color según estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return '#00ff00';
      case 'away':
        return '#ffff00';
      case 'busy':
        return '#ff0000';
      case 'offline':
      default:
        return '#808080';
    }
  };

  if (!isChatVisible || !selectedChat) return null;

  return (
    <div className="chat">
      {/* Header */}
      <div className="chatHead">
        {selectedChatUser && (
          <div style={{ marginRight: '10px' }} className="icon-border mini">
            <img
              className="user-icon mini"
              src={`https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/profileicon/${selectedChatUser.profileIcon}.png`}
              alt={selectedChatUser.userName}
            />
            <div
              className="box-status-icon"
              style={{ backgroundColor: getStatusColor(selectedChatUser.status) }}
            />
          </div>
        )}

        <div className="chat-header-info">
          <span className="chat-username">
            {selectedChatUser?.userName || selectedChat}
          </span>
          {selectedChatUser?.status && (
            <span className="chat-status">
              {selectedChatUser.status === 'online'
                ? 'En línea'
                : selectedChatUser.status === 'away'
                ? 'Ausente'
                : selectedChatUser.status === 'busy'
                ? 'Ocupado'
                : 'Desconectado'}
            </span>
          )}
        </div>

        <div className="chat-controls">
          <button onClick={handleMinimizeChat} className="chat-control-btn" title="Minimizar">
            <PiMinus />
          </button>
          <button onClick={handleCloseChat} className="chat-control-btn" title="Cerrar">
            <PiXBold />
          </button>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.from === userName ? 'own-message' : 'other-message'}`}
          >
            <div className="message-content">
              <span className="message-text">{message.content}</span>
              {showTimestamps && (
                <span className="message-time">{formatTimestamp(message.timestamp)}</span>
              )}
            </div>
          </div>
        ))}

        {/* Indicador de escritura */}
        {isUserTyping && (
          <div className="typing-indicator">
            <span>Escribiendo...</span>
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Formulario de entrada */}
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          value={chatInput}
          onChange={handleTyping}
          className="input-chat"
          placeholder="Escribe aquí..."
          maxLength={500}
          autoFocus
        />
      </form>
    </div>
  );
});