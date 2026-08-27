import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { useVerifyTransaction } from "@/modules/checkout/queries/verify-transaction";

export function OrderPaymentCallbackPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { reference } = useSearch({ from: "/shop/orders/payment/callback" });

  const { data, isLoading, isError, error } = useVerifyTransaction(reference);

  useEffect(() => {
    if (data?.status === "success" && data?.orderId) {
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
      void queryClient.invalidateQueries({ queryKey: ["order", data.orderId] });
      const timer = setTimeout(() => {
        void navigate({
          to: "/shop/orders/$orderId",
          params: { orderId: String(data.orderId) },
        });
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [data, navigate, queryClient]);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-xl border border-black/10 bg-white p-8 text-center shadow-sm">
        {!reference ? (
          <>
            <h1 className="text-lg font-semibold text-ash">Missing reference</h1>
            <p className="mt-2 text-sm text-ash/60">
              We could not find a Paystack reference on this return URL.
            </p>
          </>
        ) : isLoading ? (
          <>
            <FaSpinner className="mx-auto size-6 animate-spin text-scotch" />
            <h1 className="mt-4 text-lg font-semibold text-ash">
              Confirming payment…
            </h1>
            <p className="mt-2 text-sm text-ash/60">
              Verifying reference {reference}
            </p>
          </>
        ) : isError ? (
          <>
            <h1 className="text-lg font-semibold text-ash">Verification failed</h1>
            <p className="mt-2 text-sm text-ash/60">
              {(error as Error)?.message ||
                "We could not verify this payment yet."}
            </p>
          </>
        ) : data?.status === "success" ? (
          <>
            <h1 className="text-lg font-semibold text-ash">Payment successful</h1>
            <p className="mt-2 text-sm text-ash/60">
              Redirecting to your order…
            </p>
          </>
        ) : data?.status === "failed" || data?.status === "abandoned" ? (
          <>
            <h1 className="text-lg font-semibold text-ash">Payment {data.status}</h1>
            <p className="mt-2 text-sm text-ash/60">
              You can retry payment from your order details once available.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold text-ash">Payment pending</h1>
            <p className="mt-2 text-sm text-ash/60">
              Paystack is still confirming this charge.
            </p>
          </>
        )}

        <Button asChild className="mt-6 rounded-lg" variant="outline">
          <Link to="/shop">Back to shop</Link>
        </Button>
      </div>
    </div>
  );
}
