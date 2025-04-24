import { Address, Cart, User } from "@/types/types";
import api from "@/utils/api";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth";

export const useAddAddress = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (address: Omit<Address, "id">) => {
      const response = await api.post(`/users/address`, address);
      return response.data;
    },
    onSuccess: (data) => {
      if (data) {
        // Store tokens in localStorage
        router.push("/shop");

        // Move the cart handling logic here
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};
