import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const useFetchCart = (userId: string) => {
  return useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const response = await api.get(`/cart/${userId}`);
      return response.data;
    },
  });
};