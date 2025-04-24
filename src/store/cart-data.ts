// store/cartView.ts
import { create } from "zustand";
import useCartStore, { CartItemProps } from "@/store/cart";
import {
  StoreTotal,
  FetchedCartData,
  CartStoreGroup,
} from "@/modules/shop/cart/components/cart-sheet"; // Adjust paths
import { User } from "@/types/types";

interface CartViewState {
  isOpen: boolean;
  toggleCartView: "cart" | "checkout";
  toggleCheckoutView: "order" | "payment";
  openStoreId: string | null;
  typedCartData?: FetchedCartData;
  cartItemsToUse: CartItemProps[];
  storeTotals: StoreTotal[];
  cartTotal: number;

  setIsOpen: (open: boolean) => void;
  setToggleCartView: (view: "cart" | "checkout") => void;
  setToggleCheckoutView: (view: "order" | "payment") => void;
  setOpenStoreId: (storeId: string | null) => void;
  initializeCartData: (
    data: FetchedCartData | undefined,
    localItems: CartItemProps[],
    isLoggedIn: boolean
  ) => void;
  handleClearVendorItems: (
    storeId: string,
    isLoggedIn: boolean,
    userId: string,
    updateCart: Function,
    clearVendorItems: (storeId: string) => void
  ) => Promise<void>;
  // handleClearVendorItems: (storeId: string) => void
}

export const useCartViewStore = create<CartViewState>((set, get) => ({
  isOpen: false,
  toggleCartView: "cart",
  toggleCheckoutView: "order",
  openStoreId: null,
  typedCartData: undefined,
  cartItemsToUse: [],
  storeTotals: [],
  cartTotal: 0,

  setIsOpen: (open) => set({ isOpen: open }),
  setToggleCartView: (view) => set({ toggleCartView: view }),
  setToggleCheckoutView: (view) => set({ toggleCheckoutView: view }),
  setOpenStoreId: (storeId) => set({ openStoreId: storeId }),

  initializeCartData: (typedCartData, localItems, isLoggedIn) => {
    const fetchedCartItems: CartItemProps[] =
      typedCartData?.cartGroups?.flatMap((group) =>
        group.cartItems.map((item) => {
          const store = {
            ...group.store,
            email: "",
            telephone: "",
            address: "",
            logo: "",
            isActive: true,
            slug: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          return {
            ...item.product,
            quantity: item.quantity,
            store,
            storeId: group.storeId,
            cartId: typedCartData.id,
          } as unknown as CartItemProps;
        })
      ) ?? [];

    const cartItemsToUse = isLoggedIn ? fetchedCartItems : localItems;

    const groupedByVendorStore = cartItemsToUse.reduce<
      Record<string, CartItemProps[]>
    >((acc, product) => {
      const storeId = product.store?.id || "unknown";
      if (!acc[storeId]) acc[storeId] = [];
      acc[storeId].push(product);
      return acc;
    }, {});

    const storeTotals: StoreTotal[] = Object.entries(groupedByVendorStore).map(
      ([storeId, products]) => ({
        storeId,
        vendorStoreName: products[0]?.store?.name || "Unknown Vendor",
        totalQuantity: products.reduce((sum, p) => sum + p.quantity, 0),
        totalAmount: products.reduce((sum, p) => sum + p.price * p.quantity, 0),
        billboard: products[0]?.store?.billboard,
        products,
      })
    );

    const cartTotal = storeTotals.reduce(
      (sum, store) => sum + store.totalAmount,
      0
    );

    set({
      typedCartData,
      cartItemsToUse,
      storeTotals,
      cartTotal,
    });
  },

  // Add this inside create<CartViewState>
  handleClearVendorItems: async (
    storeId: string,
    isLoggedIn: boolean,
    userId: string,
    updateCart: Function,
    clearVendorItems: (storeId: string) => void
  ) => {
    const state = get();

    if (isLoggedIn && userId && state.typedCartData?.id) {
      try {
        const cartData = state.typedCartData;

        const remainingGroups = cartData.cartGroups.filter(
          (group: CartStoreGroup) => group.storeId !== storeId
        );

        const allCartItems = remainingGroups.flatMap((group: CartStoreGroup) =>
          group.cartItems.map((item) => ({
            id: item.product.id,
            productId: item.product.id,
            quantity: item.quantity,
            storeId: group.storeId,
          }))
        );

        const newTotalPrice = allCartItems.reduce((sum: any, item: any) => {
          const product = cartData.cartGroups
            .flatMap((g: any) => g.cartItems)
            .find((ci: any) => ci.product.id === item.id)?.product;

          return sum + (product?.price || 0) * item.quantity;
        }, 0);

        const result = await updateCart({
          cartId: cartData.id,
          userId: userId,
          cartItems: allCartItems,
          totalPrice: newTotalPrice,
        });

        // Re-initialize the store with updated groups
        const updatedCartData = {
          ...cartData,
          cartGroups: remainingGroups,
          totalPrice: newTotalPrice,
        };

        // Reuse your cart initializer logic
        state.initializeCartData(
          updatedCartData,
          state.cartItemsToUse,
          isLoggedIn
        );

        console.log("Vendor items cleared:", result);
      } catch (error) {
        console.error("Failed to clear vendor items:", error);
      }
    } else {
      clearVendorItems(storeId); // For guest users
    }
  },
}));
