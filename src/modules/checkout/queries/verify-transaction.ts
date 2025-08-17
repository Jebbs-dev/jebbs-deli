import useAuthStore from "@/store/auth";
import api from "@/utils/api";
import { skipToken, useQuery } from "@tanstack/react-query";

export const useVerifyTransaction = (reference: string) => {
  const { isLoggedIn } = useAuthStore();

  return useQuery({
    queryKey: ["payment", reference],
    queryFn: isLoggedIn
      ? async () => {
          const response = await api.get(`/payment/verify/${reference}`);
          return response.data;
        }
      : skipToken,
    enabled: !!reference,
    refetchInterval: (query) => {
      const status = query.state.data?.status;

      return status && (status === "success" || status === "failed")
        ? false
        : 5000;
    },
  });
};
