import { Address } from "@/types/types";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (address: Omit<Address, "id">) => {
      const response = await api.post(`/users/address`, address);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Failed to add address:", error);
    },
  });
};
