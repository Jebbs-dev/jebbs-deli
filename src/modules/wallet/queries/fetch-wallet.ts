import useAuthStore from "@/store/auth";
import api from "@/utils/api";
import { skipToken, useQuery } from "@tanstack/react-query";
import type { Wallet } from "../types";

export const useFetchWallet = () => {
  const { isLoggedIn } = useAuthStore();

  return useQuery({
    queryKey: ["wallet"],
    queryFn: isLoggedIn
      ? async () => {
          const response = await api.get<Wallet>("/wallet");
          return response.data;
        }
      : skipToken,
  });
};
