import { HeroSection } from "@/modules/landing/hero";
import { Services } from "@/modules/landing/services/services";
import GetStarted from "@/modules/landing/get-started";
import Faqs from "@/modules/landing/faqs";
import { CtaSection } from "@/modules/landing/cta/cta";
import Reservation from "@/modules/landing/reservation/reservation";

export function HomePage() {
  return (
    <div className="bg-land-surface text-land-on-background min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection />
        <Services />
        <GetStarted />
        <Reservation />
        <Faqs />
        <CtaSection />
      </main>
    </div>
  );
}
