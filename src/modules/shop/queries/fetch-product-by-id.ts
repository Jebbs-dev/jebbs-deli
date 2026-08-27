import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const useFetchProductById = (productId: string) => {
  return useQuery({
    queryKey: ["products", productId],
    queryFn: async () => {
      const response = await api.get(`/v1/products/${productId}`);
      return response.data;
    },
  });
};
