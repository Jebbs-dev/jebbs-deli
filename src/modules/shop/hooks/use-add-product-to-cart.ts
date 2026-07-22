import { useToast } from "@/hooks/use-toast";
import { useUpsertCartItem } from "@/modules/shop/cart/mutations/upsert-cart-item";
import useAuthStore from "@/store/auth";
import useCartStore from "@/store/cart";
import { Product } from "@/types/types";

export function useAddProductToCart() {
  const { toast } = useToast();
  const { isLoggedIn, user } = useAuthStore();
  const { addItem } = useCartStore();
  const { mutateAsync: upsertItem, isPending } = useUpsertCartItem();

  const addProductToCart = async (product: Product) => {
    const storeId = product.storeId ?? product.store?.id;
    if (!storeId) {
      toast({
        description: "Product is missing store information.",
        variant: "destructive",
      });
      return;
    }

    if (isLoggedIn && user?.id) {
      try {
        await upsertItem({
          productId: product.id,
          storeId,
          delta: 1,
          product: { ...product, storeId },
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

    addItem({ ...product, storeId });
    toast({
      description: `${product.name} added to cart!`,
    });
  };

  return { addProductToCart, isPending };
}
