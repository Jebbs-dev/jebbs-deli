import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import PathnameProvider from "@/providers/pathname-provider";
import { QueryProvider } from "@/providers/query-client-provider";
import TokenRefreshProvider from "@/providers/token-refresh-provider";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jebbs Deli",
  description: "Food ordering and delivery app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <html lang="en">
        <body className={`${GeistSans.className} antialiased`}>
          <PathnameProvider>
            <TokenRefreshProvider>{children}</TokenRefreshProvider>
          </PathnameProvider>
        </body>
      </html>
    </QueryProvider>
  );
}
