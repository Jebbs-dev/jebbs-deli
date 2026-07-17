import { Outlet } from "@tanstack/react-router";

import Footer from "@/modules/shop/components/footer";
import Header from "@/modules/shop/components/header";

export function ShopLayout() {
  return (
    <div className="flex flex-col justify-between h-full overflow-hidden">
      <Header />
      <main className="pb-10 pt-14 md:pt-10 bg-gray-50">
        <Outlet />
      </main>
      <hr className="my-6 border-gray-100" />
      <Footer />
    </div>
  );
}
