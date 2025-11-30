import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunk para login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}pokemons/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })
      const data = await response.json()
      if (!response.ok) {
        return rejectWithValue(data.error || 'Login failed')
      }

      // Guardar token en localStorage
      localStorage.setItem('token', data.id)
      
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk para verificar token
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        return rejectWithValue('No token found')
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}pokemons/auth/verify`, {
        method: 'POST'/*'GET'*/,
        /*headers: {
          'Authorization': `Bearer ${token}`,
        },*/
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.log("esto no deberia pasar")
        /*localStorage.removeItem('token')*/
        return rejectWithValue(data.message || 'Token verification failed')
      }

      return {token: data, user: data}
    } catch (error) {
      /*localStorage.removeItem('token')*/
      console.log("esto tampoco deberia pasar")
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem('token')
    },
    clearError: (state) => {
      state.error = null
    },
    setToken: (state, action) => {
      state.token = action.payload
      state.isAuthenticated = true
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Verify token
      .addCase(verifyToken.pending, (state) => {
        state.loading = true
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(verifyToken.rejected, (state/*, action*/) => {
        state.loading = false
        //state.isAuthenticated = false
        //state.user = null
        //state.token = null
      })
  }
})

export const { logout, clearError, setToken } = authSlice.actions
export default authSlice.reducer
