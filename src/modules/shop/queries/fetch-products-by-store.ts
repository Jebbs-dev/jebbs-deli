import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";

export const useFetchProductsByStore = (storeId: string) => {
  return useQuery({
    queryKey: ["products", "vendor", storeId],
    queryFn: async () => {
      const response = await api.get(`/products/store/${storeId}`);
      return response.data;
    },
  });
}; 