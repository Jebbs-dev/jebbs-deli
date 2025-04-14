"use client";

import { Button } from "@/components/ui/button";
import CartItem from "@/modules/shop/cart/components/cart-item";
import useCartStore, { CartItemProps } from "@/store/cart";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import Link from "next/link";
import { useFetchVendorStoreById } from "@/modules/shop/queries/fetch-vendor-store-by-id";
import { ArrowLeft } from "lucide-react";
import { useFetchProductsByStore } from "@/modules/shop/queries/fetch-products-by-store";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/types";

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

  const { items, totalAmount, addItem, removeItem, clearCart } = useCartStore();

  const [selectedTag, setSelectedTag] = useState<string>("All");

  const router = useRouter();

  const { data: vendorStoreData, isPending } = useFetchVendorStoreById(String(storeId));
  // const { data: products, isPending } = useFetchProductsBystore(String(storeId));

  const localStorageCart = JSON.parse(
    localStorage.getItem("jebbs-cart-storage") || "[]"
  );

  console.log(localStorageCart);

  const handleAddToCart = (product: Product) => {
    // Ensure store information is attached to the product
    const productWithStore = {
      ...product,
      store: vendorStoreData, // Attach the full store object
      storeId: vendorStoreData?.id, // Also attach storeId for direct access
    };

    addItem(productWithStore);
    toast({
      description: `${product.name} added to cart!`,
    });
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
              <Image src={vendorStoreData?.billboard} alt="Billboard" width={500} height={250} className="w-full h-full object-cover rounded-xl"  />
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
                <p>15-20 minutes</p>
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
              {specializedTags.map((tag) => (
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
          <div className="mb-10">
            <h1 className="text-xl">Orders from {vendorStoreData?.name}</h1>
          </div>
          <div className="flex flex-col justify-between h-full">
            <div className="flow-root overflow-auto">
              <ul className="-my-6 divide-y divide-gray-200">
                {items
                  .filter((item) => item.store?.id === storeId)
                  .map((item: CartItemProps) => (
                    <CartItem
                      key={item.id}
                      items={{
                        ...item,
                        onRemove: () => removeItem(item.id),
                        onAdd: () => addItem(item),
                      }}
                    />
                  ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 px-4 pt-2 sm:px-6 mb-4 text-sm">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>
                  ₦
                  {formatNumberWithCommas(
                    Number(
                      items
                        .filter((item) => item.store?.id === storeId)
                        .reduce(
                          (total, item) => total + item.price * item.quantity,
                          0
                        )
                        .toFixed(2)
                    )
                  )}
                </p>
              </div>
              <p className="mt-0.5 text-xs text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="mt-2">
                <Link
                  href="/checkout"
                  className="flex items-center justify-center rounded-md border border-transparent bg-orange-400 px-6 py-2 text-base font-medium text-white shadow-sm hover:bg-orange-600"
                  // onClick={checkoutHandler}
                >
                  Checkout
                </Link>
              </div>
              <div className="mt-2 flex justify-center text-center text-sm text-gray-500">
                <p>
                  or &nbsp;
                  <Link href="/shop">
                    <button
                      type="button"
                      className="font-medium text-orange-400 hover:text-orange-500"
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
