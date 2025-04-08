import axios from "axios";


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api",
  timeout: 10000, // Set a reasonable timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // If your API requires authentication cookies
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: any[] = [];

// Function to process queued requests
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    let userInfo = null;
    try {
      const userInfoStr = localStorage.getItem("userInfo");
      if (userInfoStr) {
        userInfo = JSON.parse(userInfoStr);
      }
    } catch (error) {
      console.error("Error parsing userInfo:", error);
    }

    if (userInfo?.access) {
      config.headers.Authorization = `Bearer ${userInfo.access}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response, // Pass successful responses as they are
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If another refresh request is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        let userInfo: any = {};
        if (localStorage.getItem("userInfo")) {
          userInfo = JSON.parse(localStorage.getItem("userInfo")!);
        }

        const refreshToken = userInfo?.refresh;

        const refreshResponse = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );

        const { access, refresh } = refreshResponse.data;

        localStorage.setItem(
          "userInfo",
          JSON.stringify({ ...userInfo!, access, refresh })
        );

        // Process queued requests with the new token
        processQueue(null, access);

        // Retry the failed request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Clear tokens and redirect to login
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }

  // (error) => {
  //   if (error.response) {
  //     // Handle different HTTP status codes
  //     if (error.response.status === 401) {
  //       console.log("Unauthorized! Redirecting to login...");
  //       // Logout user or redirect to login page
  //     } else if (error.response.status === 403) {
  //       console.log("Forbidden! You don't have access.");
  //     } else if (error.response.status === 500) {
  //       console.log("Server error! Please try again later.");
  //     }
  //   } else if (error.request) {
  //     console.log("No response received from the server.");
  //   } else {
  //     console.log("Request setup error:", error.message);
  //   }
  //   return Promise.reject(error);
  // }
);

export default api;
