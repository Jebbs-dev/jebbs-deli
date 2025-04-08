import { Cart, User } from "@/types/types";
import api from "@/utils/api";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth";

export const useLoginUser = () => {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);


  return useMutation({
    mutationFn: async (user: Omit<User, "id" | "name" | "role">) => {
      const response = await api.post("/auth/login", user);
      return response.data;
    },
    onSuccess: (data) => {
      if (data) {
        // Store tokens in localStorage
        localStorage.setItem("userInfo", JSON.stringify(data));
        // Update auth store with user data
        login(data.user);
        router.push("/shop");

        // Move the cart handling logic here
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};
