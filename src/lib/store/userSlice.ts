
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getUserProfile, type UserProfile, type UpdateProfileRequest, updateUserProfile } from "@/lib/apiClients";

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    const response = await getUserProfile();
    if (response.success && response.data) {
      // The API response type might be { user: UserProfile } or just UserProfile
      // checking the interface in profile.ts: data?: { user: UserProfile } | UserProfile;
      const data = response.data as any;
      if (data.user) {
        return data.user as UserProfile;
      }
      return data as UserProfile;
    }
    return rejectWithValue(response.error || "Failed to fetch user profile");
  }
);

// Optional: for future use if needed
export const updateUser = createAsyncThunk(
  "user/updateProfile",
  async (data: UpdateProfileRequest, { rejectWithValue }) => {
    const response = await updateUserProfile(data);
    if (response.success && response.data) {
       return response.data;
    }
    return rejectWithValue(response.error || "Failed to update profile");
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearUser: (state) => {
      state.profile = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profile = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      // If fetch fails (e.g. 401), we assume not authenticated
      state.isAuthenticated = false;
      state.profile = null;
    });

    // Update Profile
    builder.addCase(updateUser.fulfilled, (state, action) => {
        state.profile = { ...state.profile, ...action.payload } as UserProfile;
    });
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectUserProfile = (state: { user: UserState }) => state.user.profile;
export const selectUserLoading = (state: { user: UserState }) => state.user.isLoading;
export const selectIsAuthenticated = (state: { user: UserState }) => state.user.isAuthenticated;

export default userSlice.reducer;
