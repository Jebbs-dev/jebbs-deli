import api from "@/utils/api";
import { CartItemProps } from "@/store/cart";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/auth";

interface SimpleCartItem {
  id: string;
  quantity: number;
  storeId: string;
  productId?: string;
}

type UpdateCartInput = {
  cartItems: (CartItemProps | SimpleCartItem)[];
  totalPrice: number;
  userId: string;
  cartId?: string;
};

/** Full cart replace — use only for clear-all / clear-vendor. Prefer useUpsertCartItem for qty. */
export const useUpdateCart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const cartKey = ["cart", user?.id] as const;

  return useMutation({
    mutationFn: async (data: UpdateCartInput) => {
      const formattedCartItems = data.cartItems.map((item) => {
        const storeId =
          item.storeId || (item as CartItemProps).store?.id || "unknown";
        return {
          productId: (item as SimpleCartItem).productId || item.id,
          quantity: item.quantity,
          storeId,
        };
      });

      if (data.cartId) {
        const response = await api.put(`/v1/cart/${data.cartId}`, {
          cartData: { totalPrice: data.totalPrice },
          cartItems: formattedCartItems,
        });
        return response.data;
      }

      const response = await api.post("/v1/cart", {
        userId: data.userId,
        totalPrice: data.totalPrice,
        cartItems: formattedCartItems,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (user?.id) {
        queryClient.setQueryData(cartKey, data);
      }
    },
  });
};
