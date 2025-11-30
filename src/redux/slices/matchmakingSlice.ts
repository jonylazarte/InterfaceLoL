import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MatchmakingState {
  selectedQueue: string | null;
  queueState: 'idle' | 'searching' | 'found' | 'champ_select';
}

const initialState: MatchmakingState = {
  selectedQueue: null,
  queueState: 'idle',
};

const matchmakingSlice = createSlice({
  name: 'matchmaking',
  initialState,
  reducers: {
    setSelectedQueue: (state, action: PayloadAction<string>) => {
      state.selectedQueue = action.payload;
    },
    setQueueState: (state, action: PayloadAction<MatchmakingState['queueState']>) => {
      state.queueState = action.payload;
    },
  },
});

export const { setSelectedQueue, setQueueState } = matchmakingSlice.actions;
export default matchmakingSlice.reducer;
