"use client";

import { Button } from "@/components/ui/button";
import { categories } from "@/modules/shop/components/categories/data";
import ProductInformation from "@/modules/shop/components/product-information";
import { useFetchProduct } from "@/modules/shop/queries/fetch-products";
import useCartStore from "@/store/cart";
import { Product } from "@/types/types";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast"
// Skeleton component for loading state
const ProductSkeleton = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm animate-pulse">
      <div className="relative h-[100px] bg-gray-200 rounded-md"></div>
      <div className="flex flex-col py-2 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4 mt-2"></div>
      </div>
    </div>
  );
};

const Shop = () => {
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false);
  const [selectProduct, setSelectProduct] = useState<Product | null>(null);

  const { data: products, isPending, isFetching } = useFetchProduct();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addItem } = useCartStore();

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? products?.filter(
        (product: any) =>
          product.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    : products;

  // Handle category button click
  const handleCategoryClick = (categoryName: string) => {
    // If the same category is clicked again, clear the filter
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryName);
    }
  };

  // Handle adding product to cart
  const handleAddToCart = (product: any) => {
    addItem(product);
    // toast.success(`${product.name} added to cart!`, {
    //   position: "top-right",
    //   duration: 2000,
    // });
    toast({
      description: `${product.name} added to cart!`,
    })
  };

  // Create an array of 8 items for skeleton loading
  const skeletonArray = Array(8).fill(null);

  const selectedProduct = products?.find(
    (product: Product) => product.id === selectProduct?.id
  );

  return (
    <>
      <ProductInformation
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        product={selectedProduct}
      />
      <div className="pt-[81px] h-full text-sm">
        <div className="md:container mx-auto px-10 2xl:px-0">
          <section className="flex flex-col mb-4 md:mb-14">
            <h3 className="mb-6 text-xl md:text-2xl font-medium">
              Explore Categories
              {selectedCategory && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (Showing {selectedCategory})
                </span>
              )}
            </h3>

            <div className="overflow-x-auto hide-scroll">
              <div className="flex min-w-max">
                {categories.map((category) => (
                  <div
                    className={`w-[116px] h-[116px] rounded-[10px] flex flex-col items-center justify-center cursor-pointer mr-8 last:mr-0 text-black ${
                      selectedCategory === category.name ? "border-2" : ""
                    }`}
                    key={category.id}
                    style={{
                      backgroundColor: category.color,
                      borderColor:
                        selectedCategory === category.name
                          ? category.borderColor
                          : "transparent",
                    }}
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <span>
                      <Image
                        src={category.icon}
                        alt={category.name}
                        width={10}
                        height={10}
                        className="w-10 h-10"
                      />
                    </span>
                    <span className="text-[14px] font-normal leading-[18px] text-center mt-4 tracking-normal">
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            {isPending ? (
              // Skeleton loading state
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-pulse">
                {skeletonArray.map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : filteredProducts && filteredProducts.length > 0 ? (
              // Actual products
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredProducts.map((product: any) => (
                  <div
                    className="p-4 bg-white rounded-lg shadow-sm flex flex-col h-full"
                    key={product.id}
                  >
                    <div className="relative h-[100px] bg-gray-300 rounded-md">
                      <span
                        className="absolute top-2 right-2 bg-gray-50 bg-opacity-90 flex justify-center items-center rounded-sm cursor-pointer hover:bg-opacity-80 transition-all p-1"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart
                          className="p-1 z-10"
                          size={24}
                          color="#fbbf24"
                        />
                      </span>
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt="Product Image"
                          width={100}
                          height={100}
                          className="w-full h-full object-cover rounded-sm"
                        />
                      ) : (
                        <Image
                          src="/images/image-placeholder.png"
                          alt="Image placeholder"
                          width={40}
                          height={40}
                          className="relative mx-auto top-[25%] opacity-40"
                        />
                      )}
                    </div>
                    <div className="flex flex-col flex-grow py-2">
                      <h4
                        className="font-semibold cursor-pointer hover:underline text-orange-900"
                        onClick={() => {
                          setIsOpen(true);
                          setSelectProduct(product);
                        }}
                      >
                        {product.name} - {product.vendor?.name}
                      </h4>
                      <p className="text-gray-400 flex flex-row gap-2">
                        <span></span>
                        {/* {product.description || "No description available"} */}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="font-medium text-amber-500">
                          ₦
                          {formatNumberWithCommas(
                            Number(product.price.toFixed(2))
                          )}
                        </span>
                        <button
                          className="px-3 py-1 bg-amber-100 text-amber-800 rounded-md text-sm hover:bg-amber-200 transition-colors"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // No products found
              <div className="text-center py-10">
                <div className="mx-auto w-[300px] h-[300px] flex items-center justify-center">
                  <div className="text-gray-400">
                    {selectedCategory
                      ? `No products found in the ${selectedCategory} category`
                      : !isFetching && (
                          <div className="text-center py-10 ">
                            <Image
                              src="/svgs/Search.svg"
                              alt="Not Found"
                              width={500}
                              height={500}
                              className="mx-auto stroke-orange-400 w-[300px] h-[300px]"
                            />
                            <span className="-top-10 relative text-gray-400">
                              No item found!
                            </span>
                          </div>
                        )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Shop;
