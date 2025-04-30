import useAuthStore from "@/store/auth";
import api from "@/utils/api";
import { skipToken, useQuery } from "@tanstack/react-query";

export const useFetchOrders = (userId: string) => {
  const { isLoggedIn } = useAuthStore();

  return useQuery({
    queryKey: ["orders", userId],
    queryFn: isLoggedIn
      ? async () => {
          const response = await api.get(`/orders/${userId}`);
          return response.data;
        }
      : skipToken,
  });
};
