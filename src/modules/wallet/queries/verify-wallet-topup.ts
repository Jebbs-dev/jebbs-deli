import useAuthStore from "@/store/auth";
import api from "@/utils/api";
import { skipToken, useQuery } from "@tanstack/react-query";
import type { WalletTopupVerifyResponse } from "../types";

export const useVerifyWalletTopup = (reference?: string) => {
  const { isLoggedIn } = useAuthStore();

  return useQuery({
    queryKey: ["wallet", "topup", "verify", reference],
    queryFn:
      isLoggedIn && reference
        ? async () => {
            const response = await api.get<WalletTopupVerifyResponse>(
              `/wallet/topup/verify/${reference}`
            );
            return response.data;
          }
        : skipToken,
    enabled: Boolean(isLoggedIn && reference),
    retry: false,
  });
};
