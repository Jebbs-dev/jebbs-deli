import axios from "axios";
import { jwtDecode } from "jwt-decode";
import useAuthStore from "@/store/auth";

type RefreshResult = {
  accessToken: string;
  refreshToken: string;
};

type StoredUserInfo = {
  accessToken?: string;
  refreshToken?: string;
  [key: string]: unknown;
};

const getUserInfo = (): StoredUserInfo | null => {
  try {
    const userInfoStr = localStorage.getItem("userInfo");
    return userInfoStr ? JSON.parse(userInfoStr) : null;
  } catch (error) {
    console.error("Error parsing userInfo:", error);
    return null;
  }
};

const saveAccessToken = (accessToken: string) => {
  const userInfo = getUserInfo();
  if (!userInfo) return;

  localStorage.setItem(
    "userInfo",
    JSON.stringify({ ...userInfo, accessToken })
  );
};

const handleRefreshUnauthorized = () => {
  useAuthStore.getState().logout();
  window.location.href = "/auth";
};

// Helper function to check if token is about to expire
const isTokenExpiringSoon = (token: string, thresholdMinutes = 30): boolean => {
  try {
    const decoded: { exp?: number } = jwtDecode(token);
    if (!decoded.exp) return false;

    const expirationTime = decoded.exp * 1000;
    const timeUntilExpiration = expirationTime - Date.now();
    const thresholdMs = thresholdMinutes * 60 * 1000;

    return timeUntilExpiration <= thresholdMs;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

let refreshPromise: Promise<RefreshResult> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  const userInfo = getUserInfo();

  if (!userInfo?.refreshToken) {
    throw new Error("No refresh token available");
  }

  if (!refreshPromise) {
    refreshPromise = axios
      .post<RefreshResult>(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
        { refreshToken: userInfo.refreshToken }
      )
      .then((response) => {
        saveAccessToken(response.data.accessToken);
        return response.data;
      })
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

  const { accessToken } = await refreshPromise;
  return accessToken;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const userInfo = getUserInfo();

    if (userInfo?.accessToken) {
      if (isTokenExpiringSoon(userInfo.accessToken, 30)) {
        try {
          const newToken = await refreshAccessToken();
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (error) {
          console.error("Proactive token refresh failed:", error);
          config.headers.Authorization = `Bearer ${userInfo.accessToken}`;
        }
      } else {
        config.headers.Authorization = `Bearer ${userInfo.accessToken}`;
      }
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
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
 * Sets up a periodic token refresh check to keep the session alive
 */
export const setupSilentRefresh = () => {
  const checkAndRefreshToken = async () => {
    try {
      const userInfo = getUserInfo();
      if (!userInfo?.accessToken) return;

      if (isTokenExpiringSoon(userInfo.accessToken, 120)) {
        await refreshAccessToken();
      }
    } catch (error) {
      console.error("Silent token refresh failed:", error);
    }
  };

  const startupTimeout = setTimeout(checkAndRefreshToken, 1000);
  const refreshInterval = setInterval(checkAndRefreshToken, 60 * 60 * 1000);

  return () => {
    clearTimeout(startupTimeout);
    clearInterval(refreshInterval);
  };
};
