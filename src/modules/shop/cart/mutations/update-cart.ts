import { Cart } from "@/types/types";
import api from "@/utils/api";
import { CartItemProps } from "@/store/cart";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/auth";

// Define a simpler type for cart items that match what the backend expects
interface SimpleCartItem {
  id: string;
  quantity: number;
  storeId: string;
  productId?: string;
}

export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (data: {
      cartItems: (CartItemProps | SimpleCartItem)[];
      totalPrice: number;
      userId: string;
      cartId?: string;
    }) => {
      // Format cart items to ensure each has a storeId and proper format
      const formattedCartItems = data.cartItems.map((item) => {
        // Ensure storeId is present
        const storeId =
          item.storeId || (item as CartItemProps).store?.id || "unknown";

        // Return a properly formatted item
        return {
          id: item.id,
          quantity: item.quantity,
          storeId,
          productId: item.id, // Ensure productId is included
        };
      });

      console.log("Formatted cart items for update:", formattedCartItems);

      // If we have a cartId, update existing cart, otherwise add new cart
      if (data.cartId) {
        console.log(
          `Updating cart ${data.cartId} with ${formattedCartItems.length} items`
        );

        const payload = {
          cartData: { totalPrice: data.totalPrice },
          cartItems: formattedCartItems,
        };

        // Use PUT for complete replacement of cart items
        const response = await api.put(`/cart/${data.cartId}`, payload);
        console.log("Cart update response:", response.data);
        return response.data;
      } else {
        const payload = {
          userId: data.userId,
          totalPrice: data.totalPrice,
          cartItems: formattedCartItems,
        };

        console.log("Creating new cart with items:", formattedCartItems);
        const response = await api.post("/cart", payload);
        console.log("Cart creation response:", response.data);
        return response.data;
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate cart query to refetch updated cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Failed to update cart:", error);
    },
  });
};

// Add a new mutation for removing items
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      cartId: string;
      userId: string;
      cartItems: (CartItemProps | SimpleCartItem)[];
      totalPrice: number;
    }) => {
      // Format cart items to ensure each has a storeId
      const formattedCartItems = data.cartItems.map((item) => {
        // Ensure storeId is present
        const storeId =
          item.storeId || (item as CartItemProps).store?.id || "unknown";

        // Return a properly formatted item
        return {
          id: item.id,
          quantity: item.quantity,
          storeId,
          productId: item.id, // Ensure productId is included
        };
      });

      console.log("Removing items, remaining items:", formattedCartItems);

      const payload = {
        cartData: { totalPrice: data.totalPrice },
        cartItems: formattedCartItems,
      };

      console.log(`Updating cart ${data.cartId} after removal`);
      const response = await api.put(`/cart/${data.cartId}`, payload);
      console.log("Cart removal response:", response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate cart query to refetch updated cart data
      queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });
    },
    onError: (error) => {
      console.error("Failed to remove from cart:", error);
    },
  });
};
