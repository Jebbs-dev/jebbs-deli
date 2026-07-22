import { SheetHeader } from "@/components/ui/sheet";
import { ArrowLeft } from "@/components/icons";
import { cn } from "@/lib/utils";
import CheckoutOrderPage from "./checkout-order-page";
import PaymentPage from "./payment-page";
import { useCartViewStore } from "@/store/cart-data";

interface ChekoutProps {
  goToCart: () => void;
}

const CheckoutPage = ({ goToCart }: ChekoutProps) => {
  const { toggleCheckoutView, setToggleCheckoutView } = useCartViewStore();

  return (
    <div className="flex h-full flex-col text-ash">
      <SheetHeader className="text-left text-ash">
        <div className="flex flex-row items-center">
          <button
            type="button"
            className="mr-1 cursor-pointer text-ash hover:text-scotch"
            onClick={() => {
              if (toggleCheckoutView === "payment") {
                setToggleCheckoutView("order");
              } else {
                goToCart();
              }
            }}
            aria-label="Go back"
          >
            <ArrowLeft size={17} />
          </button>
          <h3 className="text-2xl font-semibold text-ash">Checkout</h3>
        </div>

        <div className="flex flex-row gap-3 pt-2">
          <button
            type="button"
            className="flex w-1/2 cursor-pointer flex-col gap-2 text-left text-ash"
            onClick={() => setToggleCheckoutView("order")}
          >
            <p className="text-ash">Your order</p>
            <div className="h-2.5 w-full rounded-lg bg-scotch" />
          </button>

          <div className="flex w-1/2 flex-col gap-2">
            <p
              className={cn(
                toggleCheckoutView === "payment"
                  ? "text-ash"
                  : "text-ash/40"
              )}
            >
              Delivery & Payment
            </p>
            <div
              className={cn(
                "h-2.5 w-full rounded-lg",
                toggleCheckoutView === "payment" ? "bg-scotch" : "bg-black/10"
              )}
            />
          </div>
        </div>
      </SheetHeader>
      {toggleCheckoutView === "order" ? (
        <CheckoutOrderPage
          proceedToPayment={() => {
            setToggleCheckoutView("payment");
          }}
        />
      ) : (
        <PaymentPage />
      )}
    </div>
  );
};

export default CheckoutPage;
