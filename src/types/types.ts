import { CartItemProps } from "@/store/cart";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  store?: Vendor;
  storeId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type Vendor = {
  id: string;
  name: string;
  email: string;
  telephone: string;
  address: string;
  logo: string;
  isActive: boolean;
  createdAt: string;
  billboard?: string;
  openingTime?: string;
  closingTime?: string;
  rating?: string;
  preparationTime?: string;
  totalReviews?: string;
  tags?: string[];
}

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  address?: string;
}

export type Cart = {
  id: string;
  userId: string;
  totalPrice: number;
  createdAt?:  string;
  updatedAt?: string;
  cartItems: CartItemProps;
  store: Vendor;
  storeId: string;
}

export type Address = {
  id: string;
  description: string;
  place_id: string;
  reference: string;
  types: string[];
}

export type Order = {
  id: string;
  storeId: string;
  userId: string;
  serviceFee: number;
  deliveryFee: number;
  subTotal: number;
  totalPrice: number;
  vendorAddress: string;
  customerAddress: string;
  status: string;
  createdAt?: string
}


// {
  // const { mutateAsync: addCart } = useAddToCart();

  // return {
  //   items: [],
  //   totalAmount: 0,
  //   totalItems: 0,

  //   addItem: async (product: Product) => {
  //     const userInfoStr = localStorage.getItem("userInfo");
  //     if (userInfoStr) {
  //       // User is signed in, add item to backend
  //       const userInfo = JSON.parse(userInfoStr);
  //       const payload = {
  //         cart: [{ ...product, quantity: 1,  }], // Adjust as needed to include quantity
  //         userId: userInfo.id, // Assuming userInfo contains an id
  //       };
  //       await addCart(payload); // Call the addCart function
  //       return; // Optionally, handle success or error
  //     }