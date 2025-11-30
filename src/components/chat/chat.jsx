import { useState, useEffect, memo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  selectChat, 
  addMessage, 
  markAllAsRead, 
  setTyping, 
  closeChat, 
  minimizeChat,
  updateChatSettings 
} from '@/redux/slices/chatSlice'
import { PiXBold, PiMinus } from "react-icons/pi"
import { VscTriangleDown } from "react-icons/vsc"
import './chat.css'

export default memo(function Chat({ socket, connectedUsers }) {
  const dispatch = useDispatch()
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef(null)
  const messagesEndRef = useRef(null)
  
  const user = useSelector(state => state.user)
  const {
    selectedChat,
    isChatVisible,
    messagesByRoom,
    chatUsers,
    isTyping: typingUsers,
    showTimestamps,
    autoScroll
  } = useSelector(state => state.chat)

  const selectedChatUser = selectedChat ? chatUsers[selectedChat] : null
  const messages = selectedChat ? messagesByRoom[selectedChat] || [] : []
  const isUserTyping = selectedChat ? typingUsers[selectedChat] || false : false

 console.log(isChatVisible)
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, autoScroll])

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (selectedChat && isChatVisible) {
      dispatch(markAllAsRead(selectedChat))
    }
  }, [selectedChat, isChatVisible, dispatch])

  // Play sound when chat opens
  useEffect(() => {
    if (isChatVisible && selectedChat) {
      const openChat = new Audio('https://github.com/jonylazarte/resources/raw/refs/heads/main/general/menu-click.mp3')
      openChat.play().catch(() => {}) // Ignore audio play errors
    }
  }, [isChatVisible, selectedChat])

  // Handle typing indicator
  const handleTyping = (e) => {
    const value = e.target.value
    setChatInput(value)

    if (value.trim() && !isTyping) {
      setIsTyping(true)
      socket?.current?.emit('typing', { to: selectedChat, isTyping: true })
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false)
        socket?.current?.emit('typing', { to: selectedChat, isTyping: false })
      }
    }, 1000)
  }

  // Handle message submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!chatInput.trim() || !selectedChat) return

    const message = {
      id: Date.now().toString(),
      from: user.userName,
      to: selectedChat,
      content: chatInput.trim(),
      timestamp: Date.now(),
      type: 'text',
      isRead: false,
      isDelivered: false
    }

    // Emit to socket
    socket?.current?.emit('chat-message', {
      to: selectedChat,
      from: user.userName,
      message: chatInput.trim()
    })

    // Add to Redux store
    dispatch(addMessage(message))
    setChatInput("")

    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false)
      socket?.current?.emit('typing', { to: selectedChat, isTyping: false })
    }
  }

  // Handle chat close
  const handleCloseChat = () => {
    if (selectedChat) {
      dispatch(closeChat(selectedChat))
    }
  }

  // Handle chat minimize
  const handleMinimizeChat = () => {
    if (selectedChat) {
      dispatch(minimizeChat(selectedChat))
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#00ff00'
      case 'away': return '#ffff00'
      case 'busy': return '#ff0000'
      case 'offline': return '#808080'
      default: return '#808080'
    }
  }

  if (!isChatVisible || !selectedChat) {
    return null
  }

  console.log('Rendering chat for user:', selectedChat, 'isChatVisible:', isChatVisible)

  return (
    <div className="chat">
      {/* Chat Header */}
      <div className="chatHead">
        {selectedChatUser && (
          <div style={{ marginRight: "10px" }} className="icon-border mini">
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
              {selectedChatUser.status === 'online' ? 'En línea' : 
               selectedChatUser.status === 'away' ? 'Ausente' :
               selectedChatUser.status === 'busy' ? 'Ocupado' : 'Desconectado'}
            </span>
          )}
        </div>

        <div className="chat-controls">
          <button 
            onClick={handleMinimizeChat}
            className="chat-control-btn"
            title="Minimizar"
          >
            <PiMinus />
          </button>
          <button 
            onClick={handleCloseChat}
            className="chat-control-btn"
            title="Cerrar"
          >
            <PiXBold />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="chat-messages">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.from === user.userName ? 'own-message' : 'other-message'}`}
          >
            <div className="message-content">
              <span className="message-text">{message.content}</span>
              {showTimestamps && (
                <span className="message-time">
                  {formatTimestamp(message.timestamp)}
                </span>
              )}
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
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

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          value={chatInput}
          onChange={handleTyping}
          className="input-chat"
          placeholder="Escribe aquí..."
          maxLength={500}
        />
      </form>
        	</div>
  )
})