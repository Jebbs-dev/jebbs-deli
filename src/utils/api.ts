import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Helper function to check if token is about to expire
const isTokenExpiringSoon = (token: string, thresholdMinutes = 30): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) return false;
    
    // Calculate when the token will expire (in milliseconds)
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;
    
    // Convert threshold to milliseconds
    const thresholdMs = thresholdMinutes * 60 * 1000;
    
    // Return true if token will expire within the threshold time
    return timeUntilExpiration <= thresholdMs;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

// Function to refresh the token
const refreshAuthToken = async () => {
  try {
    let userInfo: any = {};
    if (localStorage.getItem("userInfo")) {
      userInfo = JSON.parse(localStorage.getItem("userInfo")!);
    }
    
    if (!userInfo?.refreshToken) {
      throw new Error("No refresh token available");
    }

    const refreshResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh`,
      { refreshToken: userInfo.refreshToken }
    );

    const { accessToken, refreshToken } = refreshResponse.data;

    // Update the tokens in localStorage
    localStorage.setItem(
      "userInfo",
      JSON.stringify({ ...userInfo, accessToken, refreshToken })
    );

    return accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    localStorage.removeItem("userInfo");
    throw error;
  }
};

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
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
  async (config) => {
    let userInfo = null;
    try {
      const userInfoStr = localStorage.getItem("userInfo");
      if (userInfoStr) {
        userInfo = JSON.parse(userInfoStr);
      }
    } catch (error) {
      console.error("Error parsing userInfo:", error);
    }

    if (userInfo?.accessToken) {
      // Check if token is about to expire and refresh it proactively
      // For API requests, refresh if token expires within 30 minutes
      if (isTokenExpiringSoon(userInfo.accessToken, 30) && !isRefreshing) {
        try {
          isRefreshing = true;
          const newToken = await refreshAuthToken();
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (error) {
          console.error("Proactive token refresh failed:", error);
        } finally {
          isRefreshing = false;
        }
      } else {
        config.headers.Authorization = `Bearer ${userInfo.accessToken}`;
      }
    }

    // Dynamically set Content-Type based on the request data
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
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
        // Use the refreshAuthToken function we created
        const newAccessToken = await refreshAuthToken();
        
        // Process queued requests with the new token
        processQueue(null, newAccessToken);

        // Retry the failed request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
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

/**
 * Sets up a periodic token refresh check to keep the session alive
 * Call this function when your application initializes (e.g., in _app.js/app.js)
 */
export const setupSilentRefresh = () => {
  // Check for token refresh need on startup
  const checkAndRefreshToken = async () => {
    try {
      const userInfoStr = localStorage.getItem("userInfo");
      if (!userInfoStr) return;
      
      const userInfo = JSON.parse(userInfoStr);
      if (!userInfo?.accessToken) return;
      
      // If token is going to expire in the next 2 hours, refresh it
      if (isTokenExpiringSoon(userInfo.accessToken, 120) && !isRefreshing) {
        console.log("Silent token refresh initiated");
        await refreshAuthToken();
      }
    } catch (error) {
      console.error("Silent token refresh failed:", error);
    }
  };

  // Immediately check if we need to refresh - delay slightly to ensure the browser has fully loaded
  setTimeout(() => {
    checkAndRefreshToken();
  }, 1000);
  
  // Set up periodic checking (every 1 hour)
  const refreshInterval = setInterval(checkAndRefreshToken, 60 * 60 * 1000);
  
  // Clean up interval when needed
  return () => clearInterval(refreshInterval);
};
