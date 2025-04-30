"use client";

import { Button } from "@/components/ui/button";
import CartItem from "@/modules/shop/cart/components/cart-item";
import useCartStore, { CartItemProps } from "@/store/cart";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import Link from "next/link";
import { useFetchVendorStoreById } from "@/modules/shop/queries/fetch-vendor-store-by-id";
import { ArrowDown, ArrowLeft } from "lucide-react";
import { useFetchProductsByStore } from "@/modules/shop/queries/fetch-products-by-store";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/types";
import CartPage from "@/modules/shop/cart/components/cart-page";
import CartSheet from "@/modules/shop/cart/components/cart-sheet";
import { useCartViewStore } from "@/store/cart-data";
import CheckoutPage from "@/modules/checkout/components/checkout-page";
import useAuthStore from "@/store/auth";
import { useAuthFormModal } from "@/store/auth-form-modal";
import { useUpdateCart } from "@/modules/shop/cart/mutations/update-cart";
import CartPageComponents from "@/modules/shop/cart/components/cart-page-components";
import CheckoutOrderPage from "@/modules/checkout/components/checkout-order-page";
import PaymentPage from "@/modules/checkout/components/payment-page";
import { useFetchCart } from "@/modules/shop/cart/queries/fetch-cart";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

const specializedTags = [
  "All",
  "Main menu",
  "Protein",
  "Swallows",
  "Soups",
  "Value Munch",
  "Sides",
  "Beverages",
  "Snacks",
  "Pack",
];

