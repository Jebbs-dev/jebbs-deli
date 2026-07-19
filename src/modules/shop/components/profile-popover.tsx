import { Link, useNavigate } from "@tanstack/react-router";
import { Copy, FileClock, Headset, LogOut, Wallet } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useFetchWallet } from "@/modules/wallet/queries/fetch-wallet";
import { useAuthFormModal } from "@/store/auth-form-modal";
import useAuthStore from "@/store/auth";
import { useCartViewStore } from "@/store/cart-data";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import { useFetchUserInformation } from "@/modules/user/queries/fetch-user-information";

function inviteCodeFromUserId(userId: string) {
  const compact = userId.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `DL-${compact}`;
}

export function ProfilePopover() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoggedIn, logout } = useAuthStore();
  const { onAuthFormOpen } = useAuthFormModal();
  const { setIsOrderHistoryOpen, setIsOpen: setCartSheetOpen } =
    useCartViewStore();
  const { data: userInformation } = useFetchUserInformation(String(user?.id));
  const { data: wallet, isLoading: walletLoading } = useFetchWallet();

  const displayName = user?.name || userInformation?.name || "Guest";
  const phone =
    (userInformation as { telephone?: string } | undefined)?.telephone ||
    user?.email ||
    "";
  const initial = displayName.trim().charAt(0).toUpperCase() || "D";
  const inviteCode = user?.id ? inviteCodeFromUserId(user.id) : "DL-GUEST";
  const balance = Number(wallet?.balance ?? 0);

  const copyText = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({ description: `${label} copied` });
    } catch {
      toast({
        variant: "destructive",
        description: `Could not copy ${label.toLowerCase()}`,
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-full border-black/10 bg-[#f5f5f5] px-3 text-ash hover:bg-[#ececec] md:h-11 md:px-4"
          aria-label="Profile"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-scotch text-xs font-semibold text-white">
            {isLoggedIn ? initial : "?"}
          </span>
          <span className="ml-1.5 hidden text-sm font-medium sm:inline">
            Profile
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="z-[9999] w-[296px] overflow-hidden rounded-xl border border-black/10 bg-white p-0 shadow-lg"
      >
        {!isLoggedIn ? (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <p className="text-sm text-ash/70">
              Sign in to see your wallet, orders, and account.
            </p>
            <Button
              type="button"
              className="w-full rounded-lg"
              onClick={() => {
                setOpen(false);
                onAuthFormOpen();
              }}
            >
              Sign in
            </Button>
          </div>
        ) : (
          <div className="max-h-[80vh] overflow-y-auto">
            <div className="bg-linear-to-b from-scotch/15 to-white px-4 pb-3 pt-8">
              <div className="flex flex-col items-center gap-2">
                <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-scotch/20 bg-scotch/10 text-lg font-semibold text-scotch">
                  {initial}
                </span>
                <span className="text-center text-xl font-medium leading-none text-ash">
                  {displayName}
                </span>
                {phone ? (
                  <span className="text-sm text-ash/60">{phone}</span>
                ) : null}
              </div>
              <div className="mt-4 border-b-4 border-scotch/10">
                <div className="relative inline-block pb-3">
                  <div className="absolute inset-x-0 -bottom-1 z-20 h-1 rounded-[1px] bg-ash" />
                  <span className="text-[10px] font-bold uppercase tracking-[1px] text-ash">
                    Personal
                  </span>
                </div>
              </div>
            </div>

            <div className="px-4 py-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-ash/55">Wallet Balance</span>
                <span className="text-sm font-medium text-ash">
                  {walletLoading
                    ? "…"
                    : `₦${formatNumberWithCommas(Number(balance.toFixed(2)))}`}
                </span>
              </div>

              <div className="mb-2 flex h-10 items-center justify-between rounded-full border border-black/10 px-2.5">
                <span className="text-sm text-ash">Deli Wallet</span>
                <span className="mx-2 h-5 border-r border-black/10" />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-ash">
                    {wallet?.currency || "NGN"}
                  </span>
                  <button
                    type="button"
                    aria-label="Copy currency"
                    className="text-ash/70 hover:text-scotch"
                    onClick={() =>
                      copyText(String(wallet?.currency || "NGN"), "Currency")
                    }
                  >
                    <Copy className="size-4" />
                  </button>
                </div>
              </div>
              <p className="mb-4 text-center text-[10px] text-ash/50">
                Top up your wallet to pay for orders faster
              </p>

              <Button
                type="button"
                variant="outline"
                className="mb-2 w-full rounded-lg border-black/10"
                onClick={() => {
                  setOpen(false);
                  void navigate({ to: "/shop/wallet" });
                }}
              >
                <Wallet className="mr-2 size-4" />
                Open wallet
              </Button>
            </div>

            <div className="flex items-start justify-between border-t border-black/5 px-4 py-4">
              <div>
                <span className="mb-1 block text-xs text-ash/55">Referral</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-ash">
                    {inviteCode}
                  </span>
                  <button
                    type="button"
                    aria-label="Copy referral code"
                    className="text-ash/70 hover:text-scotch"
                    onClick={() => copyText(inviteCode, "Referral code")}
                  >
                    <Copy className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-black/5 px-2 py-2">
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-ash hover:bg-black/5"
                onClick={() => {
                  setOpen(false);
                  setIsOrderHistoryOpen(true);
                }}
              >
                <FileClock className="size-4 text-ash/60" />
                Order History
              </button>
              <Link
                to="/contact"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ash hover:bg-black/5"
                onClick={() => setOpen(false)}
              >
                <Headset className="size-4 text-ash/60" />
                Reach Support
              </Link>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-ash hover:bg-black/5"
                onClick={() => {
                  logout();
                  setCartSheetOpen(false);
                  setOpen(false);
                  void navigate({ to: "/shop" });
                }}
              >
                <LogOut className="size-4 text-ash/60" />
                Log out
              </button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
