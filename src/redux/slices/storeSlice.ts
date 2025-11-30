import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StoreState {
  featuredItems: string[];
  cart: string[];
}

const initialState: StoreState = {
  featuredItems: [],
  cart: [],
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setFeaturedItems: (state, action: PayloadAction<string[]>) => {
      state.featuredItems = action.payload;
    },
    addToCart: (state, action: PayloadAction<string>) => {
      state.cart.push(action.payload);
    },
  },
});

export const { setFeaturedItems, addToCart } = storeSlice.actions;
export default storeSlice.reducer;
