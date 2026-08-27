import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/types";

type ProductParams = {
  search?: string;
  isFeatured?: boolean;
  limit?: number;
  [key: string]: string | boolean | number | undefined;
};

type ProductsResponse = {
  products?: Product[];
  items?: Product[];
  total?: number;
  limit?: number;
  offset?: number;
};

export const useFetchFilteredProduct = (params: ProductParams) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await api.get<ProductsResponse>("/v1/products", { params });
      const data = response.data;
      return {
        ...data,
        products: data.products ?? data.items ?? [],
      };
    },
  });
};
