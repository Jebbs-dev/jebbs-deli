import { createFileRoute } from "@tanstack/react-router";

import { ShopLayout } from "@/modules/shop/components/shop-layout";

export const Route = createFileRoute("/shop")({
  component: ShopLayout,
});
