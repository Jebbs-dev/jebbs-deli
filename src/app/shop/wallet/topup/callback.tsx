import { createFileRoute } from "@tanstack/react-router";

import { TopupCallbackPage } from "@/modules/wallet/components/topup-callback-page";

type TopupCallbackSearch = {
  reference?: string;
};

export const Route = createFileRoute("/shop/wallet/topup/callback")({
  validateSearch: (search: Record<string, unknown>): TopupCallbackSearch => ({
    reference:
      typeof search.reference === "string" && search.reference.length > 0
        ? search.reference
        : typeof search.trxref === "string" && search.trxref.length > 0
          ? search.trxref
          : undefined,
  }),
  component: TopupCallbackPage,
});
