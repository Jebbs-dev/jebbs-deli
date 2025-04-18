import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import CartProvider from "@/providers/cart/cart-provider";
import FaveProvider from "@/providers/favourites/favourites-provider";

import PathnameProvider from "@/providers/pathname-provider";
import { QueryProvider } from "@/providers/query-client-provider";
import TokenRefreshProvider from "@/providers/token-refresh-provider";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <html lang="en">
        <body className={GeistSans.className}>
          <CartProvider>
            <FaveProvider>
              <PathnameProvider>
                <TokenRefreshProvider>{children}</TokenRefreshProvider>
              </PathnameProvider>
            </FaveProvider>
          </CartProvider>
        </body>
      </html>
    </QueryProvider>
  );
}
