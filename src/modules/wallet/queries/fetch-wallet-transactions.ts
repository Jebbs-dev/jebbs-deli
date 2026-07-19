import useAuthStore from "@/store/auth";
import api from "@/utils/api";
import { skipToken, useQuery } from "@tanstack/react-query";
import type { WalletTransactionsResponse } from "../types";

export const useFetchWalletTransactions = (offset = 0, limit = 20) => {
  const { isLoggedIn } = useAuthStore();

  return useQuery({
    queryKey: ["wallet", "transactions", offset, limit],
    queryFn: isLoggedIn
      ? async () => {
          const response = await api.get<WalletTransactionsResponse>(
            "/wallet/transactions",
            { params: { offset, limit } }
          );
          return response.data;
        }
      : skipToken,
  });
};
