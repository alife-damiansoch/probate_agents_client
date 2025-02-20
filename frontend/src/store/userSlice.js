import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import Cookies from 'js-cookie';
import { fetchData } from '../components/GenericFunctions/AxiosGenericFunctions';

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    const { access } = JSON.parse(Cookies.get('auth_token_agents'));

    try {
      const endpoint = `/api/user/me/`;
      const response = await fetchData(access, endpoint);

      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        console.log(err.response.data);
        // Return the custom error message from API response
        return rejectWithValue(err.response.data);
      }
      // Return a generic error message if there's no response data
      return rejectWithValue({
        error: 'An error occurred while fetching user data',
      });
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUser.pending, (state) => {
        state.user = null;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError, clearUser } = userSlice.actions;
export default userSlice.reducer;
