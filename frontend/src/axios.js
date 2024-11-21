import axios from 'axios';

// Set up Axios instance
const axiosInstance = axios.create({
  timeout: 5000,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the latest token from localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

export default axiosInstance;
