import api from "@/utils/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type ProductParams = {
  search?: string;
  isFeatured?: boolean;
  limit?: number;
  [key: string]: string | boolean | number | undefined;
};

export const useFetchFilteredProduct = (params: ProductParams) => {
  return useQuery({
    queryKey: ["products", params], // 👈 include params in the key!
    queryFn: async () => {
      const response = await api.get("/products", { params });
      return response.data;
    },
    // keepPreviousData: true, // optional: smooth transitions
  });
};
