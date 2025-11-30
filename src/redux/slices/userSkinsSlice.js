import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector} from 'reselect';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUserSkins = createAsyncThunk(
  'userSkins/getUserSkins',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}pokemons/users/skins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: id }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Pokémon');
      }

      const data = await response.json();

      return data; // Return the data to be used in the reducer
    } catch (error) {
      return rejectWithValue(error.message); // Handle errors
    }
  }
);
export const buySkin = createAsyncThunk(
  'userSkins/buySkin',
  async ( props, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}shop/skin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(props),
      });

      if (!response.ok) {
        throw new Error('Failed to buy item');
      }

      const data = await response.json();
      return data; // Return the data to be used in the reducer

    } catch (error) {
      return rejectWithValue(error.message); // Handle errors
    }
  }
);
export const consumeItem = createAsyncThunk(
  'userSkins/consumeItem',
  async( {itemId, pokemonIndex}, { rejectWithValue })=>{
    try{   
      const token = localStorage.getItem("token");
      const pokeballsState = [{
        index: pokemonIndex,
        itemId: itemId
      }];
      
      const response = await fetch(`${API_URL}pokemons/users/updatelevel`,{
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
          userId : token,
          pokeballsState,
          pokemonExp : 0
        })
      })

      if(!response.ok){
        throw new Error('Failed to consume item')
      }

      const data = await response.json()
      return data

    } catch(error){
      return rejectWithValue(error.message)
    }
  }
)
const initialState = {
  loading: false,
  skins: [],
  error: "",
};


const userSkinsSlice = createSlice({
  name: 'userSkins',
  initialState,
  reducers: {
    buySkin: (state, action) => {

    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserSkins.pending, (state) => {
        state.loading = true;
        state.error = ''; // Clear any previous errors
      })
      .addCase(getUserSkins.fulfilled, (state, action) => {
        state.loading = false;
        state.skins = action.payload; // Update state with fetched Items
      })
      .addCase(getUserSkins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong'; // Set error message
      })
      .addCase(buySkin.pending, (state) => {
        state.loading = true;
        state.error = ''; // Clear any previous errors
      })
      .addCase(buySkin.fulfilled, (state, action) => {
        state.loading = false;
        const newSkins = [...state.skins]
        newSkins.push(action.payload)
        state.skins = newSkins; // Update state with fetched Items
      })
      .addCase(buySkin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong'; // Set error message
      })
      .addCase(consumeItem.pending, (state) => {
        state.loading = true;
        state.error = ''; // Clear any previous errors
      })
      .addCase(consumeItem.fulfilled, (state, action) => {
        state.loading = false;
        //state.items = action.payload; // Update state with fetched Items
      })
      .addCase(consumeItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong'; // Set error message
      });
  },
})

export const selectUserSkinsState = (state) => state.userSkins;
export const selectUserSkins = (state) => state.userSkins.skins;
export const selectUserSkinsLoading = (state) => state.userSkins.loading;
export const selectUserSkinsError = (state) => state.userSkins.error;

export const selectUserSkinsData = createSelector(
  [selectUserSkins, selectUserSkinsLoading, selectUserSkinsError],
  (userSkins, loading, error) => ({
    userSkins,
    loading,
    error,
  })
);

export default userSkinsSlice.reducer;