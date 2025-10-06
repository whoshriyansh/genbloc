// categorySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { ENDPOINTS } from '../../../services/apiBaseUrl';
import { apiClient } from '../../../services/api';
import { Category, CategoryState } from '../../../types/task';

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>('category/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(ENDPOINTS.FETCH_ALL_CATEGORIES);

    Toast.show({
      type: 'success',
      text1: 'Categories Fetched Successfully',
      text2: response.data.message,
    });

    return response.data.data;
  } catch (error: any) {
    console.error('Fetching Categories Failed', error);

    const msg = error.response?.data?.message || 'Fetching Categories Failed';
    Toast.show({
      type: 'error',
      text1: 'Fetching Categories Failed',
      text2: msg,
    });

    return rejectWithValue(msg);
  }
});

export const createCategory = createAsyncThunk<
  Category,
  Omit<Category, '_id'>,
  { rejectValue: string }
>('category/create', async (newCategory, { rejectWithValue }) => {
  try {
    const response = await apiClient.post(
      ENDPOINTS.CREATE_CATEGORY,
      newCategory,
    );

    Toast.show({
      type: 'success',
      text1: 'Category Created',
      text2: response.data.message,
    });

    return response.data.data;
  } catch (error: any) {
    console.error('Creating Category Failed', error);

    const msg = error.response?.data?.message || 'Creating Category Failed';
    Toast.show({
      type: 'error',
      text1: 'Creating Category Failed',
      text2: msg,
    });

    return rejectWithValue(msg);
  }
});

export const deleteCategory = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('category/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await apiClient.delete(ENDPOINTS.DELETE_CATEGORY(id));

    Toast.show({
      type: 'success',
      text1: 'Category Deleted',
      text2: response.data.message,
    });

    return id;
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Deleting Category Failed';
    Toast.show({
      type: 'error',
      text1: 'Deleting Category Failed',
      text2: msg,
    });
    return rejectWithValue(msg);
  }
});

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // fetch categories
      .addCase(fetchCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Fetching Categories Failed';
      })
      // create category
      .addCase(createCategory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload); // append created category
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Creating Category Failed';
      })
      // delete category
      .addCase(deleteCategory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          c => c._id !== action.payload,
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Deleting Category Failed';
      });
  },
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;
