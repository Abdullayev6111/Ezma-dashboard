import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const API = axios.create({
  baseURL: "https://org-ave-jimmy-learners.trycloudflare.com/api/v1",
});

API.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      logoutAndRedirect();
    }
    return Promise.reject(error);
  }
);

function logoutAndRedirect() {
  const authStore = useAuthStore.getState();
  authStore.logout();
  window.location.href = '/login';
}

export default API;
