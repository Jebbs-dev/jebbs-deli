import Footer from "@/modules/shop/components/footer";
import Header from "@/modules/shop/components/header";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col justify-between h-full overflow-hidden">
      <Header />
      <main className="pb-10 pt-14 md:pt-10 bg-gray-50">{children}</main>
      <hr className="my-6 border-gray-100" />
      <Footer />
    </div>
  );
};

export default Layout;