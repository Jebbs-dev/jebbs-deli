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
    let cleanup: (() => void) | undefined;

    // Same as before: only refresh when the user is logged in.
    // Tokens live in httpOnly cookies now instead of localStorage.
    if (isLoggedIn) {
      cleanup = setupSilentRefresh();
    }

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [isLoggedIn]);

  return <>{children}</>;
};

export default TokenRefreshProvider;
