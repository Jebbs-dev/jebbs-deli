import { Cart, User } from "@/types/types";
import api from "@/utils/api";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import useAuthStore from "@/store/auth";

export const useUpdateUser = (userId: string) => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const queryClient =  useQueryClient()


  return useMutation({
    mutationFn: async (user: Partial<User>) => {
      const response = await api.patch(`/users/${userId}`, user);
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
