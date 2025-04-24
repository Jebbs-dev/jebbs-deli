import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const useFetchOrders = (userId: string) => {
  return useQuery({
    queryKey: ["orders", userId],
    queryFn: async () => {
      const response = await api.get(`/orders/${userId}`);
      return response.data;
    },
  });
};