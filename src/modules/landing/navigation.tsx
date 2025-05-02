"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/global/mode-toggle";
import PhoneCall from "../../../public/gifs/icons8-phone-ringing.gif";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
      <aside className="flex items-center gap-4">
        <Link
          href="/shop"
          className="relative bg-orange-400 flex items-center justify-center rounded-full w-[30px] h-[30px] md:w-[45px] md:h-[45px] text-white shadow-indigo-500/40"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            height="22"
            width="22"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M21.822 7.431A1 1 0 0 0 21 7H7.333L6.179 4.23A1.994 1.994 0 0 0 4.333 3H2v2h2.333l4.744 11.385A1 1 0 0 0 10 17h8c.417 0 .79-.259.937-.648l3-8a1 1 0 0 0-.115-.921zM17.307 15h-6.64l-2.5-6h11.39l-2.25 6z"></path>
            <circle cx="10.5" cy="19.5" r="1.5"></circle>
            <circle cx="17.5" cy="19.5" r="1.5"></circle>
          </svg>
        </Link>

        <Link
          href="https://jebbs-deli-admin.vercel.app/auth/vendor"
          target="_blank"
          className="flex items-center justify-center text-white h-[30px] md:h-[45px] rounded-full bg-green-700 text-sm md:text-base px-3  md:py-0"
        >
          Vendors
        </Link>

        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navigation;
