import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const BASE_URL = 'http://your-api-url/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Check internet connectivity
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new Error('No internet connection');
    }

    // Get token from storage
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      await AsyncStorage.removeItem('token');
      // Navigate to login (you'll need to implement this)
      // navigationRef.current?.navigate('Login');
    }
    return Promise.reject(handleApiError(error));
  }
);

// API endpoints
const authApi = {
  login: (credentials) => api.post('/auth/employee/login', credentials),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh')
};

const productApi = {
  getAssignments: () => api.get('/products/assignments'),
  submitProduct: (data) => api.post('/products/submit', data),
  getProgress: () => api.get('/products/progress')
};

const salaryApi = {
  getSalaryDetails: () => api.get('/salary/details'),
  getInvoices: () => api.get('/salary/invoices'),
  downloadInvoice: (month) => api.get(`/salary/invoice/${month}`, {
    responseType: 'blob'
  })
};

const profileApi = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  updatePassword: (data) => api.put('/profile/password', data)
};

export {
  authApi,
  productApi,
  salaryApi,
  profileApi
}; 