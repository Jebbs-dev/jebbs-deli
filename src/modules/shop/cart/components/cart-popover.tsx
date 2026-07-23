import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ShoppingBag } from "@/components/icons";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CartItem from "@/modules/shop/cart/components/cart-item";
import { FetchedCartData } from "@/modules/shop/cart/components/cart-sheet";
import { useFetchCart } from "@/modules/shop/cart/queries/fetch-cart";
import { useFetchUserInformation } from "@/modules/user/queries/fetch-user-information";
import useAuthStore from "@/store/auth";
import useCartStore from "@/store/cart";
import { useCartViewStore } from "@/store/cart-data";
import { useAuthFormModal } from "@/store/auth-form-modal";
import { formatNumberWithCommas } from "@/utils/formatNumber";

type CartPopoverProps = {
  cartCount: number;
};

export function CartPopover({ cartCount }: CartPopoverProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"list" | "detail">("list");

  const { isLoggedIn, user } = useAuthStore();
  const { onAuthFormOpen } = useAuthFormModal();
  const { items, addItem, removeItem } = useCartStore();
  const { data: fetchedCartData } = useFetchCart(
    user?.id ? String(user.id) : ""
  );
  const { data: userInformation } = useFetchUserInformation(String(user?.id));

  const {
    storeTotals,
    openStoreId,
    setOpenStoreId,
    typedCartData,
    initializeCartData,
    setIsOpen,
    setToggleCartView,
    setToggleCheckoutView,
  } = useCartViewStore();

  useEffect(() => {
    initializeCartData(
      fetchedCartData as FetchedCartData | undefined,
      items,
      isLoggedIn
    );
  }, [fetchedCartData, items, isLoggedIn, initializeCartData]);

  useEffect(() => {
    if (!open) {
      setView("list");
    }
  }, [open]);

  const deliveryAddress =
    userInformation?.address || "Set your delivery address";

  const activeStore = storeTotals.find((s) => s.storeId === openStoreId);

  const openStoreDetail = (storeId: string) => {
    setOpenStoreId(storeId);
    setView("detail");
  };

  const goToCheckout = () => {
    if (!isLoggedIn) {
      setOpen(false);
      onAuthFormOpen();
      return;
    }

    if (openStoreId) {
      setOpenStoreId(openStoreId);
    } else if (storeTotals[0]?.storeId) {
      setOpenStoreId(storeTotals[0].storeId);
    }
    setToggleCartView("checkout");
    setToggleCheckoutView("order");
    setIsOpen(true);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="relative h-10 rounded-full border-black/10 bg-[#f5f5f5] px-3 text-ash hover:bg-[#ececec] md:h-11 md:px-4"
          aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
        >
          <ShoppingBag className="size-5" />
          <span className="ml-1.5 hidden text-sm font-medium sm:inline">
            Cart
          </span>
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-scotch px-1 text-[0.6875rem] font-semibold text-white">
              {cartCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="z-[9999] flex w-[min(400px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-xl border border-black/10 bg-white p-0 shadow-lg"
        style={{ maxHeight: "min(70vh, 520px)" }}
      >
        <div className="shrink-0 border-b border-black/5 px-4 py-5">
          {view === "detail" ? (
            <button
              type="button"
              className="flex items-center gap-1 text-base font-medium text-ash"
              onClick={() => {
                setView("list");
                setOpenStoreId(null);
              }}
            >
              <ChevronLeft className="size-4" />
              {activeStore?.vendorStoreName || "Cart"}
            </button>
          ) : (
            <div className="text-base font-medium leading-[120%] text-ash">
              Cart
            </div>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {storeTotals.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <p className="text-sm font-medium text-ash">Your cart is empty</p>
              <p className="text-xs text-ash/55">
                Add dishes from a kitchen to get started.
              </p>
              <Button asChild variant="outline" className="rounded-lg" size="sm">
                <Link to="/shop" onClick={() => setOpen(false)}>
                  Browse kitchens
                </Link>
              </Button>
            </div>
          ) : view === "list" ? (
            <ul>
              {storeTotals.map((store) => {
                const initial =
                  store.vendorStoreName.trim().charAt(0).toUpperCase() || "D";
                return (
                  <li key={store.storeId}>
                    <button
                      type="button"
                      className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-scotch/5"
                      onClick={() => openStoreDetail(store.storeId)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-[50px] w-[50px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white text-sm font-medium text-ash">
                          {initial}
                        </span>
                        <div className="flex h-[55px] flex-col gap-0.5">
                          <span className="text-sm font-medium leading-[120%] text-black">
                            {store.vendorStoreName}
                          </span>
                          <span className="text-xs text-ash/45">
                            {store.totalQuantity}{" "}
                            {store.totalQuantity === 1 ? "item" : "items"} • ₦
                            {formatNumberWithCommas(
                              Number(store.totalAmount.toFixed(2))
                            )}
                          </span>
                          <p className="w-[242px] overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-[150%] text-ash/45">
                            Delivering to {deliveryAddress}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="size-4 shrink-0 text-ash/40" />
                    </button>
                    <div className="border-b border-black/5" />
                  </li>
                );
              })}
            </ul>
          ) : activeStore ? (
            <div className="px-4 py-2">
              <ul className="divide-y divide-black/5">
                {activeStore.products.map((item) => (
                  <CartItem
                    key={item.id}
                    tone="light"
                    items={{
                      ...item,
                      onRemove: () => removeItem(item.id),
                      onAdd: () => addItem(item),
                      cartId: isLoggedIn ? typedCartData?.id : undefined,
                    }}
                  />
                ))}
              </ul>
              <div className="sticky bottom-0 border-t border-black/5 bg-white py-4">
                <div className="mb-3 flex justify-between text-sm">
                  <span className="text-ash/60">Subtotal</span>
                  <span className="font-medium text-ash">
                    ₦
                    {formatNumberWithCommas(
                      Number(activeStore.totalAmount.toFixed(2))
                    )}
                  </span>
                </div>
                <Button
                  type="button"
                  className="w-full rounded-lg"
                  onClick={goToCheckout}
                >
                  Proceed to checkout
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}
