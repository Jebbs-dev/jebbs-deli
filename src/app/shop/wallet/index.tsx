import { createFileRoute } from "@tanstack/react-router";

import { WalletPage } from "@/modules/wallet/components/wallet-page";

export const Route = createFileRoute("/shop/wallet/")({
  component: WalletPage,
});
