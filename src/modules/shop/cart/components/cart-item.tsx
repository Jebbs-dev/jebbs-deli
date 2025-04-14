import { CartItemProps } from "@/store/cart";
import { Product } from "@/types/types";
import Image from "next/image";
import { formatNumberWithCommas } from "@/utils/formatNumber";

interface CartItemComponentProps {
  items: CartItemProps & {
    onRemove: () => void;
    onAdd: () => void;
  };
}

const CartItem = ({ items }: CartItemComponentProps) => {
  const totalPrice = items.price * items.quantity;

  return (
    <li className="flex py-6 px-2">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        {items.image ? (
          <Image
            src={items.image}
            alt={items.name}
            width={100}
            height={100}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{items.name}</h3>
            <p className="ml-4">₦{formatNumberWithCommas(Number(totalPrice.toFixed(2)))}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{items.store?.name}</p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center gap-2 bg-orange-50 rounded-full px-2">
            <button
              onClick={items.onRemove}
              className="font-medium text-orange-400 hover:text-orange-500 w-8 h-8 rounded-full text-base"
            >
              -
            </button>
            <p className="text-gray-500">Qty {items.quantity}</p>
            <button
              onClick={items.onAdd}
              className="font-medium text-orange-400 hover:text-orange-500 w-8 h-8 rounded-full text-base"
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
