import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import useAuthStore from "@/store/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

/**
 * Same behaviour as before: only redirect when a logged-in session's refresh fails.
 * Guests never hit this path.
 */
const handleRefreshUnauthorized = () => {
  useAuthStore.getState().logout();
  if (typeof window !== "undefined") {
    window.location.href = "/auth";
  }
};

const refreshAccessToken = async (): Promise<void> => {
  // Mirror old localStorage gate: only refresh when the user appears logged in.
  if (!useAuthStore.getState().isLoggedIn) {
    throw new Error("No refresh session available");
  }

  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true })
      .then(() => undefined)
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          handleRefreshUnauthorized();
        }
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  await refreshPromise;
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      useAuthStore.getState().isLoggedIn
    ) {
      originalRequest._retry = true;

      try {
        await refreshAccessToken();
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

/**
 * Periodic refresh for logged-in sessions (cookies, not localStorage tokens).
 * Does not redirect on failure — that matches not nuking browse/cart mid-session.
 */
export const setupSilentRefresh = () => {
  const checkAndRefreshToken = async () => {
    try {
      if (!useAuthStore.getState().isLoggedIn) return;
      await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Silent token refresh failed:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        useAuthStore.getState().logout();
      }
    }
  };

  const startupTimeout = setTimeout(checkAndRefreshToken, 1000);
  const refreshInterval = setInterval(checkAndRefreshToken, 60 * 60 * 1000);

  return () => {
    clearTimeout(startupTimeout);
    clearInterval(refreshInterval);
  };
};
