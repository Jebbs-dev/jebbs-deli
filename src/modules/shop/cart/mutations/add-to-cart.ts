import api from "@/utils/api";
import { CartItemProps } from "@/store/cart";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/auth";

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      cartItems: Array<
        | CartItemProps
        | { productId: string; quantity: number; storeId: string }
      >;
      totalPrice: number;
      userId: string;
    }) => {
      const response = await api.post("/v1/cart", data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      // Same as before: only invalidate after a signed-in sync.
      // Local `jebbs-cart-storage` is cleared by CartSheet after a successful sync.
      if (useAuthStore.getState().isLoggedIn) {
        queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });
      }
    },
    onError: (error) => {
      console.error("Failed to add cart:", error);
    },
  });
};
