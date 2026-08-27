import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "@/utils/api";

export const useFetchVendorStoreById = (storeId: string) => {
  return useQuery({
    queryKey: ["vendors", storeId],
    queryFn: async () => {
      const response = await api.get(`/v1/stores/${storeId}`);
      return response.data;
    },
  });
};
