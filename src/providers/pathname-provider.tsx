import { useRouterState } from "@tanstack/react-router";

import Navigation from "@/modules/landing/navigation";
import Footer from "@/modules/shop/components/footer";

interface PathnameProviderProps {
  children: React.ReactNode;
}

const PathnameProvider = ({ children }: PathnameProviderProps) => {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const authRoute = ["/auth"];
  const shopRoute = ["/shop"];

  return (
    <div>
      {!authRoute.includes(pathname) && !pathname.startsWith(shopRoute[0]) && (
        <Navigation />
      )}
      {children}
      {!authRoute.includes(pathname) && !pathname.startsWith(shopRoute[0]) && (
        <Footer />
      )}
    </div>
  );
};

export default PathnameProvider;
