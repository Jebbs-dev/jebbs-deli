import { User } from "@/types/types";
import api from "@/utils/api";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/auth";
import { useAuthFormModal } from "@/store/auth-form-modal";
import { useCartViewStore } from "@/store/cart-data";

export const useLoginUser = () => {
  const login = useAuthStore((state) => state.login);
  const { onAuthFormClose } = useAuthFormModal();
  const { setIsOpen } = useCartViewStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Omit<User, "id" | "name" | "role">) => {
      const response = await api.post("/auth/login", user);
      return response.data;
    },
    onSuccess: (data) => {
      if (data) {
        login(data.user);
        onAuthFormClose();
        setIsOpen(true);
        queryClient.invalidateQueries({ queryKey: ["cart", data.user?.id] });
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};
