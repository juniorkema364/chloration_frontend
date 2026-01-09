// import axios from "axios";

// const axiosInstance = axios.create({
// 	// baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "/api",
// 	baseURL : "http://localhost:5000/api" , 
// 	withCredentials: true, // send cookies to the server
// });

// export const forageAPI = {
//   getAll: () => axiosInstance.get('/forages'),
//   getById: (id) => axiosInstance.get(`/forages/${id}`),
//   create: (data) => axiosInstance.post('/forages', data),
//   update: (id, data) => axiosInstance.put(`/forages/${id}`, data),
//   delete: (id) => axiosInstance.delete(`/forages/${id}`)
// };

 
// export const analysisAPI = {
//   getByForageId: (forageId) => axiosInstance.get(`/analyses/${forageId}`),
//   getById: (id) => axiosInstance.get(`/analyses/${id}`),
//   create: (data) => axiosInstance.post('/analyses', data),
//   update: (id, data) => axiosInstance.put(`/analyses/${id}`, data),
//   delete: (id) => axiosInstance.delete(`/analyses/${id}`)
// };

// // STATISTIQUES
// export const statsAPI = {
//   getDashboardStats: () => axiosInstance.get('/dashboard-stats'),
//   getForageStats: (forageId) => axiosInstance.get(`/stats/forage/${forageId}`),
//   getGlobalStats: () => axiosInstance.get('/stats/global')
// };

// export default axiosInstance;
// src/api/axiosClient.js
import axios from 'axios';

 
// Créer l'instance axios
const axiosClient = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL  : import.meta.env.VITE_API_URL  ,
  // baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "/api",
  // baseURL : "http://localhost:5000/api" , 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
  // timeout: 10000
}); 

// Intercepteur de requête
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Erreur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    const errorMessage = error.response?.data?.error || error.message || 'Erreur serveur';
    console.error('Erreur API:', errorMessage);
    
    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data
    });
  }
);

export default axiosClient;