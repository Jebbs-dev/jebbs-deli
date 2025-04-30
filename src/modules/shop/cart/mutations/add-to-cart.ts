import { Cart } from "@/types/types";
import api from "@/utils/api";
import { CartItemProps } from "@/store/cart";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      cartItems: CartItemProps[];
      totalPrice: number;
      userId: string;
    }) => {
      const response = await api.post("/cart", data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      const userInfoStr = localStorage.getItem("userInfo");
      if (userInfoStr) {
        // User is signed in, clear the cart from local storage
        localStorage.removeItem("cart");
        queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });
      }
    },
    onError: (error) => {
      console.error("Failed to add cart:", error);
    },
  });
};
