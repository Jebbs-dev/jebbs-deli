import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "./globals.css?url";

import PathnameProvider from "@/providers/pathname-provider";
import { QueryProvider } from "@/providers/query-client-provider";
import TokenRefreshProvider from "@/providers/token-refresh-provider";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "Jebbs Deli" },
      { name: "description", content: "Food ordering and delivery app" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased">
        <QueryProvider>
          <PathnameProvider>
            <TokenRefreshProvider>
              <Outlet />
            </TokenRefreshProvider>
          </PathnameProvider>
        </QueryProvider>
        <Scripts />
      </body>
    </html>
  );
}
