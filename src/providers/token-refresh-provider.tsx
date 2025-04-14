"use client";

import { useEffect } from "react";
import { setupSilentRefresh } from "@/utils/api";
import useAuthStore from "@/store/auth";

interface TokenRefreshProviderProps {
  children: React.ReactNode;
}

const TokenRefreshProvider = ({ children }: TokenRefreshProviderProps) => {
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    let cleanup: () => void | undefined;
    
    // Check if we have tokens in localStorage, regardless of auth state
    const userInfoStr = localStorage.getItem("userInfo");
    const hasTokens = userInfoStr && JSON.parse(userInfoStr)?.accessToken;
    
    // Set up token refresh if user is logged in OR we have tokens
    if (isLoggedIn || hasTokens) {
      cleanup = setupSilentRefresh();
      console.log("Token refresh service initialized");
    }
    
    // Clean up on unmount or when login state changes
    return () => {
      if (cleanup) {
        cleanup();
        console.log("Token refresh service stopped");
      }
    };
  }, [isLoggedIn]);

  return <>{children}</>;
};

export default TokenRefreshProvider; 