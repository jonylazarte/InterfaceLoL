import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  language: string;
  volume: number;
  theme: 'light' | 'dark';
}

const initialState: SettingsState = {
  language: 'es',
  volume: 100,
  theme: 'dark',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
});

export const { setLanguage, setVolume, setTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
