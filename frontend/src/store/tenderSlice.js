import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
import store from "./store";

// Async thunks
export const createTender = createAsyncThunk(
  "tender/create",
  async (tenderData, { rejectWithValue }) => {
    try {
      const state = store.getState();
      console.log("Admin state:", {
        isAdmin: state.admin.adminAuth,
        token: state.admin.token,
        admin: state.admin.admin
      });
      
      console.log("Creating tender with data:", tenderData);
      console.log("API URL:", axios.defaults.baseURL);
      const response = await axios.post("/tenders", tenderData);
      console.log("Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error creating tender:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTenders = createAsyncThunk(
  "tender/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/tenders");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const closeTender = createAsyncThunk(
  "tender/close",
  async (tenderId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/tenders/${tenderId}/close`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const awardTender = createAsyncThunk(
  "tender/status",
  async (tenderData, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/tenders/${tenderData.tenderId}/status`, {items:tenderData.items, status: "awarded", storeName: tenderData.storeName });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  tenders: [],
  loading: false,
  error: null,
  success: false,
};

const tenderSlice = createSlice({
  name: "tender",
  initialState,
  reducers: {
    resetTenderState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create tender
      .addCase(createTender.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTender.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.tenders.push(action.payload.data);
      })
      .addCase(createTender.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create tender";
      })
      // Fetch tenders
      .addCase(fetchTenders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenders.fulfilled, (state, action) => {
        state.loading = false;
        state.tenders = action.payload.data;
      })
      .addCase(fetchTenders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch tenders";
      })
      // Close tender
      .addCase(closeTender.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(closeTender.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tenders.findIndex(
          (tender) => tender._id === action.payload._id
        );
        if (index !== -1) {
          state.tenders[index] = action.payload;
        }
      })
      .addCase(closeTender.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetTenderState } = tenderSlice.actions;
export default tenderSlice.reducer; 