const StorePage = () => {
  const { toast } = useToast();

  const { storeId } = useParams();

  const { addItem, removeItem, clearCart, clearVendorItems } = useCartStore();

  const [show, setShow] = useState(false);

  const [selectedTag, setSelectedTag] = useState<string>("All");

  const router = useRouter();

  const { isLoggedIn, user } = useAuthStore();

  const { data: cartData } = useFetchCart(user?.id ? String(user.id) : "");

  const { mutateAsync: updateCart } = useUpdateCart();

  const {
    storeTotals,
    typedCartData,
    cartItemsToUse,
    openStoreId,
    setOpenStoreId,
    handleClearVendorItems,
    toggleCartView,
    setToggleCartView,
    toggleCheckoutView,
    setToggleCheckoutView,
  } = useCartViewStore();

  const { data: vendorStoreData, isPending } = useFetchVendorStoreById(
    String(storeId)
  );

  const openingTime = vendorStoreData?.openingTime;
  const closingTime = vendorStoreData?.closingTime;
  
  // Today's date
  const today = new Date();
  
  // Helper function to parse "9:00 am" into today's date
  const parseTimeToTodayDate = (timeString: string) => {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
  
    if (modifier.toLowerCase() === "pm" && hours !== 12) {
      hours += 12;
    }
    if (modifier.toLowerCase() === "am" && hours === 12) {
      hours = 0;
    }
  
    const parsedDate = new Date();
    parsedDate.setHours(hours);
    parsedDate.setMinutes(minutes);
    parsedDate.setSeconds(0);
    parsedDate.setMilliseconds(0);
  
    return parsedDate;
  };
  
  // Only parse if times are available
  const parsedOpeningDate = openingTime ? parseTimeToTodayDate(openingTime) : null;
  const parsedClosingDate = closingTime ? parseTimeToTodayDate(closingTime) : null;
  
  dayjs.extend(utc);
  dayjs.extend(timezone);
  
  useEffect(() => {
    if (!parsedOpeningDate || !parsedClosingDate) return;
  
    const TIMEZONE = "Africa/Lagos";
  
    const now = dayjs().tz(TIMEZONE);
  
    // Create Dayjs objects from already parsed Dates
    const opening = dayjs(parsedOpeningDate).tz(TIMEZONE);
    const closing = dayjs(parsedClosingDate).tz(TIMEZONE);
  
    const storeOpeningTime = now
      .set("hour", opening.hour())
      .set("minute", opening.minute())
      .set("second", 0)
      .set("millisecond", 0);

    console.log(storeOpeningTime);
  
    const storeClosingTime = now
      .set("hour", closing.hour())
      .set("minute", closing.minute())
      .set("second", 0)
      .set("millisecond", 0);
  
    if (now.isAfter(storeOpeningTime) && now.isBefore(storeClosingTime)) {
      setShow(true);
    } else {
      setShow(false);
    }
  
    const msUntilOpening = storeOpeningTime.diff(now);
    const msUntilClosing = storeClosingTime.diff(now);
  
    const timers: NodeJS.Timeout[] = [];
  
    if (msUntilOpening > 0) {
      timers.push(
        setTimeout(() => {
          setShow(true);
        }, msUntilOpening)
      );
    }
  
    if (msUntilClosing > 0) {
      timers.push(
        setTimeout(() => {
          setShow(false);
        }, msUntilClosing)
      );
    }
  
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [parsedOpeningDate, parsedClosingDate]);

  // const { data: products, isPending } = useFetchProductsBystore(String(storeId));

  // const localStorageCart = JSON.parse(
  //   localStorage.getItem("jebbs-cart-storage") || "[]"
  // );

  // console.log(localStorageCart);

  const handleAddToCart = async (product: Product) => {
    // Ensure store information is attached to the product
    const productWithStore = {
      ...product,
      store: vendorStoreData, // Attach the full store object
      storeId: vendorStoreData?.id, // Also attach storeId for direct access
    };

    if (isLoggedIn && user?.id && cartData) {
      try {
        // Get existing cart items
        const existingCartItems = cartData.cartGroups
          ? cartData.cartGroups.flatMap((group: any) =>
              group.cartItems.map((item: any) => ({
                ...item.product,
                quantity: item.quantity,
                store: group.store,
                storeId: group.storeId,
              }))
            )
          : [];

        // Check if product already exists in cart
        const existingItemIndex = existingCartItems.findIndex(
          (item: any) => item.id === productWithStore.id
        );

        let updatedCartItems;

        if (existingItemIndex !== -1) {
          // Increase quantity of existing item
          updatedCartItems = [...existingCartItems];
          updatedCartItems[existingItemIndex] = {
            ...updatedCartItems[existingItemIndex],
            quantity: updatedCartItems[existingItemIndex].quantity + 1,
          };
        } else {
          // Add new item with quantity 1
          updatedCartItems = [
            ...existingCartItems,
            { ...productWithStore, quantity: 1 },
          ];
        }

        // Calculate new total price
        const newTotalPrice = updatedCartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        // Update cart in backend
        await updateCart({
          cartId: cartData.id,
          userId: user.id,
          cartItems: updatedCartItems,
          totalPrice: newTotalPrice,
        });

        // Add item to local cart state
        addItem(productWithStore);

        toast({
          description: `${product.name} added to cart!`,
        });
      } catch (error) {
        console.error("Failed to add to cart:", error);
        toast({
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Use local cart for non-authenticated users
      addItem(productWithStore);
      toast({
        description: `${product.name} added to cart!`,
      });
    }
  };

  const filteredProducts =
    selectedTag === "All"
      ? vendorStoreData?.products
      : vendorStoreData?.products?.filter(
          (product: Product) =>
            product.category?.toLowerCase() === selectedTag.toLowerCase()
        );

  return (
    <div className="pt-[40px] md:pt-[81px] h-full">
      <div className="md:container flex flex-row mx-auto px-10 2xl:px-0">
        <div className="w-full md:w-[63%] px-5 text-xs md:text-sm overflow-scroll h-screen">
          <span
            className="flex flex-row items-center mb-3 cursor-pointer"
            onClick={() => {
              router.push("/shop");
            }}
          >
            <ArrowLeft size={20} className="mr-2" />
            Go back
          </span>

          <section className="h-[220px] w-full hidden md:block bg-gray-300 rounded-xl">
            {vendorStoreData?.billboard ? (
              show ? (
                <Image
                  src={vendorStoreData?.billboard}
                  alt="Billboard"
                  width={500}
                  height={250}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="relative h-full w-full rounded-xl overflow-hidden bg-black bg-opacity-70">
                  <div
                    className="absolute inset-0 "
                    style={{
                      backgroundImage: `url(${vendorStoreData?.billboard})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      opacity: 0.5,
                    }}
                  />
                  <div className="relative z-10 flex h-full w-full items-center justify-center">
                    <span className="text-white text-2xl font-semibold">
                      Store is Closed
                    </span>
                  </div>
                </div>
              )
            ) : (
              <div className="h-full w-full bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </section>

          <section className="mt-2">
            <h4 className="text-xl">{vendorStoreData?.name}</h4>
            <div className="flex flex-row mt-2">
              <span className="pr-3 border-r-[1px]">
                <p className="text-gray-400">Preparation Time</p>
                <p>{vendorStoreData?.preparationTime}</p>
              </span>
              <span className="px-3 border-r-[1px]">
                <p className="text-gray-400">Delivery Fee</p>
                <p>₦600</p>
              </span>
              <span className="px-3">
                <p className="text-gray-400">Available Delivery Type</p>
                <p>Instant Delivery</p>
              </span>
            </div>

            <div className="flex flex-row overflow-auto gap-2 break w-full mt-5">
              {vendorStoreData?.tags.map((tag: any) => (
                <span
                  key={tag}
                  className={`min-w-20 rounded-md cursor-pointer text-orange-400 ${
                    tag === "All"
                      ? "bg-orange-400 bg-opacity-50 text-white"
                      : "bg-transparent"
                  }`}
                >
                  <p className="text-sm px-2 py-1 whitespace-nowrap">{tag}</p>
                </span>
              ))}
            </div>
          </section>

          <section>
            {isPending ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-7 mt-5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="my-4 flex flex-row justify-between gap-7 animate-pulse"
                  >
                    <div className="h-[90%] flex flex-col justify-between w-[65%]">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mt-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
                    </div>
                    <div className="w-[40%]">
                      <div className="h-[150px] bg-gray-200 rounded-t-lg"></div>
                      <div className="h-10 bg-gray-200 rounded-b-lg"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts && filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-7 mt-5">
                {filteredProducts.map((product: Product) => (
                  <div
                    key={product.id}
                    className="flex flex-row justify-between gap-5 h-[140px] pb-5 border-b border-gray-200"
                  >
                    <div className="flex flex-col justify-between w-[65%]">
                      <span>
                        <p className="font-medium">{product.name}</p>
                        <p className="line-clamp-2 text-sm text-gray-400">
                          {product.description}
                        </p>
                      </span>
                      <p className="font-medium text-orange-400">
                        ₦
                        {formatNumberWithCommas(
                          Number(product.price.toFixed(2))
                        )}
                      </p>
                    </div>
                    <div className="w-[40%] h-[120px] flex flex-col">
                      {product.image ? (
                        <div className="h-[85px]">
                          <Image
                            src={
                              product.image || "/images/image-placeholder.png"
                            }
                            alt={product.name}
                            width={50}
                            height={50}
                            className="w-full h-full rounded-t-lg"
                          />
                        </div>
                      ) : (
                        <div className="h-full w-full bg-gray-200 rounded-t-lg flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                      <Button
                        className="rounded-t-none w-full h-auto"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add +
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="mx-auto w-[300px] h-[300px] flex items-center justify-center">
                  <div className="text-gray-400">
                    {selectedTag === "All"
                      ? "No products available"
                      : `No products found in the ${selectedTag} category`}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="w-[37%] border-l-2 px-4 hidden md:block overflow-scroll h-screen">
          <div className="">
            <h1 className="text-xl">Orders from {vendorStoreData?.name}</h1>
          </div>
          <div>
            {toggleCartView === "cart" ? (
              <div className="h-[100vh]">
                <CartPageComponents storeId={String(storeId)} />
              </div>
            ) : (
              <>
                <div>
                  <div className="flex flex-row items-center">
                    <span className="mr-1">
                      <ArrowLeft
                        onClick={() => setToggleCartView("cart")}
                        size={17}
                      />
                    </span>
                    <span>
                      <h3 className="text-2xl">Checkout</h3>
                    </span>
                  </div>

                  <div className="flex flex-row gap-3 pt-2">
                    <span
                      className="w-1/2 flex flex-col gap-2"
                      onClick={() => {
                        setToggleCheckoutView("order");
                      }}
                    >
                      <p>Your order</p>
                      <div
                        className={`w-full rounded-lg h-2.5 bg-primary`}
                      ></div>
                    </span>

                    <span
                      className="w-1/2 flex flex-col gap-2"
                      onClick={() => {
                        setToggleCheckoutView("payment");
                      }}
                    >
                      Delivery & Payment
                      <div
                        className={`w-full rounded-lg h-2.5 ${
                          toggleCheckoutView === "payment"
                            ? "bg-primary"
                            : "bg-gray-100"
                        }`}
                      ></div>
                    </span>
                  </div>
                </div>
                {toggleCheckoutView === "order" ? (
                  <CheckoutOrderPage
                    proceedToPayment={() => {
                      setToggleCheckoutView("payment");
                    }}
                    // storeTotals={storeTotals}
                    // typedCartData={typedCartData}
                    // openStoreId={openStoreId}
                    // setIsOpen={setIsOpen}
                  />
                ) : (
                  <PaymentPage />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
