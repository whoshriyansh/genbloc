export const ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  UPDATE_USER: '/user/update',
  DELETE_USER: '/user/delete',

  //TASK
  FETCH_ALL: '/task/all',
  CREATE_TASK: '/task/create',
  UPDATE_TASK: (id: string) => `/task/edit/${id}`,
  DELETE_TASK: (id: string) => `/task/delete/${id}`,

  //Category
  FETCH_ALL_CATEGORIES: '/category/getAll',
  CREATE_CATEGORY: '/category/create',
  DELETE_CATEGORY: (id: string) => `/category/delete/${id}`,

  //Priority
  FETCH_ALL_PRIORITIES: '/priority/getAll',
  CREATE_PRIORITY: '/priority/create',
  DELETE_PRIORITY: (id: string) => `/priority/delete/${id}`,
};
