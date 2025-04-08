
import { Cart } from "@/types/types";
import api from "@/utils/api";

import { useMutation } from "@tanstack/react-query";

export const useAddToCart = () => {
  return useMutation({
    mutationFn: async (
      cartItem: Omit<
        Cart,
        "createdAt" | "updatedAt" | "vendor" | "vendorId" | "id" 
      >
    ) => {
      const response = await api.post("/cart", cartItem);
      return response.data;
    },
    onSuccess: (data) => {
      const userInfoStr = localStorage.getItem("userInfo");
      if (userInfoStr) {
        // User is signed in, clear the cart from local storage
        localStorage.removeItem("cart");
      }
    },
    onError: (error) => {
      console.error("Failed to add cart:", error);
    },
  });
};
