import { createFileRoute } from "@tanstack/react-router";

import { ShopPage } from "@/modules/shop/components/shop-page";

export const Route = createFileRoute("/shop/")({
  component: ShopPage,
});
