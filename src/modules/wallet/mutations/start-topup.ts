import api from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { WalletTopupResponse } from "../types";

export const useStartWalletTopup = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { amount: number; callback_url?: string }) => {
      const response = await api.post<WalletTopupResponse>(
        "/wallet/topup",
        data
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
