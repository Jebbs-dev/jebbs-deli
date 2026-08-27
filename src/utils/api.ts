import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import useAuthStore from "@/store/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MUTATING_METHODS = new Set(["post", "put", "patch", "delete"]);

const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  if (!match) return undefined;
  return decodeURIComponent(match.slice(name.length + 1));
};

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(undefined);
    }
  });
  failedQueue = [];
};

const skipRefreshEndpoints = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/v1/auth/refresh",
];

function omitEmptyParams(params: unknown): unknown {
  if (!params || typeof params !== "object" || Array.isArray(params)) {
    return params;
  }
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
    if (value === "" || value === undefined || value === null) continue;
    out[key] = value;
  }
  return out;
}

const handleRefreshUnauthorized = () => {
  useAuthStore.getState().logout();
  if (typeof window !== "undefined") {
    window.location.href = "/auth";
  }
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    const method = config.method?.toLowerCase();
    if (method && MUTATING_METHODS.has(method)) {
      const csrfToken = getCookie("csrf_token");
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
    }

    if (config.params && typeof config.params === "object") {
      config.params = omitEmptyParams(config.params);
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

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const shouldSkipRefresh = skipRefreshEndpoints.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );

    if (
      error.response?.status === 401 &&
      !shouldSkipRefresh &&
      !originalRequest._retry &&
      useAuthStore.getState().isLoggedIn
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);

        if (
          axios.isAxiosError(refreshError) &&
          refreshError.response?.status === 401
        ) {
          handleRefreshUnauthorized();
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
