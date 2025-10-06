// prioritySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { ENDPOINTS } from '../../../services/apiBaseUrl';
import { apiClient } from '../../../services/api';
import { Priority, PriorityState } from '../../../types/task';

const initialState: PriorityState = {
  priorities: [],
  loading: false,
  error: null,
};

export const fetchPriorities = createAsyncThunk<
  Priority[],
  void,
  { rejectValue: string }
>('priority/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(ENDPOINTS.FETCH_ALL_PRIORITIES);

    Toast.show({
      type: 'success',
      text1: 'Priorities Fetched Successfully',
      text2: response.data.message,
    });

    return response.data.data;
  } catch (error: any) {
    console.error('Fetching Priorities Failed', error);

    const msg = error.response?.data?.message || 'Fetching Priorities Failed';
    Toast.show({
      type: 'error',
      text1: 'Fetching Priorities Failed',
      text2: msg,
    });

    return rejectWithValue(msg);
  }
});

export const createPriority = createAsyncThunk<
  Priority,
  Omit<Priority, '_id'>,
  { rejectValue: string }
>('priority/create', async (newPriority, { rejectWithValue }) => {
  try {
    const response = await apiClient.post(
      ENDPOINTS.CREATE_PRIORITY,
      newPriority,
    );

    Toast.show({
      type: 'success',
      text1: 'Priority Created',
      text2: response.data.message,
    });

    return response.data.data;
  } catch (error: any) {
    console.error('Creating Priority Failed', error);

    const msg = error.response?.data?.message || 'Creating Priority Failed';
    Toast.show({
      type: 'error',
      text1: 'Creating Priority Failed',
      text2: msg,
    });

    return rejectWithValue(msg);
  }
});

export const deletePriority = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('priority/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await apiClient.delete(ENDPOINTS.DELETE_PRIORITY(id));

    Toast.show({
      type: 'success',
      text1: 'Priority Deleted',
      text2: response.data.message,
    });

    return id;
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Deleting Priority Failed';
    Toast.show({
      type: 'error',
      text1: 'Deleting Priority Failed',
      text2: msg,
    });
    return rejectWithValue(msg);
  }
});

const prioritySlice = createSlice({
  name: 'priority',
  initialState,
  reducers: {
    setPriorities: (state, action: PayloadAction<Priority[]>) => {
      state.priorities = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // fetch priorities
      .addCase(fetchPriorities.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPriorities.fulfilled, (state, action) => {
        state.loading = false;
        state.priorities = action.payload;
      })
      .addCase(fetchPriorities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Fetching Priorities Failed';
      })
      // create priority
      .addCase(createPriority.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPriority.fulfilled, (state, action) => {
        state.loading = false;
        state.priorities.push(action.payload); // append created priority
      })
      .addCase(createPriority.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Creating Priority Failed';
      })
      // delete priority
      .addCase(deletePriority.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePriority.fulfilled, (state, action) => {
        state.loading = false;
        state.priorities = state.priorities.filter(
          p => p._id !== action.payload,
        );
      })
      .addCase(deletePriority.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Deleting Priority Failed';
      });
  },
});

export const { setPriorities } = prioritySlice.actions;
export default prioritySlice.reducer;
