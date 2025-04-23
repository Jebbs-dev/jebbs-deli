import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const useFetchUserInformation = (userId: string) => {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    },
  });
};
