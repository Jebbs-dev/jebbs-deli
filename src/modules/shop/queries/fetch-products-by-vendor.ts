import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";

export const useFetchProductsByVendor = (vendorId: string) => {
  return useQuery({
    queryKey: ["products", "vendor", vendorId],
    queryFn: async () => {
      const response = await api.get(`/products/vendor/${vendorId}`);
      return response.data;
    },
  });
}; 