import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import useCartStore from "@/store/cart";
import CartItem from "./cart-item";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import useAuthStore from "@/store/auth";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useUpdateCart } from "../mutations/update-cart";
import { useAuthFormModal } from "@/store/auth-form-modal";
import AuthModal from "@/modules/auth/components/auth-modal";
import { useCartViewStore } from "@/store/cart-data";
import { cn } from "@/lib/utils";

interface CartProps {
  goToCheckout: () => void;
}

const CartPage = ({ goToCheckout }: CartProps) => {
  const { mutateAsync: updateCart } = useUpdateCart();
  const { addItem, removeItem, clearCart, clearVendorItems } = useCartStore();

  const {
    setIsOpen,
    storeTotals,
    typedCartData,
    cartItemsToUse,
    openStoreId,
    setOpenStoreId,
    handleClearVendorItems,
  } = useCartViewStore();

  const { onAuthFormOpen } = useAuthFormModal();
  const { isLoggedIn, user } = useAuthStore();

  return (
    <>
      <AuthModal />

      <SheetHeader className="mb-4 space-y-1 text-left">
        <SheetTitle className="text-xl font-semibold text-ash">
          Your cart
        </SheetTitle>
        {cartItemsToUse.length === 0 && (
          <p className="text-sm text-ash/60">
            Add a dish from the menu to get started.
          </p>
        )}
      </SheetHeader>

      <div className="mb-3 flex h-full flex-col justify-between">
        <div className="overflow-auto">
          {storeTotals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-lg font-semibold text-ash">Cart is empty</p>
              <p className="mt-2 max-w-[28ch] text-sm text-ash/60">
                Browse dishes and tap Add — your order builds here.
              </p>
            </div>
          ) : (
            storeTotals.map((store) => {
              const expanded = openStoreId === store.storeId;
              return (
                <div
                  key={store.storeId}
                  className="mb-4 rounded-xl border border-black/10 bg-white p-4"
                >
                  <div className="mb-3 rounded-lg bg-[#f5f5f5] p-3">
                    <div className="flex w-full items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-ash">
                        {store.vendorStoreName}
                      </h3>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-xs font-medium text-ash/60 hover:text-scotch"
                        onClick={() =>
                          setOpenStoreId(expanded ? null : store.storeId)
                        }
                      >
                        {expanded ? "Hide" : "Show"}
                        <ChevronDown
                          className={cn(
                            "size-3.5 transition-transform duration-200",
                            expanded && "rotate-180"
                          )}
                        />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-ash/70">
                      <span>
                        ₦
                        {formatNumberWithCommas(
                          Number(store.totalAmount.toFixed(2))
                        )}
                      </span>
                      <span className="border-l border-black/10 pl-3">
                        {store.totalQuantity}{" "}
                        {store.totalQuantity === 1 ? "item" : "items"}
                      </span>
                    </div>
                  </div>
                  {expanded && (
                    <ul className="divide-y divide-black/5">
                      {store.products.map((item) => (
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
                  )}
                  <div className="mt-4 flex flex-col gap-2">
                    <Button
                      type="button"
                      className="w-full rounded-lg"
                      onClick={() => {
                        if (!isLoggedIn) {
                          setIsOpen(false);
                          onAuthFormOpen();
                        } else {
                          goToCheckout();
                          setOpenStoreId(
                            openStoreId === store.storeId
                              ? null
                              : store.storeId
                          );
                        }
                      }}
                    >
                      Proceed to checkout
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full rounded-lg border-black/10"
                      onClick={() => {
                        handleClearVendorItems(
                          store.storeId,
                          isLoggedIn,
                          String(user?.id),
                          updateCart,
                          clearVendorItems
                        );
                      }}
                    >
                      Clear {store.vendorStoreName}&apos;s items
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cartItemsToUse.length > 0 && (
          <div className="mt-4 border-t border-black/10 px-1 pb-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-lg border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={async () => {
                if (isLoggedIn && user?.id && typedCartData?.id) {
                  try {
                    await updateCart({
                      cartId: typedCartData.id,
                      userId: user.id,
                      cartItems: [],
                      totalPrice: 0,
                    });
                  } catch (error) {
                    console.error("Failed to clear cart:", error);
                  }
                } else {
                  clearCart();
                }
              }}
            >
              Clear all items
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
