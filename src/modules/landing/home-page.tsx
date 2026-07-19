import { HeroSection } from "@/modules/landing/hero";
import { MissionStrip } from "@/modules/landing/mission";
import { OnDeckSection } from "@/modules/landing/on-deck";
import { CuisinesSection } from "@/modules/landing/cuisines";
import { WhyDeli } from "@/modules/landing/why-deli";
import { PillarsSection } from "@/modules/landing/pillars";
import Faqs from "@/modules/landing/faqs";
import { FinalCta } from "@/modules/landing/final-cta";

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-ash text-cream">
      <main className="flex-grow">
        <HeroSection />
        <MissionStrip />
        <OnDeckSection />
        <CuisinesSection />
        <WhyDeli />
        <PillarsSection />
        <Faqs />
        <FinalCta />
      </main>
    </div>
  );
}
