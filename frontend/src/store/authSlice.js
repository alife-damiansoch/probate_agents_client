import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../baseUrls';

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('🔍 API_URL:', API_URL); // Debug log
      const country = Cookies.get('country');
      const response = await axios.post(
        `${API_URL}/api/user/token/`,
        {
          email,
          password,
        },
        {
          headers: {
            Country: country, // Adding the 'Country' header
          },
          withCredentials: true, // Send cookies with the request
        }
      );

      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        console.log(err.response.data);
        // Return the custom error message from API response
        return rejectWithValue(err.response.data);
      }
      // Return a generic error message if there's no response data
      return rejectWithValue({ error: 'An error occurred during signup' });
    }
  }
);

const initialState = {
  token: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.loading = false;
      state.error = null;
      Cookies.remove('auth_token_agents'); // Clear the token from cookies
      // Clear localStorage items
      localStorage.removeItem('frontend_api_key_agents');
      localStorage.removeItem('user_type_agents');
    },
    loginSuccess: (state, action) => {
      state.token = action.payload.tokenObj;
      state.isLoggedIn = true;
      state.loading = false;
      state.error = null;
      const { access, refresh, api_key, user_type } = action.payload.tokenObj;

      // Set cookies
      Cookies.set('auth_token_agents', JSON.stringify({ access, refresh }), {
        secure: true,
        sameSite: 'strict',
        path: '/',
      });

      // Store API key and user type in localStorage (persists across tabs)
      if (api_key) {
        localStorage.setItem('frontend_api_key_agents', api_key);
        localStorage.setItem('user_type_agents', user_type || 'staff');
      }
    },
    setNewTokens: (state, action) => {
      const { newAccess } = action.payload;

      state.token = { access: newAccess };
      let tokenObj = Cookies.get('auth_token_agents');
      tokenObj = tokenObj ? JSON.parse(tokenObj) : null;
      const oldRefresh = tokenObj ? tokenObj.refresh : null;
      Cookies.set(
        'auth_token_agents',
        JSON.stringify({ access: newAccess, refresh: oldRefresh }),
        {
          secure: import.meta.env.PROD,
          sameSite: 'strict',
          path: '/',
        }
      );
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.fulfilled, (state, action) => {
        const { access, refresh, api_key, user_type } = action.payload;

        // Set cookies
        Cookies.set('auth_token_agents', JSON.stringify({ access, refresh }), {
          secure: import.meta.env.PROD,
          sameSite: 'strict',
          path: '/',
        });

        // Store API key and user type in localStorage (persists across tabs)
        if (api_key) {
          localStorage.setItem('frontend_api_key_agents', api_key);
          localStorage.setItem('user_type_agents', user_type || 'staff');
        }

        state.token = action.payload;
        state.isLoggedIn = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(signup.pending, (state) => {
        state.token = null;
        state.isLoggedIn = false;
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.token = null;
        state.isLoggedIn = false;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, loginSuccess, clearAuthError, setNewTokens } =
  authSlice.actions;
export default authSlice.reducer;
