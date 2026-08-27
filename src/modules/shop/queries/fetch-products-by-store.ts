import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import { Product } from "@/types/types";

type ProductsResponse = {
  items?: Product[];
  total?: number;
  limit?: number;
  offset?: number;
};

export const useFetchProductsByStore = (storeId: string) => {
  return useQuery({
    queryKey: ["products", "store", storeId],
    queryFn: async () => {
      const response = await api.get<ProductsResponse>(
        `/v1/stores/${storeId}/products`,
        { params: { limit: 100, available: true } }
      );
      return response.data;
    },
    enabled: Boolean(storeId),
  });
};
