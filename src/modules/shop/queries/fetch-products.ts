import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";

export const useFetchProduct = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get("/v1/products");
      return response.data;
    },
  });
};
