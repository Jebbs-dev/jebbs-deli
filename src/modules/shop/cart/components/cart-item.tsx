import { CartItemProps } from "@/store/cart";
import { Product } from "@/types/types";
import Image from "next/image";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import useAuthStore from "@/store/auth";
import { useUpdateCart } from "../mutations/update-cart";
import { useFetchCart } from "../queries/fetch-cart";

// Define types for cart data from the backend
interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

interface CartGroup {
  id: string;
  storeId: string;
  cartItems: CartItem[];
}

interface CartData {
  id: string;
  cartGroups: CartGroup[];
}

interface CartItemComponentProps {
  items: CartItemProps & {
    onRemove: () => void;
    onAdd: () => void;
    cartId?: string; // Add cartId for backend operations
  };
}

const CartItem = ({ items }: CartItemComponentProps) => {
  const totalPrice = items.price * items.quantity;
  const { isLoggedIn, user } = useAuthStore();
  const { mutateAsync: updateCart } = useUpdateCart();
  const { data: cartData } = useFetchCart(user?.id ? String(user.id) : "");

  const handleAdd = async () => {
    if (isLoggedIn && user && items.cartId && cartData) {
      try {
        // Extract all current cart items, transforming them into the format expected by the backend
        const allCartItems = (cartData as CartData).cartGroups.flatMap((group: CartGroup) => 
          group.cartItems.map((item: CartItem) => {
            const isTargetItem = item.product.id === items.id;
            return {
              id: item.product.id,
              quantity: isTargetItem ? item.quantity + 1 : item.quantity, // Increase this item's quantity
              storeId: group.storeId,
              productId: item.product.id
            };
          })
        );
        
        console.log("Increasing quantity for item:", items.id);
        
        // Calculate the new total price
        const newTotalPrice = allCartItems.reduce(
          (sum: number, item: {id: string, quantity: number}) => {
            // Find the original product to get the price
            const product = (cartData as CartData).cartGroups
              .flatMap((g: CartGroup) => g.cartItems)
              .find((ci: CartItem) => ci.product.id === item.id)?.product;
              
            return sum + (product?.price || 0) * item.quantity;
          }, 
          0
        );
        
        // Send the complete updated cart to the backend
        await updateCart({
          cartId: items.cartId,
          userId: user.id,
          cartItems: allCartItems,
          totalPrice: newTotalPrice,
        });
      } catch (error) {
        console.error("Failed to update cart:", error);
      }
    } else {
      // Use local cart state for non-authenticated users
      items.onAdd();
    }
  };

  const handleRemove = async () => {
    if (isLoggedIn && user && items.cartId && cartData) {
      try {
        // Extract all cart items, handling the removal properly
        const allCartItems = (cartData as CartData).cartGroups
          // First, process each group
          .map((group: CartGroup) => {
            // Process this group's items
            const processedItems = group.cartItems
              // Keep only items we're not removing completely
              .filter((item: CartItem) => {
                const isTargetItem = item.product.id === items.id;
                // Keep if not the target item or if target item has quantity > 1
                return !isTargetItem || (isTargetItem && item.quantity > 1);
              })
              // Adjust quantities as needed
              .map((item: CartItem) => {
                const isTargetItem = item.product.id === items.id;
                return {
                  id: item.product.id,
                  quantity: isTargetItem ? item.quantity - 1 : item.quantity,
                  storeId: group.storeId,
                  productId: item.product.id
                };
              });
              
            // Return the group and its processed items
            return {
              storeId: group.storeId,
              items: processedItems
            };
          })
          // Filter out any groups that now have zero items
          .filter(group => group.items.length > 0)
          // Flatten to get just the items
          .flatMap(group => group.items);
        
        console.log("Decreasing/removing item:", items.id);
        console.log("Remaining cart items:", allCartItems);
        
        // Calculate the new total price
        const newTotalPrice = allCartItems.reduce(
          (sum: number, item: {id: string, quantity: number}) => {
            // Find the original product to get the price
            const product = (cartData as CartData).cartGroups
              .flatMap((g: CartGroup) => g.cartItems)
              .find((ci: CartItem) => ci.product.id === item.id)?.product;
              
            return sum + (product?.price || 0) * item.quantity;
          }, 
          0
        );
        
        // Send the complete updated cart to the backend
        await updateCart({
          cartId: items.cartId,
          userId: user.id,
          cartItems: allCartItems,
          totalPrice: newTotalPrice,
        });
      } catch (error) {
        console.error("Failed to update cart:", error);
      }
    } else {
      // Use local cart state for non-authenticated users
      items.onRemove();
    }
  };

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
              onClick={handleRemove}
              className="font-medium text-orange-400 hover:text-orange-500 w-8 h-8 rounded-full text-base cursor-pointer"
            >
              -
            </button>
            <p className="text-gray-500">Qty {items.quantity}</p>
            <button
              onClick={handleAdd}
              className="font-medium text-orange-400 hover:text-orange-500 w-8 h-8 rounded-full text-base cursor-pointer"
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
