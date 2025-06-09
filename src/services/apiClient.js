import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // O proxy no vite.config.js vai tratar disto
});

// Este "interceptor" será muito importante no futuro.
// Ele irá adicionar automaticamente o token de autenticação a cada
// requisição após o utilizador fazer login.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
