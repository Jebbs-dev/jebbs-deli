"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/global/mode-toggle";
import PhoneCall from "../../../public/gifs/icons8-phone-ringing.gif";
import { useState, useEffect } from "react";
import Image from "next/image";

const Navigation = () => {
  const [scrollNav, setScrollNav] = useState(false);

  const changeNav = () => {
    if (window.scrollY >= 80) {
      setScrollNav(true);
    } else {
      setScrollNav(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNav);
  }, []);

  return (
    <div
      className={`sticky top-0 z-20 w-[90vw] mx-auto px-4 py-8 flex items-center justify-between bg-transparent ${
        scrollNav ? "bg-transparent" : ""
      }`}
    >
      <aside className="flex items-center gap-2">
        <Link href="/">
          <h1 className="mx-auto md:top-10 md:left-10 text-black text-2xl md:text-3xl">
            deli<span className="text-orange-400">.</span>
          </h1>
        </Link>
      </aside>
      <nav
        className={`hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] bg-orange-100 py-4 px-8 rounded-full font-semibold ${
          scrollNav ? "shadow-xl transition" : ""
        }`}
      >
        <ul className="flex items-center justify-center gap-8">
          <Link href="#" className="group relative">
            <li>Products</li>
            <Image
              src="/svgs/company-hover.svg"
              width={40}
              height={40}
              alt="hover decoration"
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </Link>
          <Link href="#" className="group relative">
            <li>Company</li>
            <Image
              src="/svgs/company-hover.svg"
              width={40}
              height={40}
              alt="hover decoration"
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </Link>
          <Link href="#faqs" className="group relative">
            <li>FAQs</li>
            <Image
              src="/svgs/company-hover.svg"
              width={40}
              height={40}
              alt="hover decoration"
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </Link>
          <Link href="/contact" className="group relative">
            <li>Contact</li>
            <Image
              src="/svgs/company-hover.svg"
              width={40}
              height={40}
              alt="hover decoration"
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </Link>
        </ul>
      </nav>
      <aside className="flex items-center gap-2">
        <Link
          href="/auth"
          className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/80 transition shadow-md"
        >
          Login
        </Link>
        {/* <UserButton /> */}
        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navigation;
