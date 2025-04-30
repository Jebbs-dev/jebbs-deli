import { Cart, User } from "@/types/types";
import api from "@/utils/api";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth";

export const useLoginUser = () => {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const queryClient = useQueryClient();


  return useMutation({
    mutationFn: async (user: Omit<User, "id" | "name" | "role">) => {
      const response = await api.post("/auth/login", user);
      return response.data;
    },
    onSuccess: (data) => {
      if (data) {

        localStorage.setItem("userInfo", JSON.stringify(data));
        login(data.user);

        queryClient.invalidateQueries({ queryKey: ["cart", data.user?.id] });
        // Move the cart handling logic here
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};
