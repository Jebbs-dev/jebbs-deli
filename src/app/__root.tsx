import {
  Link,
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
      { title: "Deli. — Food delivery in Lagos" },
      {
        name: "description",
        content:
          "Precision delivery for real Lagos appetites. Local vendors, live tracking, African to Continental.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://api.fontshare.com/v2/css?f[]=general-sans@400;500;600&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootLayout,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ash px-5 text-center text-cream">
      <p className="font-mono text-label-sm text-palm">404 · NOT FOUND</p>
      <h1 className="font-display text-headline-lg">
        This page isn&apos;t on the menu.
      </h1>
      <p className="max-w-[42ch] text-body-md text-cream/70">
        The link may be old or mistyped. The kitchen is still open.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/shop"
          className="inline-flex rounded-md bg-scotch px-7 py-3 font-display text-sm font-semibold text-ash transition-[filter] hover:brightness-110"
        >
          Browse Shops
        </Link>
        <Link
          to="/"
          className="inline-flex rounded-md border border-cream px-7 py-3 font-display text-sm font-semibold text-cream transition-colors hover:bg-iroko"
        >
          Back Home
        </Link>
      </div>
    </main>
  );
}

function RootLayout() {
  return (
    <html lang="en" className="bg-ash">
      <head>
        <HeadContent />
      </head>
      <body className="bg-ash text-cream font-sans antialiased">
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
