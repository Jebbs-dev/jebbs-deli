import { Outlet } from "@tanstack/react-router";

import Header from "@/modules/shop/components/header";

export function ShopLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-ash">
      <Header />
      <main className="flex-1 bg-white pt-[7.25rem] md:pt-[5.75rem]">
        <Outlet />
      </main>
    </div>
  );
}
