import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { addMessage, setTyping, updateUserStatus } from '@/redux/slices/chatSlice'

export function useChatSocket(socket) {
  const dispatch = useDispatch()
  const typingTimeouts = useRef({})

  useEffect(() => {
    if (!socket?.current) return

    // Handle incoming messages
    const handleChatMessage = (messageData) => {
      const message = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        from: messageData.from,
        to: messageData.to,
        content: messageData.message,
        timestamp: Date.now(),
        type: 'text',
        isRead: false,
        isDelivered: true
      }

      dispatch(addMessage(message))
    }

    // Handle typing indicators
    const handleTyping = (data) => {
      dispatch(setTyping({ userId: data.from, isTyping: data.isTyping }))
      
      // Clear existing timeout
      if (typingTimeouts.current[data.from]) {
        clearTimeout(typingTimeouts.current[data.from])
      }

      // Set timeout to stop typing indicator
      if (data.isTyping) {
        typingTimeouts.current[data.from] = setTimeout(() => {
          dispatch(setTyping({ userId: data.from, isTyping: false }))
        }, 3000)
      }
    }

    // Handle user status updates
    const handleUserStatusUpdate = (data) => {
      dispatch(updateUserStatus({ 
        userId: data.userId, 
        status: data.status 
      }))
    }

    // Handle user online/offline
    const handleUserOnline = (data) => {
      dispatch(updateUserStatus({ 
        userId: data.userName, 
        status: 'online' 
      }))
    }

    const handleUserOffline = (data) => {
      dispatch(updateUserStatus({ 
        userId: data.userName, 
        status: 'offline' 
      }))
    }

    // Register event listeners
    socket.current.on('chat-message', handleChatMessage)
    socket.current.on('typing', handleTyping)
    socket.current.on('user-status-update', handleUserStatusUpdate)
    socket.current.on('user-online', handleUserOnline)
    socket.current.on('user-offline', handleUserOffline)

    // Cleanup function
    return () => {
      if (socket?.current) {
        socket.current.off('chat-message', handleChatMessage)
        socket.current.off('typing', handleTyping)
        socket.current.off('user-status-update', handleUserStatusUpdate)
        socket.current.off('user-online', handleUserOnline)
        socket.current.off('user-offline', handleUserOffline)
      }

      // Clear all typing timeouts
      Object.values(typingTimeouts.current).forEach(timeout => {
        clearTimeout(timeout)
      })
      typingTimeouts.current = {}
    }
  }, [socket, dispatch])

  // Function to emit typing indicator
  const emitTyping = (to, isTyping) => {
    if (socket?.current) {
      socket.current.emit('typing', { to, isTyping })
    }
  }

  // Function to emit message
  const emitMessage = (to, from, message) => {
    if (socket?.current) {
      socket.current.emit('chat-message', { to, from, message })
    }
  }

  // Function to emit status update
  const emitStatusUpdate = (status) => {
    if (socket?.current) {
      socket.current.emit('user-status-update', { status })
    }
  }

  return {
    emitTyping,
    emitMessage,
    emitStatusUpdate
  }
}
