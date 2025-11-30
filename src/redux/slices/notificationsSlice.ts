import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  type: string;
  message: string;
  seen: boolean;
}

interface NotificationsState {
  list: Notification[];
}

const initialState: NotificationsState = {
  list: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.list.push(action.payload);
    },
    markAsSeen: (state, action: PayloadAction<string>) => {
      const notif = state.list.find(n => n.id === action.payload);
      if (notif) notif.seen = true;
    },
  },
});

export const { addNotification, markAsSeen } = notificationsSlice.actions;
export default notificationsSlice.reducer;
