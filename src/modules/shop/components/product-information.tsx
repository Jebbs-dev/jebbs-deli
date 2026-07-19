import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddProductToCart } from "@/modules/shop/hooks/use-add-product-to-cart";
import { Product } from "@/types/types";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { ArrowRight, Clock } from "lucide-react";

interface ProductInformationProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  product: Product | null | undefined;
}

const ProductInformation = ({
  isOpen,
  setIsOpen,
  product,
}: ProductInformationProps) => {
  const { addProductToCart, isPending } = useAddProductToCart();

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-iroko bg-iroko p-0 text-cream sm:max-w-[500px] lg:max-w-[800px]">
        <div className="flex flex-col gap-0 lg:flex-row">
          <div className="relative aspect-[4/3] w-full bg-ash lg:w-[55%] lg:aspect-auto lg:min-h-[320px]">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={480}
                height={360}
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src="/images/image-placeholder.png"
                alt=""
                width={40}
                height={40}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40"
              />
            )}
          </div>

          <div className="flex flex-1 flex-col gap-4 p-5 lg:p-6">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="font-display text-xl font-semibold text-cream">
                {product.name}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Details for {product.name}
              </DialogDescription>
              <p className="font-mono text-sm tracking-wide text-scotch">
                ₦
                {formatNumberWithCommas(
                  Number(Number(product.price).toFixed(2))
                )}
              </p>
              {product.store?.preparationTime && (
                <p className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wide text-cream/65">
                  <Clock className="size-3.5" aria-hidden />
                  {product.store.preparationTime}
                </p>
              )}
            </DialogHeader>

            {product.description && (
              <div>
                <p className="mb-1 text-sm font-medium text-cream/80">
                  Description
                </p>
                <p className="line-clamp-6 text-sm leading-relaxed text-cream/65">
                  {product.description}
                </p>
              </div>
            )}

            {product.store?.id && (
              <div>
                <p className="mb-1 text-sm font-medium text-cream/80">Kitchen</p>
                <Link
                  to="/shop/$storeId"
                  params={{ storeId: String(product.store.id) }}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1 text-sm text-cream transition-colors hover:text-scotch"
                >
                  {product.store.name}
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </div>
            )}

            <Button
              type="button"
              className="mt-auto w-full rounded-md"
              disabled={isPending}
              onClick={() => {
                void addProductToCart(product);
              }}
            >
              Add to cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductInformation;
