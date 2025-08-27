import useAuthStore from "@/store/auth";
import api from "@/utils/api";
import { skipToken, useQuery } from "@tanstack/react-query";

export const useFetchCart = (userId: string) => {
  const { isLoggedIn, user } = useAuthStore();

  return useQuery({
    queryKey: ["cart", user?.id],
    queryFn: isLoggedIn
      ? async () => {
          const response = await api.get(`/cart/${userId}`);
          return response.data;
        }
      : skipToken,
  });
};
