import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStartWalletTopup } from "@/modules/wallet/mutations/start-topup";
import { useFetchWallet } from "@/modules/wallet/queries/fetch-wallet";
import { useFetchWalletTransactions } from "@/modules/wallet/queries/fetch-wallet-transactions";
import { useAuthFormModal } from "@/store/auth-form-modal";
import useAuthStore from "@/store/auth";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import type { WalletTransaction } from "../types";

const MIN_TOPUP = 100;
const MAX_TOPUP = 1_000_000;

function formatTxnDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function TransactionRow({ tx }: { tx: WalletTransaction }) {
  const amount = Number(tx.amount);
  const credit = amount >= 0 && tx.type !== "order_payment";

  return (
    <li className="flex items-start justify-between gap-3 border-b border-black/5 py-3 last:border-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ash">
          {tx.description || tx.type}
        </p>
        <p className="text-xs text-ash/50">{formatTxnDate(tx.createdAt)}</p>
      </div>
      <div className="shrink-0 text-right">
        <p
          className={
            credit
              ? "text-sm font-medium text-scotch"
              : "text-sm font-medium text-ash"
          }
        >
          {credit ? "+" : "-"}₦
          {formatNumberWithCommas(Number(Math.abs(amount).toFixed(2)))}
        </p>
        <p className="text-[10px] uppercase tracking-wide text-ash/40">
          {tx.status}
        </p>
      </div>
    </li>
  );
}

export function WalletPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { onAuthFormOpen } = useAuthFormModal();
  const { data: wallet, isLoading } = useFetchWallet();
  const { data: history } = useFetchWalletTransactions(0, 20);
  const { mutateAsync: startTopup, isPending: toppingUp } = useStartWalletTopup();
  const [amount, setAmount] = useState("2000");
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      onAuthFormOpen();
      void navigate({ to: "/auth" });
    }
  }, [isLoggedIn, navigate, onAuthFormOpen]);

  const balance = Number(wallet?.balance ?? 0);
  const recent = wallet?.recentTransactions ?? [];
  const transactions = showHistory ? (history?.items ?? recent) : recent;

  const handleTopup = async () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value < MIN_TOPUP || value > MAX_TOPUP) {
      return;
    }

    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const data = await startTopup({
      amount: value,
      callback_url: `${origin}/shop/wallet/topup/callback`,
    });

    if (data.authorization_url) {
      window.location.href = data.authorization_url;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-ash/60">Sign in to view your wallet.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fafafa]">
      <div className="mx-auto w-full max-w-lg px-4 pb-16 pt-6 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash/45">
              Wallet
            </p>
            <h1 className="font-display text-2xl font-semibold text-ash">
              Deli Wallet
            </h1>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-lg">
            <Link to="/shop">Back to shop</Link>
          </Button>
        </div>

        <section className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
          <p className="text-xs text-ash/55">Available balance</p>
          <p className="mt-1 font-display text-3xl font-semibold text-ash">
            {isLoading
              ? "…"
              : `₦${formatNumberWithCommas(Number(balance.toFixed(2)))}`}
          </p>
          <p className="mt-1 text-xs text-ash/45">
            {wallet?.currency || "NGN"} · Pay for orders instantly
          </p>

          <div className="mt-6 space-y-3 border-t border-black/5 pt-5">
            <Label htmlFor="topup-amount" className="text-sm text-ash">
              Top up amount (₦{MIN_TOPUP.toLocaleString()} – ₦
              {MAX_TOPUP.toLocaleString()})
            </Label>
            <Input
              id="topup-amount"
              type="number"
              min={MIN_TOPUP}
              max={MAX_TOPUP}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-11 rounded-lg border-black/10 bg-white text-ash placeholder:text-ash/50"
            />
            <Button
              type="button"
              className="w-full rounded-lg"
              disabled={toppingUp}
              onClick={() => void handleTopup()}
            >
              {toppingUp ? (
                <>
                  Starting Paystack
                  <FaSpinner className="ml-2 animate-spin" />
                </>
              ) : (
                "Top up with Paystack"
              )}
            </Button>
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-base font-semibold text-ash">
              {showHistory ? "Transaction history" : "Recent activity"}
            </h2>
            <button
              type="button"
              className="text-xs font-medium text-scotch hover:underline"
              onClick={() => setShowHistory((v) => !v)}
            >
              {showHistory ? "Show recent" : "Full history"}
            </button>
          </div>
          {transactions.length === 0 ? (
            <p className="py-8 text-center text-sm text-ash/50">
              No transactions yet.
            </p>
          ) : (
            <ul>
              {transactions.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
