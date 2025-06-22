import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
import { toast } from "react-toastify";

export const submitBid = createAsyncThunk(
  "bid/submit",
  async ({ tenderId, bids, note, contactInfo }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/tenders/submit/${tenderId}`, {
        bids,
        note,
        contactInfo,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const bidSlice = createSlice({
  name: "bid",
  initialState,
  reducers: {
    resetBidState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBid.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitBid.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to submit bid";
      });
  },
});

export const { resetBidState } = bidSlice.actions;
export default bidSlice.reducer; 