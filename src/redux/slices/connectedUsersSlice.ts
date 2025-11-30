import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConnectedUser {
  id: string;
  name: string;
  status: 'online' | 'in_game' | 'away';
}

interface ConnectedUsersState {
  friendsOnline: ConnectedUser[];
  partyMembers: ConnectedUser[];
}

const initialState: ConnectedUsersState = {
  friendsOnline: [],
  partyMembers: [],
};

const connectedUsersSlice = createSlice({
  name: 'connectedUsers',
  initialState,
  reducers: {
    setFriendsOnline: (state, action: PayloadAction<ConnectedUser[]>) => {
      state.friendsOnline = action.payload;
    },
    setPartyMembers: (state, action: PayloadAction<ConnectedUser[]>) => {
      state.partyMembers = action.payload;
    },
  },
});

export const { setFriendsOnline, setPartyMembers } = connectedUsersSlice.actions;
export default connectedUsersSlice.reducer;
