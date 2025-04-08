import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import useCartStore from "@/store/cart";
import { Product } from "@/types/types";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast"

interface ProductInformationProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  product: Product; // replace with actual product type when available
}

const ProductInformation = ({
  isOpen,
  setIsOpen,
  product,
}: ProductInformationProps) => {

  const { addItem } = useCartStore();
  const { toast } = useToast()


  const handleAddToCart = (product: any) => {
    addItem(product);
    toast({
      description: `${product.name} added to cart!`,
    })
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="h-[450px] w-full sm:max-w-[500px] lg:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              <DialogDescription>Product Information</DialogDescription>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-row w-full pb-3 gap-3">
            <div className="w-[65%] relative rounded-md bg-gray-300 aspect-[4/3]">
              {product?.image ? (
                <Image
                  src={product.image}
                  alt="Product Image"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <Image
                  src="/images/image-placeholder.png"
                  alt="Image placeholder"
                  width={40}
                  height={40}
                  className="relative mx-auto top-[40%] opacity-40 rounded-md"
                />
              )}
            </div>
            <div className="w-[35%] flex flex-col gap-2 flex-grow">
              <p className="text-orange-400">{product?.name}</p>
              <p className="text-sm text-gray-500">
                ₦{formatNumberWithCommas(Number(product?.price.toFixed(2)))}
              </p>
              <span className="text-orange-400">Description</span>
              <p className="text-sm text-gray-500 line-clamp-6">{product?.description}</p>
              <div className="flex-grow">
                <span className="text-orange-400">Vendor</span>{" "}
                <Link href={`/shop/${product?.vendor?.id}`} className="hover:underline">
                  <p className="text-sm">{product?.vendor?.name}</p>
                </Link>
              </div>
              <Button className="bg-orange-400 mt-4 ring-0" onClick={() => handleAddToCart(product)}>Add to Cart</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductInformation;
