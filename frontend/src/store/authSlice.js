import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  userAuth: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.userAuth = true;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.accessToken);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.userAuth = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

export const { login, logout } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectUserAuth = (state) => state.auth.userAuth;
export const selectToken = (state) => state.auth.token;
export default authSlice.reducer; 