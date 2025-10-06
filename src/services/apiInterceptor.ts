import axios from 'axios';

const API_BASE_URL = 'https://base57-server.vercel.app';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
