import { createFileRoute } from "@tanstack/react-router";

import { ContactPage } from "@/modules/contact/contact-page";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});
