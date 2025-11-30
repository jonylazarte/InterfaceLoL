import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  summonerName: string;
  level: number;
  avatar: string;
  currencies: { rp: number; be: number };
}

const initialState: ProfileState = {
  summonerName: 'Invocador',
  level: 1,
  avatar: '',
  currencies: { rp: 0, be: 0 },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileState>) => {
      return action.payload;
    },
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
