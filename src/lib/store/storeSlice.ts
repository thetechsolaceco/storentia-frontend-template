import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { storeAPI, type StoreInfo } from "@/lib/apiClients";

interface StoreState {
  info: StoreInfo | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: StoreState = {
  info: null,
  isLoading: false,
  error: null,
};

export const fetchStoreInfo = createAsyncThunk(
  "store/fetchInfo",
  async (_, { rejectWithValue }) => {
    const storeId = process.env.NEXT_PUBLIC_STORENTIA_STOREID;
    if (!storeId) {
      return rejectWithValue("Store ID not configured");
    }
    
    const response = await storeAPI.getStore(storeId);
    if (response.success && response.data) {
      return response.data;
    }
    return rejectWithValue(response.message || "Failed to fetch store info");
  }
);

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setStoreInfo: (state, action: PayloadAction<StoreInfo>) => {
      state.info = action.payload;
      state.error = null;
    },
    clearStoreInfo: (state) => {
      state.info = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStoreInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.info = action.payload;
      })
      .addCase(fetchStoreInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setStoreInfo, clearStoreInfo } = storeSlice.actions;

// Selectors
export const selectStoreInfo = (state: { store: StoreState }) => state.store.info;
export const selectStoreLoading = (state: { store: StoreState }) => state.store.isLoading;
export const selectStoreError = (state: { store: StoreState }) => state.store.error;
export const selectStoreId = (state: { store: StoreState }) => 
  state.store.info?.id || process.env.NEXT_PUBLIC_STORENTIA_STOREID;

export default storeSlice.reducer;
