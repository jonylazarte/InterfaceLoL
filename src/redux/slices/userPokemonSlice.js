import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUserPokemon = createAsyncThunk(
  'userChampions/getUserPokemon',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}pokemons/users/pokemon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
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
export const addChampion = createAsyncThunk(
  'userChampions/addChampion',
  async ({championId, coin, price}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const body = {
            userID : token,
            championId : championId,
            coin,
            price
      }
      const response = await fetch(`${API_URL}pokemons/users/addpokemon`,{
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(body),
      })

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
export const updatePokemon = createAsyncThunk(
  'userChampions/updatePokemon',
  async( props, { rejectWithValue })=>{
    const pokeballsState = [
      props
    ]
    const token = localStorage.getItem("token");
      
    try{   
      response = await fetch(`${API_URL}pokemons/users/updatelevel`,{
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

      data = await response.json()
      return data

    } catch(error){
      return rejectWithValue(error.message)
    }
  }
)
export const sellPokemon = createAsyncThunk(
  'userChampions/sellPokemon',
  async ({pokemonId}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const body = {
            userId : token,
            pokemonIndex : pokemonId,
      }
      const response = await fetch(`${API_URL}pokemons/users/sellpokemon`,{
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(body),
      })

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
const initialState = {
  loading: false,
  champions: [],
  pokemon: [],
  error: "",
};


const userPokemonSlice = createSlice({
  name: 'userChampions',
  initialState,
  reducers: {
    sellPokemon: (state, action) => {

    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserPokemon.pending, (state) => {
        state.loading = true;
        state.error = ''; // Clear any previous errors
      })
      .addCase(getUserPokemon.fulfilled, (state, action) => {
        state.loading = false;
        state.champions = action.payload; // Update state with fetched Pokémon
      })
      .addCase(getUserPokemon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong'; // Set error message
      })
      .addCase(addChampion.pending, (state) => {
        state.loading = true;
        state.error = ''; // Clear any previous errors
      })
      .addCase(addChampion.fulfilled, (state, action) => {
        const updatedChampions = [...state.champions];
        updatedChampions.push(action.payload);
        state.champions = updatedChampions;
        state.loading = false;
      })
      .addCase(addChampion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong'; // Set error message
      })
      .addCase(updatePokemon.pending, (state) => {
        state.loading = true;
        state.error = ''; // Clear any previous errors
      })
      .addCase(updatePokemon.fulfilled, (state, action) => {
        const updatedPokemon = state.pokemonStore.map((pokemon, index) => {
          if (action.payload.some(p=> p.index == pokemon.index)) {

            const index = action.payload.findIndex(p=> p.index == pokemon.index)
            return { ...action.payload[index] };

          }

          return pokemon

        });
        state.loading = false;
        state.pokemon = updatePokemon; // Update state with fetched Pokémon
      })
      .addCase(updatePokemon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong'; // Set error message
      })
    .addCase(sellPokemon.pending, (state) => {
        state.loading = true;
        state.error = ''; // Clear any previous errors
      })
      .addCase(sellPokemon.fulfilled, (state, action) => {
        const updatedPokemon = [...state.pokemon];
        const pokemonToDeleteIndex = state.pokemon.findIndex(pokemon=>pokemon.index == action.payload.pokemonIndex)
        updatedPokemon.splice(pokemonToDeleteIndex, 1);
        state.pokemon = updatedPokemon;
        state.loading = false;
      })
      .addCase(sellPokemon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong'; // Set error message
      });
  },
})

export const selectUserPokemonState = (state) => state.userChampions;
export const selectUserPokemon = (state) => state.userChampions.champions;
export const selectUserPokemonLoading = (state) => state.userChampions.loading;
export const selectUserPokemonError = (state) => state.userChampions.error;

// Selector memoizado para combinar partes del estado
export const selectUserPokemonData = createSelector(
  [selectUserPokemon, selectUserPokemonLoading, selectUserPokemonError],
  (userChampions, loading, error) => ({
    userChampions,
    loading,
    error,
  })
);

export default userPokemonSlice.reducer;

