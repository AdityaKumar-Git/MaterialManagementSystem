import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, 
    userAuth: false,
    token: null
  },

  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.userAuth = true;
      state.token = action.payload.accessToken;
      
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.accessToken);
    },
    logout(state) {
      state.user = null; 
      state.userAuth = false;
      state.token = null;  

      localStorage.removeItem('user');
      localStorage.removeItem('token');

      console.log("Logged Out Successfully.")
    }
  },
});

export const { login, logout } = authSlice.actions;

export const selectUser  = (state) => state.auth.user; 
export const selectUserAuth = (state) => state.auth.userAuth;
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;