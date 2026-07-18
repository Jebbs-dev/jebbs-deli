import { createFileRoute } from "@tanstack/react-router";

import { ShopPage } from "@/modules/shop/components/shop-page";

type ShopSearch = {
  category?: string;
};

export const Route = createFileRoute("/shop/")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    category:
      typeof search.category === "string" && search.category.length > 0
        ? search.category
        : undefined,
  }),
  component: ShopPage,
});
