import { createFileRoute } from "@tanstack/react-router";

import { VendorsPage } from "@/modules/vendors/vendors-page";

export const Route = createFileRoute("/vendors")({
  component: VendorsPage,
});
