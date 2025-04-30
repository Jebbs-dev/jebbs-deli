import useAuthStore from "@/store/auth";
import api from "@/utils/api";
import { skipToken, useQuery } from "@tanstack/react-query";

export const useFetchUserInformation = (userId: string) => {
  const { isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: ["users", userId],
    queryFn: isLoggedIn
      ? async () => {
          const response = await api.get(`/users/${userId}`);
          return response.data;
        }
      : skipToken,
  });
};
