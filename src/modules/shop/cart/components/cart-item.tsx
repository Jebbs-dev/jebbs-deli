import { CartItemProps } from "@/store/cart";
import { Product } from "@/types/types";
import { Image } from "@unpic/react";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import useAuthStore from "@/store/auth";
import { useUpsertCartItem } from "../mutations/upsert-cart-item";

interface CartItemComponentProps {
  items: CartItemProps & {
    onRemove: () => void;
    onAdd: () => void;
    cartId?: string;
  };
  /** dark = cart sheet (iroko); light = store side panel (paper) */
  tone?: "dark" | "light";
}

const CartItem = ({ items, tone = "dark" }: CartItemComponentProps) => {
  const light = tone === "light";
  const totalPrice = items.price * items.quantity;
  const { isLoggedIn } = useAuthStore();
  const { mutate: upsertItem } = useUpsertCartItem();

  const storeId = items.storeId || items.store?.id;
  const canSync = Boolean(isLoggedIn && storeId);

  const handleAdd = () => {
    if (canSync && storeId) {
      upsertItem({
        productId: items.id,
        storeId,
        delta: 1,
        product: items as unknown as Product,
      });
      return;
    }
    items.onAdd();
  };

  const handleRemove = () => {
    if (canSync && storeId) {
      upsertItem({
        productId: items.id,
        storeId,
        delta: -1,
        product: items as unknown as Product,
      });
      return;
    }
    items.onRemove();
  };

  return (
    <li className="flex py-5">
      <div
        className={
          light
            ? "h-20 w-20 shrink-0 overflow-hidden rounded-md border border-ash/10 bg-iroko"
            : "h-20 w-20 shrink-0 overflow-hidden rounded-md border border-cream/10 bg-ash"
        }
      >
        {items.image ? (
          <Image
            src={items.image}
            alt={items.name}
            width={80}
            height={80}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span
              className={light ? "text-xs text-cream/40" : "text-xs text-cream/40"}
            >
              No image
            </span>
          </div>
        )}
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between gap-3">
          <h3
            className={
              light
                ? "font-display text-sm font-semibold text-ash"
                : "font-display text-sm font-semibold text-cream"
            }
          >
            {items.name}
          </h3>
          <p
            className={
              light
                ? "shrink-0 font-mono text-sm text-ash"
                : "shrink-0 font-mono text-sm text-cream"
            }
          >
            ₦{formatNumberWithCommas(Number(totalPrice.toFixed(2)))}
          </p>
        </div>
        {items.store?.name && (
          <p
            className={
              light
                ? "mt-1 text-sm text-ash/55"
                : "mt-1 text-sm text-cream/55"
            }
          >
            {items.store.name}
          </p>
        )}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div
            className={
              light
                ? "inline-flex items-center gap-1 rounded-md border border-ash/15 bg-white px-1"
                : "inline-flex items-center gap-1 rounded-md border border-cream/15 bg-ash px-1"
            }
          >
            <button
              type="button"
              onClick={handleRemove}
              className={
                light
                  ? "flex h-8 w-8 items-center justify-center rounded-md text-base text-ash transition-colors hover:bg-paper hover:text-scotch"
                  : "flex h-8 w-8 items-center justify-center rounded-md text-base text-cream transition-colors hover:bg-iroko hover:text-scotch"
              }
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span
              className={
                light
                  ? "min-w-8 text-center font-mono text-xs text-ash/80"
                  : "min-w-8 text-center font-mono text-xs text-cream/80"
              }
            >
              {items.quantity}
            </span>
            <button
              type="button"
              onClick={handleAdd}
              className={
                light
                  ? "flex h-8 w-8 items-center justify-center rounded-md text-base text-ash transition-colors hover:bg-paper hover:text-scotch"
                  : "flex h-8 w-8 items-center justify-center rounded-md text-base text-cream transition-colors hover:bg-iroko hover:text-scotch"
              }
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
