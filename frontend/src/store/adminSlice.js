import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    admin: null, 
    adminAuth: false,
    token: null
  },

  reducers: {
    login(state, action) {
      state.admin = action.payload.admin;
      state.adminAuth = true;
      state.token = action.payload.accessToken;
      
      localStorage.setItem('admin', JSON.stringify(action.payload.admin));
      localStorage.setItem('token', action.payload.accessToken);
    },
    logout(state) {
      state.admin = null; 
      state.adminAuth = false;
      state.token = null;  

      localStorage.removeItem('admin');
      localStorage.removeItem('token');

      console.log("Logged Out Successfully.")
    }
  },
});

export const { login, logout } = adminSlice.actions;

export const selectAdmin  = (state) => state.admin.admin; 
export const selectAdminAuth = (state) => state.admin.adminAuth;
export const selectToken = (state) => state.admin.token;

export default adminSlice.reducer;