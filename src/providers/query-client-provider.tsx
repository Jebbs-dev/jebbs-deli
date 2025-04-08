"use client";

interface ProviderProps {
  children: React.ReactNode;
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const QueryProvider: React.FC<ProviderProps> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};