import api from "@/utils/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type ProductParams = {
  name?: string;
  isFeatured?: boolean;
  [key: string]: string | boolean | undefined;
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
