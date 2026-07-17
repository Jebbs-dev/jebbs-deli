import { createFileRoute } from "@tanstack/react-router";

import { AuthPage } from "@/modules/auth/components/auth-page";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});
