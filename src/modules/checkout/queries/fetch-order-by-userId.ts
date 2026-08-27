import useAuthStore from "@/store/auth";
import api from "@/utils/api";
import { skipToken, useQuery } from "@tanstack/react-query";

const ACTIVE = new Set([
  "pending",
  "paid",
  "confirmed",
  "preparing",
  "ready",
  "picked_up",
  "in_transit",
]);

export const useFetchOrders = (userId: string) => {
  const { isLoggedIn } = useAuthStore();

  return useQuery({
    queryKey: ["orders", userId],
    queryFn: isLoggedIn
      ? async () => {
          const response = await api.get(`/v1/orders/me`);
          return response.data;
        }
      : skipToken,
    refetchInterval: (query) => {
      const items = (query.state.data?.items ?? []) as Array<{ status?: string }>;
      const hasActive = items.some((o) => o.status && ACTIVE.has(o.status));
      return hasActive ? 8000 : false;
    },
  });
};

export const useFetchOrderById = (orderId?: string) => {
  const { isLoggedIn } = useAuthStore();

  return useQuery({
    queryKey: ["order", orderId],
    queryFn:
      isLoggedIn && orderId
        ? async () => {
            const response = await api.get(`/v1/orders/${orderId}`);
            return response.data;
          }
        : skipToken,
    enabled: !!orderId && isLoggedIn,
    refetchInterval: (query) => {
      const status = query.state.data?.status as string | undefined;
      return status && ACTIVE.has(status) ? 5000 : false;
    },
  });
};
