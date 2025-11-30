import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: number;
  type: 'text' | 'system' | 'notification';
  isRead: boolean;
  isDelivered?: boolean;
}

export interface ChatUser {
  userId: string;
  userName: string;
  profileIcon: number;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: number;
  isTyping?: boolean;
  unreadCount: number;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'private' | 'group' | 'lobby';
  participants: string[];
  lastMessage?: Message;
  isActive: boolean;
  isMinimized: boolean;
  position?: { x: number; y: number };
}

export interface ChatState {
  // Chat rooms management
  activeChats: string[]; // IDs of currently open chats
  minimizedChats: string[]; // IDs of minimized chats
  chatRooms: Record<string, ChatRoom>;
  
  // Messages management
  messagesByRoom: Record<string, Message[]>;
  
  // Users management
  chatUsers: Record<string, ChatUser>;
  
  // UI State
  selectedChat: string | null;
  isChatVisible: boolean;
  isTyping: Record<string, boolean>; // userId -> isTyping
  
  // Notifications
  unreadCount: number;
  notifications: Message[];
  
  // Settings
  soundEnabled: boolean;
  showTimestamps: boolean;
  autoScroll: boolean;
}

const initialState: ChatState = {
  activeChats: [],
  minimizedChats: [],
  chatRooms: {},
  messagesByRoom: {},
  chatUsers: {},
  selectedChat: null,
  isChatVisible: false,
  isTyping: {},
  unreadCount: 0,
  notifications: [],
  soundEnabled: true,
  showTimestamps: true,
  autoScroll: true,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Chat Room Management
    openChat: (state, action: PayloadAction<{ userId: string; userName: string; profileIcon: number }>) => {
      const { userId, userName/*, profileIcon*/ } = action.payload;
      
      // Create chat room if it doesn't exist
      if (!state.chatRooms[userId]) {
        state.chatRooms[userId] = {
          id: userId,
          name: userName,
          type: 'private',
          participants: [userId],
          isActive: true,
          isMinimized: false,
        };
      }
      
      // Add to active chats if not already there
      if (!state.activeChats.includes(userId)) {
        state.activeChats.push(userId);
      }
      
      // Remove from minimized if it was there
      state.minimizedChats = state.minimizedChats.filter(id => id !== userId);
      
      // Set as selected chat
      state.selectedChat = userId;
      state.isChatVisible = true;
      
      // Reset unread count for this chat
      if (state.chatUsers[userId]) {
        state.chatUsers[userId].unreadCount = 0;
      }
    },
    
    closeChat: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      state.activeChats = state.activeChats.filter(id => id !== userId);
      state.minimizedChats = state.minimizedChats.filter(id => id !== userId);
      
      if (state.selectedChat === userId) {
        state.selectedChat = state.activeChats[0] || null;
        state.isChatVisible = state.activeChats.length > 0;
      }
    },
    
    minimizeChat: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      if (state.activeChats.includes(userId)) {
        state.activeChats = state.activeChats.filter(id => id !== userId);
        state.minimizedChats.push(userId);
        state.chatRooms[userId].isMinimized = true;
        
        if (state.selectedChat === userId) {
          state.selectedChat = state.activeChats[0] || null;
        }
      }
    },
    
    restoreChat: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      if (state.minimizedChats.includes(userId)) {
        state.minimizedChats = state.minimizedChats.filter(id => id !== userId);
        state.activeChats.push(userId);
        state.chatRooms[userId].isMinimized = false;
        state.selectedChat = userId;
      }
    },
    
    selectChat: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      if (state.activeChats.includes(userId) || state.minimizedChats.includes(userId)) {
        state.selectedChat = userId;
        state.isChatVisible = true;
        
        // Reset unread count
        if (state.chatUsers[userId]) {
          state.chatUsers[userId].unreadCount = 0;
        }
      }
    },
    
    // Message Management
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      const roomId = message.to === 'me' ? message.from : message.to;
      
      // Initialize room if it doesn't exist
      if (!state.messagesByRoom[roomId]) {
        state.messagesByRoom[roomId] = [];
      }
      
      // Add message
      state.messagesByRoom[roomId].push(message);
      
      // Update last message in chat room
      if (state.chatRooms[roomId]) {
        state.chatRooms[roomId].lastMessage = message;
      }
      
      // Update unread count if chat is not active or not selected
      if (!state.activeChats.includes(roomId) || state.selectedChat !== roomId) {
        if (state.chatUsers[roomId]) {
          state.chatUsers[roomId].unreadCount += 1;
        }
        state.unreadCount += 1;
      }
      
      // Add to notifications if it's a system message
      if (message.type === 'notification') {
        state.notifications.push(message);
      }
    },
    
    markMessageAsRead: (state, action: PayloadAction<{ roomId: string; messageId: string }>) => {
      const { roomId, messageId } = action.payload;
      const message = state.messagesByRoom[roomId]?.find(m => m.id === messageId);
      if (message) {
        message.isRead = true;
      }
    },
    
    markAllAsRead: (state, action: PayloadAction<string>) => {
      const roomId = action.payload;
      if (state.messagesByRoom[roomId]) {
        state.messagesByRoom[roomId].forEach(message => {
          message.isRead = true;
        });
      }
      
      if (state.chatUsers[roomId]) {
        state.chatUsers[roomId].unreadCount = 0;
      }
    },
    
    // User Management
    updateChatUser: (state, action: PayloadAction<ChatUser>) => {
      const user = action.payload;
      state.chatUsers[user.userId] = user;
    },
    
    updateUserStatus: (state, action: PayloadAction<{ userId: string; status: ChatUser['status'] }>) => {
      const { userId, status } = action.payload;
      if (state.chatUsers[userId]) {
        state.chatUsers[userId].status = status;
        if (status === 'offline') {
          state.chatUsers[userId].lastSeen = Date.now();
        }
      }
    },
    
    // Typing Indicators
    setTyping: (state, action: PayloadAction<{ userId: string; isTyping: boolean }>) => {
      const { userId, isTyping } = action.payload;
      state.isTyping[userId] = isTyping;
      
      if (state.chatUsers[userId]) {
        state.chatUsers[userId].isTyping = isTyping;
      }
    },
    
    // UI Controls
    toggleChatVisibility: (state) => {
      state.isChatVisible = !state.isChatVisible;
    },
    
    setChatPosition: (state, action: PayloadAction<{ chatId: string; position: { x: number; y: number } }>) => {
      const { chatId, position } = action.payload;
      if (state.chatRooms[chatId]) {
        state.chatRooms[chatId].position = position;
      }
    },
    
    // Settings
    updateChatSettings: (state, action: PayloadAction<Partial<Pick<ChatState, 'soundEnabled' | 'showTimestamps' | 'autoScroll'>>>) => {
      Object.assign(state, action.payload);
    },
    
    // Notifications
    clearNotification: (state, action: PayloadAction<string>) => {
      const messageId = action.payload;
      state.notifications = state.notifications.filter(n => n.id !== messageId);
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    
    // Cleanup
    clearChatHistory: (state, action: PayloadAction<string>) => {
      const roomId = action.payload;
      if (state.messagesByRoom[roomId]) {
        state.messagesByRoom[roomId] = [];
      }
    },
  },
});

export const {
  openChat,
  closeChat,
  minimizeChat,
  restoreChat,
  selectChat,
  addMessage,
  markMessageAsRead,
  markAllAsRead,
  updateChatUser,
  updateUserStatus,
  setTyping,
  toggleChatVisibility,
  setChatPosition,
  updateChatSettings,
  clearNotification,
  clearAllNotifications,
  clearChatHistory,
} = chatSlice.actions;

export default chatSlice.reducer;
