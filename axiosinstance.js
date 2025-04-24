import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === "development"
  ? "http://localhost:5000/api"  
  : "https://spark-backend-5v4v.onrender.com/api",
      withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error) 
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, config } = error.response;
      
      if (status === 401) {
        console.error('Unauthorized: Token may be expired or invalid');
        // Only redirect if this isn't a registration check request
        if (!config.url.includes('/registeredhackathon/check')) {
          localStorage.removeItem('token');
          localStorage.removeItem('studentId');
          window.location.href = '/';
        }
      }
      else if (status === 403) {
        console.error('Forbidden: You do not have permission to access this resource');
      } else if (status === 404) {
        console.error('Resource not found');
        // Don't redirect for 404 errors
        return Promise.reject(error);
      } else if (status >= 500) {
        console.error('Server error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
        