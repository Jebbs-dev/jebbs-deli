import { Address, Cart, User } from "@/types/types";
import api from "@/utils/api";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import useAuthStore from "@/store/auth";

export const useAddAddress = () => {
  const navigate = useNavigate();
  const queryClient =  useQueryClient()


  return useMutation({
    mutationFn: async (address: Omit<Address, "id">) => {
      const response = await api.post(`/users/address`, address);
      return response.data;
    },
    onSuccess: (data) => {
      if (data) {
        // Store tokens in localStorage
        navigate({ to: "/shop" });
        queryClient.invalidateQueries({queryKey: ["users"]})

        // Move the cart handling logic here
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};
