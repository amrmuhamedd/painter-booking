import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../services/auth.api";
import type { UserInfo } from "../../services/auth.api";

interface RegisterCredentials {
  email: string;
  name: string;
  password: string;
  role?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.register(credentials);
      const { access_token } = response;
      // Only store access token in localStorage, refresh token is handled by cookies
      return { accessToken: access_token };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      const accessToken = response.access_token;
      // No need to handle refresh token, it's in cookies
      return { accessToken };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await authApi.logout();
      dispatch(logout());
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch(logout());
      // Don't reject the promise - this ensures the UI flow continues
      return { success: true, localOnly: true };
    }
  }
);

export const getUserInfo = createAsyncThunk(
  'auth/getUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const userInfo = await authApi.getUserInfo();
      return { userInfo };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user info');
    }
  }
);

// Get initial state from localStorage - only access token is stored there
const accessToken = localStorage.getItem("accessToken");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken,
    isAuthenticated: !!accessToken,
    loading: false,
    error: null as string | null,
    userInfo: null as UserInfo | null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("accessToken", accessToken);
      // No need to store refresh token, it's in cookies
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      state.userInfo = null;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(getUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload.userInfo;
        state.loading = false;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { setCredentials, setLoading, setError, logout, setUserInfo } =
  authSlice.actions;
export default authSlice.reducer;
