import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/user/AuthSlice';
import taskReducer from './slice/task/TaskSlice';
import categoryReducer from './slice/task/CategorySlice';
import priorityReducer from './slice/task/PrioritySlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    task: taskReducer,
    category: categoryReducer,
    priority: priorityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
