"use client";

interface TokenRefreshProviderProps {
  children: React.ReactNode;
}

/**
 * Refresh is handled by the axios 401 interceptor (cookie-based).
 * Kept as a pass-through so existing provider wiring does not break.
 */
const TokenRefreshProvider = ({ children }: TokenRefreshProviderProps) => {
  return <>{children}</>;
};

export default TokenRefreshProvider;
