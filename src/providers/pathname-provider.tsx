"use client";

import { Footer } from "@/components/footer/footer";
import Faqs from "@/modules/landing/faqs";
import Navigation from "@/modules/landing/navigation";
import Reservation from "@/modules/landing/reservation/reservation";
import { usePathname } from "next/navigation";

interface PathnameProviderProps {
  children: React.ReactNode;
}

const PathnameProvider = ({ children }: PathnameProviderProps) => {
  const pathname = usePathname();

  const authRoute = ["/auth"];
  const shopRoute = ["/shop"];

  return (
    <div>
      {!authRoute.includes(pathname) && !pathname.startsWith(shopRoute[0]) && (
        <Navigation />
      )}
      {children}
      {!authRoute.includes(pathname) && !pathname.startsWith(shopRoute[0]) && (
        <Faqs />
      )}
      {!authRoute.includes(pathname) && !pathname.startsWith(shopRoute[0]) && (
        <Reservation />
      )}
      {!authRoute.includes(pathname) && !pathname.startsWith(shopRoute[0]) && (
        <Footer />
      )}
    </div>
  );
};

export default PathnameProvider;
