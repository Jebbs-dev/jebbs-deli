import { useToast } from "@/hooks/use-toast";
import { useUpdateCart } from "@/modules/shop/cart/mutations/update-cart";
import { useFetchCart } from "@/modules/shop/cart/queries/fetch-cart";
import useAuthStore from "@/store/auth";
import useCartStore from "@/store/cart";
import { Product } from "@/types/types";

type CartGroupLike = {
  storeId: string;
  store?: Product["store"];
  cartItems: Array<{
    quantity: number;
    product: Product;
  }>;
};

type CartDataLike = {
  id: string;
  cartGroups?: CartGroupLike[];
};

export function useAddProductToCart() {
  const { toast } = useToast();
  const { isLoggedIn, user } = useAuthStore();
  const { addItem } = useCartStore();
  const { mutateAsync: updateCart, isPending } = useUpdateCart();
  const { data: cartData } = useFetchCart(user?.id ? String(user.id) : "");

  const addProductToCart = async (product: Product) => {
    const productWithStore = {
      ...product,
      storeId: product.storeId ?? product.store?.id,
    };

    if (isLoggedIn && user?.id && cartData) {
      try {
        const typedCart = cartData as CartDataLike;
        const existingCartItems = typedCart.cartGroups
          ? typedCart.cartGroups.flatMap((group) =>
              group.cartItems.map((item) => ({
                ...item.product,
                quantity: item.quantity,
                store: group.store,
                storeId: group.storeId,
              }))
            )
          : [];

        const existingItemIndex = existingCartItems.findIndex(
          (item) => item.id === productWithStore.id
        );

        let updatedCartItems;

        if (existingItemIndex !== -1) {
          updatedCartItems = [...existingCartItems];
          updatedCartItems[existingItemIndex] = {
            ...updatedCartItems[existingItemIndex],
            quantity: updatedCartItems[existingItemIndex].quantity + 1,
          };
        } else {
          updatedCartItems = [
            ...existingCartItems,
            {
              ...productWithStore,
              quantity: 1,
              storeId: productWithStore.storeId,
            },
          ];
        }

        const newTotalPrice = updatedCartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        await updateCart({
          cartId: typedCart.id,
          userId: user.id,
          cartItems: updatedCartItems,
          totalPrice: newTotalPrice,
        });

        toast({
          description: `${product.name} added to cart!`,
        });
      } catch (error) {
        console.error("Failed to add to cart:", error);
        toast({
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
        });
      }
      return;
    }

    addItem(productWithStore);
    toast({
      description: `${product.name} added to cart!`,
    });
  };

  return { addProductToCart, isPending };
}
