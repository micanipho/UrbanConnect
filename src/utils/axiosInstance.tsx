import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8080/api',
});

export default axiosInstance;
