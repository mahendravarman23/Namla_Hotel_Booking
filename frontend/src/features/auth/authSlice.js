import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api.js';

const USER_STORAGE_KEY = 'hotel_app_auth_user';
const TOKEN_STORAGE_KEY = 'hotel_app_jwt_token';

const loadStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const loadStoredToken = () => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  } catch {
    return null;
  }
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authApi.login({ email, password });
      return data;
    } catch (err) {
      return rejectWithValue(err.data?.message || err.message || 'Login failed.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const data = await authApi.register({ name, email, password });
      return data;
    } catch (err) {
      if (err.data?.errors) {
        return rejectWithValue({ errors: err.data.errors });
      }
      return rejectWithValue({ message: err.data?.message || err.message || 'Registration failed.' });
    }
  }
);

const initialUser = loadStoredUser();
const initialToken = loadStoredToken();

const initialState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: Boolean(initialUser && initialToken),
  status: 'idle',
  error: null,
  fieldErrors: {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      state.fieldErrors = {};
      try {
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      } catch {}
    },
    clearAuthError(state) {
      state.error = null;
      state.fieldErrors = {};
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        state.fieldErrors = {};
        try {
          localStorage.setItem(TOKEN_STORAGE_KEY, action.payload.token);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload.user));
        } catch {}
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = typeof action.payload === 'string' ? action.payload : 'Login failed.';
      })

      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        state.fieldErrors = {};
        try {
          localStorage.setItem(TOKEN_STORAGE_KEY, action.payload.token);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload.user));
        } catch {}
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        if (action.payload?.errors) {
          state.fieldErrors = action.payload.errors;
        } else {
          state.error = action.payload?.message || 'Registration failed.';
        }
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
