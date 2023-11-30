import {CtaSection} from "@/modules/landing/cta/cta";
import { HeroSection } from "@/modules/landing/hero";
import { Menu } from "@/modules/landing/menu/menu";
import { Services } from "@/modules/landing/services/services";

export default function Home() {
  return (
    <main className="">
      <HeroSection />
      <Services/>
      <CtaSection/>
      <Menu/>
    </main>
  );
}
