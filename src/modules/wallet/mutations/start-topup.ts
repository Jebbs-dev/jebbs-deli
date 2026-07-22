import api from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { WalletTopupResponse } from "../types";

export const useStartWalletTopup = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { amount: number; callback_url?: string }) => {
      // Paystack init + Railway DB often exceeds the default 10s axios timeout.
      const response = await api.post<WalletTopupResponse>(
        "/wallet/topup",
        data,
        { timeout: 60_000 }
      );
      return response.data;
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to start wallet top-up";
      toast({
        variant: "destructive",
        title: "Top-up failed",
        description: message,
      });
    },
  });
};
