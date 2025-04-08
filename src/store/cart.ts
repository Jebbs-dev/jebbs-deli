import { Product } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Enhanced cart item type with quantity
export interface CartItemProps extends Omit<Product, 'createdAt' | 'updatedAt'> {
  quantity: number;
}

interface CartState {
  items: CartItemProps[];
  totalAmount: number;
  totalItems: number;
}

interface CartActions {
  addItem: (item: Product) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  // increaseQuantity: (id: string) => void;
  // decreaseQuantity: (id: string) => void;
  // updateQuantity: (id: string, quantity: number) => void;
}

// Combined interface for the store
interface CartStore extends CartState, CartActions {
  clearVendorItems(vendorId: string): void;
}

// Helper function to calculate total amount
const calculateTotalAmount = (items: CartItemProps[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Helper function to calculate total items
const calculateTotalItems = (items: CartItemProps[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

// Create the store with persistence
const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalAmount: 0,
      totalItems: 0,

      addItem: (product: Product) => set((state) => {
        // Check if item already exists in cart
        const existingItemIndex = state.items.findIndex(
          (item) => item.id === product.id
        );

        let updatedItems: CartItemProps[];

        if (existingItemIndex !== -1) {
          // Item exists, increase quantity
          updatedItems = [...state.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + 1,
          };
        } else {
          // Item doesn't exist, add new item with quantity 1
          updatedItems = [
            ...state.items,
            { ...product, quantity: 1 },
          ];
        }

        return {
          items: updatedItems,
          totalAmount: calculateTotalAmount(updatedItems),
          totalItems: calculateTotalItems(updatedItems),
        };
      }),

      removeItem: (id: string) => set((state) => {
        // Find the item
        const existingItemIndex = state.items.findIndex(
          (item) => item.id === id
        );

        if (existingItemIndex === -1) {
          return state; // Item not found, return current state
        }

        let updatedItems: CartItemProps[];

        // If quantity is 1, remove the item completely
        if (state.items[existingItemIndex].quantity === 1) {
          updatedItems = state.items.filter((item) => item.id !== id);
        } else {
          // Decrease quantity by 1
          updatedItems = [...state.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity - 1,
          };
        }

        return {
          items: updatedItems,
          totalAmount: calculateTotalAmount(updatedItems),
          totalItems: calculateTotalItems(updatedItems),
        };
      }),

      clearCart: () => set({
        items: [],
        totalAmount: 0,
        totalItems: 0,
      }),

      // increaseQuantity: (id: string) => {
      //   const { items } = get();
      //   const itemIndex = items.findIndex(item => item.id === id);
        
      //   if (itemIndex !== -1) {
      //     const updatedItems = [...items];
      //     updatedItems[itemIndex] = {
      //       ...updatedItems[itemIndex],
      //       quantity: updatedItems[itemIndex].quantity + 1
      //     };
          
      //     set({
      //       items: updatedItems,
      //       totalAmount: calculateTotalAmount(updatedItems),
      //       totalItems: calculateTotalItems(updatedItems),
      //     });
      //   }
      // },

      // decreaseQuantity: (id: string) => {
      //   const { items } = get();
      //   const itemIndex = items.findIndex(item => item.id === id);
        
      //   if (itemIndex !== -1) {
      //     const item = items[itemIndex];
          
      //     if (item.quantity === 1) {
      //       // Remove item if quantity would become 0
      //       const updatedItems = items.filter(item => item.id !== id);
      //       set({
      //         items: updatedItems,
      //         totalAmount: calculateTotalAmount(updatedItems),
      //         totalItems: calculateTotalItems(updatedItems),
      //       });
      //     } else {
      //       // Decrease quantity
      //       const updatedItems = [...items];
      //       updatedItems[itemIndex] = {
      //         ...updatedItems[itemIndex],
      //         quantity: updatedItems[itemIndex].quantity - 1
      //       };
            
      //       set({
      //         items: updatedItems,
      //         totalAmount: calculateTotalAmount(updatedItems),
      //         totalItems: calculateTotalItems(updatedItems),
      //       });
      //     }
      //   }
      // },

      // updateQuantity: (id: string, quantity: number) => {
      //   if (quantity <= 0) {
      //     // If quantity is 0 or negative, remove the item
      //     const updatedItems = get().items.filter(item => item.id !== id);
      //     set({
      //       items: updatedItems,
      //       totalAmount: calculateTotalAmount(updatedItems),
      //       totalItems: calculateTotalItems(updatedItems),
      //     });
      //   } else {
      //     // Update quantity to specific value
      //     const { items } = get();
      //     const itemIndex = items.findIndex(item => item.id === id);
          
      //     if (itemIndex !== -1) {
      //       const updatedItems = [...items];
      //       updatedItems[itemIndex] = {
      //         ...updatedItems[itemIndex],
      //         quantity
      //       };
            
      //       set({
      //         items: updatedItems,
      //         totalAmount: calculateTotalAmount(updatedItems),
      //         totalItems: calculateTotalItems(updatedItems),
      //       });
      //     }
      //   }
      // },

      clearVendorItems: (vendorId: string) => set((state) => {
        const updatedItems = state.items.filter(item => item.vendor?.id !== vendorId);
        return {
          items: updatedItems,
          totalAmount: calculateTotalAmount(updatedItems),
          totalItems: calculateTotalItems(updatedItems),
        };
      }),
    }),
    {
      name: "jebbs-cart-storage", // unique name for localStorage
    }
  )
);

export default useCartStore;
