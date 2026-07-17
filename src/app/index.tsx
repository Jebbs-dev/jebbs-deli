import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/modules/landing/home-page";

export const Route = createFileRoute("/")({
  component: HomePage,
});