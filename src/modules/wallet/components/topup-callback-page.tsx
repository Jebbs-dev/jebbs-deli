import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { useVerifyWalletTopup } from "@/modules/wallet/queries/verify-wallet-topup";

export function TopupCallbackPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { reference } = useSearch({ from: "/shop/wallet/topup/callback" });

  const { data, isLoading, isError, error } = useVerifyWalletTopup(reference);

  useEffect(() => {
    if (data?.settled || data?.success) {
      void queryClient.invalidateQueries({ queryKey: ["wallet"] });
      const timer = setTimeout(() => {
        void navigate({ to: "/shop/wallet" });
      }, 2200);
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
              Confirming top-up…
            </h1>
            <p className="mt-2 text-sm text-ash/60">
              Verifying payment reference {reference}
            </p>
          </>
        ) : isError ? (
          <>
            <h1 className="text-lg font-semibold text-ash">Verification failed</h1>
            <p className="mt-2 text-sm text-ash/60">
              {(error as Error)?.message ||
                "We could not verify this top-up. Check your wallet shortly."}
            </p>
          </>
        ) : data?.settled || data?.success ? (
          <>
            <h1 className="text-lg font-semibold text-ash">Top-up successful</h1>
            <p className="mt-2 text-sm text-ash/60">
              {data.message || "Your wallet balance has been updated."}
            </p>
            <p className="mt-1 text-xs text-ash/40">Redirecting to wallet…</p>
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold text-ash">Payment pending</h1>
            <p className="mt-2 text-sm text-ash/60">
              {data?.message ||
                "Paystack is still confirming this payment. Check your wallet in a moment."}
            </p>
          </>
        )}

        <Button asChild className="mt-6 rounded-lg" variant="outline">
          <Link to="/shop/wallet">Go to wallet</Link>
        </Button>
      </div>
    </div>
  );
}
