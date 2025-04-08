import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "@/utils/api";

export const useFetchVendorById = (vendorId: string) => {
  return useQuery({
    queryKey: ["vendors", vendorId],
    queryFn: async () => {
      const response = await api.get(`/vendors/${vendorId}`);
      return response.data;
    },
  });
};
