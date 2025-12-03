import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Thunks
export const getUserPokemon = createAsyncThunk(
  'userChampions/getUserPokemon',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}pokemons/users/pokemon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to fetch Pokémon');

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addChampion = createAsyncThunk(
  'userChampions/addChampion',
  async ({ championId, coin, price }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const body = {
        userID: token,
        championId,
        coin,
        price,
      };

      const response = await fetch(`${API_URL}pokemons/users/addpokemon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to add champion');

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePokemon = createAsyncThunk(
  'userChampions/updatePokemon',
  async (props, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    const pokeballsState = [props];

    try {
      const response = await fetch(`${API_URL}pokemons/users/updatelevel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: token,
          pokeballsState,
          pokemonExp: 0,
        }),
      });

      if (!response.ok) throw new Error('Failed to consume item');

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sellPokemon = createAsyncThunk(
  'userChampions/sellPokemon',
  async ({ pokemonId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const body = {
        userId: token,
        pokemonIndex: pokemonId,
      };

      const response = await fetch(`${API_URL}pokemons/users/sellpokemon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to sell Pokémon');

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  loading: false,
  champions: [],
  pokemon: [],
  error: '',
};

// Slice
const userPokemonSlice = createSlice({
  name: 'userChampions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getUserPokemon
    builder
      .addCase(getUserPokemon.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getUserPokemon.fulfilled, (state, action) => {
        state.loading = false;
        state.champions = action.payload;
      })
      .addCase(getUserPokemon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      // addChampion
      .addCase(addChampion.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(addChampion.fulfilled, (state, action) => {
        state.loading = false;
        state.champions.push(action.payload);
      })
      .addCase(addChampion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      // updatePokemon
      .addCase(updatePokemon.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(updatePokemon.fulfilled, (state) => {
        state.loading = false;
        // Aquí puedes mapear correctamente si tenés pokemon en el state
        // state.pokemon = ... tu lógica
      })
      .addCase(updatePokemon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      // sellPokemon
      .addCase(sellPokemon.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(sellPokemon.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.pokemon.findIndex(
          (p) => p.index === action.payload.pokemonIndex
        );
        if (index !== -1) {
          state.pokemon.splice(index, 1);
        }
      })
      .addCase(sellPokemon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

// Selectors
export const selectUserPokemonState = (state) => state.userChampions;
export const selectUserPokemon = (state) => state.userChampions.champions;
export const selectUserPokemonLoading = (state) => state.userChampions.loading;
export const selectUserPokemonError = (state) => state.userChampions.error;

export const selectUserPokemonData = (state) => ({
  userChampions: state.userChampions.champions,
  loading: state.userChampions.loading,
  error: state.userChampions.error,
});

export default userPokemonSlice.reducer;