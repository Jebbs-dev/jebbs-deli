import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";

export const useFetchProduct = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get("/products");
      return response.data;
    },
  });
};
