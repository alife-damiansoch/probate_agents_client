import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './authSlice';
import { userSlice } from './userSlice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    user: userSlice.reducer,
  },
});
export default store;
