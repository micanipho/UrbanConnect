import axios from 'axios';

// @ts-ignore
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export default axiosInstance;
