// Updated taskSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { ENDPOINTS } from '../../../services/apiBaseUrl';
import { apiClient } from '../../../services/api';
import { CreateTaskPayload, Task, TaskState } from '../../../types/task';

// Initial state
const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk<
  Task[],
  { category?: string; priority?: string; dueDate?: string } | void,
  { rejectValue: string }
>('task/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(ENDPOINTS.FETCH_ALL, { params });

    Toast.show({
      type: 'success',
      text1: 'Tasks Fetched Successfully',
      text2: response.data.message,
    });

    return response.data.data;
  } catch (error: any) {
    console.error('Fetching Tasks Failed', error);

    const msg = error.response?.data?.message || 'Fetching Tasks Failed';
    Toast.show({ type: 'error', text1: 'Fetching Tasks Failed', text2: msg });

    return rejectWithValue(msg);
  }
});

export const createTask = createAsyncThunk<
  Task,
  CreateTaskPayload,
  { rejectValue: string }
>('task/create', async (newTask, { rejectWithValue }) => {
  try {
    const response = await apiClient.post(ENDPOINTS.CREATE_TASK, newTask);

    Toast.show({
      type: 'success',
      text1: 'Task Created',
      text2: response.data.message,
    });

    return response.data.data;
  } catch (error: any) {
    console.error('Creating Task Failed', error);

    const msg = error.response?.data?.message || 'Creating Task Failed';
    Toast.show({ type: 'error', text1: 'Creating Task Failed', text2: msg });

    return rejectWithValue(msg);
  }
});

export const updateTask = createAsyncThunk<
  Task,
  { id: string; updatedTask: Partial<CreateTaskPayload> },
  { rejectValue: string }
>('task/update', async ({ id, updatedTask }, { rejectWithValue }) => {
  try {
    const response = await apiClient.patch(
      ENDPOINTS.UPDATE_TASK(id),
      updatedTask,
    );

    console.log('This is the actual error', response);

    Toast.show({
      type: 'success',
      text1: 'Task Updated',
      text2: response.data.message,
    });

    return response.data.data;
  } catch (error: any) {
    console.log('This is the actual error', error.response);
    const msg = error.response?.data?.message || 'Updating Task Failed';
    Toast.show({ type: 'error', text1: 'Updating Task Failed', text2: msg });
    return rejectWithValue(msg);
  }
});

export const deleteTask = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('task/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await apiClient.delete(ENDPOINTS.DELETE_TASK(id));

    Toast.show({
      type: 'success',
      text1: 'Task Deleted',
      text2: response.data.message,
    });

    return id;
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Deleting Task Failed';
    Toast.show({ type: 'error', text1: 'Deleting Task Failed', text2: msg });
    return rejectWithValue(msg);
  }
});

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // fetch tasks
      .addCase(fetchTasks.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Fetching Tasks Failed';
      })
      // create task
      .addCase(createTask.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload); // append created task
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Creating Task Failed';
      })
      // update task
      .addCase(updateTask.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Updating Task Failed';
      })
      // delete task
      .addCase(deleteTask.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(t => t._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Deleting Task Failed';
      });
  },
});

export const { setTasks } = taskSlice.actions;
export default taskSlice.reducer;
