import { createFileRoute } from "@tanstack/react-router";

import { StorePage } from "@/modules/shop/components/store-page";

export const Route = createFileRoute("/shop/$storeId")({
  component: StorePage,
});
