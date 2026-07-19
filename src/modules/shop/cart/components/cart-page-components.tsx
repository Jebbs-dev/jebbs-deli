import useCartStore from "@/store/cart";
import CartItem from "./cart-item";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import useAuthStore from "@/store/auth";
import { Button } from "@/components/ui/button";
import { useUpdateCart } from "../mutations/update-cart";
import { useAuthFormModal } from "@/store/auth-form-modal";
import { useCartViewStore } from "@/store/cart-data";

interface VendorPageProps {
  storeId: string;
}

const CartPageComponents = ({ storeId }: VendorPageProps) => {
  const { mutateAsync: updateCart } = useUpdateCart();

  const { addItem, removeItem, clearVendorItems } = useCartStore();

  const {
    storeTotals,
    openStoreId,
    setOpenStoreId,
    handleClearVendorItems,
    setToggleCartView,
    typedCartData,
  } = useCartViewStore();

  const { onAuthFormOpen } = useAuthFormModal();

  const { isLoggedIn, user } = useAuthStore();

  const currentStore = storeTotals.find((store) => store.storeId === storeId);

  return (
    <div className="mb-3 flex h-full flex-col justify-between">
      <div className="overflow-auto">
        {currentStore ? (
          <div className="mb-6 pb-6">
            <ul className="divide-y divide-ash/10">
              {currentStore.products.map((item) => (
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
          </div>
        ) : (
          <div className="flex flex-col items-center py-12 text-center">
            <p className="font-display text-base font-semibold text-ash">
              No items yet
            </p>
            <p className="mt-1 max-w-[28ch] text-sm text-ash/60">
              Add dishes from this kitchen to build your order.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-ash/10 px-1 pb-6 pt-4">
        <div className="flex justify-between text-base font-medium text-ash">
          <p>Total</p>
          <p className="font-mono">
            ₦
            {currentStore?.totalAmount
              ? formatNumberWithCommas(
                  Number(currentStore.totalAmount.toFixed(2))
                )
              : Number(0.0).toFixed(2)}
          </p>
        </div>
        <p className="mt-1 text-sm text-ash/55">
          Delivery and fees calculated at checkout.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button
            type="button"
            className="w-full rounded-md"
            onClick={() => {
              if (!isLoggedIn) {
                onAuthFormOpen();
              } else {
                setToggleCartView("checkout");
                setOpenStoreId(openStoreId === storeId ? null : storeId);
              }
            }}
          >
            Proceed to checkout
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-md border-ash/20 text-ash hover:bg-ash/5"
            onClick={() => {
              handleClearVendorItems(
                storeId,
                isLoggedIn,
                String(user?.id),
                updateCart,
                clearVendorItems
              );
            }}
          >
            Clear all items
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPageComponents;
