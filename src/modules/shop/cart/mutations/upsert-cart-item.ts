import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/auth";
import type { Product } from "@/types/types";

type UpsertCartItemInput = {
  productId: string;
  storeId: string;
  /** Absolute quantity. Prefer `delta` for +/- clicks. */
  quantity?: number;
  /** Relative change applied to the latest cached qty. */
  delta?: number;
  /** Used only for optimistic UI when adding a product not yet in the cart */
  product?: Product;
};

type AbsoluteUpsert = {
  productId: string;
  storeId: string;
  quantity: number;
  product?: Product;
};

type CartCache = {
  id: string;
  totalPrice?: number | string;
  cartGroups: Array<{
    id: string;
    storeId: string;
    store?: unknown;
    cartItems: Array<{
      id?: string;
      quantity: number;
      product: Product;
    }>;
  }>;
};

function currentQty(
  cart: CartCache | undefined,
  productId: string,
  storeId: string
) {
  const group = cart?.cartGroups?.find((g) => g.storeId === storeId);
  return (
    group?.cartItems.find((item) => item.product.id === productId)?.quantity ??
    0
  );
}

function toAbsolute(
  cart: CartCache | undefined,
  input: UpsertCartItemInput
): AbsoluteUpsert {
  const quantity =
    typeof input.quantity === "number"
      ? Math.max(0, input.quantity)
      : Math.max(
          0,
          currentQty(cart, input.productId, input.storeId) + (input.delta ?? 0)
        );

  return {
    productId: input.productId,
    storeId: input.storeId,
    quantity,
    product: input.product,
  };
}

function patchCartItem(cart: CartCache, input: AbsoluteUpsert): CartCache {
  const groups = cart.cartGroups.map((group) => ({
    ...group,
    cartItems: group.cartItems.map((item) => ({ ...item })),
  }));

  let group = groups.find((g) => g.storeId === input.storeId);

  if (input.quantity <= 0) {
    if (!group) return cart;
    group.cartItems = group.cartItems.filter(
      (item) => item.product.id !== input.productId
    );
    return {
      ...cart,
      cartGroups: groups.filter((g) => g.cartItems.length > 0),
    };
  }

  if (!group) {
    group = {
      id: `optimistic-${input.storeId}`,
      storeId: input.storeId,
      store: input.product?.store,
      cartItems: [],
    };
    groups.push(group);
  }

  const existing = group.cartItems.find(
    (item) => item.product.id === input.productId
  );
  if (existing) {
    existing.quantity = input.quantity;
  } else if (input.product) {
    group.cartItems.push({
      id: `optimistic-${input.productId}`,
      quantity: input.quantity,
      product: input.product,
    });
  }

  return { ...cart, cartGroups: groups };
}

export const useUpsertCartItem = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const cartKey = ["cart", user?.id] as const;

  const mutation = useMutation({
    scope: { id: `cart-upsert-${user?.id ?? "guest"}` },
    mutationFn: async (data: AbsoluteUpsert) => {
      const response = await api.patch("/v1/cart/items", {
        productId: data.productId,
        storeId: data.storeId,
        quantity: data.quantity,
      });
      return response.data as CartCache;
    },
    onMutate: async (data) => {
      if (!user?.id) return;
      await queryClient.cancelQueries({ queryKey: cartKey });
      const previous = queryClient.getQueryData<CartCache>(cartKey);
      if (previous) {
        queryClient.setQueryData(cartKey, patchCartItem(previous, data));
      } else if (data.product && data.quantity > 0) {
        queryClient.setQueryData(cartKey, {
          id: "optimistic-cart",
          cartGroups: [
            {
              id: `optimistic-${data.storeId}`,
              storeId: data.storeId,
              store: data.product.store,
              cartItems: [
                {
                  id: `optimistic-${data.productId}`,
                  quantity: data.quantity,
                  product: data.product,
                },
              ],
            },
          ],
        } satisfies CartCache);
      }
      return { previous };
    },
    onError: (_err, _data, context) => {
      if (context?.previous && user?.id) {
        queryClient.setQueryData(cartKey, context.previous);
      }
    },
    onSuccess: (data) => {
      if (user?.id) {
        queryClient.setQueryData(cartKey, data);
      }
    },
  });

  const resolve = (input: UpsertCartItemInput): AbsoluteUpsert => {
    const cached = queryClient.getQueryData<CartCache>(cartKey);
    return toAbsolute(cached, input);
  };

  return {
    ...mutation,
    mutate: (
      input: UpsertCartItemInput,
      opts?: Parameters<typeof mutation.mutate>[1]
    ) => mutation.mutate(resolve(input), opts),
    mutateAsync: (
      input: UpsertCartItemInput,
      opts?: Parameters<typeof mutation.mutateAsync>[1]
    ) => mutation.mutateAsync(resolve(input), opts),
  };
};
