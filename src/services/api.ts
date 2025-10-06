import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const API_BASE_URL = 'https://base57-server.vercel.app';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async config => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const authData = JSON.parse(credentials.password);
        console.log('🔑 Token from Keychain:', authData.token); // 👈 add this
        config.headers.Authorization = `Bearer ${authData.token}`;
      } else {
        console.log('⚠️ No credentials found in Keychain');
      }
    } catch (error) {
      console.error('❌ Failed to retrieve auth data:', error);
    }
    return config;
  },
  error => Promise.reject(error),
);
