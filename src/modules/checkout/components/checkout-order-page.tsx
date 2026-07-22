import useCartStore from "@/store/cart";
import CartItem from "@/modules/shop/cart/components/cart-item";
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import useAuthStore from "@/store/auth";
import { Button } from "@/components/ui/button";
import { useCartViewStore } from "@/store/cart-data";
import { useEffect } from "react";

interface CheckoutOrderProps {
  proceedToPayment: () => void;
}

const CheckoutOrderPage = ({ proceedToPayment }: CheckoutOrderProps) => {
  const { addItem, removeItem } = useCartStore();

  const {
    storeTotals,
    typedCartData,
    openStoreId,
    setOpenStoreId,
    setIsOpen,
  } = useCartViewStore();

  const { isLoggedIn } = useAuthStore();

  const resolvedStoreId =
    openStoreId && storeTotals.some((store) => store.storeId === openStoreId)
      ? openStoreId
      : (storeTotals[0]?.storeId ?? null);

  useEffect(() => {
    if (resolvedStoreId && resolvedStoreId !== openStoreId) {
      setOpenStoreId(resolvedStoreId);
    }
  }, [resolvedStoreId, openStoreId, setOpenStoreId]);

  const activeStores = storeTotals.filter(
    (store) => store.storeId === resolvedStoreId
  );
  const activeStore = activeStores[0];
  const itemCount = activeStore?.totalQuantity ?? 0;
  const subtotal = activeStore?.totalAmount ?? 0;

  return (
    <div className="flex h-full flex-col text-ash">
      <div className="mb-3 mt-3 rounded-lg bg-[#f5f5f5] px-3 py-4">
        <p className="font-medium text-ash">Order Summary</p>
      </div>
      <div className="mt-3 flex min-h-0 flex-1 flex-col justify-between">
        <div className="min-h-0 flex-1 overflow-auto">
          {activeStores.map((store) => (
            <div key={store.storeId} className="mb-6">
              <div className="mb-2 flex flex-col items-start gap-2 p-2">
                <div className="flex w-full flex-row items-center justify-between">
                  <span className="flex flex-row items-center gap-4">
                    <Image
                      src={String(store.billboard)}
                      alt="billboard"
                      width={100}
                      height={100}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="flex flex-col text-ash">
                      <p className="font-medium">{store.vendorStoreName}</p>
                      <p className="text-sm text-ash/60">
                        {store.totalQuantity}{" "}
                        {store.totalQuantity === 1 ? "item" : "items"}
                      </p>
                    </span>
                  </span>
                </div>
              </div>
              <ul className="divide-y divide-black/10 transition">
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
              <div className="mt-4">
                <Link
                  to="/shop/$storeId"
                  params={{ storeId: String(store.storeId) }}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-ash/15 bg-white px-4 py-2 text-sm font-medium text-ash transition-colors hover:bg-ash/5"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <span>+</span>
                  <span>Add Another Pack</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full border-t border-black/10 pb-3 pt-5">
          <div className="mb-3 space-y-2 text-sm text-ash">
            <div className="flex justify-between">
              <span>
                Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
              <span className="font-medium">
                ₦{formatNumberWithCommas(Number(subtotal.toFixed(2)))}
              </span>
            </div>
            <p className="text-xs text-ash/55">
              Delivery and service fees are calculated on the next step.
            </p>
          </div>
          <p className="mb-2 mt-0.5 text-center text-xs text-ash/50">
            By proceeding, you agree to our{" "}
            <span className="underline">Terms of Use</span> and{" "}
            <span className="underline">Privacy Policy</span>
          </p>
          <Button
            className="w-full rounded-lg bg-scotch text-ash shadow-sm hover:brightness-110"
            size="lg"
            onClick={proceedToPayment}
            disabled={!activeStore}
          >
            Make Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutOrderPage;
