"use client";

import { CtaSection } from "@/modules/landing/cta/cta";
import GetStarted from "@/modules/landing/get-started";
import { HeroSection } from "@/modules/landing/hero";

import { Services } from "@/modules/landing/services/services";

export default function Home() {
  const cartItems: any = [];

  // localStorage.setItem("cartItem", JSON.stringify(cartItems));

  return (
    <main>
      <HeroSection />
      <Services />
      <CtaSection />
      <GetStarted />
    </main>
  );
}
