import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as Keychain from 'react-native-keychain';
import { ENDPOINTS } from '../../../services/apiBaseUrl';
import {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  UserState,
  UserCredentials,
} from '../../../types/auth';
import Toast from 'react-native-toast-message';
import { axiosInstance } from '../../../services/apiInterceptor';
import { UpdateUserInput } from '../../../validation/UpdateUserSchema';

const initialState: UserState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// REGISTER
export const registerUser = createAsyncThunk<
  LoginResponse,
  RegisterCredentials,
  { rejectValue: string }
>('user/registerUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.REGISTER, credentials);

    const res = response.data.data;
    await Keychain.resetGenericPassword();
    await Keychain.setGenericPassword('authData', JSON.stringify(res));
    Toast.show({
      type: 'success',
      text1: 'Registration Successful',
      text2: response.data.message,
    });
    return response.data;
  } catch (error: any) {
    console.error('Register Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      code: error.code,
    });
    const msg = error.response?.data?.message || 'Registration failed';
    Toast.show({ type: 'error', text1: 'Register Error', text2: msg });
    return rejectWithValue(msg);
  }
});

// LOGIN
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>('user/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.LOGIN, credentials);

    const res = response.data.data;
    await Keychain.resetGenericPassword();
    await Keychain.setGenericPassword('authData', JSON.stringify(res));
    Toast.show({
      type: 'success',
      text1: 'Login Successful',
      text2: response.data.message,
    });
    return response.data;
  } catch (error: any) {
    console.error('Login Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      code: error.code,
    });
    const msg = error.response?.data?.message || 'Login failed';
    Toast.show({ type: 'error', text1: 'Login Error', text2: msg });
    return rejectWithValue(msg);
  }
});

// LOAD USER
export const loadUserFromStorage = createAsyncThunk<
  { token: string; user: UserCredentials },
  void,
  { rejectValue: string }
>('user/loadUserFromStorage', async (_, { rejectWithValue }) => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials && credentials.password) {
      const authData = JSON.parse(credentials.password);
      return { token: authData.token, user: authData.user };
    }
    return rejectWithValue('No auth data found');
  } catch (error: any) {
    console.error('Load User Error:', error);
    return rejectWithValue(error.message);
  }
});

// UPDATE USER
export const updateUser = createAsyncThunk<
  { user: UserCredentials },
  UpdateUserInput,
  { rejectValue: string }
>('user/updateUser', async (updateData, { rejectWithValue, getState }) => {
  try {
    const state = getState() as { user: UserState };
    const token = state.user.token;
    const response = await axiosInstance.patch(
      ENDPOINTS.UPDATE_USER,
      updateData,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    Toast.show({
      type: 'success',
      text1: 'Profile Updated',
      text2: response.data.message,
    });
    return { user: response.data.data.user };
  } catch (error: any) {
    console.error('Update User Error:', error);
    const msg = error.response?.data?.message || 'Update failed';
    Toast.show({ type: 'error', text1: 'Update Error', text2: msg });
    return rejectWithValue(msg);
  }
});

// DELETE USER
export const deleteUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/deleteUser',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const state = getState() as { user: UserState };
      const token = state.user.token;
      const response = await axiosInstance.delete(ENDPOINTS.DELETE_USER, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Toast.show({
        type: 'success',
        text1: 'Account Deleted',
        text2: response.data.message,
      });
      dispatch(logout()); // Log out after deletion
    } catch (error: any) {
      console.error('Delete User Error:', error);
      const msg = error.response?.data?.message || 'Deletion failed';
      Toast.show({ type: 'error', text1: 'Delete Error', text2: msg });
      return rejectWithValue(msg);
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      Keychain.resetGenericPassword();
    },
    setUser: (state, action: PayloadAction<UserCredentials | null>) => {
      state.user = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // LOGIN
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload || 'Login failed';
      })
      // REGISTER
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload || 'Registration failed';
      })
      // LOAD USER
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loadUserFromStorage.rejected, state => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      })
      // UPDATE USER
      .addCase(updateUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Update failed';
      })
      // DELETE USER
      .addCase(deleteUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, state => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Deletion failed';
      });
  },
});

export const { logout, setUser } = userSlice.actions;
export default userSlice.reducer;
