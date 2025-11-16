import { refreshAccessToken } from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const { accessToken: newToken } = await refreshAccessToken();
        useAuthStore.getState().setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (error) {
        // Clear auth state on refresh failure
        const { clearAuth } = useAuthStore.getState();
        clearAuth();

        // Redirect to home page
        window.location.href = "/";

        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
