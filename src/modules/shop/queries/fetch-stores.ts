import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { Product, Vendor } from "@/types/types";

export type StoreListItem = Vendor & {
  deliveryFee?: string | number;
  products?: Product[];
};

type StoresResponse = {
  items?: StoreListItem[];
  stores?: StoreListItem[];
  total?: number;
  limit?: number;
  offset?: number;
};

type StoreParams = {
  search?: string;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
};

export const useFetchStores = (params: StoreParams = {}) => {
  return useQuery({
    queryKey: ["stores", params],
    queryFn: async () => {
      const response = await api.get<StoresResponse>("/store", { params });
      const data = response.data;
      return {
        ...data,
        stores: data.stores ?? data.items ?? [],
      };
    },
  });
};
